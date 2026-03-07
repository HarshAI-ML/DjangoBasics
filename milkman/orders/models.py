from decimal import Decimal

from django.db import models

from products.models import Product


class Order(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ("COD", "Cash on Delivery"),
        ("ONLINE", "Online"),
    ]
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]
    PAYMENT_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("failed", "Failed"),
    ]

    customer_name = models.CharField(max_length=150)
    customer_phone = models.CharField(max_length=20)
    delivery_address = models.TextField()
    delivery_slot = models.CharField(max_length=100, blank=True)
    payment_method = models.CharField(
        max_length=10, choices=PAYMENT_METHOD_CHOICES, default="COD"
    )

    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    delivery_fee = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal("0.00")
    )
    total = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    payment_status = models.CharField(
        max_length=20, choices=PAYMENT_STATUS_CHOICES, default="pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def order_number(self):
        return f"MM{self.id:06d}"

    def __str__(self):
        return self.order_number


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    product_name = models.CharField(max_length=150)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    line_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"
