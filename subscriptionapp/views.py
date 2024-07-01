from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from .models import Subscription
from .serializers import SubscriptionSerializer

from django.db.models import F

@csrf_exempt
def subscription_list(request):
    if request.method == 'GET':
        subscriptions = Subscription.objects.all()
        serializer = SubscriptionSerializer(subscriptions, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        user_id = data.get('user_id')
        tokens = int(data.get('available_tokens', 0))
        
        try:
            subscription = Subscription.objects.get(user_id=user_id)
            subscription.available_tokens += tokens
            subscription.save()  # Save the updated subscription
            serializer = SubscriptionSerializer(subscription)
            return JsonResponse(serializer.data, status=200)
        except Subscription.DoesNotExist:
            serializer = SubscriptionSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=201)
            return JsonResponse(serializer.errors, status=400)

@csrf_exempt
def subscription_detail(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        user_id = data.get('user_id')
        try:
            subscription = Subscription.objects.get(user_id=user_id)
            serializer = SubscriptionSerializer(subscription)
            return JsonResponse(serializer.data)
        except Subscription.DoesNotExist:
            return JsonResponse({'error': 'Subscription does not exist'}, status=404)


@csrf_exempt
def get_tokens(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        user_id = data.get('user_id')
        try:
            subscription = Subscription.objects.get(user_id=user_id)
            serializer = SubscriptionSerializer(subscription)
            return JsonResponse(serializer.data, status=200)                
        except Subscription.DoesNotExist:
            return JsonResponse({'error': 'Subscription not found'}, status=404)

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def decrease_tokens(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        user_id = data.get('user_id')
        try:
            subscription = Subscription.objects.get(user_id=user_id)
            if subscription.available_tokens >= 1:
                subscription.available_tokens -= 1
                subscription.save()
                serializer = SubscriptionSerializer(subscription)
                return JsonResponse(serializer.data, status=200)
            else:
                return JsonResponse({'error': 'Not enough available tokens'}, status=400)
        except Subscription.DoesNotExist:
            return JsonResponse({'error': 'Subscription not found'}, status=404)

    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)