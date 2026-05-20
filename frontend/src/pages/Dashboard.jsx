import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import StockCard from "../components/StockCard";

function Dashboard() {

const [dashboardData, setDashboardData] = useState({
  walletBalance: 0,
  portfolioValue: 0,
  totalProfit: 0
});

useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/portfolio-api/portfolio", {
        withCredentials: true
      });
      if (res.data.payload) {
        setDashboardData({
          walletBalance: res.data.payload.walletBalance || 0,
          portfolioValue: res.data.payload.summary?.totalValue || 0,
          totalProfit: res.data.payload.summary?.totalPnl || 0
        });
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };
  fetchDashboardData();
}, []);

const { walletBalance, portfolioValue, totalProfit } = dashboardData;

const stocks = [
{ symbol: "AAPL", price: 180, change: "+1.2%" },
{ symbol: "TSLA", price: 250, change: "-0.8%" },
{ symbol: "AMZN", price: 130, change: "+0.4%" },
{ symbol: "MSFT", price: 320, change: "+0.6%" }
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
<p className="text-2xl font-bold">₹{walletBalance.toFixed(2)}</p>
</div>

<div className="bg-white shadow p-6 rounded-lg">
<h3 className="text-gray-500">Portfolio Value</h3>
<p className="text-2xl font-bold">₹{portfolioValue.toFixed(2)}</p>
</div>

<div className="bg-white shadow p-6 rounded-lg">
<h3 className="text-gray-500">Total Profit</h3>
<p className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
₹{totalProfit.toFixed(2)}
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