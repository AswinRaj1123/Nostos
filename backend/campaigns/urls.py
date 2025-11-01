"""
URL configuration for Campaigns API.
"""
from django.urls import path
from .views import (
    CampaignListCreateView,
    CampaignDetailView,
    CampaignUpdateListCreateView,
    CampaignTestimonialListCreateView,
    campaign_statistics,
    top_campaigns
)

app_name = 'campaigns'

urlpatterns = [
    path('', CampaignListCreateView.as_view(), name='campaign-list'),
    path('<int:pk>/', CampaignDetailView.as_view(), name='campaign-detail'),
    path('<int:campaign_id>/updates/', CampaignUpdateListCreateView.as_view(), name='campaign-updates'),
    path('<int:campaign_id>/testimonials/', CampaignTestimonialListCreateView.as_view(), name='campaign-testimonials'),
    path('statistics/', campaign_statistics, name='campaign-statistics'),
    path('top/', top_campaigns, name='top-campaigns'),
]
