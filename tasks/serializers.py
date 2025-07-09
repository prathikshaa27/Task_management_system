from rest_framework import serializers

from tasks.models import Category, Task


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
        queryset=Category.objects.all(), many=True
    )
    category_names = serializers.SerializerMethodField()
    username = serializers.CharField(source='user.username', read_only=True)


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
            "username"
        ]

    def get_category_names(self, obj):
        return [cat.name for cat in obj.category.all()]
