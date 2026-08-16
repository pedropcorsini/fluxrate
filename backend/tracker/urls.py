from rest_framework.routers import DefaultRouter
from .views import AssetViewSet, WatchlistViewSet, QuoteViewSet

router = DefaultRouter()
router.register('assets', AssetViewSet)
router.register('watchlist', WatchlistViewSet, basename='watchlist') #basename é obrigatorio quando o viewset nao tem o queryset como atribuco estático, o router nao consegue inferir o nome sozinho, entao precisamos informar.
router.register('quotes', QuoteViewSet)

urlpatterns = router.urls
