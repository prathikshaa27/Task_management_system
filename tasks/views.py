import logging
from datetime import timedelta

from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from tasks.permissions import IsOwnerOrAdminOnly

from tasks.models import Category, Task
from tasks.serializers import CategorySerializer, TaskSerializer
from django.utils.timezone import now, timedelta
from rest_framework import status
from django.db.models import Count
from collections import defaultdict
from django.contrib.auth import get_user_model
from tasks.utils import can_assign_tasks
from users.models import CustomUser
from rest_framework import status
from tasks.utils import get_user_role

logger = logging.getLogger(__name__)

User = get_user_model()


class TaskViewSet(viewsets.ModelViewSet):
    """
    A viewset for managing task CRUD operations.

    - Requires user to be authenticated.
    - Supports filtering by status, priority, and due date.
    - Allows ordering by priority and due date.
    - Enables search by task title and category name.
    """

    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsOwnerOrAdminOnly]

    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    ]
    filterset_fields = ["status", "priority", "due_date"]
    ordering_fields = ["priority", "due_date", "user__username"]
    search_fields = ["title", "category__name"]

    def get_queryset(self):
        """
        Returns a queryset of tasks that belong to the authenticated user.
        Admin: can see all tasks (read-only)
        User: sees only own tasks

        Filters the Task model to only include tasks created by the current user.
        Logs and returns an empty queryset if an error occurs during retrieval.

        Returns:
         QuerySet: A queryset of the user's tasks.
        """
        try:
            user_role = get_user_role(user)
            if user_role == "admin":
                return Task.objects.all()
            return Task.objects.filter(user=user_role)
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
            raise serializers.ValidationError(
                {"error": "Task creation failed" + str(e)}
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
        task = self.get_object()
        current_user = self.request.user
        assigner = task.assigned_by
        try:
            incoming_fields = set(self.request.data.keys())
            allowed_fields = {"status"}
            is_status_only = incoming_fields.issubset(allowed_fields)
            if not is_status_only:
               current_role = get_user_role(current_user)
               assigner_role = get_user_role(assigner)
               if current_user.role == "senior" and assigner and assigner.role != "lead":
 
                    raise serializers.ValidationError(
                        {
                            "error": "You cannot edit tasks assigned to you by a senior or lead"
                        }
                    )
            if current_role == "senior" and assigner and assigner_role != "lead":

                raise serializers.ValidationError(
                    {"error": "You cannot edit tasks assigned to you by a lead"}
                )
            task = serializer.save(user=current_user)

            if "category" in self.request.data:
                task.category.set(self.request.data.get("category", []))
        except Exception as e:
            logger.error(f"Error while updating task: {str(e)}")
            raise serializers.ValidationError({"error": f"Update failed: {str(e)}"})

    @action(detail=False, methods=["get"], url_path="notifications")
    def upcoming_tasks(self, request):
        """
        Custom action to retrieve tasks with due dates within the next two days.

        Checks for tasks that are due either tomorrow or the day after tomorrow,
        based on the current date. Useful for sending reminders or notifications.

        Args:
            request (Request): The HTTP request object.

        Returns:
            Response: A serialized list of upcoming tasks.
        """
        today = timezone.now().date()
        in_one_day = today + timedelta(days=1)
        in_two_days = today + timedelta(days=2)
        tasks = self.get_queryset().filter(due_date__in=[in_one_day, in_two_days])
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing categories that belong to the authenticated user's tasks.

    Ensures users only see categories relevant to their own tasks.
    """

    serializer_class = CategorySerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

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
            return Category.objects.all()
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


class AnalyticsViewSet(viewsets.ViewSet):
    """
    A ViewSet for viewing task analytics.

    Only accessible by admin users.
    This viewset provides statistical insights about tasks and user activity
    for the purpose of monitoring productivity and trends.

    Permissions:
        - Only users with admin privileges can access this viewset.
    """

    permission_classes = [IsAdminUser]

    @action(detail=False, methods=["get"], url_path="summary")
    def analytics_summary(self, request):
        """
        Returns task analytics summary for admin users.

        Includes:
        - Top 5 active users based on task count
        - Tasks created per day in the last 7 days
        - Task count per status (e.g., pending, completed)

        Only accessible to users with admin role.
        """
        user = request.user
        if get_user_role(user) != "admin":
            return Response(
                {"detail": "Only admins can access this endpoint"},
                status=status.HTTP_403_FORBIDDEN,
            )
        active_users = (
            Task.objects.values("user__username")
            .annotate(task_count=Count("id"))
            .order_by("-task_count")[:5]
        )

        today = now().date()
        daily_tasks = defaultdict(int)
        for i in range(7):
            day = today - timedelta(days=i)
            count = Task.objects.filter(created_at=day).count()
            daily_tasks[day.strftime("%Y-%m-%d")] = count
            status_distribution = Task.objects.values("status").annotate(
                count=Count("id")
            )
            return Response(
                {
                    "active_users": list(active_users),
                    "tasks_per_day": dict(daily_tasks),
                    "status_summary": status_distribution,
                },
                status=status.HTTP_200_OK,
            )


class TaskAssignViewSet(viewsets.ViewSet):
    """
    ViewSet responsible for assigning tasks from one user to another.

    This view handles task assignment via POST requests. Only authenticated users
    with proper permissions (based on business logic defined in `can_assign_tasks`)
    are allowed to assign tasks to others.

    Attributes:
        permission_classes (list): Ensures only authenticated users can access this view.
        authentication_classes (list): Uses JWT authentication to verify users.

    Methods:
        create(request):
            Handles task creation and assignment from the assigner (request user)
            to the assignee (provided via `assignee_id` in the request data).
            Returns 201 on success, 403 for permission errors, 404 if the assignee
            is not found, or 400/500 for other issues.
    """

    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def create(self, request):
        """
        Assigns a task to another user.

        This method allows the authenticated user (assigner) to assign a task
        to another user (assignee) based on the provided `assignee_id` and
        task details in the request payload.

        Args:
            request (Request): The HTTP request object containing user credentials
                               and task assignment data (including `assignee_id`,
                               title, description, etc.).

        Returns:
            Response:
                - 201 Created: If the task is successfully assigned.
                - 400 Bad Request: If the task data is invalid.
                - 403 Forbidden: If the assigner is not permitted to assign tasks to the assignee.
                - 404 Not Found: If the assignee user ID does not exist.
                - 500 Internal Server Error: For any unexpected issues during assignment.
        """
        try:
            assigner = request.user
            assignee_id = request.data.get("assignee_id")
            assignee = CustomUser.objects.get(id=assignee_id)
            print("User:", request.user)
            print("Is authenticated:", request.user.is_authenticated)
            print("Role:", getattr(request.user, "role", "NO ROLE"))

            if not can_assign_tasks(assigner, assignee):
                return Response(
                    {"error": "Permission denied to assign task to this user"},
                    status=status.HTTP_403_FORBIDDEN,
                )
            serializer = TaskSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=assignee, assigned_by=assigner)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Assignee user not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Task assignment failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
