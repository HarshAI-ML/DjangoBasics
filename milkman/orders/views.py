from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_404_NOT_FOUND

from .models import CustomerOrder, Order
from .serializers import CustomerOrderSerializer, OrderSerializer


@api_view(["GET", "POST"])
def order_list(request):
    if request.method == "GET":
        orders = Order.objects.prefetch_related("items").order_by("-created_at")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    serializer = OrderSerializer(data=request.data)
    if serializer.is_valid():
        order = serializer.save()
        return Response(OrderSerializer(order).data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=400)


@api_view(["GET"])
def order_detail(request, order_id):
    try:
        order = Order.objects.prefetch_related("items").get(id=order_id)
    except Order.DoesNotExist:
        return Response({"detail": "Order not found."}, status=HTTP_404_NOT_FOUND)

    return Response(OrderSerializer(order).data)


@api_view(["GET", "POST"])
def customer_order_list(request):
    if request.method == "GET":
        orders = CustomerOrder.objects.all().order_by("-order_date")
        return Response(CustomerOrderSerializer(orders, many=True).data)

    serializer = CustomerOrderSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=400)


@api_view(["GET"])
def customer_order_by_username(request, username):
    orders = CustomerOrder.objects.filter(customer_username=username).order_by("-order_date")
    return Response(CustomerOrderSerializer(orders, many=True).data)
