from flask import Flask, jsonify, request, Blueprint
import mysql.connector
import logging
from loggings.logger_config import setup_logger
from services.exception import CustomException
from services.post_service import PostService
from services.auth_service import AuthService

post_bp = Blueprint('post', __name__)

@post_bp.route('/post', methods=['POST'])
def add_post():

    if not request:
        return jsonify({'error': 'No JSON data provided'}), 400
    try:
        user_id = AuthService.verify_token(request)
        returendValue = PostService.add_post(request,user_id)
        logging.debug(returendValue)
        return jsonify({'status':'SUCCESS'}),200
    except CustomException as e:
        return CustomException.to_json(e),e.status_code

@post_bp.route('/like', methods=['POST'])
def like_post():
    logging.debug(request.json)
    data = request.json 
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400
    try:
        user_id = AuthService.verify_token(request)
        returendValue = PostService.like_post(data,user_id)
        logging.debug(returendValue)
        return returendValue,200
    except CustomException as e:
        return CustomException.to_json(e),e.status_code


@post_bp.route('/comment', methods=['POST'])
def comment_post():
    data = request.json 
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400
    try:
        user_id = AuthService.verify_token(request)
        returendValue = PostService.comment_post(data,user_id)
        logging.debug(returendValue)
        return returendValue,200
    except CustomException as e:
        return CustomException.to_json(e),e.status_code


@post_bp.route('/fetch/posts', methods=['GET'])
def fetch_posts():
    data= request.args 
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400
    try:
        user_id = AuthService.verify_token(request)
        returendValue = PostService.fetch_posts(int(data.get('page_no')),int(data.get('page_size')),user_id)
        logging.debug(returendValue)
        return returendValue
    except CustomException as e:
        return CustomException.to_json(e),e.status_code

@post_bp.route('/fetch/profile/posts', methods=['GET'])
def fetch_your_posts():
    data= request.args 
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400
    try:
        user_id = AuthService.verify_token(request)
        returendValue = PostService.fetch_posts_for_user(int(data.get('page_no')),int(data.get('page_size')),data.get('user_id'),user_id)
        logging.debug(returendValue)
        return returendValue
    except CustomException as e:
        return CustomException.to_json(e),e.status_code

@post_bp.route('/fetch/liked', methods=['GET'])
def fetch_liked_users():
    data= request.args 
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400
    try:
        user_id = AuthService.verify_token(request)
        returendValue = PostService.fetch_liked_users(user_id,data.get('post_id'), int(data.get('page_no')),int(data.get('page_size')))
        logging.debug(returendValue)
        return returendValue
    except CustomException as e:
        return CustomException.to_json(e),e.status_code


@post_bp.route('/fetch/comments', methods=['GET'])
def fetch_comments_users():
    data= request.args 
    if not data:
        return jsonify({'error': 'No JSON data provided'}), 400
    try:
        user_id = AuthService.verify_token(request)
        returendValue = PostService.fetch_commented_users_with_comments(data.get('post_id'), int(data.get('page_no')),int(data.get('page_size')))
        logging.debug(returendValue)
        return returendValue
    except CustomException as e:
        return CustomException.to_json(e),e.status_code