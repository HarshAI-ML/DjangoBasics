from django.urls import path
from . import views
from .views import Customer_list

urlpatterns = [
    path('customer/', Customer_list, name='Customer-list'),

    # path('getstaff/',views.totalstaff,name='totalstaff'),
]