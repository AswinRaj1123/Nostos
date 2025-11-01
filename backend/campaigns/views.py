"""
Views for Campaign API.
"""
from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from django.db.models import Q, Sum

from .models import Campaign, CampaignUpdate, CampaignTestimonial
from .serializers import (
    CampaignSerializer,
    CampaignListSerializer,
    CampaignUpdateSerializer,
    CampaignTestimonialSerializer
)


class IsAdminOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow admins to edit."""
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class CampaignListCreateView(generics.ListCreateAPIView):
    """API endpoint for listing and creating campaigns."""
    
    queryset = Campaign.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'deadline', 'goal', 'raised']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CampaignListSerializer
        return CampaignSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class CampaignDetailView(generics.RetrieveUpdateDestroyAPIView):
    """API endpoint for campaign detail."""
    
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [IsAdminOrReadOnly]


class CampaignUpdateListCreateView(generics.ListCreateAPIView):
    """API endpoint for campaign updates."""
    
    serializer_class = CampaignUpdateSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    def get_queryset(self):
        campaign_id = self.kwargs.get('campaign_id')
        return CampaignUpdate.objects.filter(campaign_id=campaign_id)
    
    def perform_create(self, serializer):
        campaign_id = self.kwargs.get('campaign_id')
        serializer.save(
            campaign_id=campaign_id,
            created_by=self.request.user
        )


class CampaignTestimonialListCreateView(generics.ListCreateAPIView):
    """API endpoint for campaign testimonials."""
    
    serializer_class = CampaignTestimonialSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        campaign_id = self.kwargs.get('campaign_id')
        queryset = CampaignTestimonial.objects.filter(campaign_id=campaign_id)
        
        # Only show approved testimonials to non-admin users
        if not (self.request.user and self.request.user.role == 'admin'):
            queryset = queryset.filter(is_approved=True)
        
        return queryset
    
    def perform_create(self, serializer):
        campaign_id = self.kwargs.get('campaign_id')
        serializer.save(
            campaign_id=campaign_id,
            donor=self.request.user
        )


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def campaign_statistics(request):
    """Get overall campaign statistics."""
    
    total_campaigns = Campaign.objects.count()
    active_campaigns = Campaign.objects.filter(status='active').count()
    completed_campaigns = Campaign.objects.filter(status='completed').count()
    total_raised = Campaign.objects.aggregate(
        total=Sum('raised')
    )['total'] or 0
    
    return Response({
        'total_campaigns': total_campaigns,
        'active_campaigns': active_campaigns,
        'completed_campaigns': completed_campaigns,
        'total_raised': float(total_raised),
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def top_campaigns(request):
    """Get top campaigns by amount raised."""
    
    limit = int(request.GET.get('limit', 5))
    campaigns = Campaign.objects.filter(status='active').order_by('-raised')[:limit]
    serializer = CampaignListSerializer(campaigns, many=True)
    
    return Response(serializer.data)
