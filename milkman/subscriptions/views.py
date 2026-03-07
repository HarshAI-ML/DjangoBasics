from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_404_NOT_FOUND

from customers.models import Customer

from .models import CustomerSubscription, Plan
from .serializers import CustomerSubscriptionSerializer, PlanSerializer

DEFAULT_PLANS = [
    {"name": "Starter", "monthly_price": "199.00", "quantity": "500ml daily"},
    {"name": "Standard", "monthly_price": "349.00", "quantity": "1L daily"},
    {"name": "Family", "monthly_price": "599.00", "quantity": "2L daily"},
]


@api_view(["GET", "POST"])
def plan_list(request):
    if request.method == "GET":
        if not Plan.objects.exists():
            Plan.objects.bulk_create([Plan(**item) for item in DEFAULT_PLANS])
        plans = Plan.objects.all().order_by("id")
        return Response(PlanSerializer(plans, many=True).data)

    serializer = PlanSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=HTTP_201_CREATED)
    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
def plan_detail(request, plan_id):
    try:
        plan = Plan.objects.get(id=plan_id)
    except Plan.DoesNotExist:
        return Response({"detail": "Plan not found."}, status=HTTP_404_NOT_FOUND)

    plan.delete()
    return Response(status=204)


@api_view(["GET"])
def subscription_list(request):
    subscriptions = CustomerSubscription.objects.select_related("customer", "plan").all()
    serializer = CustomerSubscriptionSerializer(subscriptions, many=True)
    return Response(serializer.data)


@api_view(["GET", "POST"])
def customer_subscription(request, username):
    customer = Customer.objects.filter(username=username).first()
    if not customer:
        return Response({"detail": "Customer not found."}, status=HTTP_404_NOT_FOUND)

    if request.method == "GET":
        sub = CustomerSubscription.objects.filter(customer=customer).select_related("plan").first()
        if not sub:
            return Response({"detail": "No active subscription."}, status=HTTP_404_NOT_FOUND)
        return Response(CustomerSubscriptionSerializer(sub).data)

    plan_id = request.data.get("plan")
    plan = Plan.objects.filter(id=plan_id).first()
    if not plan:
        return Response({"detail": "Plan not found."}, status=HTTP_404_NOT_FOUND)

    sub, _ = CustomerSubscription.objects.update_or_create(
        customer=customer, defaults={"plan": plan, "status": "Active"}
    )
    return Response(CustomerSubscriptionSerializer(sub).data, status=HTTP_201_CREATED)

