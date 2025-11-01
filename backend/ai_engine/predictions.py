"""
ML Predictions for donor behavior and campaign success.
"""
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta
import pickle
import os


class DonorRetentionPredictor:
    """Predict likelihood of donor returning."""
    
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def prepare_features(self, donor_data):
        """
        Prepare features for prediction.
        
        Args:
            donor_data: Dictionary or list of dictionaries with donor info
        
        Returns:
            Feature array
        """
        
        features = []
        data_list = donor_data if isinstance(donor_data, list) else [donor_data]
        
        for data in data_list:
            feature_vector = [
                data.get('total_donations', 0),
                data.get('total_amount', 0),
                data.get('avg_donation', 0),
                data.get('days_since_last_donation', 0),
                data.get('campaigns_supported', 0),
                data.get('account_age_days', 0),
                1 if data.get('has_profile_picture', False) else 0,
                len(data.get('bio', '')) > 0,
            ]
            features.append(feature_vector)
        
        return np.array(features)
    
    def train(self, training_data, labels):
        """Train the model with historical data."""
        
        X = self.prepare_features(training_data)
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, labels)
        self.is_trained = True
    
    def predict(self, donor_data):
        """
        Predict donor retention probability.
        
        Args:
            donor_data: Dictionary with donor information
        
        Returns:
            Probability of donor returning (0-1)
        """
        
        if not self.is_trained:
            # Return heuristic-based prediction if model not trained
            return self._heuristic_prediction(donor_data)
        
        X = self.prepare_features(donor_data)
        X_scaled = self.scaler.transform(X)
        probability = self.model.predict_proba(X_scaled)[0][1]
        
        return float(probability)
    
    def _heuristic_prediction(self, donor_data):
        """Fallback heuristic when model is not trained."""
        
        score = 0.5  # Base probability
        
        # Recent activity increases probability
        days_since_last = donor_data.get('days_since_last_donation', 365)
        if days_since_last < 30:
            score += 0.3
        elif days_since_last < 90:
            score += 0.15
        elif days_since_last > 180:
            score -= 0.2
        
        # Multiple donations increase probability
        donation_count = donor_data.get('total_donations', 0)
        if donation_count >= 5:
            score += 0.2
        elif donation_count >= 3:
            score += 0.1
        
        # Higher average donation increases probability
        avg_donation = donor_data.get('avg_donation', 0)
        if avg_donation > 5000:
            score += 0.1
        elif avg_donation > 2000:
            score += 0.05
        
        return max(0.0, min(1.0, score))


class CampaignSuccessPredictor:
    """Predict campaign success probability."""
    
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def prepare_features(self, campaign_data):
        """Prepare features for prediction."""
        
        features = []
        data_list = campaign_data if isinstance(campaign_data, list) else [campaign_data]
        
        for data in data_list:
            # Calculate days remaining
            if 'deadline' in data:
                deadline = data['deadline']
                if isinstance(deadline, str):
                    deadline = datetime.fromisoformat(deadline.replace('Z', '+00:00'))
                days_remaining = (deadline - datetime.now()).days
            else:
                days_remaining = data.get('days_remaining', 30)
            
            feature_vector = [
                data.get('goal', 100000),
                data.get('raised', 0),
                data.get('donor_count', 0),
                days_remaining,
                data.get('update_count', 0),
                data.get('testimonial_count', 0),
                len(data.get('description', '')),
                1 if data.get('has_image', False) else 0,
            ]
            features.append(feature_vector)
        
        return np.array(features)
    
    def predict(self, campaign_data):
        """
        Predict campaign success probability.
        
        Args:
            campaign_data: Dictionary with campaign information
        
        Returns:
            Predicted success probability (0-1)
        """
        
        if not self.is_trained:
            return self._heuristic_prediction(campaign_data)
        
        X = self.prepare_features(campaign_data)
        X_scaled = self.scaler.transform(X)
        prediction = self.model.predict(X_scaled)[0]
        
        return max(0.0, min(1.0, float(prediction)))
    
    def _heuristic_prediction(self, campaign_data):
        """Fallback heuristic when model is not trained."""
        
        goal = campaign_data.get('goal', 100000)
        raised = campaign_data.get('raised', 0)
        days_remaining = campaign_data.get('days_remaining', 30)
        donor_count = campaign_data.get('donor_count', 0)
        
        # Current progress
        progress = raised / goal if goal > 0 else 0
        
        # Calculate required daily rate
        remaining_amount = goal - raised
        daily_rate_needed = remaining_amount / max(days_remaining, 1)
        
        # Calculate current daily rate (simplified)
        current_daily_rate = raised / max((30 - days_remaining), 1) if days_remaining < 30 else raised / 7
        
        # Base score on progress
        score = progress
        
        # Adjust based on momentum
        if current_daily_rate >= daily_rate_needed:
            score += 0.2
        elif current_daily_rate >= daily_rate_needed * 0.7:
            score += 0.1
        else:
            score -= 0.1
        
        # Adjust based on donor engagement
        if donor_count > 50:
            score += 0.15
        elif donor_count > 20:
            score += 0.1
        elif donor_count < 5:
            score -= 0.1
        
        # Time pressure factor
        if days_remaining < 7 and progress < 0.8:
            score -= 0.1
        
        return max(0.0, min(1.0, score))


# Global predictor instances
donor_retention_predictor = DonorRetentionPredictor()
campaign_success_predictor = CampaignSuccessPredictor()
