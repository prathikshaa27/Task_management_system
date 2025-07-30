from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from tasks.models import Task


class Command(BaseCommand):
    help = "Initializes roles and assigns permissions"

    def handle(self, *args, **kwargs):
        roles = ["admin", "lead", "senior", "junior"]
        task_ct = ContentType.objects.get_for_model(Task)
        perms = Permission.objects.filter(content_type=task_ct)

        for role in roles:
            group, _ = Group.objects.get_or_create(name=role)
            group.permissions.set(perms)
