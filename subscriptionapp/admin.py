# admin.py

from django.contrib import admin
from .models import Subscription

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'plan', 'available_tokens', 'user_name')
    search_fields = ('user_id', 'plan', 'user_name')
