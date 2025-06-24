from django.shortcuts import render
from tasks.models import Task
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from tasks.forms import TaskForm
from django.urls import reverse_lazy
from django.contrib import messages
from django.shortcuts import redirect
# Create your views here.

class TaskListView(LoginRequiredMixin,ListView):
    model = Task
    context_object_name = 'tasks'
    template_name = 'task_list.html'

    def get_queryset(self):
        queryset = Task.objects.filter(user=self.request.user)
        priority = self.request.GET.get('priority')
        status = self.request.GET.get('status')
        due_date = self.request.GET.get('due_date')

        if priority:
            queryset = queryset.filter(priority=priority)
        if status:
            queryset = queryset.filter(status=status)
        if due_date:
            queryset = queryset.filter(due_date=due_date)
        return queryset

class TaskDetailView(LoginRequiredMixin,DetailView):
    model = Task
    context_object_name = 'task'
    template_name = 'task_details.html'

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

class TaskCreateView(LoginRequiredMixin,CreateView):
    model = Task
    form_class = TaskForm
    template_name = 'task_form.html'
    success_url = reverse_lazy('task_list')

    def form_valid(self, form):
        try:
            form.instance.user = self.request.user
            return super().form_valid(form)
        except Exception as e:
            messages.error(self.request,f"Error updating task:{e}")
            return self.form_invalid(form)

class TaskUpdateView(LoginRequiredMixin,UpdateView):
    model = Task
    form_class = TaskForm
    template_name = 'task_form.html'
    success_url = reverse_lazy('task_list')

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def form_valid(self, form):
        try:
            return super().form_valid(form)
        except Exception as e:
            messages.error(self.request, f"Error updating task :{e}")
            return self.form_invalid(form)

class TaskDeleteView(LoginRequiredMixin,DeleteView):
     model = Task
     template_name = 'task_delete.html'
     success_url = reverse_lazy('task_list')

     def get_queryset(self):
         return Task.objects.filter(user=self.request.user)
     
     def delete(self,request,*args,**kwargs):
         try:
             return super().delete(request,*args,**kwargs)
         except Exception as e:
             messages.error(self.request, f"Error deleting task :{e}")
             return redirect('task_list')
             
