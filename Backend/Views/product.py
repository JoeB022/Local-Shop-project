from flask import Blueprint, request, jsonify
from flask_cors import CORS
from models import Product, db

product_bp = Blueprint('product', __name__, url_prefix='/products')
CORS(product_bp)

@product_bp.route('/', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([{'id': product.id, 'name': product.name, 'buying_price': float(product.buying_price), 'selling_price': float(product.selling_price)} for product in products])

@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify({'id': product.id, 'name': product.name, 'buying_price': float(product.buying_price), 'selling_price': float(product.selling_price)})

@product_bp.route('/create', methods=['POST'])
def create_product():
    data = request.get_json()
    new_product = Product(name=data['name'], buying_price=data['buying_price'], selling_price=data['selling_price'], store_id=data['store_id'])
    db.session.add(new_product)
    db.session.commit()
    return jsonify({'id': new_product.id, 'name': new_product.name, 'buying_price': float(new_product.buying_price), 'selling_price': float(new_product.selling_price)}), 201

@product_bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    product.name = data.get('name', product.name)
    product.buying_price = data.get('buying_price', product.buying_price)
    product.selling_price = data.get('selling_price', product.selling_price)
    db.session.commit()
    return jsonify({'id': product.id, 'name': product.name, 'buying_price': float(product.buying_price), 'selling_price': float(product.selling_price)})

@product_bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return '', 204