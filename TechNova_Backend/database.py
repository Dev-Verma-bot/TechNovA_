from pymongo import MongoClient
from datetime import datetime
from config import Config
import json

class DatabaseManager:
    def __init__(self):
        self.client = MongoClient('mongodb+srv://rapellysaivinil_db_user:JFEli1Gz2KRtPbYV@cluster0.feutxpe.mongodb.net/')
        self.db = self.client[Config.DB_NAME]
        self.applications = self.db[Config.APPLICATIONS_COLLECTION]
    
    def save_application(self, application_data, prediction_results, analysis_response):
        """Save approved application to database"""
        
        document = {
            'application_data': application_data,
            'prediction_results': {
                'probability_default': prediction_results['probability_default'],
                'probability_approval': prediction_results['probability_approval'],
                'risk_category': prediction_results['risk_category']
            },
            'analysis_response': analysis_response,
            'timestamp': datetime.now(),
            'status': 'approved'
        }
        
        result = self.applications.insert_one(document)
        return str(result.inserted_id)
    
    def get_all_applications(self):
        """Retrieve all applications (for admin purposes)"""
        applications = list(self.applications.find({}, {'_id': 0}))
        return applications

# Singleton instance
db_manager = DatabaseManager()