"""
Serializers for Campaign API.
"""
from rest_framework import serializers
from .models import Campaign, CampaignUpdate, CampaignTestimonial
from users.serializers import UserProfileSerializer


class CampaignSerializer(serializers.ModelSerializer):
    """Serializer for Campaign."""
    
    progress_percentage = serializers.ReadOnlyField()
    donor_count = serializers.ReadOnlyField()
    created_by = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = Campaign
        fields = (
            'id', 'title', 'description', 'category', 'goal', 'raised',
            'deadline', 'status', 'image', 'progress_percentage',
            'donor_count', 'created_by', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'raised', 'created_at', 'updated_at')


class CampaignListSerializer(serializers.ModelSerializer):
    """Serializer for Campaign list (minimal fields)."""
    
    progress_percentage = serializers.ReadOnlyField()
    donor_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Campaign
        fields = (
            'id', 'title', 'category', 'goal', 'raised',
            'deadline', 'status', 'image', 'progress_percentage',
            'donor_count', 'created_at'
        )


class CampaignUpdateSerializer(serializers.ModelSerializer):
    """Serializer for Campaign Update."""
    
    created_by = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = CampaignUpdate
        fields = ('id', 'campaign', 'title', 'message', 'created_by', 'created_at')
        read_only_fields = ('id', 'created_at')


class CampaignTestimonialSerializer(serializers.ModelSerializer):
    """Serializer for Campaign Testimonial."""
    
    donor = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = CampaignTestimonial
        fields = ('id', 'campaign', 'donor', 'message', 'rating', 'created_at', 'is_approved')
        read_only_fields = ('id', 'created_at', 'is_approved')
