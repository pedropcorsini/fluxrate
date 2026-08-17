"""Models do app tracker: catálogo de assets, histórico de cotações e watchlist."""
from django.contrib.auth.models import User
from django.db import models


class Asset(models.Model):
    """Catálogo de moedas/crypto."""

    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    TYPE_CHOICES = [
        ('fiat', 'Fiat'),
        ('crypto', 'Crypto'),
    ]  # deve ser uma lista de tuplas, não um set() — choices exige pares ordenados (valor, label)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)

    def __str__(self):
        """Representação legível: o code do asset (ex: 'BTC')."""
        return self.code


class Quote(models.Model):
    """Histórico de cotações: preço de um Asset numa moeda de referência num instante."""

    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    value = models.DecimalField(max_digits=18, decimal_places=8)  # 8 dígitos porque crypto tem preços bem fracionados
    QUOTE_CURRENCY_CHOICES = [
        ('BRL', 'Real'),
        ('USD', 'Dólar'),
    ]
    quote_currency = models.CharField(max_length=3, choices=QUOTE_CURRENCY_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """Representação legível: 'CODE/MOEDA: valor' (ex: 'BTC/BRL: 330000')."""
        return f"{self.asset.code}/{self.quote_currency}: {self.value}"


class Watchlist(models.Model):
    """Relação usuário <-> asset favorito."""

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """Representação legível: 'usuario - CODE' (ex: 'pedro - BTC')."""
        return f"{self.user.username} - {self.asset.code}"
