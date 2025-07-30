from rest_framework.permissions import BasePermission


class IsLeadOrSeniorOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.groups.filter(name__in=["admin", "lead", "senior"]).exists()
        )
