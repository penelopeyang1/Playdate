from flask_wtf import FlaskForm
from wtforms import IntegerField
from wtforms.validators import DataRequired

class ChatForm(FlaskForm):
    match_id = IntegerField('Match ID', validators=[DataRequired()])
