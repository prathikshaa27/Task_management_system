from tasks.utils import get_user_role
from rest_framework import permissions


class IsOwnerOrAdminOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user_role = get_user_role(request.user)
        if user_role == "admin":
            return request.method in permissions.SAFE_METHODS
        return obj.user == request.user

   