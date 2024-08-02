from sqlalchemy import null
from services.exception import CustomException
from flask import  jsonify
import logging
from loggings.logger_config import setup_logger
import os
import time
import random
from werkzeug.utils import secure_filename
from db.connection import Database
UPLOAD_FOLDER =  os.path.abspath('..\..\..\projectFinal\\project\\public\\assets\\posts') 
class PostService:

    def add_post(request, user_id):
        logging.debug("reqq")
        logging.debug(request.form)
        text_content = request.form["text"]
        newFileName =None; 
        timestamp = int(time.time() * 1000)  
        random_number = random.randint(1000, 10000)  
        post_id = f'{random_number}{timestamp}'
        if 'image' in request.files:
            image_file = request.files['image']
            if image_file :
                filename = secure_filename(image_file.filename)
                newFileName = post_id+"."+filename.rsplit('.', 1)[1].lower()
                image_path= os.path.join(UPLOAD_FOLDER, newFileName)
                image_file.save(image_path)
                logging.debug(newFileName)
        if not text_content and not newFileName:
            logging.debug("No valid content to post")
            return False
        with Database() as cursor:
            cursor.execute_query_save("INSERT INTO post (post_id, user_id,text_content, content_url ,created_ts) VALUES (%s, %s, %s,%s,%s)", (post_id, user_id,text_content,newFileName,round(time.time() * 1000)))
        return True

    def allowed_file(filename):
        ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    def like_post(data,user_id):
        logging.debug(data.get('post_id'))
        try:
            with Database() as cursor:
                checkLike = cursor.execute_query("SELECT * FROM likes where user_id =%s and post_id=%s",(user_id,data.get('post_id')))
                logging.debug("c")
                logging.debug(checkLike)
                logging.debug(checkLike is not None and len(checkLike)>0)

                if(checkLike is not None and len(checkLike)>0 ):
                    cursor.execute_query_save("DELETE  FROM likes where user_id =%s and post_id=%s",(user_id,data.get('post_id')))
                else:
                    timestamp = int(time.time() * 1000)  
                    random_number = random.randint(100, 1000)  
                    
                    like_id = f'{random_number}{timestamp}'
                    logging.debug(like_id)

                    cursor.execute_query_save("INSERT INTO likes (like_id,post_id, user_id,created_ts) VALUES (%s, %s, %s,%s)", (like_id, data.get('post_id'), user_id,round(time.time() * 1000)))
                    logging.debug("quert executed")
        except Exception as e:
            logging.debug(e)
        return user_id
    
    def comment_post(data, user_id):
        with Database() as cursor:
            timestamp = int(time.time() * 1000)  
            random_number = random.randint(10, 100)  
            comment_id = f'{random_number}{timestamp}'
            logging.debug("Hii comments")

            logging.debug(comment_id)

            cursor.execute_query_save("INSERT INTO comments (comment_id,post_id, user_id,comment_text,created_ts) VALUES (%s, %s, %s,%s,%s)", (comment_id, data.get('post_id'),user_id,data.get('comment_text'),round(time.time() * 1000)))
        user_data = {
                    
                    'comment_id': comment_id,
                    'user_id':user_id,
                    'comment_text':data.get('comment_text')
                }
        return user_data

    def fetch_posts(page, page_size,user_id):
        with Database() as cursor:
            offset = (page ) * page_size
            result= cursor.execute_query("""
                SELECT 
                    p.post_id, 
                    p.user_id, 
                    u.name AS username, 
                    p.text_content,
                    p.content_url, 
                    u.image,
                    COALESCE(l.like_count, 0) AS like_count,
                    COALESCE(c.comment_count, 0) AS comment_count,
                    CASE WHEN EXISTS (
                    SELECT 1 FROM likes WHERE post_id = p.post_id AND user_id = %s
                     ) THEN TRUE ELSE FALSE END AS user_has_liked
                FROM post p
                JOIN follows f ON p.user_id = f.followed_id
                JOIN user_details u ON p.user_id = u.user_id
                LEFT JOIN (
                    SELECT post_id, COUNT(*) AS like_count
                    FROM likes
                    GROUP BY post_id
                ) l ON p.post_id = l.post_id
                LEFT JOIN (
                    SELECT post_id, COUNT(*) AS comment_count
                    FROM comments
                    GROUP BY post_id
                ) c ON p.post_id = c.post_id
                WHERE f.follower_id = %s and f.status=2
                ORDER BY p.created_ts DESC
                LIMIT %s OFFSET %s;
                """, (user_id,user_id, page_size, offset))
            logging.debug("re")
            logging.debug( page_size)
            logging.debug( offset)
            logging.debug( user_id)

            formatted_posts = []
            if(result is None):
                return jsonify(None),200
            for item in result:
                postsResponse = {
                    'post_id':item[0],
                    'posted_user_id': item[1],
                    'posted_user_name': item[2],                    
                    'text_content':item[3],
                    'content_url':item[4],
                    'user_image':item[5],
                    'like_count':item[6],
                    'comment_count':item[7],
                    'user_liked':item[8]
                }
                formatted_posts.append(postsResponse)
            return jsonify({'posts': formatted_posts}), 200

    def fetch_liked_users(user_id,post_id,page,page_size):
        with Database() as cursor:
            offset = (page ) * page_size
        
            query = """
                SELECT 
                    l.user_id AS liked_user_id, 
                    u.user_name AS liked_username,
                    u.image
                FROM likes l
                JOIN user_details u ON l.user_id = u.user_id
                WHERE l.post_id = %s
                ORDER BY l.created_ts ASC 
                LIMIT %s OFFSET %s
            """
            
            result = cursor.execute_query(query, (post_id, page_size, offset))
            formatted_data = []
            if(result is None):
                return jsonify(None),200
            for item in result:
                user_data = {
                    'user_id': item[0],
                    'user_name': item[1],
                    'image': "/" + item[2] if item[2] is not None else None,
                }
                formatted_data.append(user_data)
            return jsonify(formatted_data), 200




    def fetch_commented_users_with_comments(post_id,page,page_size):
        offset = (page ) * page_size 
        with Database() as cursor:
            query = """
                SELECT 
                    c.comment_id,
                    c.user_id AS commenter_id,
                    u.user_name AS commenter_username,
                    u.image,
                    c.comment_text
                FROM comments c
                JOIN user_details u ON c.user_id = u.user_id
                WHERE c.post_id = %s
                ORDER BY c.created_ts ASC
                LIMIT %s OFFSET %s
            """
            result = cursor.execute_query(query, (post_id, page_size, offset))
            logging.debug("res")
            logging.debug(result)
            formatted_data = []
            if(result is None):
                return jsonify(None),200
            for item in result:
                user_data = {
                    
                    'comment_id': item[0],
                    'user_id':item[1],
                    'user_name': item[2],
                    'image': "/" + item[3] if item[3] is not None else None,
                    'comment_text':item[4]
                }
                formatted_data.append(user_data)
            return jsonify(formatted_data), 200
            

    def fetch_posts_for_user(page, page_size,user_id, user_id_from_token):
        with Database() as cursor:
            offset = (page ) * page_size
            logging.debug("user_i")
            logging.debug(user_id)
            query = """SELECT 
                    p.post_id, 
                    p.user_id, 
                    p.text_content,
                    p.content_url, 
                    COALESCE(l.like_count, 0) AS like_count,
                    COALESCE(c.comment_count, 0) AS comment_count,
                    CASE WHEN EXISTS (
                    SELECT 1 FROM likes WHERE post_id = p.post_id AND user_id = %s
                     ) THEN TRUE ELSE FALSE END AS user_has_liked
                FROM post p
                LEFT JOIN (
                    SELECT post_id, COUNT(*) AS like_count
                    FROM likes
                    GROUP BY post_id
                ) l ON p.post_id = l.post_id
                LEFT JOIN (
                    SELECT post_id, COUNT(*) AS comment_count
                    FROM comments
                    GROUP BY post_id
                ) c ON p.post_id = c.post_id
                where p.user_id = %s
                ORDER BY p.created_ts DESC
                LIMIT %s OFFSET %s;
                """
            if(user_id_from_token == user_id or user_id is  None):
                sameUser = True
                params = (user_id_from_token,user_id_from_token,page_size,offset)
            else:
                sameUser = False
                params = (user_id_from_token,user_id,page_size,offset)
            result= cursor.execute_query(query
                , params)
            logging.debug("re")
            logging.debug(query)
            logging.debug(params)

            logging.debug(result)
            formatted_posts = []
            if(result is None):
                return jsonify(None),200
            for item in result:
                postsResponse = {
                    'post_id':item[0],
                    'posted_user_id': item[1],
                    'text_content':item[2],
                    'content_url':item[3],
                    'like_count':item[4],
                    'comment_count':item[5],
                    'user_liked':item[6]
                }
                formatted_posts.append(postsResponse)
            return jsonify({'posts': formatted_posts}), 200
