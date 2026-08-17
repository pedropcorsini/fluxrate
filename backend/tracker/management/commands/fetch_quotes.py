"""Management command manual para disparar sync_quotes (python manage.py fetch_quotes)."""
from django.core.management.base import BaseCommand

from tracker.services import sync_quotes


class Command(BaseCommand):
    """Busca e persiste as cotações de todos os assets, sob demanda."""

    help = "Fetches fiat and crypto quotes and saves them as Quote records"

    def handle(self, *args, **options):
        """Executa sync_quotes() e reporta sucesso no stdout do comando."""
        sync_quotes()
        self.stdout.write(self.style.SUCCESS("Quotes synced successfully"))
