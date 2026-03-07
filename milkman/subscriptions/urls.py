from django.urls import path
from .views import customer_subscription, plan_detail, plan_list, subscription_list

urlpatterns = [
    path("plans/", plan_list, name="plan-list"),
    path("plans/<int:plan_id>/", plan_detail, name="plan-detail"),
    path("subscriptions/", subscription_list, name="subscription-list"),
    path("subscriptions/<str:username>/", customer_subscription, name="customer-subscription"),
]
