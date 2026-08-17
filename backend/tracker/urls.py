"""Rotas do app tracker, geradas via DRF router (assets, watchlist, quotes)."""
from rest_framework.routers import DefaultRouter

from .views import AssetViewSet, QuoteViewSet, WatchlistViewSet

router = DefaultRouter()
router.register('assets', AssetViewSet)
router.register('watchlist', WatchlistViewSet, basename='watchlist')  # basename é obrigatório quando o viewset não tem queryset como atributo estático — o router não consegue inferir o nome sozinho
router.register('quotes', QuoteViewSet)

urlpatterns = router.urls
