"""Registro dos models do tracker no Django admin."""
from django.contrib import admin

from .models import Asset, Quote, Watchlist

admin.site.register(Asset)
admin.site.register(Quote)
admin.site.register(Watchlist)
