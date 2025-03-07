from Views.product import product_bp
from Views.stock import stock_bp
from Views.store import store_bp
from Views.supply_request import supply_request_bp
from Views.user import user_bp
from flask import Flask, Response, current_app, request, jsonify, url_for, redirect, session
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import check_password_hash
import os
import secrets
from datetime import timedelta
from authlib.integrations.flask_client import OAuth
import requests

# Import models and database
from models import db, User, Store, Product, Stock, SupplyRequest

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for cross-origin requests
CORS(app, resources={r"/*": {"origins": "*"}},
     expose_headers='Authorization', supports_credentials=True)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///localshop.db'
# Disable modification tracking
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CORS_HEADERS'] = 'application/json'


# Initialize database & migrations
db.init_app(app)
migrate = Migrate(app, db)  #

# google auth

oauth = OAuth(app)
# register a new client on google console and use thos credentials instead
google = oauth.register(
    'google',
    client_id='',
    client_secret='',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile',
        'prompt': 'select_account'
    },
)


@app.route('/auth/google/login')
def google_login():
    # Store the frontend callback URL in the session
    frontend_callback = request.args.get(
        'callback_url', 'http://localhost:5173/auth/callback')
    session['frontend_callback'] = frontend_callback

    # Redirect to Google for authentication
    redirect_uri = request.host_url.rstrip('/') + '/auth/google/callback'
    return google.authorize_redirect(redirect_uri)


@app.route('/auth/google/callback')
def google_callback():
    try:
        # Get token from Google
        token = google.authorize_access_token()
        user_info = token.get('userinfo')

        if not user_info or not user_info.get('email'):
            return jsonify({'error': 'Failed to get user info from Google'}), 400

        email = user_info.get('email')
        name = user_info.get('name', email.split('@')[0])

        # Check if user exists in your database
        user = User.query.filter_by(email=email).first()

        if not user:
            # Create new user
            user = User(
                username=name,
                email=email,
                password_hash=None,
                role='merchant',
                is_clerk=True
            )
            db.session.add(user)
            db.session.commit()

        # Create JWT token
        access_token = create_access_token(identity={'id': user.id})

        # Get the frontend callback URL from session
        frontend_callback = session.get(
            'frontend_callback', 'http://localhost:5173/auth/callback')

        # Redirect to frontend with auth data in fragment (more secure than query params)
        # Using fragment (#) instead of query params (?) prevents tokens from being logged in server logs
        auth_data = {
            'token': access_token,
            'username': name,
            'role': user.role.value
        }

        import json
        import urllib.parse

        # Encode auth data for URL
        encoded_data = urllib.parse.quote(json.dumps(auth_data))
        redirect_url = f"{frontend_callback}#{encoded_data}"

        return redirect(redirect_url)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Add a verification endpoint to check token validity
@app.route('/api/verify-token', methods=['GET'])
def verify_token():
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    return jsonify({
        'valid': True,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role
        }
    })

@app.before_request
def basic_authentication():
    if request.method.lower() == 'options':
        return Response()


# JWT configuration
app.config["JWT_SECRET_KEY"] = 'secret-key'  # Secure JWT secret key
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(
    hours=24)  # Token expiration time
jwt = JWTManager(app)  # Initialize JWTManager

# Secret key for session management
app.secret_key = secrets.token_hex(16)

# Import and register blueprints if they exist
app.register_blueprint(user_bp, url_prefix='/user')
app.register_blueprint(store_bp)
app.register_blueprint(product_bp)
app.register_blueprint(supply_request_bp, url_prefix='/supply_request')
app.register_blueprint(stock_bp, url_prefix='/stock')

# ✅ Run Flask application
if __name__ == '__main__':
    with app.app_context():  # Ensure database tables are created
        db.create_all()
    app.run(debug=True)
