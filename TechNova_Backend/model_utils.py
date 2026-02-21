import pickle
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
from config import Config

class LoanModelPredictor:
    def __init__(self):
        self.model = None
        self.preprocessor = None
        self.feature_names = None
        self.load_artifacts()
    
    def load_artifacts(self):
        """Load the saved model and preprocessor"""
        try:
            # Load preprocessor
            with open(Config.PREPROCESSOR_PATH, 'rb') as f:
                self.preprocessor = pickle.load(f)
            
            # Load model
            self.model = load_model(Config.MODEL_PATH)
            
            # Get feature names from preprocessor
            self._extract_feature_names()
            
            print("✓ Model and preprocessor loaded successfully")
        except Exception as e:
            print(f"✗ Error loading artifacts: {str(e)}")
            raise
    
    def _extract_feature_names(self):
        """Extract feature names after preprocessing"""
        try:
            # This is a simplified version - you may need to adjust based on your preprocessor
            self.feature_names = []
            
            # For numeric features
            numeric_features = ['Age', 'Income', 'LoanAmount', 'CreditScore', 
                              'MonthsEmployed', 'NumCreditLines', 'InterestRate', 
                              'LoanTerm', 'DTIRatio']
            self.feature_names.extend(numeric_features)
            
            # For categorical features (one-hot encoded)
            categorical_features = ['Education', 'EmploymentType', 'MaritalStatus',
                                  'LoanPurpose', 'HasMortgage', 'HasDependents', 'HasCoSigner']
            
            # Add one-hot encoded feature names (simplified - adjust based on actual categories)
            self.feature_names.extend([f"{feat}_encoded" for feat in categorical_features])
            
        except Exception as e:
            print(f"Warning: Could not extract feature names: {str(e)}")
            self.feature_names = None
    
    def predict(self, application_data):
        """
        Predict loan default probability
        
        Args:
            application_data: dict containing all features
        
        Returns:
            dict with prediction results
        """
        # Convert to DataFrame
        df = pd.DataFrame([application_data])
        
        # Preprocess
        X_processed = self.preprocessor.transform(df)
        
        # Predict probability and sanitize invalid numeric outputs
        prob = float(self.model.predict(X_processed)[0][0])
        if not np.isfinite(prob):
            prob = 0.5
        
        # Determine class
        predicted_class = 0 if prob > 0.5 else 1  # 0 = reject, 1 = accept
        
        # Determine risk category
        if prob >= Config.HIGH_RISK_THRESHOLD:
            risk_category = "High Risk"
        elif prob <= Config.LOW_RISK_THRESHOLD:
            risk_category = "Low Risk"
        else:
            risk_category = "Medium Risk"
        
        # Calculate feature importance (simplified version)
        feature_importance = self._calculate_feature_importance(X_processed[0])
        
        return {
            'probability_default': float(prob),
            'probability_approval': float(1 - prob),
            'predicted_class': predicted_class,
            'risk_category': risk_category,
            'feature_importance': feature_importance,
            'application_data': application_data
        }
    
    def _calculate_feature_importance(self, X_sample):
        """
        Calculate feature importance using gradient-based method
        This is a simplified version - for production, consider using SHAP or LIME
        """
        import tensorflow as tf
        
        # Create a gradient function
        X_tensor = tf.convert_to_tensor([X_sample], dtype=tf.float32)
        
        with tf.GradientTape() as tape:
            tape.watch(X_tensor)
            predictions = self.model(X_tensor)
        
        # Get gradients
        gradients = tape.gradient(predictions, X_tensor).numpy()[0]
        
        # Normalize to percentages
        abs_gradients = np.abs(gradients)
        total = abs_gradients.sum()
        if not np.isfinite(total) or total <= 0:
            importance_percentages = np.zeros_like(abs_gradients, dtype=np.float32)
        else:
            importance_percentages = (abs_gradients / total) * 100

        # Ensure finite JSON-safe numbers only
        importance_percentages = np.nan_to_num(
            importance_percentages,
            nan=0.0,
            posinf=0.0,
            neginf=0.0,
        )
        
        # Map to feature names if available
        if self.feature_names and len(self.feature_names) == len(importance_percentages):
            feature_importance = {
                name: float(val) for name, val in zip(self.feature_names, importance_percentages)
            }
        else:
            feature_importance = {f"feature_{i}": float(val) 
                                for i, val in enumerate(importance_percentages)}
        
        # Sort by importance
        sorted_importance = dict(sorted(feature_importance.items(), 
                                       key=lambda x: x[1], reverse=True))
        
        return sorted_importance

# Singleton instance
predictor = LoanModelPredictor()
