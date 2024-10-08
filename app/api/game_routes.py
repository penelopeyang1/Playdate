from flask import Blueprint, request, jsonify
from flask import current_app as app
from flask_wtf import CSRFProtect
from app.models import db, Game
from app.models import db, UserGame
from app.forms import UserGameForm

game_routes = Blueprint('games', __name__)

csrf = CSRFProtect()

#CREATE - for adding games to user profile
@game_routes.route('/', methods=['POST'])
def add_game():
    data = request.get_json()
    app.logger.debug(f"Received data: {data}")

    user_id = data.get('user_id')
    game_id = data.get('game_id')

    if not user_id or not game_id:
        app.logger.error("Missing user_id or game_id")
        return jsonify({"error": "Missing user_id or game_id"}), 400

    game = Game.query.get(game_id)
    if not game:
        app.logger.error("Game does not exist")
        return jsonify({"error": "Game does not exist"}), 400

    existing_game = UserGame.query.filter_by(
        user_id=user_id,
        game_id=game_id
    ).first()
    if existing_game:
        app.logger.error("Game already added to profile")
        return jsonify({"error": "Game already added to profile"}), 400

    new_game = UserGame(
        user_id=user_id,
        game_id=game_id,
        game_title=game.title,
        game_image_url=game.image_url
    )
    db.session.add(new_game)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Database commit error: {str(e)}")
        return jsonify({"error": "Failed to add game"}), 500

    return jsonify(new_game.to_dict()), 201

# GET - Fetch all games
@game_routes.route('/all', methods=['GET'])
def get_all_games():
    try:
        games = Game.query.all()
        return jsonify([game.to_dict() for game in games]), 200
    except Exception as e:
        app.logger.error(f"Error fetching games: {str(e)}")
        return jsonify({"error": "Failed to fetch games"}), 500

@game_routes.route('/user/<int:user_id>', methods=['GET'])
def get_user_games(user_id):
    try:
        # Fetch UserGame entries directly to get the primary keys
        user_games = UserGame.query.filter(UserGame.user_id == user_id).all()

        # Check if user has no games
        if not user_games:
            return jsonify([]), 200  # Return an empty list if no games found

        # Prepare a list of dictionaries including UserGame details with primary key
        games_list = [user_game.to_dict() for user_game in user_games]

        return jsonify(games_list), 200
    except Exception as e:
        app.logger.error(f"Error fetching user games for user {user_id}: {str(e)}")
        return jsonify({"error": "Failed to fetch user games"}), 500

#UPDATE
@game_routes.route('/<int:game_id>', methods=['PUT'])
def update_game(game_id):
    game = UserGame.query.get(game_id)
    if game:
        # game.rank = request.json.get('rank', game.rank)
        game.description = request.json.get('description', game.description)
        db.session.commit()
        return jsonify(game.to_dict()), 200
    return jsonify({"error": "Game not found"}), 404

#DELETE
@game_routes.route('/<int:id>', methods=['DELETE'])
def delete_game(id):
    app.logger.debug(f"Received DELETE request for game with primary key ID: {id}")

    # Fetch the UserGame entry by primary key ID
    user_game = UserGame.query.get(id)

    if user_game:
        db.session.delete(user_game)
        try:
            db.session.commit()
            app.logger.info(f"Successfully deleted UserGame entry with primary key ID: {id}")
            return jsonify({"message": "Game deleted"}), 200
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Database commit error when deleting game: {str(e)}")
            return jsonify({"error": "Failed to delete game due to server error"}), 500
    else:
        app.logger.error(f"Game not found with primary key ID: {id}")
        return jsonify({"error": "Game not found"}), 404
