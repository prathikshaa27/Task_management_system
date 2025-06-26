from django.test import TestCase
import pytest
from tasks.models import Task
from django.contrib.auth import get_user_model
from django.test import Client
from django.urls import reverse
from datetime import date, timedelta


# Create your tests here.
User = get_user_model()


@pytest.fixture
def test_user(db):
    return User.objects.create_user(
        username="testuser", email="testuser@gmail.com", password="Testpass@123"
    )


@pytest.fixture
def client_logged_in(test_user):
    client = Client()
    client.login(username="testuser", password="Testpass@123")
    return client


@pytest.fixture
def create_tasks(test_user):
    Task.objects.create(
        user=test_user,
        title="Urgent Task",
        priority="High",
        status="Pending",
        due_date=date.today(),
    )
    Task.objects.create(
        user=test_user,
        title="Medium Task",
        priority="Medium",
        status="In Progress",
        due_date=date.today(),
    )
    Task.objects.create(
        user=test_user,
        title="Low priority Task",
        priority="Low",
        status="Completed",
        due_date=date.today() + timedelta(days=1),
    )


@pytest.mark.django_db
def test_task_creation(client_logged_in):
    url = reverse("task_create")
    data = {
        "title": "Test Task",
        "description": "This is a sample test task.",
        "priority": "High",
        "status": "Pending",
        "due_date": date.today(),
    }
    response = client_logged_in.post(url, data)
    assert response.status_code == 302
    assert Task.objects.filter(title="Test Task").exists()


@pytest.mark.django_db
def test_task_update(client_logged_in, test_user):
    task = Task.objects.create(
        user=test_user, title="Test Title", priority="High", status="Pending"
    )
    url = reverse("task_update", args=[task.pk])
    updated_data = {
        "title": "Example Title",
        "priority": "High",
        "status": "In Progress",
    }
    response = client_logged_in.post(url, updated_data)
    assert response.status_code == 302
    task.refresh_from_db()
    assert task.title == "Example Title"
    assert task.status == "In Progress"


@pytest.mark.django_db
def test_task_update(client_logged_in, test_user):
    task = Task.objects.create(
        user=test_user, title="Test Title", priority="High", status="Pending"
    )
    url = reverse("task_delete", args=[task.pk])
    response = client_logged_in.post(
        url,
    )
    assert response.status_code == 302
    assert not Task.objects.filter(pk=task.pk).exists()


@pytest.mark.django_db
def test_task_filter_by_priority(client_logged_in, test_user, create_tasks):
    response = client_logged_in.get(reverse("task_list"), {"priority": "High"})
    assert response.status_code == 200
    assert b"Urgent Task" in response.content
    assert b"Medium Task" not in response.content


@pytest.mark.django_db
def test_task_filter_by_status(client_logged_in, test_user, create_tasks):
    response = client_logged_in.get(reverse("task_list"), {"status": "Completed"})
    assert response.status_code == 200
    assert b"Low priority Task" in response.content
    assert b"Medium Task" not in response.content


@pytest.mark.django_db
def test_task_filter_by_due_date(client_logged_in, test_user, create_tasks):
    today_date = date.today().isoformat()
    url = reverse("task_list")
    response = client_logged_in.get(url, {"due_date": today_date})
    content = response.content.decode()
    assert "Urgent Task" in content
    assert "Medium Task" in content
    assert "Low priority Task" not in content


@pytest.mark.django_db
def test_sort_by_due_date(client_logged_in, create_tasks):
    url = reverse("task_list")
    response = client_logged_in.get(url, {"sort": "due_date"})
    content = response.content.decode()

    assert (
        content.find("Urgent Task")
        < content.find("Medium Task")
        < content.find("Low priority Task")
    )


@pytest.mark.django_db
def test_sort_by_priority(client_logged_in, create_tasks):
    url = reverse("task_list")
    response = client_logged_in.get(url, {"sort": "priority"})
    content = response.content.decode()

    assert (
        content.find("Urgent Task")
        < content.find("Medium Task")
        < content.find("Low priority Task")
    )


@pytest.mark.django_db
def test_sort_by_due_notifications(client_logged_in, create_tasks):
    url = reverse("task_notifications")
    response = client_logged_in.get(url)
    content = response.content.decode()

    assert "Urgent Task" in content
    assert "Medium Task" in content
    assert "Low priority Task" not in content
