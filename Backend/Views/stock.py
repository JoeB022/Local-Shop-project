from flask import Blueprint, request, jsonify
from datetime import datetime
from models import db

# Define Blueprint for Stock
stock_bp = Blueprint('stock', __name__)

# Import the Stock model (assuming it's defined in a separate models file)
from models import Stock

# Helper function to validate required fields
def validate_fields(data, required_fields):
    return all(key in data for key in required_fields)

# Create a new Stock entry
@stock_bp.route('/', methods=['POST'])
def create_stock():
    data = request.get_json()
    if not data or not validate_fields(data, ['product_id', 'quantity']):
        return jsonify({'error': 'Missing required fields'}), 400

    new_stock = Stock(
        product_id=data['product_id'],
        quantity=data['quantity'],
        quantity_spoilt=data.get('quantity_spoilt', 0)
    )

    db.session.add(new_stock)
    db.session.commit()

    return jsonify({'message': 'Stock created successfully', 'id': new_stock.id}), 201

# Read a Stock entry
@stock_bp.route('/<int:stock_id>', methods=['GET'])
def get_stock(stock_id):
    stock = Stock.query.get(stock_id)
    if not stock:
        return jsonify({'error': 'Stock not found'}), 404

    return jsonify({
        'id': stock.id,
        'product_id': stock.product_id,
        'quantity': stock.quantity,
        'quantity_spoilt': stock.quantity_spoilt,
        'last_updated': stock.last_updated
    }), 200

# Update a Stock entry
@stock_bp.route('/<int:stock_id>', methods=['PUT'])
def update_stock(stock_id):
    stock = Stock.query.get(stock_id)
    if not stock:
        return jsonify({'error': 'Stock not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    stock.product_id = data.get('product_id', stock.product_id)
    stock.quantity = data.get('quantity', stock.quantity)
    stock.quantity_spoilt = data.get('quantity_spoilt', stock.quantity_spoilt)
    stock.last_updated = datetime.utcnow()

    db.session.commit()

    return jsonify({'message': 'Stock updated successfully'}), 200

# Delete a Stock entry
@stock_bp.route('/<int:stock_id>', methods=['DELETE'])
def delete_stock(stock_id):
    stock = Stock.query.get(stock_id)
    if not stock:
        return jsonify({'error': 'Stock not found'}), 404

    db.session.delete(stock)
    db.session.commit()

    return jsonify({'message': 'Stock deleted successfully'}), 200
