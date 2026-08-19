"""Views (ViewSets) do app tracker."""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Asset, Quote, Watchlist
from .serializers import AssetSerializer, QuoteSerializer, WatchlistSerializer


class AssetViewSet(viewsets.ModelViewSet):
    """CRUD do catálogo de assets (fiat/crypto)."""

    queryset = Asset.objects.all()
    serializer_class = AssetSerializer


class WatchlistViewSet(viewsets.ModelViewSet):
    """CRUD da watchlist do usuário autenticado (cada usuário só vê a própria)."""

    serializer_class = WatchlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Restringe o queryset aos itens de watchlist do usuário da requisição."""
        return Watchlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Injeta o user autenticado no item criado; nunca confiamos no que o cliente manda."""
        serializer.save(user=self.request.user)


class QuoteViewSet(viewsets.ModelViewSet):
    """CRUD do histórico de cotações, com filtros opcionais via query params.

    Query params suportados:
        asset: filtra por Asset.code (ex: ?asset=BTC)
        currency: filtra por quote_currency (ex: ?currency=BRL)
        latest: se 'true', devolve só a cotação mais recente por asset/moeda
        recent: devolve as N cotações mais recentes de CADA asset/moeda (ex:
            ?recent=2), diferente de page_size que corta o total combinado —
            necessário pra garantir dado suficiente por ativo com o catálogo
            crescendo (ver DashboardPage no frontend)
    """

    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Aplica os filtros de asset/currency/latest sobre o queryset base."""
        queryset = Quote.objects.select_related('asset')

        asset_code = self.request.query_params.get('asset')
        if asset_code:
            queryset = queryset.filter(asset__code=asset_code.upper())

        currency = self.request.query_params.get('currency')
        if currency:
            queryset = queryset.filter(quote_currency=currency.upper())

        if self.request.query_params.get('latest') == 'true':
            # DISTINCT ON (Postgres) exige que o order_by comece com as mesmas colunas do distinct.
            return queryset.order_by('asset', 'quote_currency', '-timestamp').distinct(
                'asset', 'quote_currency'
            )

        recent = self.request.query_params.get('recent')
        if recent:
            return self._recent_per_asset(queryset, recent)

        return queryset.order_by('-timestamp')

    def _recent_per_asset(self, queryset, recent):
        """Filtra para as N cotações mais novas de cada (asset, quote_currency).

        Feito em Python (não window function) porque filtrar por uma window
        function exigiria uma subquery no Postgres; com o volume de dados
        deste projeto, iterar em memória é simples e correto.
        """
        try:
            limit = max(1, int(recent))
        except ValueError:
            limit = 1

        seen_counts = {}
        recent_ids = []
        for quote_id, asset_id, currency in queryset.order_by('-timestamp').values_list(
            'id', 'asset_id', 'quote_currency'
        ):
            key = (asset_id, currency)
            seen_counts[key] = seen_counts.get(key, 0) + 1
            if seen_counts[key] <= limit:
                recent_ids.append(quote_id)

        return Quote.objects.filter(id__in=recent_ids).select_related('asset').order_by('-timestamp')
