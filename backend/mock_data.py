from models import db, Product
from app import app
import random

categories = ['Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Toys']
electronics = ['Smartphone', 'Laptop', 'Headphones', 'Smartwatch', 'Tablet']
books = ['Novel', 'Textbook', 'Biography', 'Cookbook', 'Fantasy']
clothing = ['T-Shirt', 'Jeans', 'Dress', 'Jacket', 'Sneakers']

def generate_mock_products():
    products = []
    
    for i in range(100):
        category = random.choice(categories)
        if category == 'Electronics':
            name = f"{random.choice(electronics)} {random.randint(1, 10)}"
        elif category == 'Books':
            name = f"{random.choice(books)} '{random.choice(['The', 'A', 'My'])} {random.choice(['Great', 'Amazing', 'Secret'])} {random.choice(['Story', 'Adventure', 'Life'])}'"
        elif category == 'Clothing':
            name = f"{random.choice(clothing)} ({random.choice(['Small', 'Medium', 'Large', 'XL'])})"
        else:
            name = f"{category} Item {i+1}"
            
        product = Product(
            name=name,
            price=round(random.uniform(5, 500), 2),
            description=f"This is a sample description for {name}. It's a wonderful product in the {category} category.",
            category=category,
            image_url=f"https://picsum.photos/200/200?random={i}",
            stock=random.randint(0, 100)
        )
        products.append(product)
    
    return products

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Only populate if database is empty
        if Product.query.count() == 0:
            products = generate_mock_products()
            db.session.bulk_save_objects(products)
            db.session.commit()
            print(f"Added {len(products)} mock products to the database.")
        
        # Add a test user
        if User.query.count() == 0:
            user = User(
                username="testuser",
                password=generate_password_hash("password123"),
                email="test@example.com"
            )
            db.session.add(user)
            db.session.commit()
            print("Added test user (username: testuser, password: password123)")
