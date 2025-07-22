from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from users.models import CustomUser

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_check = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "password_check"]

    # to validate password
    def validate(self, data):
        print("Received data in serializer:", data)
        if data["password"] != data["password_check"]:
            raise serializers.ValidationError(
                "Passwords you typed does not match please check again"
            )
        return data

    def create(self, validated_data):
        try:
            validated_data.pop("password_check")
            user_creation = User.objects.create_user(**validated_data)
            return user_creation
        except Exception as e:
            raise serializers.ValidationError(
                {"error": f"User creation failed{str(e)}"}
            )


class UserProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        validators=[validate_password],
    )

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def update(self, instance, validated_data):
        try:
            if "password" in validated_data:
                instance.set_password(validated_data.pop("password"))
            return super().update(instance, validated_data)
        except Exception as e:
            raise serializers.ValidationError(
                {"error": f"User profile update failed{str(e)}"}
            )


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        return token


def validate(self, attrs):
    data = super().validate(attrs)
    return data


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "email", "role"]
