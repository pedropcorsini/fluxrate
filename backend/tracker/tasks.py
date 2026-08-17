from celery import shared_task
from .services import sync_quotes


@shared_task
def sync_quotes_task():
    sync_quotes()
