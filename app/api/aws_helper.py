import boto3
import botocore
import os
import uuid

BUCKET_NAME = os.environ.get("S3_BUCKET")
S3_LOCATION = f"https://{BUCKET_NAME}.s3.amazonaws.com/"
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif"}

#instance of s3 passing env variables
s3 = boto3.client(
   "s3",
   aws_access_key_id=os.environ.get("S3_KEY"),
   aws_secret_access_key=os.environ.get("S3_SECRET")
)

@app.route('/api/generate-presigned-url', methods=['GET'])
def generate_presigned_url():
    file_name = request.args.get('file_name')
    file_type = request.args.get('file_type')

    if not file_name or not file_type:
        return jsonify({'error': 'File name and type are required'}), 400

    try:
        response = s3.generate_presigned_url(
            'put_object',
            Params={'Bucket': BUCKET_NAME, 'Key': file_name, 'ContentType': file_type},
            ExpiresIn=3600
        )
    except botocore.exceptions.BotoCoreError as e:
        return jsonify({'error': str(e)}), 500

    return jsonify({'url': response})

#util function for unique file names
def get_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{unique_filename}.{ext}"

#upload helper function to bucket
def upload_file_to_s3(file, acl="public-read"):
    try:
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
