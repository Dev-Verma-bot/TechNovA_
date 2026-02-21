import os

class Config:
    # Model paths
    MODEL_PATH = 'ann_model.h5'
    PREPROCESSOR_PATH = 'preprocessor.pkl'
    
    # Database configuration
    DB_NAME = 'loan_management'
    APPLICATIONS_COLLECTION = 'applications'
    
    # Gemini API configuration
    GROQ_API_KEY = os.getenv('GROQ_API_KEY', 'your-api-key-here')
    GEMINI_MODEL = 'gemini-2.5-pro'  # or 'gemini-pro'
    
    # Risk thresholds
    HIGH_RISK_THRESHOLD = 0.7
    LOW_RISK_THRESHOLD = 0.3
    
    # Flask configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    DEBUG = True
    PORT = int(os.getenv('FLASK_PORT', 8000))
