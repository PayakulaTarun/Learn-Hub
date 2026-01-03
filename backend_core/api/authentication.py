from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
import firebase_admin
from firebase_admin import auth, credentials
import os
from django.contrib.auth.models import User

# Initialize Firebase Admin if not already initialized
if not len(firebase_admin._apps):
    try:
        # Assuming ADC or ENV var is set for credentials
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Warning: Firebase Admin init failed (might use ADC later): {e}")

class FirebaseAuthentication(BaseAuthentication):
    """
    Firebase Authentication Middleware for DRF.
    """
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None

        try:
            token = auth_header.split(" ").pop()
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token.get("uid")
        except Exception:
            raise exceptions.AuthenticationFailed('Invalid Firebase Token')

        if not uid:
            return None

        # Return a mock user or get_or_create a Django user mapped to UID
        # For Phase 2 simple migration, we trust the UID
        user, _ = User.objects.get_or_create(username=uid) 
        return (user, None)
