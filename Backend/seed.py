from app import app, db  # adjust import based on your structure
from models import User, Store, Product, Stock, Role

def seed_data():
    with app.app_context():
        db.drop_all()
        db.create_all()

  
        stores = [
            Store(name="SuperMart", address="123 Main Street, Nairobi", merchant_id=2),
            Store(name="FreshGrocers", address="456 Market Lane, Mombasa", merchant_id=2),
            Store(name="Tech Haven", address="789 Gadget Avenue, Kisumu", merchant_id=2)
        ]

        for store in stores:
            db.session.add(store)

        db.session.flush()  # Make sure stores have IDs

        products = [
            Product(name="Maize Flour (2kg)", buying_price=100.00, selling_price=130.00, store_id=stores[0].id),
            Product(name="Cooking Oil (1L)", buying_price=250.00, selling_price=300.00, store_id=stores[0].id),
            Product(name="Toothpaste (100ml)", buying_price=50.00, selling_price=75.00, store_id=stores[0].id),

            Product(name="Tomatoes (1kg)", buying_price=120.00, selling_price=150.00, store_id=stores[1].id),
            Product(name="Potatoes (1kg)", buying_price=80.00, selling_price=100.00, store_id=stores[1].id),
            Product(name="Onions (1kg)", buying_price=70.00, selling_price=90.00, store_id=stores[1].id),

            Product(name="Smartphone Charger", buying_price=300.00, selling_price=500.00, store_id=stores[2].id),
            Product(name="Wireless Mouse", buying_price=400.00, selling_price=700.00, store_id=stores[2].id),
            Product(name="Power Bank (10,000 mAh)", buying_price=1500.00, selling_price=2000.00, store_id=stores[2].id),
        ]

        for product in products:
            db.session.add(product)

        db.session.flush()  # Make sure stores have IDs


        # Add stock for each product
        for product in products:
            stock = Stock(product_id=product.id, quantity=100, quantity_spoilt=0)
            db.session.add(stock)

        db.session.commit()
        print("✅ Seed data inserted successfully!")


if __name__ == "__main__":
    seed_data()
