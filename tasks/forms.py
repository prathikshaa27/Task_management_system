from django import forms
from tasks.models import Task, Category


class TaskForm(forms.ModelForm):
    # import pdb;pdb.set_trace()
    categories = forms.ModelMultipleChoiceField(
        queryset=Category.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False,
    )

    class Meta:
        model = Task
        fields = ["title", "description", "priority", "due_date", "status", "category"]
