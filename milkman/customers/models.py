from django.db import models


class Customer(models.Model):
    username = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(unique=True)
    mobile = models.CharField(max_length=20, default="Not provided")
    address = models.TextField()
    password = models.CharField(max_length=128, default="password")
    role = models.CharField(max_length=20, default="customer")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
