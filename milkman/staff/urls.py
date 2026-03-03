from django.urls import path
from . import views
from .views import staff_list


urlpatterns = [
    path('staff/', staff_list, name='staff-list'),
    
    # path('getstaff/',views.totalstaff,name='totalstaff'),
]