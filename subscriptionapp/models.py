from django.db import models

class Subscription(models.Model):
    user_id = models.CharField(max_length=150, unique=True)
    plan = models.CharField(max_length=100)
    available_tokens = models.IntegerField(default=0)
    user_name = models.CharField(max_length=150)
    
    def __str__(self):
        return self.user_name
