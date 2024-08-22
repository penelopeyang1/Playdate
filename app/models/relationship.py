from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Table, Column, Integer, String, ForeignKey, Float, Boolean
from app.models.db import db
# from sqlalchemy.orm import relationship

# Association table for User and Game many to many relationship
# user_games = Table(
#     'user_games', db.Model.metadata,
#     Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
#     Column('game_id', Integer, ForeignKey('games.id'), primary_key=True),
# )

# Association table for Match Requests (self-referential many-to-many)
match_requests = Table(
    'match_requests', db.Model.metadata,
    Column('id', Integer, primary_key=True),
    Column('requester_id', Integer, ForeignKey('users.id'), nullable=False),
    Column('requestee_id', Integer, ForeignKey('users.id'), nullable=False),
    Column('status', String(50), default='pending'),
)
