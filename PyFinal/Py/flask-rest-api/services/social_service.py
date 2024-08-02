# service.py

from db.connection import Database
from models.User.user_details import User
from models.User.follow import Follow
import mysql.connector
from services.exception import CustomException
import time
import logging
from loggings.logger_config import setup_logger

class FollowService:
    def follow_user(follower_id, followed_id):
        try:
            with Database() as cursor:
                follower_row = cursor.execute_query("SELECT * FROM user_details WHERE user_id = %s", (follower_id,))
                if not follower_row:
                    raise CustomException("Follower not found", 400)

                followed_row = cursor.execute_query("SELECT * FROM user_details WHERE user_id = %s", (followed_id,))
                if not followed_row:
                    raise CustomException("Followed not found", 400)


                existing_follow= cursor.execute_query("SELECT * FROM follows WHERE follower_id = %s AND followed_id = %s", (follower_id, followed_id))
                logging.debug(existing_follow)
                if existing_follow and existing_follow[0][3]==2:
                    raise CustomException("Already Following", 400)
                elif existing_follow and existing_follow[0][3] == 1:
                    raise CustomException("Already Requested", 400)

                cursor.execute_query_save("REPLACE INTO follows (follower_id, followed_id,created_ts,status) VALUES (%s, %s, %s,%s)", (follower_id, followed_id,round(time.time() * 1000),1))

            return True

        except mysql.connector.Error as e:
            logging.debug(e)
            raise e

    def unfollow_user(follower_id, followed_id,status):
        try:
            with Database() as cursor:
                existing_follow= cursor.execute_query("SELECT * FROM follows WHERE follower_id = %s AND followed_id = %s", (follower_id, followed_id))
                logging.debug(existing_follow)
                if not existing_follow:
                    raise CustomException("Connection doesn't exist", 400)
                elif (status == 2 or status == 4) and existing_follow[0][3] != 1:
                    raise CustomException("Cant perform action on connection", 400)
                elif status == 0 and (existing_follow[0][3] != 2 and existing_follow[0][3] != 1):
                    raise CustomException("Connection doesn't exist for unfollow", 400)
                cursor.execute_query_save("UPDATE follows SET status=%s where (follower_id = %s AND followed_id = %s)", (status,follower_id, followed_id))

            return True

        except mysql.connector.Error as e:
            logging.debug(e)
            raise CustomException("Something went wrong", 500)

    def get_followers(user_id, status, page=0, page_size=10):
        try:
            with Database() as cursor:
                offset = (page) * page_size
                logging.debug("userd")
                logging.debug(user_id)
                logging.debug(status)
                logging.debug(page_size)
                logging.debug(offset)
                
                followers_rows= cursor.execute_query("""
                   SELECT ud.user_id, ud.user_name,ud.name,ud.email,ud.gender,ud.bio,ud.image,ud.dob
                    FROM follows AS f
                    JOIN user_details AS ud ON f.follower_id = ud.user_id and f.status = %s
                    WHERE f.followed_id = %s
                    LIMIT %s OFFSET %s
                """, (status, user_id, page_size, offset))
                logging.debug(followers_rows)

                logging.debug(followers_rows)
                if(followers_rows is not None):
                    followers = [User.from_db_row(row) for row in followers_rows if row is not None and User.from_db_row(row) is not None]
                    followers_data = [user.to_dict() for user in followers]
                    return followers_data

                return None

        except mysql.connector.Error as e:
            logging.debug(e)
            raise CustomException("Something went wrong", 500)
    def get_following(user_id, status, page=1, page_size=10):
        try:
            with Database() as cursor:

                offset = (page ) * page_size
                following_rows = cursor.execute_query("""
                    SELECT ud.user_id, ud.user_name,ud.name,ud.email,ud.gender,ud.bio,ud.image,ud.dob
                    FROM follows AS f
                    JOIN user_details AS ud ON f.followed_id = ud.user_id and f.status = %s
                    WHERE f.follower_id = %s
                    LIMIT %s OFFSET %s
                """, (status,user_id,(page_size), (offset)))
                logging.debug(following_rows)
                if(following_rows):
                    following = [User.from_db_row(row) for row in following_rows]
                    following_data = [user.to_dict() for user in following]
                    return following_data
            return None

        except mysql.connector.Error as e:
            logging.debug(e)
            raise CustomException("Something went wrong", 500)

    def get_searchData(search_text,user_id, page=1, page_size=10):
        try:
            search_text = "%"+search_text + "%"
            with Database() as cursor:
                offset = (page ) * page_size
                logging.debug("user_id")
                logging.debug(user_id)

                following_rows = cursor.execute_query("""
                    SELECT ud.user_id, ud.user_name,ud.name,ud.email,ud.gender,ud.bio,ud.image,ud.dob
                    FROM user_details ud where (user_name like %s or name  like %s) and user_id!=%s
                    LIMIT %s OFFSET %s 
                """, (search_text,search_text, user_id, page_size, offset))
                logging.debug(following_rows)
                if(following_rows):
                    following = [User.from_db_row(row) for row in following_rows]
                    following_data = [user.to_dict() for user in following]
                    return following_data
                return []

        except mysql.connector.Error as e:
            logging.debug(e)
            raise CustomException("Something went wrong", 500)

    def get_followers_count(user_id):
        logging.debug("came in for count")
        try:
            with Database() as cursor:
                logging.debug(user_id)
                followers_rows= cursor.execute_query("""
                   SELECT COUNT(*) FROM follows WHERE followed_id = %s and status = 2
                """, (user_id,))
                logging.debug(followers_rows)
                following_rows= cursor.execute_query("""
                   SELECT COUNT(*) FROM follows WHERE follower_id = %s and status = 2
                """, (user_id,))
                logging.debug(following_rows)
                count = [0,0]
                if(followers_rows):
                    count[0] = followers_rows[0][0]
                if(following_rows):
                    count[1] = following_rows[0][0]
                return count
                

        except mysql.connector.Error as e:
            logging.debug(e)
            raise CustomException("Something went wrong", 500)

    def isFollowing(user_id,target_user_id):
        logging.debug("came in for is following")
        try:
            with Database() as cursor:
                logging.debug(user_id)
                followers_rows= cursor.execute_query("""
                   SELECT status FROM follows WHERE followed_id = %s and follower_id= %s
                """, (target_user_id,user_id))
                logging.debug(followers_rows)
                if(followers_rows):
                    return followers_rows[0][0]
                return 0
        except mysql.connector.Error as e:
            logging.debug(e)
            raise CustomException("Something went wrong", 500)


    
    
