from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from .models import Customer
from .serializers import CustomerSerializer
# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Customer
from .serializers import CustomerSerializer


@api_view(['GET', 'POST'])
def Customer_list(request):

    if request.method == 'GET':
        staff = Customer.objects.all()
        serializer = CustomerSerializer(staff, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CustomerSerializer(data=request.data)
        print("line no 23 ", request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)