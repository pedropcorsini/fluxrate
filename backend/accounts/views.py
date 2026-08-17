"""Views do app accounts."""
from rest_framework import generics, permissions

from .serializers import RegisterSerializer


class RegisterView(generics.CreateAPIView):
    """Endpoint público de cadastro de usuário (POST username/email/password)."""

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
