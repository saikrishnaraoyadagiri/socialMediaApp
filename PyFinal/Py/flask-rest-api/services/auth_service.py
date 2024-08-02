# auth_service.py
from flask import jsonify, request
import jwt
from services.exception import CustomException
import datetime

class AuthService:
    def generate_token(user_id):
        payload = {
            'user_id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)  # Token expiration time
        }
        token = jwt.encode(payload, "social", algorithm='HS256')
        return token

    def verify_token(request):
        try:
            token = None

            if 'Authorization' in request.headers:
                auth_header = request.headers['Authorization']
                token = auth_header.split(" ")[1] if len(auth_header.split(" ")) > 1 else None

            if not token:
                raise CustomException("Token is missing", 401)
            payload = jwt.decode(token, "social", algorithms=['HS256'])
            return payload['user_id']  
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None