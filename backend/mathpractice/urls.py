"""
  All the URLs for the site (REST API endpoints)
"""
from django.urls import path
from app import user_api


urlpatterns = [
    path('api/v1/register/', user_api.register, name='register'),
    path('api/v1/login/', user_api.login, name='login'),
    path('api/v1/logout/', user_api.logout, name='logout'),
    path('api/v1/me/', user_api.me, name='me'),
]
