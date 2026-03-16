import { useContext } from "react";
import Sidebar from "../components/Sidebar";
import StockCard from "../components/StockCard";
import { AppContext } from "../context/AppContext";

function Dashboard() {

const {wallet,portfolioValue,totalProfit} = useContext(AppContext);

const stocks = [
{ name: "AAPL", price: 180, change: "+1.2%" },
{ name: "TSLA", price: 250, change: "-0.8%" },
{ name: "AMZN", price: 130, change: "+0.4%" },
{ name: "MSFT", price: 320, change: "+0.6%" }
];

return (

<div className="bg-gray-100 min-h-screen">

<div className="flex">

<Sidebar/>

<div className="flex-1 p-6">

{/* Dashboard Cards */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

<div className="bg-white shadow p-6 rounded-lg">
<h3 className="text-gray-500">Wallet Balance</h3>
<p className="text-2xl font-bold">${wallet}</p>
</div>

<div className="bg-white shadow p-6 rounded-lg">
<h3 className="text-gray-500">Portfolio Value</h3>
<p className="text-2xl font-bold">${portfolioValue}</p>
</div>

<div className="bg-white shadow p-6 rounded-lg">
<h3 className="text-gray-500">Total Profit</h3>
<p className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
${totalProfit}
</p>
</div>

</div>

{/* Market Section */}

<div className="bg-white shadow rounded-lg p-6">

<h2 className="text-xl font-bold mb-4">Market</h2>

<div className="grid md:grid-cols-2 gap-4">

{stocks.map((stock,index)=>(

<StockCard key={index} stock={stock}/>

))}

</div>

</div>

</div>

</div>

</div>

);

}

export default Dashboard;