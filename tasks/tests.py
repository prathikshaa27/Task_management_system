from datetime import date, timedelta

import pytest
from django.contrib.auth import get_user_model
from django.core import mail
from django.core.management import call_command
from django.urls import reverse
from rest_framework.test import APIClient

from tasks.models import Category, Task
from rest_framework_simplejwt.tokens import AccessToken
from django.utils.timezone import now

# Create your tests here.

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user():
    return User.objects.create_user(username="test_user", password="Test@123")


@pytest.fixture
def auth_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def category(user):
    category_creation = Category.objects.create(name="work")
    return category_creation


@pytest.fixture
def task(user):
    return Task.objects.create(
        user=user,
        title="Test Task",
        description="Test Description",
        priority="High",
        status="Pending",
    )


@pytest.fixture
def multiple_tasks(user, category):
    Task.objects.create(
        user=user,
        title="Task 1",
        priority="Low",
        status="Pending",
        due_date="2025-06-30",
    )
    Task.objects.create(
        user=user,
        title="Task 2",
        priority="High",
        status="In Progress",
        due_date="2025-06-28",
    )
    Task.objects.create(
        user=user,
        title="Task 3",
        priority="Medium",
        status="Completed",
        due_date="2025-07-01",
    )


pytest.fixture


def admin_user(db):
    from django.contrib.auth import get_user_model

    User = get_user_model()
    return User.objects.create_user(
        username="admin_user",
        password="Admin@123",
        email="admin@example.com",
        role="admin",
    )


@pytest.fixture
def admin_client(api_client, admin_user):
    token = AccessToken.for_user(admin_user)
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(token)}")
    return api_client


@pytest.fixture
def admin_tasks(admin_user):
    today = now().date()
    for i in range(7):
        Task.objects.create(
            user=admin_user,
            title=f"Task {i}",
            status="Completed" if i % 2 == 0 else "In Progress",
            created_at=today - timedelta(days=i),
        )


@pytest.fixture
def assigner_user():
    return User.objects.create_user(
        username="assigner", password="Assign@123", role="lead"
    )


@pytest.fixture
def assignee_user():
    return User.objects.create_user(
        username="assignee", password="Assignee@123", role="senior"
    )


@pytest.fixture
def assign_auth_client(api_client, assigner_user):
    token = AccessToken.for_user(assigner_user)
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(token)}")
    return api_client


@pytest.fixture
def assign_category():
    return Category.objects.create(name="Testing")


@pytest.mark.django_db
def test_create_task(auth_client, category):
    url = reverse("task-list")
    data = {
        "title": "Django",
        "description": "Learn Django",
        "priority": "Medium",
        "status": "In Progress",
        "category": [category.id],
    }
    response = auth_client.post(url, data, format="json")
    assert response.status_code == 201
    assert Task.objects.filter(title="Django").exists()


@pytest.mark.django_db
def test_list_tasks(auth_client, task):
    url = reverse("task-list")
    response = auth_client.get(url)
    assert response.status_code == 200
    assert any(t["title"] == "Test Task" for t in response.data["results"])


@pytest.mark.django_db
def test_update_task(auth_client, task, category):
    url = reverse("task-detail", kwargs={"pk": task.id})
    data = {
        "title": "Updated Task",
        "description": "task.decription",
        "priority": task.priority,
        "status": task.status,
        "category": [category.id],
    }
    response = auth_client.put(url, data, format="json")
    assert response.status_code == 200
    task.refresh_from_db()
    assert task.title == "Updated Task"


@pytest.mark.django_db
def test_task_delete(auth_client, task):
    url = reverse("task-detail", kwargs={"pk": task.id})
    response = auth_client.delete(url)
    assert response.status_code == 204
    assert not Task.objects.filter(id=task.id).exists()


@pytest.mark.django_db
def test_filter_task_by_priority(auth_client, multiple_tasks):
    url = reverse("task-list")
    response = auth_client.get(url, {"priority": "High"})
    assert response.status_code == 200
    assert all(task["priority"] == "High" for task in response.data["results"])


@pytest.mark.django_db
def test_filter_task_by_status(auth_client, multiple_tasks):
    url = reverse("task-list")
    response = auth_client.get(url, {"status": "Pending"})
    assert response.status_code == 200
    assert all(task["status"] == "Pending" for task in response.data["results"])


@pytest.mark.django_db
def test_filter_task_by_due_date(auth_client, multiple_tasks):
    url = reverse("task-list")
    response = auth_client.get(url, {"due_date": "2025-06-30"})
    assert response.status_code == 200
    assert all(task["due_date"] == "2025-06-30" for task in response.data["results"])


@pytest.mark.django_db
def test_sort_task_by_priority(auth_client, multiple_tasks):
    url = reverse("task-list")
    response = auth_client.get(url, {"ordering": "priority"})
    assert response.status_code == 200
    titles = [task["priority"] for task in response.data["results"]]
    assert titles == sorted(titles)


@pytest.mark.django_db
def test_sort_task_by_due_date(auth_client, multiple_tasks):
    url = reverse("task-list")
    response = auth_client.get(url, {"ordering": "due_date"})
    assert response.status_code == 200
    titles = [task["due_date"] for task in response.data["results"]]
    assert titles == sorted(titles)


@pytest.mark.django_db
def test_list_categories(auth_client, user):
    work_category = Category.objects.create(name="Work")
    personal_category = Category.objects.create(name="Personal")
    urgent_category = Category.objects.create(name="Urgent")

    task = Task.objects.create(
        user=user,
        title="Finish report for project",
        priority="High",
        status="In Progress",
    )
    task.category.add(work_category)

    user_creation = User.objects.create_user(username="test1_user", password="pass123")
    other_task = Task.objects.create(
        user=user_creation, title="Other's Task", priority="Low", status="Pending"
    )
    other_task.category.add(personal_category)
    url = reverse("category-list")
    response = auth_client.get(url)

    assert response.status_code == 200
    category_names = [cat["name"] for cat in response.data["results"]]
    assert "Work" in category_names
    assert "Personal" in category_names
    assert "Urgent" in category_names


@pytest.mark.django_db
def test_assign_task_success(
    assign_auth_client, assigner_user, assignee_user, assign_category, monkeypatch
):
    from tasks.views import can_assign_tasks

    monkeypatch.setattr("tasks.views.can_assign_tasks", lambda assigner, assignee: True)
    url = reverse("assign-task-list")
    data = {
        "title": "Test Task",
        "description": "Sample Task",
        "priority": "High",
        "status": "Pending",
        "category": [assign_category.id],
        "assignee_id": assignee_user.id,
        "due_date": "2025-07-20",
    }
    response = assign_auth_client.post(url, data=data, format="json")

    assert response.status_code == 201
    assert response.data["title"] == "Test Task"
    assert response.data["assignee_name"] == assignee_user.username
    assert response.data["assigned_by_name"] == assigner_user.username
    assert response.data["assigned_by_role"] == assigner_user.role
