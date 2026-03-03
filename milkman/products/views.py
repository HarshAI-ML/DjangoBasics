from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets

from .serializers import productSerializer
# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product
from .serializers import productSerializer


@api_view(['GET', 'POST'])
def product_list(request):

    if request.method == 'GET':
        product = Product.objects.all()
        serializer = productSerializer(product, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = productSerializer(data=request.data)
        print("line no 23 ", request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)