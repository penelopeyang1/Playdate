from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField
from wtforms.validators import DataRequired, Length

class MatchRequestForm(FlaskForm):
    requester_id = IntegerField('Requester ID', validators=[DataRequired()])
    requestee_id = IntegerField('Requestee ID', validators=[DataRequired()])
    # status = StringField('Status', validators=[Optional(), Length(max=50)])
    status = StringField('Status', validators=[Length(max=50)])
