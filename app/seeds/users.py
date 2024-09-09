from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text

def seed_users():
    demo = User(
        first_name='Demo',
        email='demo@aa.io',
        password='password',
        gender='Non-Binary',
        age='21',
        region='West',
        playstyle='Social',
        has_mic=False,
        platforms='PC',
        image_url='https://playdate-images.s3.amazonaws.com/demo.PNG'
        )
    faker = User(
        first_name='Sang-hyeok',
        email='hideonbush@t1.gg',
        password='goat',
        gender='Male',
        age='28',
        region='East',
        playstyle='Competitive',
        has_mic=True,
        platforms='PC',
        image_url='https://playdate-images.s3.amazonaws.com/faker.jpg'
        )
    pokimane = User(
        first_name='Imane',
        email='poki@gmail.com',
        password='pokemans',
        gender='Female',
        age='28',
        region='West',
        playstyle='Social',
        has_mic=True,
        platforms='PC',
        image_url='https://playdate-images.s3.amazonaws.com/pokimane.jpg'
        )
    jett = User(
        first_name='Jett',
        email='mvpcarry@val.gg',
        password='reviveme',
        gender='Female',
        age='21',
        region='East',
        playstyle='Competitive',
        has_mic=True,
        platforms='PC',
        image_url='https://playdate-images.s3.amazonaws.com/jett.jpg'
        )
    pewdiepie = User(
        first_name='Felix',
        email='sven@mc.gg',
        password='mynamejed',
        gender='Male',
        age='34',
        region='Southwest',
        playstyle='Explorative',
        has_mic=True,
        platforms='PC and Console',
        image_url='https://playdate-images.s3.amazonaws.com/pewdiepie.JPG'
        )
    ninja = User(
        first_name='Richard',
        email='theninja@fort.gg',
        password='slurpjuice',
        gender='Male',
        age='33',
        region='West',
        playstyle='Competitive',
        has_mic=True,
        platforms='PC',
        image_url='https://playdate-images.s3.amazonaws.com/ninja.jpg'
        )
    kyedae = User(
        first_name='Kyedae',
        email='kyedae@val.gg',
        password='iluvtenz',
        gender='Female',
        age='22',
        region='West',
        playstyle='Casual',
        has_mic=True,
        platforms='PC',
        image_url='https://playdate-images.s3.amazonaws.com/kyedae.WEBP'
        )
    tenz = User(
        first_name='Tyson',
        email='tenz@val.gg',
        password='iluvkyedae',
        gender='Male',
        age='23',
        region='West',
        playstyle='Competitive',
        has_mic=True,
        platforms='PC',
        image_url='https://playdate-images.s3.amazonaws.com/tenz.jpg'
        )
    penelope = User(
        first_name='Penelope',
        email='penelolpe@aa.io',
        password='fortnite',
        gender='Female',
        age='23',
        region='Midwest',
        playstyle='Casual',
        has_mic=True,
        platforms='PC',
        image_url='https://playdate-images.s3.amazonaws.com/penelope.jpg'
        )
    alexander = User(
        first_name='Alexander',
        email='sa1nt@aa.io',
        password='bruce',
        gender='Male',
        age='24',
        region='Southwest',
        playstyle='Competitive',
        has_mic=True,
        platforms='PC and Console',
        image_url='https://playdate-images.s3.amazonaws.com/alexander.jpg'
        )
    jungkook = User(
        first_name='Jungkook',
        email='jk@bts.com',
        password='maknae',
        gender='Male',
        age='27',
        region='East',
        playstyle='Competitive',
        has_mic=True,
        platforms='PC and Console',
        image_url='https://playdate-images.s3.amazonaws.com/jungkook.jpg'
    )
    valkyrae = User(
        first_name='Rachell',
        email='valkyrae@100t.gg',
        password='sus',
        gender='Female',
        age='32',
        region='West',
        playstyle='Social',
        has_mic=True,
        platforms='PC',
        image_url='https://playdate-images.s3.amazonaws.com/valkyrae.jpg'
    )
    tyler1 = User(
        first_name='Tyler',
        email='tyler1@lol.gg',
        password='toxic',
        gender='Male',
        age='29',
        region='Midwest',
        playstyle='Competitive',
        has_mic=True,
        platforms='PC and Console',
        image_url='https://playdate-images.s3.amazonaws.com/tyler.JPG'
    )
    chaewon = User(
        first_name='Chaewon',
        email='chaechae@lsfm.kp',
        password='smarter',
        gender='Female',
        age='24',
        region='East',
        playstyle='Casual',
        has_mic=True,
        platforms='PC',
        image_url='https://playdate-images.s3.amazonaws.com/chaewon.jpg'
    )


    db.session.add(demo)
    db.session.add(faker)
    db.session.add(pokimane)
    db.session.add(jett)
    db.session.add(pewdiepie)
    db.session.add(ninja)
    db.session.add(kyedae)
    db.session.add(tenz)
    db.session.add(penelope)
    db.session.add(alexander)
    db.session.add(jungkook)
    db.session.add(valkyrae)
    db.session.add(tyler1)
    db.session.add(chaewon)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
