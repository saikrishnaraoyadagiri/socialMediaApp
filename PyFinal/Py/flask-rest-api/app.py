
# app.py

from flask import Flask, jsonify
from controllers.user_controller import user_bp
from controllers.social_controller import social_bp
from controllers.post_controller import post_bp
from flask_cors import CORS



app = Flask(__name__)
CORS(app) 
app.register_blueprint(user_bp)
app.register_blueprint(social_bp)
app.register_blueprint(post_bp)



if __name__ == '__main__':
    app.run(debug=True)
