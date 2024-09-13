from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import User, db
# from app.forms.signup_form import SignUpForm
from app.forms.aws_form import ImageForm
from app.api.aws_helper import upload_file_to_s3, remove_file_from_s3, get_unique_filename
# from werkzeug.utils import secure_filename

user_routes = Blueprint('users', __name__)

@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:userId>')
@login_required
def user(userId):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(userId)
    return user.to_dict()

# @user_routes.route('/upload_profile_picture', methods=['POST'])
# def upload_profile_picture():
#     if 'image' not in request.files:
#         return jsonify({'error': 'No image provided'}), 400

#     image = request.files['image']

#     if image.filename == '':
#         return jsonify({'error': 'No image provided'}), 400

#     try:
#         # Upload to S3
#         s3_client = boto3.client('s3')
#         bucket_name = 'playdate-images'
#         filename = secure_filename(image.filename)
#         s3_client.upload_fileobj(image, bucket_name, filename)

#         # Construct the URL
#         image_url = f"https://{bucket_name}.s3.amazonaws.com/{filename}"

#         return jsonify({'url': image_url}), 200

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
# @user_routes.route('/upload_profile_picture', methods=['POST'])
# def upload_profile_picture():

#     form = ImageForm()
#     form['csrf_token'].data = request.cookies.get('csrf_token', '')

#     print(f"Received files: {request.files}")

#     if form.validate_on_submit():
#         image = form.image_file.data
#         print(f"Image received: {image}")

#         if not image or image.filename == '':
#             print("No image file provided.")
#             return jsonify({'error': 'No image provided'}), 400

#         try:
#             image.filename = get_unique_filename(image.filename)
#             # Upload to S3
#             upload_response = upload_file_to_s3(image)
#             print(f"Upload response: {upload_response}")

#             if "url" not in upload_response:
#                 return jsonify({'error': upload_response.get('errors', 'Image upload failed')}), 500

#             image_url = upload_response["url"]
#             return jsonify({'url': image_url}), 200

#         except Exception as e:
#             print(f"Exception during file upload: {e}")
#             return jsonify({'error': str(e)}), 500

#     print(f"Form errors: {form.errors}")
#     return jsonify({'error': 'Invalid form submission'}), 400
@user_routes.route('/upload_profile_picture', methods=['POST'])
def upload_profile_picture():
    try:
        form = ImageForm()
        form['csrf_token'].data = request.cookies.get('csrf_token', '')

        if form.validate_on_submit():
            image = form.image.data

            if not image or image.filename == '':
                print("No image provided.")
                return jsonify({'error': 'No image provided'}), 400

            # Check file size if applicable
            if len(image.read()) > MAX_FILE_SIZE:
                print("File too large.")
                return jsonify({'error': 'File too large'}), 400
            image.seek(0)  # Reset file pointer after reading size

            # Upload to S3
            upload_response = upload_file_to_s3(image)
            if "url" not in upload_response:
                print(f"Image upload failed: {upload_response.get('errors', 'Unknown error')}")
                return jsonify({'error': 'Image upload failed'}), 500

            image_url = upload_response["url"]
            return jsonify({'url': image_url}), 200

        print(f"Form validation errors: {form.errors}")
        return jsonify({'error': 'Invalid form submission'}), 400

    except Exception as e:
        print(f"Exception during image upload: {e}")  # Add detailed logging
        return jsonify({'error': str(e)}), 500
