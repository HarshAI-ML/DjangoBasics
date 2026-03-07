from django.urls import path
from .views import customer_list, customer_login

urlpatterns = [
    path("customers/", customer_list, name="customer-list"),
    path("customers/login/", customer_login, name="customer-login"),
]
