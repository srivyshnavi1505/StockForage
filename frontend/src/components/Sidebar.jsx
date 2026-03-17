import { useAuth } from "../stores/authStore";
import { useNavigate } from "react-router-dom";

function Sidebar(){

const currentUser = useAuth((state)=>state.currentUser);
const logout = useAuth((state)=>state.logout);
const navigate = useNavigate();

const handleLogout = async () => {
  await logout();
  navigate("/login");
};

return(

<div className="bg-gray-900 text-white w-56 min-h-screen p-6 flex flex-col">

{/* TOP SECTION */}
<div className="flex flex-col items-center">

{/* Profile Avatar */}
<div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-3xl font-bold mb-4">
{currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : "U"}
</div>

{/* User Details */}
<p className="text-xl font-bold">{currentUser?.username}</p>
<p className="text-gray-300">{currentUser?.email}</p>
<p className="text-gray-300">{currentUser?.mobile}</p>

</div>

{/* LOGOUT BUTTON */}
<button
onClick={handleLogout}
className="bg-red-500 hover:bg-red-600 text-white py-2 rounded mt-auto mb-6"
>
Logout
</button>

</div>

);

}

export default Sidebar;