from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, IntegerField, BooleanField
from wtforms.validators import DataRequired, Email, ValidationError, Length, EqualTo, Optional
from app.models import User

def user_exists(form, field):
    # Checking if email is already in use
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')

def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')

class SignUpForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), username_exists])
    email = StringField('Email', validators=[DataRequired(), Email(), user_exists])
    first_name = StringField('First Name', validators=[DataRequired(), Length(min=2, max=50)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6, max=255)])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    image_url = StringField('Profile Image URL', validators=[Optional()])
    gender = StringField('Gender', validators=[Optional(), Length(max=50)])
    age = IntegerField('Age', validators=[Optional()])
    region = StringField('Region', validators=[Optional(), Length(max=100)])
    playstyle = StringField('Playstyle', validators=[Optional(), Length(max=100)])
    has_mic = BooleanField('Has Mic', default=True)
    platforms = StringField('Platforms', validators=[Optional(), Length(max=255)])
