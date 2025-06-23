from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password


User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_check = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "password_check"]

    def validate(self, data):
        if data["password"] != data["password_check"]:
            raise serializers.ValidationError(
                "Passwords you typed does not match please check again"
            )
        return data

    def create(self, validated_data):
        validated_data.pop("password_check")
        return User.objects.create_user(**validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=False, validators=[validate_password]
    )

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def update(self, instance, validated_data):
        if "password" in validated_data:
            instance.set_password(validated_data.pop("password"))
        return super().update(instance, validated_data)
