from django.db import models
from django.contrib.auth.models import AbstractUser,Group

# Create your models here.

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("lead", "Lead"),
        ("senior", "Senior"),
        ("junior", "Junior"),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="junior")

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.sync_group()

    def sync_group(self):
        if self.role:
            group, _ = Group.objects.get_or_create(name=self.role.lower())
            self.groups.set([group]) 
