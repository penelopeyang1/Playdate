from flask import Blueprint, request, jsonify
from app.models import db, Game
from app.forms import GameForm

game_routes = Blueprint('games', __name__)

#CREATE
@game_routes.route('/', methods=['POST'])
# def add_game():
#     form = GameForm()
#     if form.validate_on_submit():
#         new_game = UserGame(
#             user_id=form.user_id.data,
#             game_id=form.game_id.data,
#             rank=form.rank.data
#         )
#         db.session.add(new_game)
#         db.session.commit()
#         return jsonify(new_game.to_dict()), 201
#     return jsonify(form.errors), 400
def add_game():
    form = GameForm()
    if form.validate_on_submit():
        # Check if the game_id exists in the Game model
        game = Game.query.get(form.game_id.data)
        if not game:
            return jsonify({"error": "Game does not exist"}), 400

        # Check if the game is already added to the user's profile
        existing_game = UserGame.query.filter_by(
            user_id=form.user_id.data,
            game_id=form.game_id.data
        ).first()
        if existing_game:
            return jsonify({"error": "Game already added to profile"}), 400

        new_game = UserGame(
            user_id=form.user_id.data,
            game_id=form.game_id.data,
            rank=form.rank.data
        )
        db.session.add(new_game)
        db.session.commit()
        return jsonify(new_game.to_dict()), 201
    return jsonify(form.errors), 400

#VIEW
@game_routes.route('/<int:user_id>', methods=['GET'])
def get_games(user_id):
    games = UserGame.query.filter_by(user_id=user_id).all()
    return jsonify([game.to_dict() for game in games]), 200

#UPDATE
@game_routes.route('/<int:game_id>', methods=['PUT'])
def update_game(game_id):
    game = UserGame.query.get(game_id)
    if game:
        game.rank = request.json.get('rank', game.rank)
        # Add more fields to update as needed
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
