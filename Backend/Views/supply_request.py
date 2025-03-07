from flask import Blueprint, request, jsonify
from datetime import datetime
from models import db

# Define Blueprint for SupplyRequest
supply_request_bp = Blueprint('supply_request', __name__)

# Import the SupplyRequest model (assuming it's defined in a separate models file)
from models import SupplyRequest

# Helper function to validate required fields
def validate_fields(data, required_fields):
    return all(key in data for key in required_fields)

# Create a new Supply Request
@supply_request_bp.route('/', methods=['POST'])
def create_supply_request():
    data = request.get_json()
    if not data or not validate_fields(data, ['store_id', 'product_id', 'requested_quantity']):
        return jsonify({'error': 'Missing required fields'}), 400

    new_request = SupplyRequest(
        store_id=data['store_id'],
        product_id=data['product_id'],
        requested_quantity=data['requested_quantity'],
        received_quantity=data.get('received_quantity'),
        payment_status=data.get('payment_status', 'Pending'),
        status=data.get('status', 'Pending'),
        clerk_id=data.get('clerk_id')
    )

    db.session.add(new_request)
    db.session.commit()

    return jsonify({'message': 'Supply request created successfully', 'id': new_request.id}), 201

# Read a Supply Request
@supply_request_bp.route('/<int:request_id>', methods=['GET'])
def get_supply_request(request_id):
    request = SupplyRequest.query.get(request_id)
    if not request:
        return jsonify({'error': 'Supply request not found'}), 404

    return jsonify({
        'id': request.id,
        'store_id': request.store_id,
        'product_id': request.product_id,
        'requested_quantity': request.requested_quantity,
        'received_quantity': request.received_quantity,
        'payment_status': request.payment_status,
        'status': request.status,
        'requested_at': request.requested_at,
        'clerk_id': request.clerk_id
    }), 200

# Update a Supply Request
@supply_request_bp.route('/<int:request_id>', methods=['PUT'])
def update_supply_request(request_id):
    request = SupplyRequest.query.get(request_id)
    if not request:
        return jsonify({'error': 'Supply request not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    request.store_id = data.get('store_id', request.store_id)
    request.product_id = data.get('product_id', request.product_id)
    request.requested_quantity = data.get('requested_quantity', request.requested_quantity)
    request.received_quantity = data.get('received_quantity', request.received_quantity)
    request.payment_status = data.get('payment_status', request.payment_status)
    request.status = data.get('status', request.status)
    request.clerk_id = data.get('clerk_id', request.clerk_id)

    db.session.commit()

    return jsonify({'message': 'Supply request updated successfully'}), 200

# Delete a Supply Request
@supply_request_bp.route('/<int:request_id>', methods=['DELETE'])
def delete_supply_request(request_id):
    request = SupplyRequest.query.get(request_id)
    if not request:
        return jsonify({'error': 'Supply request not found'}), 404

    db.session.delete(request)
    db.session.commit()

    return jsonify({'message': 'Supply request deleted successfully'}), 200
