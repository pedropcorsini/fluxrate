from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from .models import Asset, Quote, Watchlist
from .serializers import AssetSerializer, QuoteSerializer, WatchlistSerializer

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer

class WatchlistViewSet(viewsets.ModelViewSet):
    serializer_class = WatchlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):  #filtra por self.request.user e injeta o user automaticamente. criado porque nunca confiamos no que o cliente manda.
        serializer.save(user=self.request.user)

class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    permission_classes = [IsAuthenticated]
    

