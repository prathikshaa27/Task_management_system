from django.urls import path
from users.views import UserRegistrationView, LoginView, UserProfileView
from django.contrib.auth import views as auth_views

urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="registration-view"),
    path("login/", LoginView.as_view(), name="login-view"),
    path(
        "password-reset/", auth_views.PasswordResetView.as_view(), name="password-reset"
    ),
    path(
        "password/reset/completed/",
        auth_views.PasswordResetDoneView.as_view(),
        name="password_reset_done",
    ),
    path(
        "password/reset/<uidb64>/<token>",
        auth_views.PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "password/reset/done",
        auth_views.PasswordResetCompleteView.as_view(),
        name="password_reset_complete",
    ),
    path(
        "view/update/profile",
        UserProfileView.as_view(),
        name="display-and-update-profile",
    ),
]
