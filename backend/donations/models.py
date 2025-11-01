"""
Models for Donations.
"""
from django.db import models
from django.utils import timezone
from users.models import User
from campaigns.models import Campaign
import uuid


class Donation(models.Model):
    """Donation model."""
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )
    
    PAYMENT_METHOD_CHOICES = (
        ('upi', 'UPI'),
        ('card', 'Credit/Debit Card'),
        ('netbanking', 'Net Banking'),
        ('wallet', 'Wallet'),
    )
    
    transaction_id = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='donations')
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='donations')
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Payment gateway details
    payment_gateway_id = models.CharField(max_length=100, blank=True)
    payment_gateway_response = models.JSONField(blank=True, null=True)
    
    # Donor message
    message = models.TextField(blank=True)
    is_anonymous = models.BooleanField(default=False)
    
    # Receipt
    receipt_number = models.CharField(max_length=50, unique=True, blank=True)
    receipt_sent = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'donations'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['donor', 'campaign']),
            models.Index(fields=['status', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.donor.name} - ₹{self.amount} for {self.campaign.title}"
    
    def save(self, *args, **kwargs):
        # Generate receipt number if not exists
        if not self.receipt_number:
            self.receipt_number = f"RCP{timezone.now().strftime('%Y%m%d')}{self.id or ''}"
        
        # Update campaign raised amount if completed
        if self.status == 'completed' and not self.pk:
            self.campaign.raised += self.amount
            self.campaign.save(update_fields=['raised'])
        
        super().save(*args, **kwargs)


class DonationReceipt(models.Model):
    """Donation receipt model."""
    
    donation = models.OneToOneField(Donation, on_delete=models.CASCADE, related_name='receipt')
    receipt_file = models.FileField(upload_to='receipts/', blank=True)
    generated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'donation_receipts'
    
    def __str__(self):
        return f"Receipt for {self.donation.transaction_id}"
