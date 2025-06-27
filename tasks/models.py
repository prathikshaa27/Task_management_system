from django.db import models
from django.conf import settings


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=25, unique=True)

    def __str__(self):
        return self.name


class Task(models.Model):
    PRIORITY_CHOICES = [("Low", "Low"), ("Medium", "Medium"), ("High", "High")]
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("In Progress", "In Progress"),
        ("Completed", "Completed"),
    ]
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tasks"
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    priority = models.CharField(
        max_length=15, choices=PRIORITY_CHOICES, default="Medium"
    )
    due_date = models.DateField(blank=True, null=True)
    status = models.CharField(
        max_length=15, choices=STATUS_CHOICES, default="In Progress"
    )
    category = models.ManyToManyField(Category, blank=True, related_name="tasks")
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
