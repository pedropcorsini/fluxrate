import requests
from .models import Asset, Quote, Watchlist


def fetch_fiat_quote(asset, target_currency):
    base_url = "https://economia.awesomeapi.com.br/last/"

    if asset.code == target_currency:
        return None

    url = f"{base_url}{asset.code}-{target_currency}"
    response = requests.get(url)
    data = response.json()

    key = f"{asset.code}{target_currency}"
    return float(data[key]["bid"])

COINGECKO_IDS = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
}

def fetch_crypto_quote(asset, target_currency):
    base_url = "https://api.coingecko.com/api/v3/simple/price"

    if asset.code == target_currency:
        return None

    coin_id = COINGECKO_IDS[asset.code]
    vs_currency = target_currency.lower()

    response = requests.get(base_url, params={"ids": coin_id, "vs_currencies": vs_currency}) #o requests monta a query string (?ids=...&vs_currencies=...) sozinho
    data = response.json()

    return float(data[coin_id][vs_currency])

def sync_quotes():
    target_currencies = ['BRL', 'USD']

    for asset in Asset.objects.all():
        for currency in target_currencies:
            if asset.type == 'fiat':
                value = fetch_fiat_quote(asset, currency)
            else:
                value = fetch_crypto_quote(asset, currency)

            if value is None:
                continue

            Quote.objects.create(
                asset=asset,
                value=value,
                quote_currency=currency,
            )