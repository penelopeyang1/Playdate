from .db import db, environment, SCHEMA, add_prefix_for_prod

class MatchRequest(db.Model):
    __tablename__ = 'match_requests'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    requestee_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    status = db.Column(db.String(50), default='pending')

    #RELATIONSIPS
    requester = db.relationship('User', foreign_keys=[requester_id], back_populates='match_requests_sent')
    requestee = db.relationship('User', foreign_keys=[requestee_id], back_populates='match_requests_received')

    def to_dict(self):
        return {
            'id': self.id,
            'requester_id': self.requester_id,
            'requestee_id': self.requestee_id,
            'status': self.status
        }
