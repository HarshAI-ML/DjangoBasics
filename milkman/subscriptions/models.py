from django.db import models
from customers.models import Customer


class Plan(models.Model):
    name = models.CharField(max_length=100, unique=True)
    monthly_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class CustomerSubscription(models.Model):
    customer = models.OneToOneField(
        Customer, related_name="subscription", on_delete=models.CASCADE
    )
    plan = models.ForeignKey(Plan, related_name="subscriptions", on_delete=models.CASCADE)
    status = models.CharField(max_length=20, default="Active")
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer.username} -> {self.plan.name}"
