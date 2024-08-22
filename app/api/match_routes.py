from flask import Blueprint, request, jsonify
from app.models import db, Match, User
from app.forms import MatchForm

match_routes = Blueprint('matches', __name__)

#CREATE
@match_routes.route('/', methods=['POST'])
def create_match():
    form = MatchForm()
    if form.validate_on_submit():
        new_match = Match(
            user_one_id=form.user_one_id.data,
            user_two_id=form.user_two_id.data,
            status=form.status.data
        )
        db.session.add(new_match)
        db.session.commit()
        return jsonify(new_match.to_dict()), 201
    return jsonify(form.errors), 400

#VIEW
@match_routes.route('/', methods=['GET'])
def get_matches():
    matches = Match.query.all()
    return jsonify([match.to_dict() for match in matches]), 200

#UPDATE
@match_routes.route('/<int:match_id>', methods=['PUT'])
def update_match(match_id):
    match = Match.query.get(match_id)
    if match:
        match.status = request.json.get('status', match.status)
        db.session.commit()
        return jsonify(match.to_dict()), 200
    return jsonify({"error": "Match not found"}), 404

#DELETE
@match_routes.route('/<int:match_id>', methods=['DELETE'])
def delete_match(match_id):
    match = Match.query.get(match_id)
    if match:
        db.session.delete(match)
        db.session.commit()
        return jsonify({"message": "Match deleted"}), 200
    return jsonify({"error": "Match not found"}), 404
