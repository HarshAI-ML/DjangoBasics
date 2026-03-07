from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Product
from .serializers import productSerializer


@api_view(["GET", "POST"])
def product_list(request):
    if request.method == "GET":
        product = Product.objects.all()
        serializer = productSerializer(
            product, many=True, context={"request": request}
        )
        return Response(serializer.data)

    serializer = productSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)
