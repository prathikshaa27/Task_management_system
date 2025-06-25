from django.shortcuts import render
from tasks.models import Task
from django.views.generic import (
    ListView,
    CreateView,
    UpdateView,
    DeleteView,
    DetailView,
)
from django.contrib.auth.mixins import LoginRequiredMixin
from tasks.forms import TaskForm
from django.urls import reverse_lazy
from django.contrib import messages
from django.shortcuts import redirect
from django.db.models import Q

# Create your views here.


class TaskListView(LoginRequiredMixin, ListView):
    """
    View to display a list of tasks for the authenticated user.

    Allows filtering by priority, status, due date, and searching by title,
    description, or category name. Tasks can also be sorted by priority or due date.
    """

    model = Task
    context_object_name = "tasks"
    template_name = "task_list.html"

    def get_queryset(self):
        queryset = Task.objects.filter(user=self.request.user)
        priority = self.request.GET.get("priority")
        status = self.request.GET.get("status")
        due_date = self.request.GET.get("due_date")
        search_query = self.request.GET.get("search")

        if priority:
            queryset = queryset.filter(priority=priority)
        if status:
            queryset = queryset.filter(status=status)
        if due_date:
            queryset = queryset.filter(due_date=due_date)

        sort_by = self.request.GET.get("sort")
        if sort_by in ["due_date", "priority"]:
            queryset = queryset.order_by(sort_by)

        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query)
                | Q(description__icontains=search_query)
                | Q(category__name__icontains=search_query)
            ).distinct()

        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        search_query = request.GET.get("search")
        if search_query and queryset.count() == 1:
            task = queryset.first()
            return redirect("task_list", pk=task.pk)
        self.object_list = queryset
        context = self.get_context_data()
        return self.render_to_response(context)


class TaskDetailView(LoginRequiredMixin, DetailView):
    """
    View to display the details of a specific task.
    Only allows access to tasks owned by the current user.
    """

    model = Task
    context_object_name = "task"
    template_name = "task_details.html"

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)


class TaskCreateView(LoginRequiredMixin, CreateView):
    """
    View to create a new task.

    Automatically assigns the task to the currently logged-in user.
    """

    model = Task
    form_class = TaskForm
    template_name = "task_form.html"
    success_url = reverse_lazy("task_list")

    def form_valid(self, form):
        try:
            form.instance.user = self.request.user
            return super().form_valid(form)
        except Exception as e:
            messages.error(self.request, f"Error updating task:{e}")
            return self.form_invalid(form)


class TaskUpdateView(LoginRequiredMixin, UpdateView):
    """
    View to update an existing task.

    Only allows updating tasks owned by the current user.
    """

    model = Task
    form_class = TaskForm
    template_name = "task_form.html"
    success_url = reverse_lazy("task_list")

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def form_valid(self, form):
        try:
            return super().form_valid(form)
        except Exception as e:
            messages.error(self.request, f"Error updating task :{e}")
            return self.form_invalid(form)


class TaskDeleteView(LoginRequiredMixin, DeleteView):
    """
    View to delete an existing task.

    Only allows deletion of tasks owned by the current user.
    """

    model = Task
    template_name = "task_delete.html"
    success_url = reverse_lazy("task_list")

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def delete(self, request, *args, **kwargs):
        try:
            return super().delete(request, *args, **kwargs)
        except Exception as e:
            messages.error(self.request, f"Error deleting task :{e}")
            return redirect("task_list")
