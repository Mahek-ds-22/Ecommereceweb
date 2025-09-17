import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const addToCart = (product) => setCart([...cart, product]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartCount={cart.length} />
      <ProductList products={products} addToCart={addToCart} />
      <Cart cart={cart} />
    </div>
  );
}

export default App;
