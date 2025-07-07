from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.core.management.base import BaseCommand

from tasks.models import Task

User = get_user_model()


class Command(BaseCommand):
    help = "Sends email reminders for tasks due in 1 or 2 days"

    def handle(self, *args, **kwargs):
        today = date.today()

        for user in User.objects.all():

            tasks_2_day = Task.objects.filter(
                user=user,
                due_date=today + timedelta(days=2),
                reminder_sent_for_2_days=False,
            ).exclude(status="Completed")

            tasks_1_day = Task.objects.filter(
                user=user,
                due_date=today + timedelta(days=1),
                reminder_sent_for_1_day=False,
            ).exclude(status="Completed")

            all_tasks = list(tasks_2_day) + list(tasks_1_day)
            if all_tasks and user.email:
                task_list = "\n".join(
                    [f"{task.title} (Due:{task.due_date})" for task in all_tasks]
                )
                send_mail(
                    subject="Upcoming Task Reminder",
                    message=f"Hi {user.username},\n\nHere are your upcoming tasks:\n{task_list}",
                    from_email="noreply@yourapp.com",
                    recipient_list=[user.email],
                )
                for task in tasks_2_day:
                    task.reminder_sent_for_2_days = True
                    task.save(update_fields=["reminder_sent_for_2_days"])
                for task in tasks_1_day:
                    task.reminder_sent_for_1_day = True
                    task.save(update_fields=["reminder_sent_for_1_day"])
