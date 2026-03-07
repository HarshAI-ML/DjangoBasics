from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product", "product_name", "quantity", "unit_price", "line_total")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer_name",
        "customer_phone",
        "payment_method",
        "status",
        "payment_status",
        "total",
        "created_at",
    )
    list_filter = ("status", "payment_status", "payment_method", "created_at")
    search_fields = ("customer_name", "customer_phone")
    inlines = [OrderItemInline]
