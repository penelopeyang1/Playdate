from flask import Blueprint, request, jsonify
from app.models import User, db
from app.forms import LoginForm
from app.forms.signup_form import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
# from werkzeug.utils import secure_filename
from app.api.aws_helper import upload_file_to_s3, get_unique_filename, ALLOWED_EXTENSIONS, allowed_file

import boto3

# from flask_jwt_extended import create_access_token

auth_routes = Blueprint('auth', __name__)
# signup_routes = Blueprint('signup', __name__)
# s3 = boto3.client('s3')

@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': {'message': 'Unauthorized'}}, 401


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        return user.to_dict()
    return form.errors, 401

    #for token based auth testing
    # if form.validate_on_submit():
    #     user = User.query.filter_by(email=form.data['email']).first()
    #     if user and user.check_password(form.data['password']):  # Assuming you have a password check
    #         access_token = create_access_token(identity=user.id)
    #         return jsonify(access_token=access_token), 200
    #     return jsonify({"error": "Invalid credentials"}), 401
    # return jsonify(form.errors), 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies.get('csrf_token', '')

    if form.validate_on_submit():
        image_url = request.json.get('image_url')
        print(f"Received image URL in signup: {image_url}")

        # Check if image_url is correctly passed
        if not image_url:
            return jsonify({'error': 'Image URL not provided in signup request'}), 400

        user = User(
            email=form.data['email'],
            password=form.data['password'],
            first_name=form.data.get('first_name'),
            gender=form.data.get('gender'),
            age=form.data.get('age'),
            playstyle=form.data.get('playstyle'),
            region=form.data.get('region'),
            has_mic=form.data.get('hasMic'),
            platforms=form.data.get('platforms'),
            image_url=image_url
        )

        try:
            db.session.add(user)
            db.session.commit()
            print("User after commit:", user.to_dict())
            login_user(user)
            return user.to_dict(), 201

        except Exception as e:
            print(f"Error during user creation: {e}")
            db.session.rollback()
            return jsonify({'error': 'User creation failed'}), 500

    print(f"Form validation errors: {form.errors}")
    return form.errors, 401







@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': {'message': 'Unauthorized'}}, 401
