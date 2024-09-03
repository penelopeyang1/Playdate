from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    hashed_password = db.Column(db.String(255), nullable=False)
    image_url = db.Column(db.String(255))
    gender = db.Column(db.String(50))
    age = db.Column(db.Integer)
    region = db.Column(db.String(100))
    playstyle = db.Column(db.String(100))
    has_mic = db.Column(db.Boolean, default=True)
    platforms = db.Column(db.String(255))

    # Relationships
    user_games = db.relationship('UserGame', back_populates='user')
    clips = db.relationship('Clip', back_populates='creator')
    matches_as_user_one = db.relationship('Match', foreign_keys='Match.user_one_id', backref='match_user_one', overlaps="user_one_matches,matches_as_user_one")
    matches_as_user_two = db.relationship('Match', foreign_keys='Match.user_two_id', backref='match_user_two', overlaps="user_two_matches,matches_as_user_two")
    match_requests_sent = db.relationship('MatchRequest', foreign_keys='MatchRequest.requester_id', back_populates='requester')
    match_requests_received = db.relationship('MatchRequest', foreign_keys='MatchRequest.requestee_id', back_populates='requestee')
    messages = db.relationship('Message', back_populates='sender')

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'image_url': self.image_url,
            'gender': self.gender,
            'age': self.age,
            'region': self.region,
            'playstyle': self.playstyle,
            'has_mic': self.has_mic,
            'platforms': self.platforms
        }
