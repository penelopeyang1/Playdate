from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField
from wtforms.validators import DataRequired, Length, Optional

class UserGameForm(FlaskForm):
    user_id = IntegerField('User ID', validators=[DataRequired()])
    game_id = IntegerField('Game ID', validators=[DataRequired()])
    # rank = StringField('Rank', validators=[Optional(), Length(max=100)])
    # description = StringField('Description', validators=[Optional(), Length(max=150)])
