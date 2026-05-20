import { useAuth } from "../stores/authStore";
import { useNavigate } from "react-router-dom";

function Sidebar() {

  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);

  const navigate = useNavigate();

  const handleLogout = async () => {

    await logout();
    navigate("/login");

  };

  return (

    <div className="w-72 min-h-screen bg-gradient-to-b from-[#0F172A] via-[#111827] to-[#020617] border-r border-white/10 backdrop-blur-xl text-white flex flex-col p-8 shadow-2xl">

 

      {/* PROFILE CARD */}

      <div className="relative overflow-hidden bg-white/10 border border-white/10 rounded-[32px] p-8 shadow-2xl backdrop-blur-xl">

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

      <div className="mt-8 space-y-4">

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

      {/* LOGOUT */}

      <button
        onClick={handleLogout}
        className="mt-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 py-4 rounded-2xl font-semibold shadow-2xl transition-all duration-300 hover:scale-[1.02]"
      >

        Logout

      </button>

    </div>

  );

}

export default Sidebar;