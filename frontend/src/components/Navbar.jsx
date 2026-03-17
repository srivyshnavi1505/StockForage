import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-10 py-4 flex justify-between items-center shadow-lg">

      {/* Logo + Brand */}
      <div className="flex items-center gap-3">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwMRN8hunzhTSBKTij6CP0MWS7zF56t_Es6Q&s"
          alt="logo"
          className="w-10 h-10 rounded-full border-2 border-blue-500"
        />

        <h1 className="text-2xl font-bold tracking-wide text-blue-400">
          StockForage
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-8 text-sm font-medium">

        <Link className="hover:text-blue-400 transition" to="/">Home</Link>

        <Link className="hover:text-blue-400 transition" to="/portfolio">
          Portfolio
        </Link>

        <Link className="hover:text-blue-400 transition" to="/leaderboard">
          Leaderboard
        </Link>

        <Link className="hover:text-blue-400 transition" to="/history">
          Trade History
        </Link>

        {/* Auth Buttons */}
        <Link
          className="border border-blue-500 px-4 py-1 rounded hover:bg-blue-500 transition"
          to="/login"
        >
          Login
        </Link>

        <Link
          className="border border-blue-500 px-4 py-1 rounded hover:bg-blue-500 transition"
          to="/register"
        >
          Register
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;