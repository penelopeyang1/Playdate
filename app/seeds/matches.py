from app.models import db, Match, environment, SCHEMA
from sqlalchemy.sql import text
import random

def seed_matches():
    # List of user IDs (these should match the IDs from the users seeded)
    user_ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

    # Creating random matches
    num_matches = 10  # Adjust the number of matches as needed

    for _ in range(num_matches):
        user_one_id, user_two_id = random.sample(user_ids, 2)
        match = Match(
            user_one_id=user_one_id,
            user_two_id=user_two_id,
            status='accepted'  # Change to 'pending' or 'rejected' as needed
        )
        db.session.add(match)

    db.session.commit()

def undo_matches():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.matches RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM matches"))

    db.session.commit()
