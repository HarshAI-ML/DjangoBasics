from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

from .models import Customer
from .serializers import CustomerLoginSerializer, CustomerSerializer


ADMIN_EMAIL = "harshshinde@gmail.com"
ADMIN_PASSWORD = "password"


@api_view(["GET", "POST"])
def customer_list(request):
    if request.method == "GET":
        customers = Customer.objects.all().order_by("-created_at")
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def customer_login(request):
    serializer = CustomerLoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    email = serializer.validated_data["email"].strip().lower()
    password = serializer.validated_data["password"].strip()

    if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
        return Response({"ok": True, "role": "admin", "username": email.split("@")[0]})

    customer = Customer.objects.filter(email=email, password=password).first()
    if not customer:
        return Response({"ok": False, "role": None, "username": None}, status=HTTP_404_NOT_FOUND)

    return Response({"ok": True, "role": "customer", "username": customer.username})
