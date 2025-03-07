from flask import Blueprint, request, jsonify,url_for,redirect
from models import User, db, Role
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import re
from enum import Enum

user_bp = Blueprint('user', __name__, url_prefix='/user')

def role_required(allowed_roles):
    def decorator(func):
        @wraps(func)
        @jwt_required()
        def wrapper(*args, **kwargs):
            current_user = get_jwt_identity()
            user = User.query.get(current_user['id'])
            if not user or user.role.value not in allowed_roles:
                return jsonify({'error': 'Unauthorized access'}), 403
            return func(*args, **kwargs)
        return wrapper
    return decorator


# Ensure Role Enum is correctly defined
class Role(Enum):
    admin = "admin"
    clerk = "clerk"
    merchant = "merchant"

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print("Received data:", data)  # ✅ Debugging line

    # Validate required fields
    required_fields = ['username', 'email', 'password', 'role']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        print(f"Validation error: Missing fields - {', '.join(missing_fields)}")
        return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400

    # Extract fields after checking for missing values
    username = data['username']
    email = data['email']
    password = data['password']
    role_str = data['role'].lower()  # Normalize role input

    # Validate email format using regex
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if not re.match(email_regex, email):
        print(f"Validation error: Invalid email format - {email}")
        return jsonify({'error': 'Invalid email format'}), 400

    # Check if username already exists
    if User.query.filter_by(username=username).first():
        print(f"Validation error: Username '{username}' already exists.")
        return jsonify({'error': 'Username already exists'}), 400

    # Check if email already exists
    if User.query.filter_by(email=email).first():
        print(f"Validation error: Email '{email}' is already registered.")
        return jsonify({'error': 'Email is already registered'}), 400

    # Validate role
    if role_str not in ['admin', 'clerk', 'merchant']:
        print(f"Validation error: Invalid role '{role_str}' provided.")
        return jsonify({'error': 'Invalid role provided. Allowed roles: admin, clerk, merchant'}), 400

    # Convert role string to Enum (if using an Enum for roles)
    try:
        role = Role(role_str)  # Convert role string to Enum
    except ValueError:
        return jsonify({'error': 'Invalid role provided. Allowed roles: admin, clerk, merchant'}), 400

    # Hash password
    hashed_password = generate_password_hash(password)

    # Create new user
    new_user = User(
        username=username,
        email=email,  # Store email
        password_hash=hashed_password,
        role=role.value,  # Store as string in DB
        is_clerk=(role == Role.clerk)  # Set is_clerk flag if applicable
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': f'User {username} registered successfully as {role.value}'}), 201

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Check if email and password are provided
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing email or password'}), 400

    email = data['email'].strip().lower()  # Normalize email input
    password = data['password']

    # Fetch user from database
    user = User.query.filter_by(email=email).first()

    if not user:
        print(f"Login failed: User with email {email} not found.")  # Debugging
        return jsonify({'error': 'Invalid email or password'}), 401

    # Verify password
    if not check_password_hash(user.password_hash, password):
        print(f"Login failed: Incorrect password for {email}")  # Debugging
        return jsonify({'error': 'Invalid email or password'}), 401

    # Generate access token
    access_token = create_access_token(identity={'id': user.id, 'role': user.role.value})
    
    print(f"User {email} logged in successfully as {user.role.value}")  # Debugging

    return jsonify({
        'message': f'Welcome {user.username}, you are logged in!',
        'access_token': access_token,
        'role': user.role.value
    }), 200


@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    user = User.query.get_or_404(current_user['id'])
    return jsonify({
        'id': user.id,
        'username': user.username,
        'role': user.role.value,
        'is_clerk': user.is_clerk
    })

@user_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    if 'username' in data:
        user.username = data['username']
    if 'password' in data:
        user.password_hash = generate_password_hash(data['password'])
    if 'role' in data:
        try:
            user.role = Role(data['role'])
        except ValueError:
            return jsonify({'error': 'Invalid role'}), 400
    user.is_clerk = data.get('is_clerk', user.is_clerk)
    
    db.session.commit()
    return jsonify({'message': 'User updated successfully'})

@user_bp.route('/<int:user_id>', methods=['DELETE'])
@role_required(['admin'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'})

@user_bp.route('/admin-data', methods=['GET'])
@role_required(['admin'])
def admin_data():
    return jsonify({'message': 'Admin access granted'}), 200

@user_bp.route('/merchant-data', methods=['GET'])
@role_required(['merchant'])
def merchant_data():
    return jsonify({'message': 'Merchant access granted'}), 200

@user_bp.route('/clerk-data', methods=['GET'])
@role_required(['clerk'])
def clerk_data():
    return jsonify({'message': 'Clerk access granted'}), 200

@user_bp.route('/all-users', methods=['GET'])
@role_required(['admin'])
def get_users():
    users = User.query.all()
    return jsonify([{
        'id': user.id,
        'username': user.username,
        'role': user.role.value,
        'is_clerk': user.is_clerk
    } for user in users])
