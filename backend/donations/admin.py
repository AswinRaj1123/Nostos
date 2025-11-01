"""
Admin configuration for Donations app.
"""
from django.contrib import admin
from .models import Donation, DonationReceipt


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    """Donation admin."""
    
    list_display = ('transaction_id', 'donor', 'campaign', 'amount', 'payment_method', 'status', 'created_at')
    list_filter = ('status', 'payment_method', 'is_anonymous', 'created_at')
    search_fields = ('transaction_id', 'donor__name', 'donor__email', 'campaign__title')
    readonly_fields = ('transaction_id', 'created_at', 'completed_at')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Donation Information', {
            'fields': ('transaction_id', 'donor', 'campaign', 'amount')
        }),
        ('Payment Details', {
            'fields': ('payment_method', 'status', 'payment_gateway_id', 'payment_gateway_response')
        }),
        ('Additional Info', {
            'fields': ('message', 'is_anonymous', 'receipt_number', 'receipt_sent')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'completed_at')
        }),
    )


@admin.register(DonationReceipt)
class DonationReceiptAdmin(admin.ModelAdmin):
    """Donation receipt admin."""
    
    list_display = ('donation', 'generated_at')
    search_fields = ('donation__transaction_id', 'donation__donor__name')
    readonly_fields = ('generated_at',)
