"""
URL configuration for Donations API.
"""
from django.urls import path
from .views import (
    DonationListView,
    DonationCreateView,
    DonationDetailView,
    donation_statistics,
    donation_history_chart,
    campaign_leaderboard,
    generate_receipt
)

app_name = 'donations'

urlpatterns = [
    path('', DonationListView.as_view(), name='donation-list'),
    path('create/', DonationCreateView.as_view(), name='donation-create'),
    path('<int:pk>/', DonationDetailView.as_view(), name='donation-detail'),
    path('statistics/', donation_statistics, name='donation-statistics'),
    path('history-chart/', donation_history_chart, name='donation-history-chart'),
    path('campaign/<int:campaign_id>/leaderboard/', campaign_leaderboard, name='campaign-leaderboard'),
    path('<int:donation_id>/receipt/', generate_receipt, name='generate-receipt'),
]
