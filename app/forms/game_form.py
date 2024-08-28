from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Length, Optional

class GameForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired(), Length(max=100)])
    genre = StringField('Genre', validators=[Optional(), Length(max=100)])
    image_url = StringField('Image URL', validators=[Optional()])

