from rest_framework import permissions


class IsOwnerOrAdminOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == "admin":
            return request.method in permissions.SAFE_METHODS
        return obj.user == request.user
