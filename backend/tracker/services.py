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

