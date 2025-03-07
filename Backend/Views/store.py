import jwt
from flask import request
from flask import Blueprint, request, jsonify
from models import Store, db, Product, SupplyRequest
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import CORS, cross_origin  # Import CORS
from flask_jwt_extended import JWTManager

store_bp = Blueprint('store', __name__, url_prefix='/stores')

# CORS(store_bp,  supports_credentials=True)
@store_bp.route('/all', methods=['GET'])
@jwt_required()
def get_stores():
    # If token is expired or invalid, it will return an error
    identity = get_jwt_identity()
    print("JWT Identity:", identity)
    merchant_id = identity['id']
    stores = Store.query.filter_by(merchant_id=merchant_id).all()

    return jsonify([
        {'id': store.id, 'name': store.name, 'address': store.address,
            'product_count': Product.query.filter_by(store_id=store.id).count(),
         'supply_request_count': SupplyRequest.query.filter_by(store_id=store.id).count()
         }
        for store in stores
    ])


@store_bp.route('/<int:store_id>', methods=['GET'])
def get_store(store_id):
    store = Store.query.get_or_404(store_id)
    products = Product.query.filter_by(store_id=store_id).all()
    supply_requests = SupplyRequest.query.filter_by(store_id=store_id).all()
    return jsonify({
        'id': store.id,
        'name': store.name,
        'address': store.address,
        'products': [{'id': product.id, 'name': product.name, 'buying_price': float(product.buying_price), 'selling_price': float(product.selling_price)} for product in products],
        'supply_requests': [{'id': request.id, 'product_id': request.product_id, 'requested_quantity': request.requested_quantity, 'received_quantity': request.received_quantity} for request in supply_requests]
    })


@store_bp.route('/create', methods=['POST'])
@jwt_required()
def create_store():
    identity = get_jwt_identity()
    merchant_id = identity['id']


    data = request.get_json()
    new_store = Store(
        name=data['name'], address=data['address'], merchant_id=merchant_id)
    db.session.add(new_store)
    db.session.commit()
    return jsonify({'id': new_store.id, 'name': new_store.name, 'address': new_store.address}), 201


@store_bp.route('/<int:store_id>', methods=['PUT'])
def update_store(store_id):
    store = Store.query.get_or_404(store_id)
    data = request.get_json()
    store.name = data.get('name', store.name)
    store.address = data.get('address', store.address)
    db.session.commit()
    return jsonify({'id': store.id, 'name': store.name, 'address': store.address})


@store_bp.route('/<int:store_id>', methods=['DELETE'])
def delete_store(store_id):
    store = Store.query.get_or_404(store_id)
    db.session.delete(store)
    db.session.commit()
    return '', 204
