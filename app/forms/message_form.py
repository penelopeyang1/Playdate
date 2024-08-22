from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField
from wtforms.validators import DataRequired, Length

class MessageForm(FlaskForm):
    chat_id = IntegerField('Chat ID', validators=[DataRequired()])
    sender_id = IntegerField('Sender ID', validators=[DataRequired()])
    message = StringField('Message', validators=[DataRequired(), Length(max=255)])
