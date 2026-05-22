import { useAuth } from "../stores/authStore";
import { useNavigate } from "react-router-dom";

function Sidebar() {

  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const watchlist = useAuth((state) => state.watchlist) || [];
  const toggleWatchlist = useAuth((state) => state.toggleWatchlist);

  const navigate = useNavigate();

  const handleLogout = async () => {

    await logout();
    navigate("/login");

  };

  return (

    <div className="hidden lg:flex w-72 min-h-screen bg-gradient-to-b from-[#0F172A] via-[#111827] to-[#020617] border-r border-white/10 backdrop-blur-xl text-white flex-col p-8 shadow-2xl">

 

      {/* PROFILE CARD */}

      <div className="relative overflow-hidden bg-white/10 border border-white/10 rounded-[32px] p-8 shadow-2xl backdrop-blur-xl flex-shrink-0">

        {/* GLOW */}

        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/20 blur-[80px] rounded-full"></div>

        <div className="relative z-10 flex flex-col items-center text-center">

          {/* AVATAR */}

          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-4xl font-bold shadow-xl mb-5 border-4 border-white/10">

            {currentUser?.username
              ? currentUser.username.charAt(0).toUpperCase()
              : "U"}

          </div>

          {/* USERNAME */}

          <h2 className="text-2xl font-bold mb-2">
            {currentUser?.username}
          </h2>

          {/* EMAIL */}

          <p className="text-gray-300 text-sm break-all mb-2">
            {currentUser?.email}
          </p>

          {/* MOBILE */}

          <p className="text-cyan-400 font-semibold">
            {currentUser?.mobile}
          </p>

        </div>

      </div>

      {/* QUICK STATS */}

      <div className="mt-8 space-y-4 flex-shrink-0">

        <div className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">

          <p className="text-gray-400 text-sm mb-2">
            Trading Status
          </p>

          <h3 className="text-green-400 font-bold text-xl">
            Active
          </h3>

        </div>

        <div className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">

          <p className="text-gray-400 text-sm mb-2">
            Market Access
          </p>

          <h3 className="text-cyan-400 font-bold text-xl">
            Premium
          </h3>

        </div>

      </div>

      {/* WATCHLIST */}
      
      <div className="mt-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <h3 className="text-gray-400 text-sm font-semibold mb-3 tracking-wider uppercase">Watchlist</h3>
        {watchlist.length === 0 ? (
          <p className="text-xs text-gray-500">No stocks in watchlist.</p>
        ) : (
          <div className="space-y-3">
            {watchlist.map(sym => (
              <div key={sym} className="flex justify-between items-center bg-white/5 rounded-2xl p-4 border border-white/5 hover:bg-white/10 transition-colors">
                <span className="font-bold">{sym}</span>
                <button onClick={() => toggleWatchlist(sym)} className="text-red-400 hover:text-red-300 text-xs font-semibold px-2 py-1 bg-red-500/10 rounded-lg">Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LOGOUT */}

      <button
        onClick={handleLogout}
        className="mt-6 flex-shrink-0 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 py-4 rounded-2xl font-semibold shadow-2xl transition-all duration-300 hover:scale-[1.02]"
      >

        Logout

      </button>

    </div>

  );

}

export default Sidebar;