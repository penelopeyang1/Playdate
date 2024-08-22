from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, Length, Optional

class ClipForm(FlaskForm):
    title = StringField('Title', validators=[Optional(), Length(max=255)])
    description = StringField('Description', validators=[Optional(), Length(max=255)])
    video_url = StringField('Video URL', validators=[DataRequired(), Length(max=255)])
    creator_id = IntegerField('Creator ID', validators=[DataRequired()])
    game_id = IntegerField('Game ID', validators=[Optional()])
