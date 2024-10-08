from .db import db, environment, SCHEMA, add_prefix_for_prod

class Clip(db.Model):
    __tablename__ = 'clips'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    description = db.Column(db.String(255))
    video_url = db.Column(db.String(255))
    creator_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('games.id')))

    #RELATIONSHIPS
    creator = db.relationship('User', back_populates='clips')
    game = db.relationship('Game')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'video_url': self.video_url,
            'creator_id': self.creator_id,
            'game_id': self.game_id,
            'creator': self.creator.to_dict(),
            'game': self.game.to_dict() if self.game else None
        }
