"""Serializers do app tracker."""
from rest_framework import serializers

from .models import Asset, Quote, Watchlist


class AssetSerializer(serializers.ModelSerializer):
    """Serializa o catálogo de assets (fiat/crypto)."""

    class Meta:
        model = Asset
        fields = ['id', 'code', 'name', 'type']


class QuoteSerializer(serializers.ModelSerializer):
    """Serializa uma cotação histórica de um asset numa moeda de referência."""

    class Meta:
        model = Quote
        fields = ['id', 'asset', 'value', 'quote_currency', 'timestamp']


class WatchlistSerializer(serializers.ModelSerializer):
    """Serializa um item de watchlist; 'user' é somente leitura (injetado na view)."""

    class Meta:
        model = Watchlist
        fields = ['id', 'user', 'asset', 'added_at']
        read_only_fields = ['user']  # se o user estiver no field, vira uma entrada obrigatória
