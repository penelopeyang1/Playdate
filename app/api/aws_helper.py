import boto3
import botocore
import os
import uuid
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import SubmitField
# from werkzeug.utils import secure_filename

from flask import Blueprint, request, jsonify

aws_routes = Blueprint('aws', __name__)

BUCKET_NAME = os.environ.get("S3_BUCKET")
S3_REGION = os.environ.get("S3_REGION")
S3_LOCATION = f"https://{BUCKET_NAME}.s3.amazonaws.com/"
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif"}


print(f"Bucket Name: {BUCKET_NAME}")
print(f"Bucket Region: {S3_REGION}")

#instance of s3 passing env variables
s3 = boto3.client(
   "s3",
   aws_access_key_id=os.environ.get("S3_KEY"),
   aws_secret_access_key=os.environ.get("S3_SECRET"),
   region_name=S3_REGION
)


#util function for unique file names
def get_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{unique_filename}.{ext}"

#upload helper function to bucket
def upload_file_to_s3(file, acl="public-read"):
    try:

        #generate unique file name
        file.filename = get_unique_filename(file.filename)

        s3.upload_fileobj(
            file,
            BUCKET_NAME,
            file.filename,
            ExtraArgs={
                "ACL": acl,
                "ContentType": file.content_type
            }
        )
    except Exception as e:
        # in case the your s3 upload fails
        return {"errors": str(e)}

    return {"url": f"{S3_LOCATION}{file.filename}"}

#remove uploaded file from bucket helper function
def remove_file_from_s3(image_url):
    # AWS needs the image file name, not the URL,
    # so you split that out of the URL
    key = image_url.rsplit("/", 1)[1]
    print(key)
    try:
        s3.delete_object(
        Bucket=BUCKET_NAME,
        Key=key
        )
    except Exception as e:
        return { "errors": str(e) }
    return True

# class ImageForm(FlaskForm):
#     image = FileField("Image File", validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
#     submit = SubmitField("Create Post")


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

