export default function Cart({ cart }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="p-6 border-t bg-gray-100">
      <h2 className="text-lg font-bold mb-2">Cart Summary</h2>
      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
            <li key={index} className="flex justify-between">
              <span>{item.name}</span>
              <span>${item.price}</span>
            </li>
          ))}
        </ul>
      )}
      <h3 className="mt-4 font-semibold">Total: ${total}</h3>
    </div>
  );
}
