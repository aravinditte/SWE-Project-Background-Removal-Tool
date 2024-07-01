"""backgroundRemoverBackend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from authapp.views import register, user_login, send_email_view, change_password, send_forgot_password_mail
from subscriptionapp.views import subscription_list, decrease_tokens,get_tokens
from core.views import process_file,process_video

from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', register, name='register'),
    path('api/login/', user_login, name='login'),
    path('api/process_file/', process_file, name='process'),
    path('api/process_video/', process_video, name='process'),
    path('api/subscribe/', subscription_list, name='subscription_list'),
    path('api/decrease_tokens', decrease_tokens, name='decrease_tokens'),
    path('api/get_tokens', get_tokens, name='subscription_detail'),
    path('api/send_email', send_email_view, name='send_email'),
    path('api/change_password', change_password, name='change_password'),
    path('api/send_forgot_password_mail', send_forgot_password_mail, name='send_forgot_password_mail'),


]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)