# controllers/user_controller.py

from flask import Blueprint, jsonify, request
from models.User.user_details import User
from services.user_service import UserService
from services.auth_service import AuthService
import logging
from services.exception import CustomException

user_bp = Blueprint('user', __name__)

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

@user_bp.route('/user', methods=['GET'])
def get_users():
    try:
        user_id_from_token = AuthService.verify_token(request)
        users = UserService.get_user(None,user_id_from_token)
    except CustomException as e:
        return CustomException.to_json(e),e.status_code
    except Exception as e:
         return jsonify({'error': 'Something went wrong'}),500
    return users
@user_bp.route('/user/<string:user_id>', methods=['GET'])
def get_users_with_id(user_id):
    try:
        user_id_from_token = AuthService.verify_token(request)
        users = UserService.get_user(user_id,user_id_from_token)
    except CustomException as e:
        return CustomException.to_json(e),e.status_code
    except Exception as e:
         return jsonify({'error': 'Something went wrong'}),500
    return users

@user_bp.route('/login', methods=['GET'])
def login_user():
    data = request.args
    user_id = UserService.get_user_by_id(data.get("user_name"),data.get("password"))
    logging.debug('Debug message: Accessing home endpoint user:{user}')
    if user_id is not None :
        token = AuthService.generate_token(user_id)
        return jsonify({'token':token }), 200
    else:
        return jsonify({'error': 'Invalid Username or Password'}), 401

@user_bp.route('/register', methods=['POST'])
def create_user():
    try:
        data = request.json
        logging.debug(data)
        new_user = UserService.create_user(data.get('user_name'),data.get('password'),data.get('name'),data.get('email'),data.get('question'),data.get('answer'))
        logging.debug(new_user)
        if new_user is not None :
            token = AuthService.generate_token(new_user)
            return jsonify({'token': token}), 200
    except CustomException as e:
        return CustomException.to_json(e),e.status_code
    except Exception as e:
        return jsonify({'error': 'FAILURE'}),500
        

@user_bp.route('/update',methods=['POST'])
def update_user_details():
    try:
        logging.debug("update method")
        user_id = AuthService.verify_token(request)
        logging.debug(user_id)
        logging.debug(request)
        logging.debug(request.json)

        UserService.update_user_details(request.json,user_id)
        return jsonify({'message': 'SUCCESS'}),200
    except CustomException as e:
        return CustomException.to_json(e),e.status_code
    except Exception as e:
        return jsonify({'error': 'FAILURE'}),500


@user_bp.route('/upload_image',methods=['POST'])
def upload_image():
    try:
        user_id = AuthService.verify_token(request)
        UserService.upload_image(request,user_id)
        return jsonify({'message': 'SUCCESS'}),200
    except CustomException as e:
        return CustomException.to_json(e),e.status_code
    except Exception as e:
        return jsonify({'error': 'FAILURE'}),500

@user_bp.route('/question', methods=['GET'])
def question():
    try:
        logging.debug(request)
        data = request.args
        users = UserService.getQuestion(data.get('user_name'))
    except CustomException as e:
        return CustomException.to_json(e),e.status_code
    except Exception as e:
        logging.debug(e)
        return jsonify({'error': 'Something went wrong'}),500
    return users

@user_bp.route('/answer', methods=['GET'])
def validate():
    try:
        data = request.args
        users = UserService.validateAnswer(data.get('answer'),data.get('user_name'))
    except CustomException as e:
        return CustomException.to_json(e),e.status_code
    except Exception as e:
         return jsonify({'error': 'Something went wrong'}),500
    return users



@user_bp.route('/password', methods=['GET'])
def changePss():
    user_name = request.args.get('user_name')
    password = request.args.get('password')
    try:
        user_id = UserService.change(password, user_name)
        logging.debug(user_id)
        if user_id is not None:
            token = AuthService.generate_token(user_id)
            return jsonify({'token': token}), 200
    except CustomException as e:
        return CustomException.to_json(e), e.status_code
    except Exception as e:
        return jsonify({'error': 'Something went wrong'}), 500

    
