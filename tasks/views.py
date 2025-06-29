from rest_framework import viewsets, permissions
from tasks.models import Task, Category
from tasks.serializers import TaskSerializer, CategorySerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import serializers
import logging

logger = logging.getLogger(__name__)


class TaskViewSet(viewsets.ModelViewSet):
    """
    A viewset for managing task CRUD operations.

    - Requires user to be authenticated.
    - Supports filtering by status, priority, and due date.
    - Allows ordering by priority and due date.
    - Enables search by task title and category name.
    """

    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    ]
    filterset_fields = ["status", "priority", "due_date"]
    ordering_fields = ["priority", "due_date"]
    search_fields = ["title", "category__name"]

    def get_queryset(self):
        """
        Returns queryset of tasks that belong to the authenticated user.

        Handles any exceptions during fetching with logging and returns an empty queryset.
        """
        try:
            return Task.objects.filter(user=self.request.user)
        except Exception as e:
            logger.error(f"Error fetching tasks for user {self.request.user}: {str(e)}")
            return Task.objects.none()

    def perform_create(self, serializer):
        """
        Creates a new task associated with the authenticated user.

        If 'category' is in the request data, sets the categories accordingly.
        Logs errors and raises validation error if creation fails.
        """
        try:
            task = serializer.save(user=self.request.user)
            if "category" in self.request.data:
                task.category.set(self.request.data.get("category", []))
        except Exception as e:
            logger.error(f"Error while creating task: {str(e)}")
            raise serializers.ValidationError(
                {"error": "Could not create task. Please check the data."}
            )

    def perform_update(self, serializer):
        """
        Updates an existing task for the authenticated user.

        If 'category' is present, updates the many-to-many relationship.
        Logs errors and raises validation error if update fails.
        """
        try:
            task = serializer.save(user=self.request.user)
            if "category" in self.request.data:
                task.category.set(self.request.data.get("category", []))
        except Exception as e:
            logger.error(f"Error while updating task: {str(e)}")
            raise serializers.ValidationError(
                {"error": "Could not update task. Something went wrong."}
            )


class CategoryViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing categories that belong to the authenticated user's tasks.

    Ensures users only see categories relevant to their own tasks.
    """

    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            return Category.objects.filter(tasks__user=self.request.user).distinct()
        except Exception as e:
            logger.error(
                f"Error fetching categories for user {self.request.user}: {str(e)}"
            )
            return Category.objects.none()

    def get_serializer_context(self):
        return {"request": self.request}
