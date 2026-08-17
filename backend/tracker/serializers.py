from rest_framework import serializers
from .models import Asset, Quote, Watchlist

class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ['id', 'code', 'name', 'type']

class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = ['id', 'asset', 'value', 'quote_currency','timestamp']

class WatchlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Watchlist
        fields = ['id', 'user', 'asset', 'added_at']
        read_only_fields = ['user'] #se o user estiver no field, vai ser uma entrada obrigatória. 
