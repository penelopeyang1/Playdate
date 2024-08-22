from .db import db

class MatchRequest(db.Model):
    __tablename__ = 'match_requests'

    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    requestee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(50), default='pending')

    #RELATIONSIPS
    requester = db.relationship('User', foreign_keys=[requester_id], back_populates='match_requests_sent')
    requestee = db.relationship('User', foreign_keys=[requestee_id], back_populates='match_requests_received')
