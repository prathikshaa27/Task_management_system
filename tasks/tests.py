from django.test import TestCase
import pytest
from tasks.models import Task, Category
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from datetime import date, timedelta
from django.core.management import call_command
from django.core import mail


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
    assert any(t["title"] == "Test Task" for t in response.data)


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
    assert all(task["priority"] == "High" for task in response.data)


@pytest.mark.django_db
def test_filter_task_by_status(auth_client, multiple_tasks):
    url = reverse("task-list")
    response = auth_client.get(url, {"status": "Pending"})
    assert response.status_code == 200
    assert all(task["status"] == "Pending" for task in response.data)


@pytest.mark.django_db
def test_filter_task_by_due_date(auth_client, multiple_tasks):
    url = reverse("task-list")
    response = auth_client.get(url, {"due_date": "2025-06-30"})
    assert response.status_code == 200
    assert all(task["due_date"] == "2025-06-30" for task in response.data)


@pytest.mark.django_db
def test_sort_task_by_priority(auth_client, multiple_tasks):
    url = reverse("task-list")
    response = auth_client.get(url, {"ordering": "priority"})
    assert response.status_code == 200
    titles = [task["priority"] for task in response.data]
    assert titles == sorted(titles)


@pytest.mark.django_db
def test_sort_task_by_priority(auth_client, multiple_tasks):
    url = reverse("task-list")
    response = auth_client.get(url, {"ordering": "due_date"})
    assert response.status_code == 200
    titles = [task["due_date"] for task in response.data]
    assert titles == sorted(titles)


@pytest.mark.django_db
def test_task_notifications(user):
    user.email = "testuser@gmail.com"
    user.save()

    first_task = Task.objects.create(
        user=user,
        title="Python Revision",
        due_date=date.today() + timedelta(days=1),
        status="Pending",
    )

    second_task = Task.objects.create(
        user=user,
        title="CPD Session",
        due_date=date.today() + timedelta(days=2),
        status="In Progress",
    )

    call_command("send_reminders")
    assert len(mail.outbox) == 1
    email = mail.outbox[0]
    assert "Python Revision" in email.body
    assert "CPD Session" in email.body
    assert email.to == [user.email]

    first_task.refresh_from_db()
    second_task.refresh_from_db()

    assert first_task.reminder_sent_for_1_day is True
    assert second_task.reminder_sent_for_2_days is True


@pytest.mark.django_db
def test_list_categories(auth_client, user):
    work_category = Category.objects.create(name="Work")
    personal_category = Category.objects.create(name="Personal")

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
    category_names = [cat["name"] for cat in response.data]
    assert "Work" in category_names
    assert "Personal" not in category_names
