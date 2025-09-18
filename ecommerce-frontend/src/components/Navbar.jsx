export default function Navbar({ cartCount }) {
  return (
    <nav className="bg-blue-600 p-4 flex justify-between text-white">
      <h1 className="text-xl font-bold">E-Shop</h1>
      <div>
        🛒 Cart: <span className="font-bold">{cartCount}</span>
      </div>
    </nav>
  );
}
