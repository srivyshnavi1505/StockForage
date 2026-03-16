import { Link } from "react-router-dom";

function Sidebar(){

return(

<div className="bg-gray-900 text-white w-56 min-h-screen p-6">

<h2 className="text-lg font-bold mb-6">
Dashboard
</h2>

<ul className="space-y-4">

<li>
<Link to="/dashboard">Market</Link>
</li>

<li>
<Link to="/portfolio">Portfolio</Link>
</li>

<li>
<Link to="/history">Trade History</Link>
</li>

<li>
<Link to="/leaderboard">Leaderboard</Link>
</li>

</ul>

</div>

);

}

export default Sidebar;