"""Serviços de busca e persistência de cotações (fiat via AwesomeAPI, crypto via CoinGecko)."""
import logging

import requests

from .models import Asset, Quote

logger = logging.getLogger(__name__)

COINGECKO_IDS = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
}


class QuoteFetchError(Exception):
    """Levantada quando uma cotação não pôde ser obtida de uma fonte externa."""


def fetch_fiat_quote(asset, target_currency):
    """Busca a cotação de um asset fiat em target_currency via AwesomeAPI.

    Retorna None quando asset.code == target_currency (self-quote, sem sentido).
    Levanta QuoteFetchError em falha de rede, status de erro ou payload inesperado.
    """
    base_url = "https://economia.awesomeapi.com.br/last/"

    if asset.code == target_currency:
        return None

    url = f"{base_url}{asset.code}-{target_currency}"
    key = f"{asset.code}{target_currency}"

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        return float(data[key]["bid"])
    except (requests.RequestException, KeyError, ValueError, TypeError) as exc:
        raise QuoteFetchError(
            f"Falha ao buscar cotação fiat {asset.code}/{target_currency}: {exc}"
        ) from exc


def fetch_crypto_quote(asset, target_currency):
    """Busca a cotação de um asset crypto em target_currency via CoinGecko.

    Retorna None quando asset.code == target_currency (self-quote, sem sentido).
    Levanta QuoteFetchError em falha de rede, status de erro ou payload inesperado.
    """
    base_url = "https://api.coingecko.com/api/v3/simple/price"

    if asset.code == target_currency:
        return None

    if asset.code not in COINGECKO_IDS:
        raise QuoteFetchError(f"Asset crypto sem mapeamento CoinGecko: {asset.code}")

    coin_id = COINGECKO_IDS[asset.code]
    vs_currency = target_currency.lower()

    try:
        response = requests.get(
            base_url,
            params={"ids": coin_id, "vs_currencies": vs_currency},
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        return float(data[coin_id][vs_currency])
    except (requests.RequestException, KeyError, ValueError, TypeError) as exc:
        raise QuoteFetchError(
            f"Falha ao buscar cotação crypto {asset.code}/{target_currency}: {exc}"
        ) from exc


def sync_quotes():
    """Busca a cotação de cada Asset em BRL e USD e persiste como Quote.

    Percorre todos os assets cadastrados; para cada um, busca a cotação
    fiat ou crypto (conforme asset.type) em cada moeda de destino. Falhas
    de uma fonte externa (rate limit, timeout, payload inesperado) são
    logadas e não interrompem o processamento dos demais assets.
    """
    target_currencies = ['BRL', 'USD']

    for asset in Asset.objects.all():
        for currency in target_currencies:
            try:
                if asset.type == 'fiat':
                    value = fetch_fiat_quote(asset, currency)
                else:
                    value = fetch_crypto_quote(asset, currency)
            except QuoteFetchError:
                logger.warning(
                    "Cotação ignorada para %s/%s", asset.code, currency, exc_info=True
                )
                continue

            if value is None:
                continue

            Quote.objects.create(
                asset=asset,
                value=value,
                quote_currency=currency,
            )
