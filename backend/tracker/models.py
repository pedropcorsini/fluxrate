from django.db import models
from django.contrib.auth.models import User

class Asset(models.Model):
    """Catálogo de moedas/crypto"""
    code =  models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    TYPE_CHOICES = [
        ('fiat', 'Fiat'),
        ('crypto', 'Crypto',)
    ] #deve ser uma tupla e não um set()
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)

    def __str__(self):
        return self.code

class Quote(models.Model):
    """Histórco de cotações"""
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    value = models.DecimalField(max_digits=18, decimal_places=8) #total de dígitos e quantos depois da virgula | 8dig porque crypto tem preços bem fracionados.
    timestamp = models.DateTimeField(auto_now_add=True) 

    def __str__(self):
        return f"{self.asset.code}: {self.value}"

class Watchlist(models.Model):
    """Relação do usuário <-> ativo favorito"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.asset.code}"