from .db import db, environment, SCHEMA, add_prefix_for_prod

class Game(db.Model):
    __tablename__ = 'games'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    genre = db.Column(db.String(100))
    image_url = db.Column(db.String(255))


    #RELATIONSHIPS ~
    user_games = db.relationship('UserGame', back_populates='game')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'genre': self.genre,
            'image_url': self.image_url,
        }
