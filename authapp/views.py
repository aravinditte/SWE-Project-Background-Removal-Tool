from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import RegistrationSerializer, LoginSerializer
from .email_utils import send_email
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .models import CustomUser

from .email_utils import send_email


@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "status": "success",
            }, status=status.HTTP_201_CREATED)
        return Response({
                "status": "success",
                "message": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def user_login(request):
    if request.method == 'POST':
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            return Response({
                "status": "success",
                "data": {
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "name": user.name
                    }
                }
            }, status=status.HTTP_200_OK)
        return Response({
                "status": "Fail",
                "message": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
def change_password(request):
    if request.method == 'POST':
        email = request.data.get('email', '')
        new_password = request.data.get('new_password', '')
        if email and new_password:
            user = CustomUser.objects.filter(email=email).first()
            if user:
                user.set_password(new_password)
                user.save()
                return JsonResponse({'success': True, 'message': 'Password changed successfully'})
            else:
                return JsonResponse({'success': False, 'message': 'User not found with this email'})
        else:
            return JsonResponse({'success': False, 'message': 'Email address or new password not provided'})
    else:
        return JsonResponse({'success': False, 'message': 'Only POST requests are allowed'})


@csrf_exempt
@api_view(['POST'])
def send_forgot_password_mail(request):
    if request.method == 'POST':
        email = request.data.get('email', '')
        if email:
            user = CustomUser.objects.filter(email=email).first()
            if user:
                email_subject = 'Reset Your Password'
                email_body = f'Hello {user.name},\n\nWe have received a request to reset your password. To change your password, please click <a href="http://localhost:5173/forgot_password">here</a> \n\nIf you did not request this change, you can safely ignore this email.\n\nThank you,\nBackground Removal'
                send_email(email, email_subject, email_body)
                return JsonResponse({'success': True, 'message': 'Forgot password email sent successfully'})
            else:
                return JsonResponse({'success': False, 'message': 'User not found with this email'})
        else:
            return JsonResponse({'success': False, 'message': 'Email address or new password not provided'})
    else:
        return JsonResponse({'success': False, 'message': 'Only POST requests are allowed'})



@csrf_exempt
@api_view(['POST'])
def send_email_view(request):
    if request.method == 'POST':
        email = request.POST.get('email', '')
        print("email: "+email)
        if email:
            user = CustomUser.objects.filter(email=email).first()
            if user:
                email_subject = 'Reset Your Password'
                email_body = f'Hello {user.name},\n\nWe have received a request to reset your password. To change your password, please click <a href="http://localhost:5173/forgot_password">here</a> \n\nIf you did not request this change, you can safely ignore this email.\n\nThank you,\nBackground Removal'
                send_email(email, email_subject, email_body)
                return JsonResponse({'success': True, 'message': 'Forgot password email sent successfully'})
            else:
                return JsonResponse({'success': False, 'message': 'User not found with this email'})
        else:
            return JsonResponse({'success': False, 'message': 'Email address not provided'})
    else:
        return JsonResponse({'success': False, 'message': 'Only POST requests are allowed'})