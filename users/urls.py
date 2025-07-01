from django.urls import path
from users.views import UserRegistrationView, LoginView, UserProfileView,ChangePasswordView
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

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
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
   
]
