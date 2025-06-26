from django.urls import path
from tasks.views import (
    TaskListView,
    TaskCreateView,
    TaskUpdateView,
    TaskDeleteView,
    TaskDetailView,
    CategoryListView,
    ChangeTaskStatusView,
    TaskNotificationView,
)

urlpatterns = [
    path("tasks/", TaskListView.as_view(), name="task_list"),
    path("tasks/<int:pk>/", TaskDetailView.as_view(), name="task_detail"),
    path("tasks/create", TaskCreateView.as_view(), name="task_create"),
    path("tasks/<int:pk>/edit/", TaskUpdateView.as_view(), name="task_update"),
    path("tasks/<int:pk>/delete/", TaskDeleteView.as_view(), name="task_delete"),
    path("tasks/categories/", CategoryListView.as_view(), name="category_list"),
    path(
        "tasks/<int:pk>/change-status/",
        ChangeTaskStatusView.as_view(),
        name="change_status",
    ),
    path(
        "tasks/notifications", TaskNotificationView.as_view(), name="task_notifications"
    ),
]
