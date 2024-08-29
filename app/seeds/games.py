from app.models import db, Game, environment, SCHEMA
from sqlalchemy.sql import text

def seed_games():
    game_data = [
        {"title": "Fortnite", "genre": "Battle Royale", "image_url": "https://playdate-images.s3.amazonaws.com/fortnite-cover.jpg"},
        {"title": "Valorant", "genre": "First-Person Shooter", "image_url": "https://playdate-images.s3.amazonaws.com/valorant-cover.jpg"},
        {"title": "Minecraft", "genre": "Sandbox", "image_url": "https://playdate-images.s3.amazonaws.com/minecraft-cover.jpg"},
        {"title": "Genshin Impact", "genre": "RPG", "image_url": "https://playdate-images.s3.amazonaws.com/genshin-cover.jpg"},
        {"title": "Overwatch 2", "genre": "First-Person Shooter", "image_url": "https://playdate-images.s3.amazonaws.com/overwatch-cover.jpg"},
        {"title": "League of Legends", "genre": "MOBA", "image_url": "https://playdate-images.s3.amazonaws.com/lol-cover.webp"},
        {"title": "Roblox", "genre": "Variety", "image_url": "https://playdate-images.s3.amazonaws.com/roblox-cover.jpg"},
        {"title": "Rocket League", "genre": "Sport", "image_url": "https://playdate-images.s3.amazonaws.com/rocket-league-cover.jpg"},
        {"title": "Call of Duty", "genre": "First-Person Shooter", "image_url": "https://playdate-images.s3.amazonaws.com/cod-cover.webp"},
        {"title": "Animal Crossing New Horizons", "genre": "Simulation", "image_url": "https://playdate-images.s3.amazonaws.com/acnh-cover.jpg"},
        {"title": "Lethal Company", "genre": "Horror", "image_url": "https://playdate-images.s3.amazonaws.com/lethal-company-cover.jpg"},
        {"title": "Fall Guys", "genre": "Battle Royale", "image_url": "https://playdate-images.s3.amazonaws.com/fallguys-cover.avif"},
        {"title": "Grand Theft Auto", "genre": "Action-Adventure", "image_url": "https://playdate-images.s3.amazonaws.com/gta-cover.jpg"},
        {"title": "Counter-Strike: Global Offensive", "genre": "First-Person Shooter", "image_url": "https://playdate-images.s3.amazonaws.com/csgo-cover.png"},
        {"title": "Palworld", "genre": "Action-Adventure", "image_url": "https://playdate-images.s3.amazonaws.com/palword-cover.jpg"},
    ]

    # create and add game instances to the session
    for data in game_data:
        game = Game(**data)
        db.session.add(game)

    db.session.commit()

def undo_games():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.games RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM games"))

    db.session.commit()
