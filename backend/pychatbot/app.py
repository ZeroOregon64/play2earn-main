from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from chat import get_response
import os

app = Flask(__name__, static_folder='./build', static_url_path='/')
CORS(app)

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/predict', methods=['POST'])
def predict():
    text = request.get_json().get("message")
    # TODO: Check if text is valid
    response = get_response(text)
    message = {"answer": response}
    return jsonify(message)

if __name__ == "__main__":
    app.run(debug=True)
