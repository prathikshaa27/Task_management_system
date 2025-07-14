from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("lead", "Lead"),
        ("senior", "Senior"),
        ("junior", "Junior"),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="junior")
