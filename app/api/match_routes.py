from flask import Blueprint, request, jsonify
from app.models import db, Match, User, MatchRequest
from app.forms import MatchForm

match_routes = Blueprint('matches', __name__)

# CREATE a new match manually using MatchForm (Optional)
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

# Route for liking a user and potentially creating a match
@match_routes.route('/like', methods=['POST'])
def create_like():
    data = request.get_json()
    requester_id = data['userId']
    requestee_id = data['likedUserId']

    # Check if a like already exists
    existing_request = MatchRequest.query.filter_by(requester_id=requester_id, requestee_id=requestee_id).first()
    if not existing_request:
        # Create a new like entry
        new_like = MatchRequest(requester_id=requester_id, requestee_id=requestee_id, status='liked')
        db.session.add(new_like)
        db.session.commit()
        existing_request = new_like

    # Check if the other user has also liked back (mutual like)
    mutual_like = MatchRequest.query.filter_by(requester_id=requestee_id, requestee_id=requester_id, status='liked').first()
    if mutual_like:
        # Delete the match requests since we are creating a match now
        db.session.delete(existing_request)
        db.session.delete(mutual_like)

        # Create a new entry in the matches table
        new_match = Match(
            user_one_id=min(requester_id, requestee_id),
            user_two_id=max(requester_id, requestee_id),
            status='matched'
        )
        db.session.add(new_match)
        db.session.commit()
        print(f"New match created between {requester_id} and {requestee_id}")

    return jsonify({"message": "Like processed", "status": "matched" if mutual_like else "liked"}), 201

# Route for disliking a user
@match_routes.route('/dislike', methods=['POST'])
def dislike_user():
    data = request.json
    requester_id = data.get('userId')
    requestee_id = data.get('dislikedUserId')

    # Create or update match request to 'disliked'
    match_request = MatchRequest.query.filter_by(requester_id=requester_id, requestee_id=requestee_id).first()

    if match_request:
        # Update existing match request to 'disliked'
        match_request.status = 'disliked'
        db.session.commit()
        return jsonify(match_request.to_dict()), 200
    else:
        # Create a new match request with status 'disliked'
        new_request = MatchRequest(
            requester_id=requester_id,
            requestee_id=requestee_id,
            status='disliked'
        )
        db.session.add(new_request)
        db.session.commit()
        return jsonify(new_request.to_dict()), 201

# Fetch potential matches for a user
@match_routes.route('/potential_matches', methods=['GET'])
def get_potential_matches():
    user_id = request.args.get('userId')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    user_id = int(user_id)

    # Fetch all match requests involving the current user
    match_requests = MatchRequest.query.filter(
        (MatchRequest.requester_id == user_id) |
        (MatchRequest.requestee_id == user_id)
    ).all()

    # Extract IDs to exclude based on the match requests
    excluded_user_ids = set()
    liked_me_ids = set()
    for match_request in match_requests:
        if match_request.status == 'liked' and match_request.requestee_id == user_id:
            liked_me_ids.add(match_request.requester_id)
        if match_request.status in ['liked', 'disliked', 'matched']:
            if match_request.requester_id == user_id:
                excluded_user_ids.add(match_request.requestee_id)
            elif match_request.requestee_id == user_id:
                excluded_user_ids.add(match_request.requester_id)

    # Fetch users who are potential matches and include those who liked the user
    potential_matches = User.query.filter(
        User.id != user_id,
        (~User.id.in_(excluded_user_ids)) | User.id.in_(liked_me_ids)
    ).all()

    response = []
    for user in potential_matches:
        # Check if the current user has liked this potential match
        likedByCurrentUser = MatchRequest.query.filter_by(
            requester_id=user_id,
            requestee_id=user.id,
            status='liked'
        ).first() is not None

        # Check if the potential match has liked the current user
        likedUserLikedBack = MatchRequest.query.filter_by(
            requester_id=user.id,
            requestee_id=user_id,
            status='liked'
        ).first() is not None

        # Print debug statements to verify flags
        print(f"User {user_id} -> User {user.id}: likedByCurrentUser={likedByCurrentUser}, likedUserLikedBack={likedUserLikedBack}")

        # Only add to response if not already matched
        response.append({
            **user.to_dict(),
            'likedByCurrentUser': likedByCurrentUser,
            'likedUserLikedBack': likedUserLikedBack
        })

    return jsonify(response), 200

# Update a match status
@match_routes.route('/<int:match_id>', methods=['PUT'])
def update_match(match_id):
    match = Match.query.get(match_id)
    if match:
        match.status = request.json.get('status', match.status)
        db.session.commit()
        return jsonify(match.to_dict()), 200
    return jsonify({"error": "Match not found"}), 404

# DELETE a match
@match_routes.route('/<int:match_id>', methods=['DELETE'])
def delete_match(match_id):
    print(f"Attempting to delete match with ID: {match_id}")

    # Retrieve the match from the matches table
    match = Match.query.get(match_id)

    if match:
        # Delete the match from the matches table
        db.session.delete(match)
        db.session.commit()
        print(f"Match with ID {match_id} deleted successfully from matches table.")

        # Update the corresponding match_requests back to 'liked' or remove if necessary
        match_requests = MatchRequest.query.filter(
            ((MatchRequest.requester_id == match.user_one_id) & (MatchRequest.requestee_id == match.user_two_id)) |
            ((MatchRequest.requester_id == match.user_two_id) & (MatchRequest.requestee_id == match.user_one_id))
        ).all()

        for request in match_requests:
            # Revert status to 'liked' or delete request based on your business logic
            request.status = 'liked'  # Reverting to 'liked', or you can delete it
            # db.session.delete(request)  # Uncomment if you prefer to delete the match request
            db.session.commit()

        return jsonify({"message": "Match and related requests updated/deleted successfully."}), 200

    print(f"Match with ID: {match_id} not found")
    return jsonify({"error": "Match not found"}), 404

# Fetch users who liked the current user
@match_routes.route('/liked_me', methods=['GET'])
def get_users_who_liked_me():
    user_id = request.args.get('userId')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    liked_requests = MatchRequest.query.filter_by(
        requestee_id=user_id, status='liked'
    ).all()

    liked_user_ids = [req.requester_id for req in liked_requests]

    liked_users = User.query.filter(User.id.in_(liked_user_ids)).all()

    return jsonify([user.to_dict() for user in liked_users]), 200

@match_routes.route('/matches', methods=['GET'])
def get_user_matches():
    user_id = request.args.get('userId')

    # Validate the user_id
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    user_id = int(user_id)

    # Query the Match table for all matches involving the user
    matches = Match.query.filter(
        (Match.user_one_id == user_id) | (Match.user_two_id == user_id)
    ).all()

    # Prepare response data by including details of the matched users
    response = []
    for match in matches:
        # Determine the other user in the match
        matched_user_id = match.user_two_id if match.user_one_id == user_id else match.user_one_id
        matched_user = User.query.get(matched_user_id)

        if matched_user:
            # Combine match data and matched user details into the response
            response.append({
                "match": match.to_dict(),
                "matched_user": matched_user.to_dict(),
            })
        else:
            print(f"User with ID {matched_user_id} not found in database.")

    # Return the list of matches along with associated user data
    return jsonify(response), 200

# Fetch users liked by the current user
@match_routes.route('/liked_by_me', methods=['GET'])
def get_users_liked_by_me():
    user_id = request.args.get('userId')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    liked_requests = MatchRequest.query.filter_by(
        requester_id=user_id, status='liked'
    ).all()

    liked_user_ids = [req.requestee_id for req in liked_requests]

    liked_users = User.query.filter(User.id.in_(liked_user_ids)).all()

    return jsonify([user.to_dict() for user in liked_users]), 200

@match_routes.route('/matches', methods=['GET'])
def get_matches():
    user_id = request.args.get('userId')

    if not user_id:
        return jsonify([]), 400  # Return an empty list if no userId is provided

    matches = Match.query.filter(
        (Match.user_one_id == user_id) | (Match.user_two_id == user_id)
    ).all()

    print('Matches fetched from DB:', [match.to_dict() for match in matches]) # Debug log

    # Return a list of matches
    return jsonify([match.to_dict() for match in matches]), 200

@match_routes.route('/<int:match_id>/nickname', methods=['PUT'])
def update_match_nickname(match_id):
    data = request.get_json()
    nickname = data.get('nickname')

    match = Match.query.get(match_id)
    if not match:
        return jsonify({"error": "Match not found"}), 404

    match.nickname = nickname
    db.session.commit()

    return jsonify(match.to_dict()), 200
