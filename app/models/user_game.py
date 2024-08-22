from .db import db, environment, SCHEMA

class UserGame(db.Model):
    __tablename__ = 'user_games'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False)

    #RELATIONSHIPS
    user = db.relationship('User', back_populates='user_games')
    game = db.relationship('Game', back_populates='user_games')
