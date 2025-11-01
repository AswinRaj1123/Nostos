"""
Serializers for Donation API.
"""
from rest_framework import serializers
from .models import Donation, DonationReceipt
from users.serializers import UserProfileSerializer
from campaigns.serializers import CampaignListSerializer


class DonationSerializer(serializers.ModelSerializer):
    """Serializer for Donation."""
    
    donor = UserProfileSerializer(read_only=True)
    campaign = CampaignListSerializer(read_only=True)
    campaign_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Donation
        fields = (
            'id', 'transaction_id', 'donor', 'campaign', 'campaign_id',
            'amount', 'payment_method', 'status', 'message', 'is_anonymous',
            'receipt_number', 'receipt_sent', 'created_at', 'completed_at'
        )
        read_only_fields = ('id', 'transaction_id', 'status', 'receipt_number', 'created_at', 'completed_at')


class DonationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating donation."""
    
    class Meta:
        model = Donation
        fields = ('campaign', 'amount', 'payment_method', 'message', 'is_anonymous')
    
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0")
        return value


class DonationReceiptSerializer(serializers.ModelSerializer):
    """Serializer for Donation Receipt."""
    
    donation = DonationSerializer(read_only=True)
    
    class Meta:
        model = DonationReceipt
        fields = ('id', 'donation', 'receipt_file', 'generated_at')
