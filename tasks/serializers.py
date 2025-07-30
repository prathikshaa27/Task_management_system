from rest_framework import serializers
from tasks.utils import get_user_role
from tasks.models import Category, Task
from users.models import CustomUser


class TaskSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["title", "due_date", "priority", "status"]


class CategorySerializer(serializers.ModelSerializer):
    tasks = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "tasks"]

    def get_tasks(self, obj):
        user = self.context["request"].user
        tasks = obj.tasks.filter(user=user)
        return TaskSummarySerializer(tasks, many=True).data


class TaskSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), many=True, required=False
    )
    title = serializers.CharField(required=False)
    category_names = serializers.SerializerMethodField()
    username = serializers.CharField(source="user.username", read_only=True)
    assignee_id = serializers.IntegerField(write_only=True, required=False)
    assignee_name = serializers.CharField(source="user.username", read_only=True)
    assigned_by_name = serializers.CharField(
        source="assigned_by.username", read_only=True
    )
    assigned_by_role = serializers.SerializerMethodField()
    assignee_id = serializers.PrimaryKeyRelatedField(
        source="user",  # <- the key trick
        queryset=CustomUser.objects.all(),
        write_only=True,
        required=False,
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
            "category_names",
            "created_at",
            "username",
            "assignee_id",
            "assignee_name",
            "assigned_by_name",
            "assigned_by_role",
            "assignee_id",
        ]

    def get_category_names(self, obj):
        return [cat.name for cat in obj.category.all()]

    def create(self, validated_data):
        category_data = validated_data.pop("category", [])
        assignee = validated_data.pop("user", None)
        validated_data.pop("assignee_id", None)
        validated_data.pop("assigned_id", None)
        task = Task.objects.create(user=assignee, **validated_data)
        task.category.set(category_data)
        return task

    def get_assigned_by_role(self, obj):
        return get_user_role(obj.assigned_by)
