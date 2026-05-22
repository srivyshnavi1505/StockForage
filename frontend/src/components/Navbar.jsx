import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../stores/authStore";
import { useState, useEffect } from "react";
import {
  FiChevronDown,
  FiUser,
  FiBell,
  FiLogOut,
} from "react-icons/fi";

function Navbar() {

  let currentUser = useAuth((state) => state.currentUser);

  const logout = useAuth((state) => state.logout);

  const navigate = useNavigate();

  const location = useLocation();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [showLoginNotification, setShowLoginNotification] =
    useState(true);

  useEffect(() => {

    if (currentUser) {

      const timer = setTimeout(() => {

        setShowLoginNotification(false);

      }, 4000);

      return () => clearTimeout(timer);

    }

  }, [currentUser]);

  const handleLogout = async () => {

    await logout();

    navigate("/login");

  };

  // HIDE NAVBAR ON PROTECTED PAGES WHEN LOGGED OUT

  const publicRoutes = ["/", "/login", "/register"];

  if (!currentUser && !publicRoutes.includes(location.pathname)) {
    return null;
  }

  return (

    <>

      {/* LOGIN POPUP NOTIFICATION */}

      {currentUser && showLoginNotification && (

        <div className="fixed top-24 right-8 z-[100] animate-bounce">

          <div className="bg-[#111827] border border-cyan-500/30 shadow-2xl rounded-2xl p-5 w-80 backdrop-blur-xl">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">

                🔔

              </div>

              <div>

                <h3 className="text-white font-bold text-lg mb-1">
                  Welcome Back!
                </h3>

                <p className="text-gray-300 text-sm">
                  Hello {currentUser?.username}, market is now open for trading.
                </p>

              </div>

            </div>

          </div>

        </div>

      )}

      <nav className="sticky top-0 z-50 bg-[#0F172A] border-b border-white/10 px-8 py-5 shadow-2xl">

        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* LOGO */}

          <div className="flex items-center gap-4">

            <div className="relative">

              <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full"></div>

              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwMRN8hunzhTSBKTij6CP0MWS7zF56t_Es6Q&s"
                alt="logo"
                className="relative z-10 w-12 h-12 rounded-full border border-white/10 shadow-xl"
              />

            </div>

            <div>

              <h1 className="text-2xl font-extrabold text-white">

                Stock<span className="text-cyan-400">Forage</span>

              </h1>

              <p className="text-xs text-gray-400">
                Smart Trading Platform
              </p>

            </div>

          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white text-2xl focus:outline-none"
            >
              {showMobileMenu ? "✕" : "☰"}
            </button>
          </div>

          {/* NAVIGATION */}
          <div
            className={`md:flex items-center gap-4 ${
              showMobileMenu
                ? "flex flex-col absolute top-full left-0 w-full bg-[#0F172A] p-5 border-b border-white/10 shadow-2xl z-50"
                : "hidden"
            }`}
          >

            {!currentUser ? (

              <>

                <Link
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full md:w-auto text-center px-5 py-2 rounded-2xl bg-white/10 border border-white/10 text-gray-300 hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-lg"
                  to="/"
                >
                  Home
                </Link>

                <Link
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full md:w-auto text-center px-5 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-xl hover:scale-105 transition-all duration-300"
                  to="/login"
                >
                  Login
                </Link>

                <Link
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full md:w-auto text-center px-5 py-2 rounded-2xl bg-white text-black font-semibold shadow-xl hover:scale-105 transition-all duration-300"
                  to="/register"
                >
                  Register
                </Link>

              </>

            ) : (

              <>

                <Link
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full md:w-auto text-center px-5 py-2 rounded-2xl bg-white/10 border border-white/10 text-gray-300 hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-lg"
                  to="/dashboard"
                >
                  Dashboard
                </Link>

                <Link
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full md:w-auto text-center px-5 py-2 rounded-2xl bg-white/10 border border-white/10 text-gray-300 hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-lg"
                  to="/portfolio"
                >
                  Portfolio
                </Link>

                <Link
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full md:w-auto text-center px-5 py-2 rounded-2xl bg-white/10 border border-white/10 text-gray-300 hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-lg"
                  to="/leaderboard"
                >
                  Leaderboard
                </Link>

                <Link
                  onClick={() => setShowMobileMenu(false)}
                  className="w-full md:w-auto text-center px-5 py-2 rounded-2xl bg-white/10 border border-white/10 text-gray-300 hover:bg-cyan-500 hover:text-white transition-all duration-300 shadow-lg"
                  to="/history"
                >
                  Trade History
                </Link>

                {/* PROFILE */}

                <div className="relative w-full md:w-auto">

                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full md:w-auto flex justify-center items-center gap-3 px-4 py-2 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all duration-300"
                  >

                    <div className="w-11 h-11 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-2xl">

                      {currentUser?.username
                        ? currentUser.username.charAt(0).toUpperCase()
                        : "U"}

                    </div>

                    <span className="text-white font-semibold uppercase">
                      {currentUser?.username}
                    </span>

                    <FiChevronDown className="text-gray-300" />

                  </button>

                  {/* DROPDOWN */}

                  {showDropdown && (

                    <div className="absolute right-0 md:right-0 left-0 md:left-auto mt-4 w-full md:w-64 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">

                      <div className="px-5 py-4 border-b border-white/10 text-center md:text-left">

                        <p className="text-white font-bold text-lg">
                          {currentUser?.username}
                        </p>

                        <p className="text-gray-400 text-sm break-all">
                          {currentUser?.email}
                        </p>

                      </div>


                      <button
                        onClick={handleLogout}
                        className="w-full flex justify-center md:justify-start items-center gap-3 px-5 py-4 text-red-400 hover:bg-red-500/10 transition-all duration-300"
                      >

                        <FiLogOut />

                        Logout

                      </button>

                    </div>

                  )}

                </div>

              </>

            )}

          </div>

        </div>

      </nav>

    </>

  );

}

export default Navbar;