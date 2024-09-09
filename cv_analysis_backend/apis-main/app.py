from flask import Flask, request, jsonify
from flask_login import LoginManager
from flask_cors import CORS
from cv import cv_bp
from models import User
import os
from dotenv import load_dotenv
from jwt import decode, ExpiredSignatureError, InvalidTokenError

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

if not os.getenv('FRONTEND_URL'):
    raise ValueError("FRONTEND_URL required in .env")

# Enable CORS
CORS(app, resources={r"/*": {"origins": os.getenv('FRONTEND_URL')}})


app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ALGORITHM'] = 'HS256'


login_manager = LoginManager(app)


app.register_blueprint(cv_bp, url_prefix='/cv')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Manual JWT verification
def verify_jwt(token):
    try:
        decoded = decode(token, app.config['JWT_SECRET_KEY'], algorithms=[app.config['JWT_ALGORITHM']])
        return decoded
    except ExpiredSignatureError:
        return {"msg": "Token has expired"}
    except InvalidTokenError:
        return {"msg": "Invalid token"}

@app.route('/')
def home():
    # Check for JWT token manually in the request header
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"msg": "Missing token"}), 401

    try:
        print(token)
        token = token.split(' ')[1]  # Remove 'Bearer ' from the start of the token
    except IndexError:
        return jsonify({"msg": "Token format is invalid"}), 401
    print(token)
    decoded = verify_jwt(token)
    if "msg" in decoded:
        return jsonify(decoded), 401

    return "FBA Project"

if __name__ == '__main__':
    app.run(debug=True)
