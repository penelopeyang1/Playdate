from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, IntegerField, BooleanField
from wtforms.validators import DataRequired, Email, ValidationError, Length, EqualTo, Optional, URL
from wtforms import SubmitField
from flask_wtf.file import FileField, FileAllowed, FileRequired
from app.api.aws_helper import ALLOWED_EXTENSIONS
from app.models import User

def user_exists(form, field):
    # Checking if email is already in use
    email = field.data
    user = User.query.filter(User.email == email).first()

    if user:
        raise ValidationError('Email address is already in use.')

class SignUpForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email(), user_exists])
    first_name = StringField('First Name', validators=[DataRequired(), Length(min=2, max=50)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6, max=255)])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    image_file = FileField('Image File', validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    submit = SubmitField('Upload Image')
    gender = StringField('Gender', validators=[Optional(), Length(max=50)])
    age = IntegerField('Age', validators=[Optional()])
    region = StringField('Region', validators=[Optional(), Length(max=100)])
    playstyle = StringField('Playstyle', validators=[Optional(), Length(max=100)])
    has_mic = BooleanField('Has Mic', default=True)
    platforms = StringField('Platforms', validators=[Optional(), Length(max=255)])
