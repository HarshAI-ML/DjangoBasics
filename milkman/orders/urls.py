from django.urls import path

from .views import (
    customer_order_by_username,
    customer_order_list,
    order_detail,
    order_list,
)

urlpatterns = [
    path("orders/", order_list, name="order_list"),
    path("orders/<int:order_id>/", order_detail, name="order_detail"),
    path("customer-orders/", customer_order_list, name="customer_order_list"),
    path(
        "customer-orders/<str:username>/",
        customer_order_by_username,
        name="customer_order_by_username",
    ),
]
