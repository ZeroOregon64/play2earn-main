from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from flask_cors import CORS, cross_origin
import os
import logging
from werkzeug.utils import secure_filename
from utils import process_cv_file, calculate_context_score, allowed_file, calculate_skill_score, calculate_experience_score
from models import CVAnalysis, User
from jwt import decode, ExpiredSignatureError, InvalidTokenError
from dotenv import load_dotenv
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.DEBUG)

cv_bp = Blueprint('cv', __name__)

def verify_jwt(token):
    try:
        decoded = decode(token, os.getenv('JWT_SECRET_KEY'), 'HS256')
        return decoded
    except ExpiredSignatureError:
        return {"msg": "Token has expired"}
    except InvalidTokenError:
        return {"msg": "Invalid token"}


@cv_bp.route('/upload', methods=['POST'])
def upload_cv():
    #JWT verification
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"msg": "Missing token"}), 401

    try:
        token = token.split(' ')[1]  # Remove 'Bearer ' from the start of the token
    except IndexError:
        return jsonify({"msg": "Token format is invalid"}), 401

    decoded = verify_jwt(token)
    if "msg" in decoded:
        return jsonify(decoded), 401

    logging.debug(f"Authorization Header: {request.headers.get('Authorization')}")

    logging.debug('Entering upload_cv function')
    user_identity = decoded
    user = User.objects(username=user_identity["username"]).only('username').first()


    if 'file' not in request.files:
        logging.debug('No file part in request')
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    job_title = request.form.get('job_title')

    if file.filename == '':
        logging.debug('No selected file')
        return jsonify({"error": "No selected file"}), 400

    if not job_title:
        logging.debug('No job title provided')
        return jsonify({"error": "No job title provided"}), 400

    if file and allowed_file(file.filename, {'pdf', 'docx', 'doc'}):
        filename = secure_filename(file.filename)
        # Construct the user-specific upload path
        user_upload_folder = current_app.config['UPLOAD_FOLDER']

        # Ensure the directory exists
        os.makedirs(user_upload_folder, exist_ok=True)

        # Save the file
        file_path = os.path.join(user_upload_folder, filename)
        file.save(file_path)
        logging.debug(f'File saved at: {file_path}')

        file_name, text, name, designation, experience, education, skills = process_cv_file(file_path, filename)

        if name is None:
            logging.debug('Failed to extract information from CV')
            return jsonify({"error": "Failed to extract information from CV"}), 400


        if user:
            cv_analysis = CVAnalysis(
                file_name=file_name,
                user=user,
                name=name or "",
                designation=designation or "",
                experience=experience or "",
                education=education or "",
                skills=skills or "",
                salary_expectation="",
                description="",
                professional_title=job_title,
                years_of_experience=""
            )
            cv_analysis.save()
            logging.debug('CV analysis saved to database')

        response = {
            "file_name": file_name,
            "context_score": None,
            "name": name or "",
            "designation": designation or "",
            "experience": experience or "",
            "education": education or "",
            "skills": skills or "",
            "salary_expectation": "",
            "description": "",
            "professional_title": job_title,
            "years_of_experience": ""
        }
        logging.debug('Returning JSON response')
        return jsonify(response), 200

    else:
        logging.debug('Invalid file type')
        return jsonify({"error": "Invalid file type"}), 400

@cv_bp.route('/add', methods=['POST'])
def manual_upload_cv():
    #JWT verification
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"msg": "Missing token"}), 401

    try:
        token = token.split(' ')[1]  # Remove 'Bearer ' from the start of the token
    except IndexError:
        return jsonify({"msg": "Token format is invalid"}), 401
    
    decoded = verify_jwt(token)
    if "msg" in decoded:
        return jsonify(decoded), 401
    user_identity = decoded
    user = User.objects(username=user_identity["username"]).only('username').first()

    logging.debug('Entering manual_upload_cv function')
    data = request.json
    full_name = data.get('name')
    skills = data.get('skills')
    years_of_experience = data.get('yoe')
    salary_expectation = data.get('salaryExpectations')
    description = data.get('jd')
    education = data.get('ee')
    experience = data.get('we')
    professional_title = None  #Disabled because it is not requested in frontend

    if not all([full_name, skills, years_of_experience, salary_expectation, description]):
        logging.debug('Missing required fields in request')
        return jsonify({"error": "Missing required fields"}), 400

    if user:
        cv_analysis = CVAnalysis(
            user=user,
            name=full_name or "",
            experience=experience or "",
            education=education or "",
            skills=skills or "",
            salary_expectation=salary_expectation or "",
            description=description,
            years_of_experience=years_of_experience
        )
        cv_analysis.save()
        logging.debug('CV analysis saved to database')

    response = {
        "full_name": full_name,
        "skills": skills,
        "years_of_experience": years_of_experience,
        "salary_expectation": salary_expectation,
        "description": description,
        "professional_title": professional_title
    }
    logging.debug('Returning JSON response for manual upload')
    return jsonify(response), 200

@cv_bp.route('/analyze', methods=['POST'])
def analyze_resumes():
    #JWT verification
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"msg": "Missing token"}), 401

    try:
        token = token.split(' ')[1]  # Remove 'Bearer ' from the start of the token
    except IndexError:
        return jsonify({"msg": "Token format is invalid"}), 401
    decoded = verify_jwt(token)
    if "msg" in decoded:
        return jsonify(decoded), 401

    logging.debug('Entering analyze_resumes function')
    data = request.get_json()  # Get the JSON data from the request body
    sample_jd = data.get('sample_jd')  # Extract the sample_jd from the JSON data

    if not sample_jd:
        logging.debug('No job description provided')
        return jsonify({"error": "No job description provided"}), 400

    # Get all CVs in the uploads folder
    
    upload_folder = current_app.config['UPLOAD_FOLDER']
    if not os.path.exists(upload_folder):
        logging.debug('No CVs found')
        return jsonify({"error": "No CVs found"}), 404
    files = [f for f in os.listdir(upload_folder) if allowed_file(f, {'pdf', 'docx', 'doc'})]
    
    scores = []

    for file_name in files:
        
        file_path = os.path.join(upload_folder, file_name)
        try:
            _, text, name, designation, experience, education, skills = process_cv_file(file_path, file_name)

            if name is None:
                logging.warning(f"Skipping file due to extraction failure: {file_name}")
                continue

            # Calculate skill score
            skill_score = calculate_skill_score(skills, sample_jd)

            scores.append({
                "file_name": file_name,
                "context_score": skill_score * 100,  # Assuming composite score is the desired context score
                "name": name,
                "designation": designation,
                "experience": experience,
                "education": education,
                "skills": skills
            })
        except Exception as e:
            logging.error(f"Error processing file {file_name}: {e}")
    logging.debug(scores)
    # Sort by composite score in descending order and get top 5
    top_scores = sorted(scores, key=lambda x: x['context_score'], reverse=True)[:5]

    logging.debug('Returning top 5 CVs based on analysis')
    return jsonify(top_scores), 200
