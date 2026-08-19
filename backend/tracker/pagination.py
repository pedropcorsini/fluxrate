"""Paginação padrão da API: permite o cliente pedir um page_size maior via query param."""
from rest_framework.pagination import PageNumberPagination


class StandardPagination(PageNumberPagination):
    """PageNumberPagination com page_size configurável pelo cliente (?page_size=N)."""

    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 200
