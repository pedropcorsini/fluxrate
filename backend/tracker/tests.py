"""Testes do app tracker: services de cotação e endpoints da API."""
from unittest.mock import Mock, patch

from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Asset, Quote
from .services import QuoteFetchError, fetch_crypto_quote, fetch_fiat_quote, sync_quotes


def _mock_response(json_data, status_code=200):
    """Constrói um Mock de requests.Response para os testes de service."""
    response = Mock()
    response.status_code = status_code
    response.json.return_value = json_data
    if status_code >= 400:
        response.raise_for_status.side_effect = Exception("HTTP error")
    else:
        response.raise_for_status.return_value = None
    return response


class FetchFiatQuoteTests(APITestCase):
    """Testes de fetch_fiat_quote (AwesomeAPI)."""

    def setUp(self):
        self.usd = Asset.objects.create(code='USD', name='Dolar', type='fiat')

    def test_self_quote_returns_none(self):
        """Cotar um asset na própria moeda deve devolver None, sem chamar a API."""
        self.assertIsNone(fetch_fiat_quote(self.usd, 'USD'))

    @patch('tracker.services.requests.get')
    def test_successful_fetch_returns_float(self, mock_get):
        """Uma resposta válida deve virar um float extraído do campo 'bid'."""
        mock_get.return_value = _mock_response({'USDBRL': {'bid': '5.43'}})
        value = fetch_fiat_quote(self.usd, 'BRL')
        self.assertEqual(value, 5.43)

    @patch('tracker.services.requests.get')
    def test_bad_payload_raises_quote_fetch_error(self, mock_get):
        """Payload sem a chave esperada deve virar QuoteFetchError, não um KeyError cru."""
        mock_get.return_value = _mock_response({'unexpected': {}})
        with self.assertRaises(QuoteFetchError):
            fetch_fiat_quote(self.usd, 'BRL')


class FetchCryptoQuoteTests(APITestCase):
    """Testes de fetch_crypto_quote (CoinGecko)."""

    def setUp(self):
        self.btc = Asset.objects.create(code='BTC', name='Bitcoin', type='crypto')

    def test_self_quote_returns_none(self):
        """Cotar um asset na própria moeda deve devolver None, sem chamar a API."""
        self.assertIsNone(fetch_crypto_quote(self.btc, 'BTC'))

    @patch('tracker.services.requests.get')
    def test_successful_fetch_returns_float(self, mock_get):
        """Uma resposta válida deve virar um float extraído do vs_currency pedido."""
        mock_get.return_value = _mock_response({'bitcoin': {'brl': 330000.0}})
        value = fetch_crypto_quote(self.btc, 'BRL')
        self.assertEqual(value, 330000.0)

    def test_unmapped_asset_raises_quote_fetch_error(self):
        """Asset crypto sem entrada em COINGECKO_IDS deve falhar de forma controlada."""
        unmapped = Asset.objects.create(code='ZZZ', name='Moeda Inexistente', type='crypto')
        with self.assertRaises(QuoteFetchError):
            fetch_crypto_quote(unmapped, 'BRL')


class SyncQuotesTests(APITestCase):
    """Testes de sync_quotes: persistência e resiliência a falhas parciais."""

    def setUp(self):
        self.usd = Asset.objects.create(code='USD', name='Dolar', type='fiat')
        self.btc = Asset.objects.create(code='BTC', name='Bitcoin', type='crypto')

    @patch('tracker.services.fetch_crypto_quote')
    @patch('tracker.services.fetch_fiat_quote')
    def test_creates_a_quote_per_asset_and_currency(self, mock_fiat, mock_crypto):
        """Cada combinação asset/moeda válida deve gerar um Quote."""
        mock_fiat.side_effect = lambda asset, currency: None if currency == 'USD' else 5.0
        mock_crypto.side_effect = lambda asset, currency: 300000.0

        sync_quotes()

        self.assertEqual(Quote.objects.count(), 3)  # USD/BRL, BTC/BRL, BTC/USD

    @patch('tracker.services.fetch_crypto_quote')
    @patch('tracker.services.fetch_fiat_quote')
    def test_one_failing_asset_does_not_block_the_others(self, mock_fiat, mock_crypto):
        """Um QuoteFetchError num asset não deve impedir os demais de serem salvos."""
        mock_fiat.side_effect = QuoteFetchError('API fora do ar')
        mock_crypto.side_effect = lambda asset, currency: 300000.0

        sync_quotes()

        self.assertEqual(Quote.objects.filter(asset=self.btc).count(), 2)
        self.assertEqual(Quote.objects.filter(asset=self.usd).count(), 0)


class QuoteEndpointTests(APITestCase):
    """Testes do endpoint /api/quotes/, incluindo autenticação e filtros."""

    def setUp(self):
        self.user = User.objects.create_user(username='tester', password='senha-forte-123')
        self.asset = Asset.objects.create(code='BTC', name='Bitcoin', type='crypto')
        Quote.objects.create(asset=self.asset, value=300000, quote_currency='BRL')

    def test_requires_authentication(self):
        """Sem token, o endpoint deve responder 401."""
        response = self.client.get('/api/quotes/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_user_can_list_quotes(self):
        """Com autenticação, o endpoint deve listar as cotações existentes."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/quotes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
