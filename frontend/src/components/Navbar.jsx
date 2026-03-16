import { Link } from "react-router-dom";

function Navbar(){

return(

<nav className="bg-black text-white px-8 py-4 flex justify-between items-center">

<h1 className="text-xl font-bold">
StockForage
</h1>

<div className="flex gap-6">

<Link to="/">Home</Link>
<Link to="/portfolio">Portfolio</Link>
<Link to="/leaderboard">Leaderboard</Link>
<Link to="/login">Login</Link>
<Link to="/register">Register</Link>

</div>

</nav>

);

}

export default Navbar;