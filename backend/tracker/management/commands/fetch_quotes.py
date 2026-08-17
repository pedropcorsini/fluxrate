from django.core.management.base import BaseCommand
from tracker.services import sync_quotes

class Command(BaseCommand):
    help = "Fetches fiat and crypto quotes and saves them as Quote records"

    def handle(self, *args, **options):
        sync_quotes()
        self.stdout.write(self.style.SUCCESS("Quotes synced successfully"))