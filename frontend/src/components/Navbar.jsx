import { Link } from "react-router-dom";
import { useAuth } from "../stores/authStore";

function Navbar(){
let currentUser = useAuth((state)=>(state.currentUser))


return(

<nav className="bg-black text-white px-8 py-4 flex justify-between items-center">

<h1 className="text-xl font-bold">
StockForage
</h1>

<div className="flex gap-6">

{
!currentUser ? (
<>

<Link className="border border-blue-500 px-4 py-1 rounded hover:bg-blue-500 transition" to="/">
Home
</Link>

<Link className="border border-blue-500 px-4 py-1 rounded hover:bg-blue-500 transition" to="/portfolio">
Portfolio
</Link>

<Link className="border border-blue-500 px-4 py-1 rounded hover:bg-blue-500 transition" to="/leaderboard">
Leaderboard
</Link>

<Link className="border border-blue-500 px-4 py-1 rounded hover:bg-blue-500 transition" to="/history">
Trade History
</Link>

<Link className="border border-blue-500 px-4 py-1 rounded hover:bg-blue-500 transition" to="/login">
Login
</Link>

<Link className="border border-blue-500 px-4 py-1 rounded hover:bg-blue-500 transition" to="/register">
Register
</Link>

</>
) : (
<>
<Link className="border border-blue-500 px-4 py-1 rounded hover:bg-blue-500 transition" to="/dashboard">
Dashboard
</Link>
<Link className="border border-blue-500 px-4 py-1 rounded hover:bg-blue-500 transition" to="/portfolio">
Portfolio
</Link>

<Link className="border border-blue-500 px-4 py-1 rounded hover:bg-blue-500 transition" to="/leaderboard">
Leaderboard
</Link>

<Link className="border border-blue-500 px-4 py-1 rounded hover:bg-blue-500 transition" to="/history">
Trade History
</Link>

</>
)
}


</div>

</nav>

);

}

export default Navbar;