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
from rest_framework_simplejwt.authentication import JWTAuthentication


# Create your views here.

User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    """
    API view to register a new user.

    Allows users to create a new account by providing username, email,
    password, and password confirmation. Uses UserRegistrationSerializer
    for input validation.
    """

    serializer_class = UserRegistrationSerializer


class LoginView(APIView):
    """
    API view to log in an existing user.

    Accepts username and password in the request body.
    Authenticates the user using Django's built-in authentication system.
    Returns a success message on login or an error message on failure.
    """

    def post(self, request):
        """
            Handle POST request for user login.

            Validates credentials, logs in the user if valid, and returns a response.
            Args:
            request (Request): The HTTP request object containing login credentials.

        Returns:
            Response: A success response if login is successful,
                      or an error response indicating the failure reason.
        """
        try:
            username = request.data.get("username")
            password = request.data.get("password")
            if not username or not password:
                return Response(
                    {"error": "Both username and password are required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            check_logged_in_user = authenticate(username=username, password=password)
            if check_logged_in_user:
                login(request, check_logged_in_user)
                return Response({"message": "Login successful"})
            return Response(
                {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response({"error": f"An unexpected error occured:{str(e)}"})


class UserProfileView(RetrieveUpdateAPIView):
    """
    API view to retrieve and update user profile information.

    Requires the user to be authenticated.
    Allows updates to username, email, and password.
    Args:
        request (Request): The HTTP request, expected to contain:
            - username (str): The desired unique username.
            - email (str): The user’s email address.
            - password (str): The user’s password.
            - password_check (str): Confirmation of the password.

    Returns:
        Response: HTTP 201 Created with the new user’s data on success,
                  or HTTP 400 Bad Request with validation errors.

    Raises:
        serializers.ValidationError: If password and password_check do not match,
                                      or other validation errors occur
    """

    serializer_class = UserProfileSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """_summary_

        Returns:
            _type_: _description_
        """
        return self.request.user
