"""Management command para popular o catálogo de assets (python manage.py seed_assets)."""
from django.core.management.base import BaseCommand

from tracker.models import Asset

ASSETS = [
    ("EUR", "Euro", "fiat"),
    ("GBP", "Libra Esterlina", "fiat"),
    ("JPY", "Iene Japonês", "fiat"),
    ("CHF", "Franco Suíço", "fiat"),
    ("CAD", "Dólar Canadense", "fiat"),
    ("AUD", "Dólar Australiano", "fiat"),
    ("ARS", "Peso Argentino", "fiat"),
    ("CNY", "Yuan Chinês", "fiat"),
    ("MXN", "Peso Mexicano", "fiat"),
    ("SOL", "Solana", "crypto"),
    ("XRP", "Ripple", "crypto"),
    ("ADA", "Cardano", "crypto"),
    ("DOGE", "Dogecoin", "crypto"),
    ("BNB", "BNB", "crypto"),
    ("MATIC", "Polygon", "crypto"),
    ("LTC", "Litecoin", "crypto"),
    ("DOT", "Polkadot", "crypto"),
    ("AVAX", "Avalanche", "crypto"),
    ("LINK", "Chainlink", "crypto"),
]


class Command(BaseCommand):
    """Cadastra a lista curada de assets fiat/crypto, sem duplicar os já existentes."""

    help = "Seeds the Asset catalog with a curated list of major fiat currencies and cryptocurrencies"

    def handle(self, *args, **options):
        """Cria cada asset da lista via get_or_create e reporta quantos foram criados."""
        created_count = 0
        for code, name, asset_type in ASSETS:
            _, created = Asset.objects.get_or_create(
                code=code, defaults={"name": name, "type": asset_type}
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"{created_count} novo(s) asset(s) criado(s), {len(ASSETS) - created_count} já existia(m)"
            )
        )
