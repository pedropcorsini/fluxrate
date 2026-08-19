"""Permissions compartilhadas do app tracker."""
from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsAdminOrReadOnly(BasePermission):
    """Catálogo compartilhado (assets/quotes): qualquer autenticado lê, só staff escreve."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)
