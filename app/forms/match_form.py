from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField
from wtforms.validators import DataRequired, Length

class MatchForm(FlaskForm):
    user_one_id = IntegerField('User One ID', validators=[DataRequired()])
    user_two_id = IntegerField('User Two ID', validators=[DataRequired()])
    # status = StringField('Status', validators=[Optional(), Length(max=50)])
    # need to add optional validator if using optional field
    status = StringField('Status', validators=[Length(max=50)])
