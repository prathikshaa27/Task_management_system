from rest_framework import serializers
from tasks.models import Task, Category


class TaskSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["title", "due_date", "priority", "status"]


class CategorySerializer(serializers.ModelSerializer):
    tasks = TaskSummarySerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "tasks"]


class TaskSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), many=True
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "priority",
            "due_date",
            "status",
            "category",
            "created_at",
        ]
