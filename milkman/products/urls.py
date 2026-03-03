from django.urls import path
from . import views
from .views import product_list


urlpatterns = [
    path('products/', product_list, name='product-list'),
    
    # path('getstaff/',views.totalstaff,name='totalstaff'),
]