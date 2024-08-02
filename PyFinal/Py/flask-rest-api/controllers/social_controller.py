# controller.py

from flask import Flask, jsonify, request, Blueprint
import mysql.connector
from services.social_service import FollowService
import logging
from loggings.logger_config import setup_logger
from services.exception import CustomException
from services.auth_service import AuthService

social_bp = Blueprint('social', __name__)

@social_bp.route('/follow', methods=['POST'])
def follow_user():
    data = request.json
    user_id = AuthService.verify_token(request)
    follower_id = user_id
    followed_id = data.get('followed_id')

    if not follower_id or not followed_id:
        return jsonify({'error': 'follower_id and followed_id are required'}), 400
    try:
        returendValue = FollowService.follow_user(follower_id,followed_id)
        logging.debug(returendValue)
        return jsonify({'status':'SUCCESS'}),200
    except CustomException as e:
        return CustomException.to_json(e),e.status_code

@social_bp.route('/unfollow', methods=['POST'])
def unfollow_user():
    data = request.json
    user_id = AuthService.verify_token(request)
    follower_id = user_id
    followed_id = data.get('followed_id')

    if not follower_id or not followed_id:
        return jsonify({'error': 'follower_id and followed_id are required'}), 400
    try:
        FollowService.unfollow_user(follower_id,followed_id,0)
        return jsonify({'status':'SUCCESS'}),200
    except CustomException as e:
        return CustomException.to_json(e),e.status_code

@social_bp.route('/decline', methods=['POST'])
def decline_user():
    data = request.json
    user_id = AuthService.verify_token(request)
    follower_id = data.get('follower_id')
    followed_id = user_id

    if not follower_id or not followed_id:
        return jsonify({'error': 'follower_id and followed_id are required'}), 400
    try:
        FollowService.unfollow_user(follower_id,followed_id,4)
        return jsonify({'status':'SUCCESS'}),200
    except CustomException as e:
        return CustomException.to_json(e),e.status_code

@social_bp.route('/accept', methods=['POST'])
def accept_user():
    data = request.json
    user_id = AuthService.verify_token(request)
    
    follower_id = data.get('follower_id')
    followed_id = user_id

    if not follower_id or not followed_id:
        return jsonify({'error': 'follower_id and followed_id are required'}), 400
    try:
        FollowService.unfollow_user(follower_id,followed_id,2)
        return jsonify({'status':'SUCCESS'}),200
    except CustomException as e:
        return CustomException.to_json(e),e.status_code

@social_bp.route('/followers', methods=['GET'])
def get_followers():
    data = request.args
    logging.debug(data)

    user_id = AuthService.verify_token(request)
    
    if data.get('user_id') is not None:
        user_id = data.get('user_id')
    returendValue = FollowService.get_followers(user_id,2,int(data.get('page_no')),int(data.get('page_size')))
    return jsonify({'users':returendValue}),200


@social_bp.route('/following', methods=['GET'])
def get_following():
    data = request.args
    user_id = AuthService.verify_token(request)
    
    if data.get('user_id') is not None:
        user_id = data.get('user_id')
    returendValue = (FollowService.get_following(user_id,2,int(data.get('page_no')),int(data.get('page_size'))))
    return jsonify({'users':returendValue}),200

@social_bp.route('/requests', methods=['GET'])
def get_requests():
    user_id = AuthService.verify_token(request)
    data = request.args
    returendValue = (FollowService.get_followers(user_id,1,int(data.get('page_no')),int(data.get('page_size'))))
    return jsonify({'users':returendValue}),200

@social_bp.route('/search', methods=['GET'])
def get_search():
    user_id = AuthService.verify_token(request)
    data = request.args
    returendValue = (FollowService.get_searchData(data.get('search_text'),user_id,int(data.get('page_no')),int(data.get('page_size'))))
    return jsonify({'users':returendValue}),200

