from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import generics, status
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from users.serializers import UserProfileSerializer, UserRegistrationSerializer,CustomTokenObtainPairSerializer,UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets
from users.models import CustomUser

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
    permission_classes = [AllowAny]


class ChangePasswordView(APIView):
    """
    Allows authenticated user to change password.
    Requires:
    - new_password
    - confirm_password
    """

    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        """_summary_
        Handles POST request to update the authenticated user's password.
        Args:
              request(Request): The HTTP request object containing the new and confirm passwords

        Returns:
             Response: A success message upon password update or an error message
            with appropriate HTTP status code on validation failure.
        """
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not new_password or not confirm_password:
            return Response(
                {"error": "Both new_password and confirm_password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_password != confirm_password:
            return Response(
                {"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            validate_password(new_password, user=request.user)
        except DjangoValidationError as e:
            return Response({"error": e.messages}, status=status.HTTP_400_BAD_REQUEST)

        request.user.set_password(new_password)
        request.user.save()

        return Response(
            {"message": "Password updated successfully."}, status=status.HTTP_200_OK
        )


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
        """Retrieves the user object associated with the current authenticated request.

        Returns:
            User: The currently authenticated user instance.
        """
        return self.request.user

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class UserRoleUpdateView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]