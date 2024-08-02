from db.connection import Database
from flask import jsonify, send_file
from models.User.user_details import User
import uuid
from services.exception import CustomException
import logging
from loggings.logger_config import setup_logger
import os
import time
import random
from werkzeug.utils import secure_filename
from services.post_service import PostService
from services.social_service import FollowService
import hashlib
UPLOAD_FOLDER =  os.path.abspath('..\..\..\projectFinal\\project\\public\\assets\\user_images') 

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}  


class UserService:
    def get_user_by_id(user_name,password):
        with Database() as db:
            query = "SELECT * FROM user_details where user_name = %s and password = %s"
            logging.debug(query)
            params = (user_name, hashlib.sha256(password.encode('utf-8')).hexdigest())
            logging.debug(params)
            result =  db.execute_query(query, params)
            if result:
                return result[0][0]
            else:
                return None
    
    def create_user(user_name,password,name,email,question,answer):
        with Database() as db:
            query = "SELECT * FROM user_details where user_name = %s"
            params = (user_name,)
            logging.debug(query)
            logging.debug(params)
            result =  db.execute_query(query, params)
            if result:
                raise CustomException("Username is already taken", 400)
            else:
                try:
                    logging.debug("tyruihru")

                    sql_update_query = """
                        INSERT INTO user_details (user_id, user_name, password, name, email, gender, bio, image, dob,question,answer)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s,%s,%s);
                    """
                    logging.debug(sql_update_query)

                    timestamp = int(time.time() * 1000)  
                    random_number = random.randint(1, 1000)  
                    logging.debug(random_number)
                    user_id = f'{timestamp}{random_number}'
                    logging.debug(user_id)
                    hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()
                    update_params = (user_id, user_name, hashed_password, name,email, None, None, None, None,question,answer)
                    logging.debug(update_params)
                    result2 = db.execute_query_save(sql_update_query, update_params)
                    logging.debug(result2)
                    return user_id
                except Exception as e:
                    logging.debug(e)
                    raise e
    
    def update_user_details(user_data,user_id):
        logging.debug("insided")
        with Database() as db:
            try:
                logging.debug(user_data)
                sql_update_query ="""
                UPDATE user_details
                SET 
                    name = %s,
                    email = %s,
                    gender = %s,
                    bio = %s,
                    dob = %s
                WHERE user_id = %s;
            """
                logging.debug(sql_update_query)
                update_params = (user_data.get('name'),  user_data.get('email'), user_data.get('gender'),  user_data.get('bio'),  user_data.get('dob'), user_id)
                logging.debug(update_params)
                result2 = db.execute_query_save(sql_update_query, update_params)
                logging.debug(result2)
                return
            except Exception as e:
                raise e

    def upload_image(request,user_id):
        logging.debug(UPLOAD_FOLDER)
        try:
            if 'file' not in request.files:
                raise CustomException("No file part", 400)
            
            file = request.files['file']
            
            if file.filename == '':
                raise CustomException("No selected file", 400)
            logging.debug("file got ")
            logging.debug(file)
            if file :
                filename = secure_filename(file.filename)
                newFileName = user_id+"."+filename.rsplit('.', 1)[1].lower()
                filepath= os.path.join(UPLOAD_FOLDER, newFileName)
                file.save(filepath)
                logging.debug(filepath)
                with Database() as db:
                    query = "UPDATE user_details SET image = %s WHERE user_id = %s"
                    params = (newFileName, user_id)
                    result= db.execute_query_save(query, params)
                    logging.debug(query,params)
                return jsonify({'message': 'Image successfully uploaded'}), 200
            
            else:
                return jsonify({'error': 'File type not allowed'}), 400
        except Exception as e:
            logging.debug(e)
            raise e

    def get_user(user_id,user_id_from_token):
        with Database() as db:
            if(user_id is None):
                user_id=user_id_from_token
                user_id_from_token = None
            query = "SELECT * FROM user_details where user_id = %s"
            params = (user_id,)
            logging.debug(query)
            logging.debug(params)
            result =  db.execute_query(query, params)
            logging.debug("hitting follower count:")
            logging.debug(result[0])
            followersCount = FollowService.get_followers_count(user_id)
            isFollowing = 2
            if(user_id_from_token is not None):
                isFollowing = FollowService.isFollowing(user_id_from_token,user_id)
                logging.debug(isFollowing)
            if result:
                user_data = {
                    'user_id': result[0][0]if result[0][0] is not None else None,
                    'user_name': result[0][1] if result[0][1] is not None else None,
                    'name': result[0][3] if result[0][3] is not None else None,
                    'email': result[0][4] if result[0][4] is not None else None,
                    'gender': result[0][5] if result[0][5] is not None else None,
                    'bio': result[0][6] if result[0][6] is not None else None,
                    'image': "/" + result[0][7] if result[0][7] is not None else None,
                    'dob':  result[0][8] if result[0][8] is not None else None,
                    'followersCount' :followersCount[0],
                    'followingCount' : followersCount[1],
                    'isFollowing' : isFollowing
                }
                return jsonify(user_data)
            else:
                raise CustomException("UserId doesn't exist", 400)

    def get_user_with_posts(user_id, user_id_from_token):
        with Database() as db:
            query = "SELECT * FROM user_details where user_id = %s"
            params = (user_id,)
            logging.debug(query)
            logging.debug(params)
            result =  db.execute_query(query, params)
            check_follow_query = """
                SELECT 1 FROM follows
                WHERE follower_id = %s AND followed_id = %s
            """
            resultFollow = db.execute_query(check_follow_query,(user_id_from_token,user_id))
            isFollowing = False
            if(resultFollow):
                isFollowing = resultFollow[0][3]==2
            else:
                isFollowing = False

            posts = None
            if(isFollowing):
                posts =  db.execute_query("SELECT * FROM post WHERE user_id = %s order by created_ts",(user_id,))

            if result:
                user_data = {
                    'user_id': result[0][0]if result[0][0] is not None else None,
                    'user_name': result[0][1] if result[0][1] is not None else None,
                    'name': result[0][3] if result[0][3] is not None else None,
                    'email': result[0][4] if result[0][4] is not None else None,
                    'gender': result[0][5] if result[0][5] is not None else None,
                    'bio': result[0][6] if result[0][6] is not None else None,
                    'image': "/" + result[0][7] if result[0][7] is not None else None,
                    'posts':posts if posts is not None else None
                }
                return jsonify(user_data)
            else:
                raise CustomException("UserId doesn't exist", 400)

    def getQuestion(user_name):
        with Database() as db:
            query = "SELECT question FROM user_details where user_name = %s"
            params = (user_name, )
            result =  db.execute_query(query, params)
            logging.debug(result)
            if result:
                return jsonify(result[0][0])
            else:
                 raise CustomException("User name not valid", 400)
    def validateAnswer(answer,user_name):
        with Database() as db:
            query = "SELECT answer,user_id FROM user_details where user_name = %s and answer =%s"
            params = (user_name, answer)
            result =  db.execute_query(query, params)
            logging.debug(result)
            if result:
                return jsonify(result[0][1])
            else:
                raise CustomException("Answer is not valid", 400)



    def change(answer,user_name):
        with Database() as db:
            logging.debug(user_name)
            result1 = db.execute_query("Select user_id from user_details where user_name =%s",(user_name,))
            logging.debug(result1)
            if(result1 is None):
                raise CustomException("User name not valid", 400)
            query = """UPDATE user_details
                    SET 
                    password = %s
                WHERE user_id = %s"""
            password = hashlib.sha256(answer.encode('utf-8')).hexdigest()
            params = (password, result1[0][0])
            result =  db.execute_query_save(query, params)
            return result1[0][0]

