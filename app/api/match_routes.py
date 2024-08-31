from flask import Blueprint, request, jsonify
from app.models import db, Match, User, MatchRequest
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
@match_routes.route('/potential_matches', methods=['GET'])
def get_potential_matches():
    user_id = request.args.get('userId', type=int)
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    #get user IDs of matches where the logged-in user is either user_one_id or user_two_id
    matched_user_ids = db.session.query(Match.user_one_id).filter(Match.user_two_id == user_id).all()
    matched_user_ids.extend(db.session.query(Match.user_two_id).filter(Match.user_one_id == user_id).all())
    matched_user_ids = {user_id for user_id, in matched_user_ids}

    #get user IDs of pending match requests where the logged-in user is either requester_id or requestee_id
    pending_request_ids = db.session.query(MatchRequest.requester_id).filter(
        MatchRequest.requestee_id == user_id, MatchRequest.status == 'pending'
    ).all()
    pending_request_ids.extend(db.session.query(MatchRequest.requestee_id).filter(
        MatchRequest.requester_id == user_id, MatchRequest.status == 'pending'
    ).all())
    pending_request_ids = {user_id for user_id, in pending_request_ids}

    excluded_user_ids = matched_user_ids.union(pending_request_ids)

    potential_matches = User.query.filter(
        User.id != user_id,
        User.id.notin_(excluded_user_ids)
    ).all()

    return jsonify([user.to_dict() for user in potential_matches]), 200

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
