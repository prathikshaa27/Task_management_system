from django.urls import include, path
from rest_framework.routers import DefaultRouter

from tasks.views import CategoryViewSet, TaskViewSet,AnalyticsViewSet,TaskAssignViewSet

router = DefaultRouter()
router.register(r"tasks", TaskViewSet, basename="task")
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"analytics", AnalyticsViewSet, basename="analytics")
router.register(r"assign-task",TaskAssignViewSet, basename="assign-task")

urlpatterns = [path("api/", include(router.urls))]
