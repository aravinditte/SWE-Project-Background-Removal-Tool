# serializers.py

from rest_framework import serializers
from .models import Subscription

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id', 'user_id', 'plan', 'available_tokens', 'user_name']
