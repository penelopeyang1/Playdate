from .db import db, environment, SCHEMA, add_prefix_for_prod

class Match(db.Model):
    __tablename__ = 'matches'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_one_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user_two_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(50), default='pending')

    #RELATIONSHIPS
    # users = db.relationship('User', back_populates='matches', foreign_keys=[user_one_id, user_two_id])
    user_one = db.relationship('User', foreign_keys=[user_one_id], backref=db.backref('user_one_matches', lazy=True), overlaps="match_user_one,matches_as_user_one")
    user_two = db.relationship('User', foreign_keys=[user_two_id], backref=db.backref('user_two_matches', lazy=True), overlaps="match_user_two,matches_as_user_two")

    chats = db.relationship('Chat', back_populates='match')

    def to_dict(self):
        return {
            'id': self.id,
            'user_one_id': self.user_one_id,
            'user_two_id': self.user_two_id,
            'status': self.status
        }
