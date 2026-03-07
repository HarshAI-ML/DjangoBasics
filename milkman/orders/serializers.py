from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from products.models import Product

from .models import Order, OrderItem
from .models import CustomerOrder


class OrderItemWriteSerializer(serializers.Serializer):
    product = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderItemReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "quantity",
            "unit_price",
            "line_total",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemWriteSerializer(many=True, write_only=True)
    order_items = OrderItemReadSerializer(source="items", many=True, read_only=True)
    order_number = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "customer_name",
            "customer_phone",
            "delivery_address",
            "delivery_slot",
            "payment_method",
            "status",
            "payment_status",
            "subtotal",
            "delivery_fee",
            "total",
            "items",
            "order_items",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "order_number",
            "status",
            "payment_status",
            "subtotal",
            "delivery_fee",
            "total",
            "created_at",
        ]

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("At least one item is required.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        item_data = validated_data.pop("items")
        product_ids = [item["product"] for item in item_data]

        products = Product.objects.select_for_update().filter(id__in=product_ids)
        products_map = {product.id: product for product in products}

        if len(products_map) != len(set(product_ids)):
            raise serializers.ValidationError({"items": "One or more products are invalid."})

        subtotal = Decimal("0.00")
        order_items_payload = []

        for item in item_data:
            product = products_map[item["product"]]
            quantity = item["quantity"]

            if not product.is_available:
                raise serializers.ValidationError(
                    {"items": f"{product.name} is currently unavailable."}
                )

            if quantity > product.stock_quantity:
                raise serializers.ValidationError(
                    {"items": f"Only {product.stock_quantity} unit(s) available for {product.name}."}
                )

            unit_price = product.price
            line_total = unit_price * quantity
            subtotal += line_total

            order_items_payload.append(
                {
                    "product": product,
                    "product_name": product.name,
                    "quantity": quantity,
                    "unit_price": unit_price,
                    "line_total": line_total,
                }
            )

        delivery_fee = Decimal("20.00") if subtotal > 0 else Decimal("0.00")
        total = subtotal + delivery_fee

        order = Order.objects.create(
            subtotal=subtotal,
            delivery_fee=delivery_fee,
            total=total,
            **validated_data,
        )

        order_items = [OrderItem(order=order, **item) for item in order_items_payload]
        OrderItem.objects.bulk_create(order_items)

        for item in order_items_payload:
            product = item["product"]
            product.stock_quantity -= item["quantity"]
            if product.stock_quantity == 0:
                product.is_available = False
            product.save(update_fields=["stock_quantity", "is_available"])

        return order


class CustomerOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerOrder
        fields = [
            "id",
            "customer_username",
            "order_number",
            "total_bill",
            "order_date",
            "items",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
