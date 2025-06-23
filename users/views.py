from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import login, authenticate
from users.serializers import UserRegistrationSerializer, UserProfileSerializer
from django.contrib.auth import get_user_model
from django.http import request
from rest_framework.permissions import IsAuthenticated


# Create your views here.

User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    fetch_all_users = User.objects.all()
    serializer_class = UserRegistrationSerializer


class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        check_logged_in_user = authenticate(username=username, password=password)
        if check_logged_in_user:
            login(request, check_logged_in_user)
            return Response({"message": "Login successful"})
        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )


class UserProfileView(RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
