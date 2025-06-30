from rest_framework import viewsets, permissions
from tasks.models import Task, Category
from tasks.serializers import TaskSerializer, CategorySerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import serializers
from rest_framework_simplejwt.authentication import JWTAuthentication
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
        """_summary_

        Returns:
            _type_: _description_
        """
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
        Handles the creation of a new Task object.

        This method assigns the currently authenticated user to the task and
        sets the associated categories if provided in the request data.

        Args:
            serializer (TaskSerializer): The serializer instance containing validated task data.

        Raises:
            serializers.ValidationError: If task creation fails due to invalid input or internal error.
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
         Args:
          serializer (TaskSerializer): The serializer instance containing the updated task data.

        Raises:
          serializers.ValidationError: If the task update fails due to invalid input or internal error.
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
        """
        Returns a queryset of categories associated with the authenticated user's tasks.

        This method filters `Category` objects to include only those linked to tasks
        that belong to the currently logged-in user. The `distinct()` function is used
        to ensure duplicate categories (if any) are removed from the result.

        Returns:
            QuerySet: A queryset containing user-specific `Category` objects.

        Logs:
            Logs an error message if the queryset fails to retrieve,
            and returns an empty queryset in such a case.
        """
        try:
            return Category.objects.filter(tasks__user=self.request.user).distinct()
        except Exception as e:
            logger.error(
                f"Error fetching categories for user {self.request.user}: {str(e)}"
            )
            return Category.objects.none()

    def get_serializer_context(self):
        """
        Provides additional context to the serializer class.

        This method ensures that the current HTTP request object is passed
        to the serializer via the context. It's particularly useful when
        you need access to the request user or other request-specific data
        inside the serializer.

        Returns:
            dict: A dictionary containing the request object under the "request" key.
        """
        return {"request": self.request}
