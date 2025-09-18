export default function ProductCard({ product, addToCart }) {
  return (
    <div className="border rounded-lg shadow-md p-4 flex flex-col items-center">
      <img src={product.image} alt={product.name} className="w-32 h-32 object-cover" />
      <h2 className="mt-2 font-semibold">{product.name}</h2>
      <p className="text-gray-600">${product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
}
