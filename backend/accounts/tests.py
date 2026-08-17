"""Testes do app accounts: endpoint público de cadastro de usuário."""
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class RegisterEndpointTests(APITestCase):
    """Testes do endpoint POST /api/accounts/register/."""

    def test_register_creates_user_with_hashed_password(self):
        """Cadastro válido deve criar o usuário com a senha hasheada (nunca em texto puro)."""
        response = self.client.post(reverse('register'), {
            'username': 'novo_usuario',
            'email': 'novo@example.com',
            'password': 'senha-forte-123',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username='novo_usuario')
        self.assertNotEqual(user.password, 'senha-forte-123')
        self.assertTrue(user.check_password('senha-forte-123'))

    def test_password_is_not_returned_in_response(self):
        """A resposta do cadastro não deve vazar a senha de volta pro cliente."""
        response = self.client.post(reverse('register'), {
            'username': 'outro_usuario',
            'password': 'senha-forte-123',
        })
        self.assertNotIn('password', response.data)

    def test_weak_password_is_rejected(self):
        """Senhas fracas devem ser barradas pelos validators padrão do Django."""
        response = self.client.post(reverse('register'), {
            'username': 'usuario_fraco',
            'password': '123',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
