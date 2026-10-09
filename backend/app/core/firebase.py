import os
import logging
from pathlib import Path
import firebase_admin
from firebase_admin import credentials, firestore
from app.core.config import settings

logger = logging.getLogger("vouch.firebase")

db = None
firebase_initialized = False

def init_firebase():
    global db, firebase_initialized
    if firebase_initialized:
        return db
        
    cred_path = Path(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
    if cred_path.exists():
        try:
            cred = credentials.Certificate(str(cred_path))
            firebase_admin.initialize_app(cred, {
                'projectId': settings.FIREBASE_PROJECT_ID
            })
            db = firestore.client()
            firebase_initialized = True
            logger.info(f"Firebase Firestore initialized successfully with project {settings.FIREBASE_PROJECT_ID}")
        except Exception as e:
            logger.error(f"Failed to initialize Firebase Admin SDK: {e}")
            db = None
    else:
        logger.warning(f"Service account file not found at {cred_path}. Running with local fallback.")
        db = None
        
    return db

def get_db():
    global db
    if not firebase_initialized:
        return init_firebase()
    return db
