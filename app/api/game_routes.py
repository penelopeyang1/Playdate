from flask import Blueprint, request, jsonify
from app.models import db, Game
from app.forms import GameForm

game_routes = Blueprint('games', __name__)

#CREATE - for adding games to user profile
@game_routes.route('/', methods=['POST'])
def add_game():
    form = GameForm()
    if form.validate_on_submit():
        game = Game.query.get(form.game_id.data)
        if not game:
            return jsonify({"error": "Game does not exist"}), 400

        existing_game = UserGame.query.filter_by(
            user_id=form.user_id.data,
            game_id=form.game_id.data
        ).first()
        if existing_game:
            return jsonify({"error": "Game already added to profile"}), 400

        new_game = UserGame(
            user_id=form.user_id.data,
            game_id=form.game_id.data,
            description=form.description.data
        )
        db.session.add(new_game)
        db.session.commit()
        return jsonify(new_game.to_dict()), 201
    return jsonify(form.errors), 400

# GET - Fetch all games
# @game_routes.route('/all', methods=['GET'])
# def get_all_games():
#     try:
#         games = Game.query.all()
#         # print([game.to_dict() for game in games])
#         app.logger.info("Fetched games:", [game.to_dict() for game in games])
#         return jsonify([game.to_dict() for game in games]), 200
#     except Exception as e:
#         app.logger.error(f"Error fetching games: {str(e)}")
#         return jsonify({"error": "Failed to fetch games"}), 500
@game_routes.route('/all', methods=['GET'])
def get_all_games():
    try:
        games = Game.query.all()
        return jsonify([game.to_dict() for game in games]), 200
    except Exception as e:
        app.logger.error(f"Error fetching games: {str(e)}")
        return jsonify({"error": "Failed to fetch games"}), 500

# GET - Fetch games for a specific user
@game_routes.route('/user/<int:user_id>', methods=['GET'])
def get_user_games(user_id):
    try:
        games = UserGame.query.filter_by(user_id=user_id).all()
        return jsonify([game.to_dict() for game in games]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
@game_routes.route('/<int:game_id>', methods=['DELETE'])
def delete_game(game_id):
    game = UserGame.query.get(game_id)
    if game:
        db.session.delete(game)
        db.session.commit()
        return jsonify({"message": "Game deleted"}), 200
    return jsonify({"error": "Game not found"}), 404
