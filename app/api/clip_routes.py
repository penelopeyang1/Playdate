from flask import Blueprint, request, jsonify
from app.models import db, Clip
from app.forms import ClipForm

clip_routes = Blueprint('clips', __name__)

#CREATE
@clip_routes.route('/', methods=['POST'])
def add_clip():
    form = ClipForm()
    if form.validate_on_submit():
        new_clip = Clip(
            title=form.title.data,
            description=form.description.data,
            video_url=form.video_url.data,
            creator_id=form.creator_id.data,
            game_id=form.game_id.data
        )
        db.session.add(new_clip)
        db.session.commit()
        return jsonify(new_clip.to_dict()), 201
    return jsonify(form.errors), 400

#VIEW
@clip_routes.route('/<int:user_id>', methods=['GET'])
def get_clips(user_id):
    clips = Clip.query.filter_by(creator_id=user_id).all()
    return jsonify([clip.to_dict() for clip in clips]), 200

#UPDATE
@clip_routes.route('/<int:clip_id>', methods=['PUT'])
def update_clip(clip_id):
    clip = Clip.query.get(clip_id)
    if clip:
        clip.title = request.json.get('title', clip.title)
        clip.description = request.json.get('description', clip.description)
        db.session.commit()
        return jsonify(clip.to_dict()), 200
    return jsonify({"error": "Clip not found"}), 404

#DELETE
@clip_routes.route('/<int:clip_id>', methods=['DELETE'])
def delete_clip(clip_id):
    clip = Clip.query.get(clip_id)
    if clip:
        db.session.delete(clip)
        db.session.commit()
        return jsonify({"message": "Clip deleted"}), 200
    return jsonify({"error": "Clip not found"}), 404
