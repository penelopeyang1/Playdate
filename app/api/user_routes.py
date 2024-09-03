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
@user_routes.route('/upload_profile_picture', methods=['POST'])
def upload_profile_picture():
    # form = SignUpForm()
    form = ImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        image = form.image.data

        if image.filename == '':
            return jsonify({'error': 'No image provided'}), 400

        try:
            image.filename = get_unique_filename(image.filename)
            # Upload to S3
            upload_response = upload_file_to_s3(image)

            # print(upload_response)

            if "url" not in upload_response:
                # Return error if the upload fails
                return jsonify({'error': upload_response.get('errors', 'Image upload failed')}), 500

            # Return the URL of the uploaded image
            image_url = upload_response["url"]

            return jsonify({'url': image_url}), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    print(form.errors)
    return jsonify({'error': 'Invalid form submission'}), 400
