from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Product, User
import json
from datetime import datetime
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = 3600  # 1 hour session lifetime

CORS(app, supports_credentials=True)
db.init_app(app)

# Initialize database
with app.app_context():
    db.create_all()

# Authentication middleware
@app.before_request
def check_auth():
    if request.endpoint not in ['login', 'register', 'static'] and not session.get('logged_in'):
        return jsonify({"error": "Unauthorized"}), 401

# User routes
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password, data['password']):
        session['logged_in'] = True
        session['user_id'] = user.id
        session.permanent = True
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')
    
    new_user = User(
        username=data['username'],
        password=hashed_password,
        email=data['email']
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully"}), 201

# Chatbot routes
@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    response = process_message(user_message)
    return jsonify({"response": response})

def process_message(message):
    message = message.lower()
    
    # Handle greetings
    if any(word in message for word in ['hi', 'hello', 'hey']):
        return "Hello! Welcome to our e-commerce store. How can I help you today?"
    
    # Handle product search
    elif 'search' in message or 'find' in message:
        category = extract_category(message)
        if category:
            products = Product.query.filter(Product.category.ilike(f'%{category}%')).limit(5).all()
            if products:
                product_list = "\n".join([f"{p.name} - ${p.price}" for p in products])
                return f"Here are some {category} products:\n{product_list}\nWould you like more details about any of these?"
            else:
                return f"Sorry, we couldn't find any {category} products. Would you like to try another category?"
        else:
            return "What type of products are you looking for? Please specify a category."
    
    # Handle product details
    elif 'details' in message or 'about' in message:
        product_name = extract_product_name(message)
        if product_name:
            product = Product.query.filter(Product.name.ilike(f'%{product_name}%')).first()
            if product:
                return f"Here are details for {product.name}:\nPrice: ${product.price}\nDescription: {product.description}\nCategory: {product.category}\nWould you like to add this to your cart?"
            else:
                return "Sorry, I couldn't find that product. Could you be more specific?"
        else:
            return "Which product would you like details about?"
    
    # Handle cart operations
    elif 'cart' in message or 'add' in message or 'buy' in message:
        return "I can help you with your cart. Would you like to add an item, view your cart, or proceed to checkout?"
    
    # Default response
    else:
        return "I'm here to help with your shopping needs. You can ask me to search for products, get product details, or help with your cart."

def extract_category(message):
    # Simple NLP to extract product category
    categories = ['electronics', 'books', 'clothing', 'textiles', 'furniture']
    for category in categories:
        if category in message:
            return category
    return None

def extract_product_name(message):
    # Extract product name from message
    words = message.split()
    for i, word in enumerate(words):
        if word in ['about', 'details', 'for'] and i+1 < len(words):
            return ' '.join(words[i+1:])
    return None

# Product routes
@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    if category:
        products = Product.query.filter(Product.category.ilike(f'%{category}%')).all()
    else:
        products = Product.query.limit(20).all()
    
    products_list = [{
        'id': p.id,
        'name': p.name,
        'price': p.price,
        'description': p.description,
        'category': p.category,
        'image_url': p.image_url
    } for p in products]
    
    return jsonify(products_list)

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    if product:
        return jsonify({
            'id': product.id,
            'name': product.name,
            'price': product.price,
            'description': product.description,
            'category': product.category,
            'image_url': product.image_url
        })
    return jsonify({"error": "Product not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
