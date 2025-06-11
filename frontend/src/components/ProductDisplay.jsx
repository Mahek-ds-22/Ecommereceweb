import React from 'react';

const ProductDisplay = ({ product, onBack, onAddToCart }) => {
    return (
        <div className="product-display">
            <button onClick={onBack} className="back-button">← Back to chat</button>
            
            <div className="product-details">
                <img src={product.image_url} alt={product.name} />
                <div className="product-info">
                    <h2>{product.name}</h2>
                    <p className="price">${product.price}</p>
                    <p className="category">{product.category}</p>
                    <p className="description">{product.description}</p>
                    
                    <button onClick={onAddToCart} className="add-to-cart">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDisplay;
