from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
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
    old_password = serializers.CharField(
        write_only = True,
        required = False,
        allow_blank = True
    )
    

    class Meta:
        model = User
        fields = ["username", "email", "password","old_password"]

    def update(self, instance, validated_data):
        old_password = validated_data.pop("old_password",None)
        new_password = validated_data.pop("password", None)
        try:
            if new_password:
                if not old_password:
                    raise serializers.ValidationError({"old_password":"You must provide your current password to set a new one."})
                if not instance.check_password(old_password):
                    raise serializers.ValidationError({"old_password":"Current password is incorrect."})
                instance.set_password(new_password)
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
        model = CustomUser
        fields = ["id", "username", "email", "role"]
    def update(self, instance, validated_data):
       role = validated_data.get('role')
       if role:
           instance.role = role
           instance.save()
       return super().update(instance,validated_data)