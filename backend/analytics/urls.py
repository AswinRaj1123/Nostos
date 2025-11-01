"""
URL configuration for Analytics API.
"""
from django.urls import path
from .views import (
    dashboard_statistics,
    donation_trends,
    campaign_performance,
    donor_analytics,
    sentiment_analysis_report,
    category_breakdown,
    export_report
)

app_name = 'analytics'

urlpatterns = [
    path('dashboard/', dashboard_statistics, name='dashboard-statistics'),
    path('donation-trends/', donation_trends, name='donation-trends'),
    path('campaign-performance/', campaign_performance, name='campaign-performance'),
    path('donor-analytics/', donor_analytics, name='donor-analytics'),
    path('sentiment-report/', sentiment_analysis_report, name='sentiment-report'),
    path('category-breakdown/', category_breakdown, name='category-breakdown'),
    path('export-report/', export_report, name='export-report'),
]
