from flask import Blueprint, request, jsonify
from app.models import db, Message, Chat
from app.forms import MessageForm

message_routes = Blueprint('messages', __name__)

#CREATE
@message_routes.route('/', methods=['POST'])
def send_message():
    form = MessageForm()
    if form.validate_on_submit():
        new_message = Message(
            chat_id=form.chat_id.data,
            sender_id=form.sender_id.data,
            message=form.message.data
        )
        db.session.add(new_message)
        db.session.commit()
        return jsonify(new_message.to_dict()), 201
    return jsonify(form.errors), 400

#VIEW
@message_routes.route('/<int:chat_id>', methods=['GET'])
def get_messages(chat_id):
    messages = Message.query.filter_by(chat_id=chat_id).all()
    return jsonify([message.to_dict() for message in messages]), 200

#UPDATE
@message_routes.route('/<int:message_id>', methods=['PUT'])
def update_message(message_id):
    message = Message.query.get(message_id)
    if message:
        message.message = request.json.get('message', message.message)
        db.session.commit()
        return jsonify(message.to_dict()), 200
    return jsonify({"error": "Message not found"}), 404

#DELETE
@message_routes.route('/<int:message_id>', methods=['DELETE'])
def delete_message(message_id):
    message = Message.query.get(message_id)
    if message:
        db.session.delete(message)
        db.session.commit()
        return jsonify({"message": "Message deleted"}), 200
    return jsonify({"error": "Message not found"}), 404
