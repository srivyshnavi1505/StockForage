import { useAuth } from "../stores/authStore";

function Sidebar(){

const currentUser = useAuth((state)=>state.currentUser);

return(

<div className="bg-gray-900 text-white w-56 min-h-screen p-6 flex flex-col items-center">

<p className="text-2xl font-bold mb-2">{currentUser?.username}</p>

<p className="text-lg text-gray-300">{currentUser?.email}</p>

<p className="text-lg text-gray-300">{currentUser?.mobile}</p>

</div>

);

}

export default Sidebar;