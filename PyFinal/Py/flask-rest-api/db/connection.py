import mysql.connector

class Database:
    def __init__(self):
        self.connection = None
        self.connect()

    def connect(self):
        try:
            self.connection = mysql.connector.connect(
                host='localhost',
                database='social_media',
                user='root',
                password='Sai@1997',
            )
            print("Connected to MySQL database")
        except mysql.connector.Error as e:
            print(f"Error connecting to MySQL database: {e}")

    def disconnect(self):
        if self.connection:
            self.connection.close()
            print("Disconnected from MySQL database")

    def execute_query(self, query, params=None):
        if not self.connection:
            self.connect()
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(query, params)
                result = cursor.fetchall()
                return result
        except mysql.connector.Error as e:
            print(f"Error executing query: {e}")
            return None
    
    def execute_query_save(self, query, params=None):
        if not self.connection:
            self.connect()
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(query, params)
                result = self.connection.commit()
                return result
        except mysql.connector.Error as e:
            print(f"Error executing query: {e}")
            raise e

    def __enter__(self):
        if not self.connection:
            self.connect()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.disconnect()
    
    def commit(self):
        self.connection.commit()

