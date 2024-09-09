from app.models import db, User, Game, UserGame, environment, SCHEMA
from sqlalchemy.sql import text

def seed_user_games():
    user_ids = {
        'demo': 1,
        'faker': 2,
        'pokimane': 3,
        'jett': 4,
        'pewdiepie': 5,
        'ninja': 6,
        'kyedae': 7,
        'tenz': 8,
        'penelope': 9,
        'alexander': 10,
        'jungkook': 11,
        'valkyrae': 12,
        'tyler1': 13,
        'chaewon': 14
    }

    game_ids = {
        'Apex Legends': 1,
        'Fortnite': 2,
        'Valorant': 3,
        'Overwatch 2': 4,
        'Minecraft': 5,
        'Genshin Impact': 6,
        'Among Us': 7,
        'League of Legends': 8,
        'Roblox': 9,
        'Call of Duty': 10,
        'Rocket League': 11,
        'Lethal Company': 12,
        'Animal Crossing New Horizons': 13,
        'Grand Theft Auto': 14,
        'Fall Guys': 15,
        'Dead by Daylight': 16,
        'Palworld': 17,
        'Elden Ring': 18
    }

    user_games = [
        (user_ids['demo'], [game_ids['Grand Theft Auto'], game_ids['Roblox']]),
        (user_ids['faker'], [game_ids['League of Legends']]),
        (user_ids['pokimane'], [game_ids['Among Us'], game_ids['Dead by Daylight'], game_ids['Lethal Company']]),
        (user_ids['jett'], [game_ids['Valorant'], game_ids['Grand Theft Auto']]),
        (user_ids['pewdiepie'], [game_ids['Minecraft'], game_ids['Elden Ring'], game_ids['Grand Theft Auto']]),
        (user_ids['ninja'], [game_ids['Fortnite'], game_ids['Apex Legends'], game_ids['Call of Duty']]),
        (user_ids['kyedae'], [game_ids['Valorant'], game_ids['Among Us']]),
        (user_ids['tenz'], [game_ids['Valorant']]),
        (user_ids['penelope'], [game_ids['Fortnite'], game_ids['Genshin Impact'], game_ids['Valorant'], game_ids['League of Legends']]),
        (user_ids['alexander'], [game_ids['Rocket League'], game_ids['Fortnite'], game_ids['Valorant'], game_ids['Minecraft']]),
        (user_ids['jungkook'], [game_ids['League of Legends'], game_ids['Overwatch 2']]),
        (user_ids['valkyrae'], [game_ids['Among Us'], game_ids['Valorant'], game_ids['Fortnite']]),
        (user_ids['tyler1'], [game_ids['League of Legends'], game_ids['Fortnite']]),
        (user_ids['chaewon'], [game_ids['Overwatch 2'], game_ids['Roblox']]),
    ]

    #add user-game associations to the session
    for userId, game_list in user_games:
        for game_id in game_list:
            game = Game.query.get(game_id)
            if game:
                user_game = UserGame(
                    user_id=userId,
                    game_id=game_id,
                    game_title=game.title,
                    game_image_url=game.image_url
                )
                db.session.add(user_game)

    db.session.commit()

def undo_user_games():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.user_games RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM user_games"))

    db.session.commit()
