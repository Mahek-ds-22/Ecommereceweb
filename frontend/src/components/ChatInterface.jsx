import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ProductDisplay from './ProductDisplay';

const ChatInterface = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const messagesEndRef = useRef(null);
    
    // Initial greeting
    useEffect(() => {
        addMessage("bot", "Hello! Welcome to our e-commerce store. How can I help you today?");
    }, []);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const addMessage = (sender, text) => {
        const timestamp = new Date().toLocaleTimeString();
        setMessages(prev => [...prev, { sender, text, timestamp }]);
    };
    
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;
        
        // Add user message
        addMessage("user", inputMessage);
        setInputMessage('');
        
        try {
            // Send to backend
            const response = await axios.post('http://localhost:5000/api/chat', {
                message: inputMessage
            }, { withCredentials: true });
            
            // Add bot response
            addMessage("bot", response.data.response);
            
            // If the response suggests products, fetch them
            if (response.data.response.includes('Here are some')) {
                const category = inputMessage.toLowerCase().includes('electronics') ? 'Electronics' :
                                inputMessage.toLowerCase().includes('books') ? 'Books' :
                                inputMessage.toLowerCase().includes('clothing') ? 'Clothing' : '';
                if (category) {
                    fetchProducts(category);
                }
            }
        } catch (error) {
            addMessage("bot", "Sorry, I encountered an error. Please try again.");
            console.error("Chat error:", error);
        }
    };
    
    const fetchProducts = async (category) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/products?category=${category}`);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
    
    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        addMessage("user", `Tell me more about ${product.name}`);
        // In a real app, we would send this to the backend
        addMessage("bot", `Here are details for ${product.name}:
Price: $${product.price}
Description: ${product.description}
Would you like to add this to your cart?`);
    };
    
    const resetChat = () => {
        setMessages([]);
        setProducts([]);
        setSelectedProduct(null);
        addMessage("bot", "Hello! Welcome to our e-commerce store. How can I help you today?");
    };
    
    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>E-commerce Assistant</h2>
                <button onClick={resetChat} className="reset-btn">Reset Chat</button>
            </div>
            
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <div className="message-content">
                            <p>{msg.text}</p>
                            <span className="timestamp">{msg.timestamp}</span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            
            {products.length > 0 && !selectedProduct && (
                <div className="product-suggestions">
                    <h3>Suggested Products</h3>
                    <div className="product-grid">
                        {products.map(product => (
                            <div key={product.id} className="product-card" onClick={() => handleProductSelect(product)}>
                                <img src={product.image_url} alt={product.name} />
                                <h4>{product.name}</h4>
                                <p>${product.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {selectedProduct && (
                <ProductDisplay 
                    product={selectedProduct} 
                    onBack={() => setSelectedProduct(null)}
                    onAddToCart={() => {
                        addMessage("user", `Add ${selectedProduct.name} to cart`);
                        addMessage("bot", `${selectedProduct.name} has been added to your cart!`);
                    }}
                />
            )}
            
            <form onSubmit={handleSendMessage} className="message-form">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message here..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatInterface;
