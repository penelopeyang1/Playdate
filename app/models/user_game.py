from .db import db, environment, SCHEMA, add_prefix_for_prod

class UserGame(db.Model):
    __tablename__ = 'user_games'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('games.id')), nullable=False)
    rank = db.Column(db.String, nullable=True)
    description = db.Column(db.String, nullable=True)

    #RELATIONSHIPS
    user = db.relationship('User', back_populates='user_games')
    game = db.relationship('Game', back_populates='user_games')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'game_id': self.game_id,
            'rank': self.rank,
            'description': self.description
        }
