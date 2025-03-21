from flask import Flask, Response, current_app, request, jsonify, url_for, redirect, session
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from flask_cors import CORS
from werkzeug.security import check_password_hash
import os
import secrets
from datetime import timedelta
from authlib.integrations.flask_client import OAuth
import requests
import json
import urllib.parse

# Import models and database
from models import db, User, Store, Product, Stock, SupplyRequest

# Import blueprints
from Views.product import product_bp
from Views.stock import stock_bp
from Views.store import store_bp
from Views.supply_request import supply_request_bp
from Views.user import user_bp

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for cross-origin requests
CORS(app, resources={r"/*": {"origins": "*"}}, expose_headers='Authorization', supports_credentials=True)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localshop_db_user:6S8MtuRbXNtzy11vOZf4eyxuJyNlAGAR@dpg-cv5n6ubtq21c73da64m0-a.oregon-postgres.render.com/localshop_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CORS_HEADERS'] = 'application/json'

# Initialize database & migrations
db.init_app(app)
migrate = Migrate(app, db)

# Google OAuth Configuration
oauth = OAuth(app)
google = oauth.register(
    'google',
    client_id='YOUR_GOOGLE_CLIENT_ID',  # Replace with actual client ID
    client_secret='YOUR_GOOGLE_CLIENT_SECRET',  # Replace with actual secret
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile', 'prompt': 'select_account'}
)

@app.route('/auth/google/login')
def google_login():
    # Store the frontend callback URL in the session
    frontend_callback = request.args.get('callback_url', 'http://localshop-inventory-system.vercel.app/auth/callback')
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
        frontend_callback = session.get('frontend_callback', 'http://localshop-inventory-system.vercel.app/auth/callback')

        # Securely encode authentication data
        auth_data = {'token': access_token, 'username': name, 'role': user.role.value}
        encoded_data = urllib.parse.quote(json.dumps(auth_data))
        redirect_url = f"{frontend_callback}#{encoded_data}"

        return redirect(redirect_url)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Token verification endpoint
@app.route('/api/verify-token', methods=['GET'])
@jwt_required()  # Ensures token is required
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
app.config["JWT_SECRET_KEY"] = 'your-secure-secret-key'  # Change this to a strong secret
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)  # Token expiration time
jwt = JWTManager(app)

# Secret key for session management
app.secret_key = secrets.token_hex(16)

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/user')
app.register_blueprint(store_bp)
app.register_blueprint(product_bp)
app.register_blueprint(supply_request_bp, url_prefix='/supply_request')
app.register_blueprint(stock_bp, url_prefix='/stock')

# Run Flask application
if __name__ == '__main__':
    app.run(debug=True)
