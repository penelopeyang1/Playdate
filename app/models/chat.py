from .db import db, environment, SCHEMA

class Chat(db.Model):
    __tablename__ = 'chats'

    id = db.Column(db.Integer, primary_key=True)
    match_id = db.Column(db.Integer, db.ForeignKey('matches.id'), nullable=False)

    #RELATIONSHIPS
    match = db.relationship('Match', back_populates='chats')
    messages = db.relationship('Message', back_populates='chat')

    def to_dict(self):
        return {
            'id': self.id,
            'match_id': self.match_id,
            'messages': [message.to_dict() for message in self.messages]
        }
