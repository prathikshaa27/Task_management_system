from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)

from users.views import (ChangePasswordView, UserProfileView,
                         UserRegistrationView,CustomTokenObtainPairView,UserListView,UserRoleUpdateView)

urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="registration-view"),
    path(
        "view/update/profile",
        UserProfileView.as_view(),
        name="display-and-update-profile",
    ),
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("users",UserListView.as_view(), name="user-list"),
    path("users/<int:pk>/", UserRoleUpdateView.as_view(), name="user-role")
]
