from django.test import TestCase
import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status

# Create your tests here.

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def create_user():
    def make_user(**kwargs):
        return User.objects.create_user(**kwargs)

    return make_user


@pytest.mark.django_db
def test_user_registration(api_client):
    url = reverse("registration-view")
    data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "Testuser123!",
        "password_check": "Testuser123!",
    }
    response = api_client.post(url, data=data)
    assert response.status_code == status.HTTP_201_CREATED
    assert User.objects.filter(username="testuser").exists()


@pytest.mark.django_db
def test_password_mismatch(api_client):
    url = reverse("registration-view")
    data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "Testuser123!",
        "password_check": "user123!",
    }
    response = api_client.post(url, data=data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Passwords you typed does not match please check again" in str(response.data)


@pytest.mark.django_db
def test_login_success(api_client, create_user):
    user_creation = create_user(username="testsampleuser", password="testsample@123")
    url = reverse("login-view")
    data = {"username": "testsampleuser", "password": "testsample@123"}
    response = api_client.post(url, data=data)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["message"] == "Login successful"


@pytest.mark.django_db
def test_login_fail(api_client, create_user):
    url = reverse("login-view")
    data = {"username": "testsample", "password": "testsample@3"}
    response = api_client.post(url, data=data)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Invalid credentials" in str(response.data)


@pytest.mark.django_db
def test_profile_update(api_client, create_user):
    user_creation = create_user(
        username="testsample", password="testsample@123", email="testsample@gmail.com"
    )
    api_client.force_authenticate(user=user_creation)
    url = reverse("display-and-update-profile")
    response = api_client.patch(url, {"email": "testsample12345@gmail.com"})
    assert response.status_code == status.HTTP_200_OK
    assert response.data["email"] == "testsample12345@gmail.com"


@pytest.mark.django_db
def test_password_reset(api_client):
    url = reverse("password-reset")
    response = api_client.get(url)
    assert (
        response.status_code == status.HTTP_200_OK
        or response.status_code == status.HTTP_302_FOUND
    )
