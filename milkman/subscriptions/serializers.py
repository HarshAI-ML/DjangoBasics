from rest_framework import serializers

from .models import CustomerSubscription, Plan


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ["id", "name", "monthly_price", "quantity", "created_at"]
        read_only_fields = ["id", "created_at"]


class CustomerSubscriptionSerializer(serializers.ModelSerializer):
    customer_username = serializers.CharField(source="customer.username", read_only=True)
    plan_name = serializers.CharField(source="plan.name", read_only=True)
    monthly_price = serializers.DecimalField(
        source="plan.monthly_price", max_digits=10, decimal_places=2, read_only=True
    )
    quantity = serializers.CharField(source="plan.quantity", read_only=True)

    class Meta:
        model = CustomerSubscription
        fields = [
            "id",
            "customer",
            "customer_username",
            "plan",
            "plan_name",
            "monthly_price",
            "quantity",
            "status",
            "subscribed_at",
        ]
        read_only_fields = ["id", "subscribed_at"]
