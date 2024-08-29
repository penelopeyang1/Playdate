import os
from flask import Flask, render_template, request, session, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from .models import db, User
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.match_routes import match_routes
from .api.game_routes import game_routes
from .api.clip_routes import clip_routes
from .api.message_routes import message_routes
from .seeds import seed_commands
from .config import Config

app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='/')

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

# Configuration
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
Migrate(app, db)

# # Tell flask about our seed commands
app.cli.add_command(seed_commands)

# Register Blueprints
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(match_routes, url_prefix='/api/matches')
app.register_blueprint(game_routes, url_prefix='/api/games')
app.register_blueprint(clip_routes, url_prefix='/api/clips')
app.register_blueprint(message_routes, url_prefix='/api/messages')

# CORS
CORS(app)

@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            return redirect(url, code=301)

@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get('FLASK_ENV') == 'production' else None,
        httponly=True
    )
    return response

@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = {
        rule.rule: [
            [method for method in rule.methods if method in acceptable_methods],
            app.view_functions[rule.endpoint].__doc__
        ]
        for rule in app.url_map.iter_rules()
        if rule.endpoint != 'static'
    }
    return jsonify(route_list)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    """
    This route will direct to the public directory in our
    React builds in the production environment for favicon
    or index.html requests.
    """
    if path.startswith('api/'):
        # Prevent serving React app for API routes
        return jsonify({"error": "Not found"}), 404
    elif path == 'favicon.ico':
        return app.send_from_directory(app.static_folder, 'favicon.ico')
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404

# # @app.errorhandler(404)
# # def not_found(e):
# #     return app.send_static_file('index.html')
