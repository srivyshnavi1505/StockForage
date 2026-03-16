import { useState } from "react";
import Sidebar from "../components/Sidebar";

function Dashboard() {

const initialWallet = 100000;

const [wallet, setWallet] = useState(initialWallet);
const [portfolio, setPortfolio] = useState([]);

const stocks = [
{ name: "AAPL", price: 180, change: "+1.2%" },
{ name: "TSLA", price: 250, change: "-0.8%" },
{ name: "AMZN", price: 130, change: "+0.4%" },
{ name: "MSFT", price: 320, change: "+0.6%" }
];

const buyStock = (stock) => {

if(wallet < stock.price){
alert("Not enough balance");
return;
}

setWallet(wallet - stock.price);
setPortfolio([...portfolio, stock]);

};

const sellStock = (stockIndex) => {

const stock = portfolio[stockIndex];

setWallet(wallet + stock.price);

const updated = [...portfolio];
updated.splice(stockIndex,1);

setPortfolio(updated);

};

const portfolioValue = portfolio.reduce((total, stock) => total + stock.price, 0);

const totalProfit = portfolioValue + wallet - initialWallet;

return (

<div className="bg-gray-100 min-h-screen">

<div className="flex">

<Sidebar />

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

{/* Market Table */}

<div className="bg-white shadow rounded-lg p-6">

<h2 className="text-xl font-bold mb-4">Market</h2>

<table className="w-full text-left">

<thead className="border-b">
<tr>
<th className="py-2">Stock</th>
<th>Price</th>
<th>Change</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{stocks.map((stock, index) => (

<tr key={index} className="border-b">

<td className="py-3">{stock.name}</td>

<td>${stock.price}</td>

<td className={stock.change.includes("+") ? "text-green-500" : "text-red-500"}>
{stock.change}
</td>

<td>

<button
onClick={() => buyStock(stock)}
className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
>
Buy
</button>

<button
onClick={() => sellStock(index)}
className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
>
Sell
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</div>

</div>

);

}

export default Dashboard;