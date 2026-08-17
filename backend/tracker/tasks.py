"""Tasks do Celery do app tracker."""
from celery import shared_task

from .services import sync_quotes


@shared_task
def sync_quotes_task():
    """Task periódica (ver settings.CELERY_BEAT_SCHEDULE) que dispara sync_quotes()."""
    sync_quotes()
