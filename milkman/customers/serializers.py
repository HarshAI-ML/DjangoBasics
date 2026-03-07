from rest_framework import serializers
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Customer
        fields = ["id", "username", "email", "mobile", "address", "password", "role", "created_at"]
        read_only_fields = ["id", "role", "created_at"]


class CustomerLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
