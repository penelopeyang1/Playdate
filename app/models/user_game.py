from .db import db, environment, SCHEMA, add_prefix_for_prod

class UserGame(db.Model):
    __tablename__ = 'user_games'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('games.id')), nullable=False)

    #RELATIONSHIPS
    user = db.relationship('User', back_populates='user_games')
    game = db.relationship('Game', back_populates='user_games')
