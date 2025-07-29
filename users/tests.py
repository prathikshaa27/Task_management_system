import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken

# Create your tests here.

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def create_user():
    def make_user(username, password, email, role="junior"):
        return User.objects.create_user(
            username=username, password=password, email=email, role=role
        )

    return make_user


@pytest.fixture
def authenticated_client(create_user):
    def make_authenticated_client(role="junior"):
        user = create_user(
            username=f"{role}_user",
            password="testpass@123",
            email=f"{role}@gmail.com",
            role=role,
        )
        token = AccessToken.for_user(user)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(token)}")
        return client, user

    return make_authenticated_client


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
def test_login_success_with_role(api_client, create_user):
    user = create_user(
        username="testuser", password="testuser@123", email="testuser@example.com"
    )
    url = reverse("token_obtain_pair")
    data = {"username": "testuser", "password": "testuser@123"}
    response = api_client.post(url, data=data)
    access_token = response.data["access"]
    decoded_token = AccessToken(access_token)
    assert "role" in decoded_token
    assert decoded_token["role"] == "junior"


@pytest.mark.django_db
def test_password_mismatch(authenticated_client):
    client, _ = authenticated_client()
    url = reverse("change-password")
    data = {"new_password": "TestPass@123", "confirm_password": "TestPass@12"}
    response = client.post(url, data=data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data["error"] == "Passwords do not match."


@pytest.mark.django_db
def test_password_change_missing_fields(authenticated_client):
    client, _ = authenticated_client()
    url = reverse("change-password")
    data = {"new_password": "TestPass@123"}
    response = client.post(url, data=data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "error" in response.data


@pytest.mark.django_db
def test_profile_update_without_password(authenticated_client):
    client, _ = authenticated_client()
    url = reverse("display-and-update-profile")
    new_data = {"username": "testuser", "email": "testuser@gmail.com"}
    response = client.put(url, new_data, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert response.data["username"] == "testuser"


@pytest.mark.django_db
def test_profile_update(authenticated_client):
    client, _ = authenticated_client()
    url = reverse("display-and-update-profile")
    updates_data = {
        "username": "testuser",
        "email": "testuser@gmail.com",
    }
    response = client.put(url, updates_data, format="json")
    assert response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_change_password(authenticated_client):
    client, user = authenticated_client()  

    url = reverse("change-password")
    password_data = {
        "new_password": "newpass@123",
        "confirm_password": "newpass@123"
    }

    response = client.post(url, password_data, format="json")
    assert response.status_code == status.HTTP_200_OK
    user.refresh_from_db()
    fresh_client = APIClient()
    login_data = {"username": user.username, "password": "newpass@123"}
    login_response = fresh_client.post(reverse("token_obtain_pair"), login_data)

    assert login_response.status_code == status.HTTP_200_OK

@pytest.mark.django_db
def test_user_list_access_authorized_admin(authenticated_client):
    client, _ = authenticated_client("admin")
    response = client.get(reverse("user-list"))
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_admin_can_update_user_roles(authenticated_client, create_user):
    target_user = create_user(
        username="testuser",
        password="testpass@123",
        email="testuser@gmail.com",
        role="junior",
    )
    client, _ = authenticated_client("admin")
    url = reverse("user-role", kwargs={"pk": target_user.pk})
    data = {"role": "senior"}
    response = client.patch(url, data=data, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert response.data["role"] == "senior"
