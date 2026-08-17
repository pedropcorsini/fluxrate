"""Garante que o app Celery seja carregado sempre que o Django subir."""
from .celery import app as celery_app

__all__ = ('celery_app',)
