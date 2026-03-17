import { useEffect, useState } from "react";
import axios from "axios";

function Portfolio() {

const [portfolioData, setPortfolioData] = useState({ holdings: [], summary: { totalInvested: 0, totalValue: 0, totalPnl: 0, totalPnlPct: 0 } });
  const [error, setError] = useState(null);

useEffect(()=>{

const fetchPortfolio = async () => {
  try {
    setLoading(true);
    setError(null);
    const res = await axios.get("http://localhost:3000/portfolio-api/portfolio", {
      withCredentials: true
    });
    console.log(res.data);
    if (res.data.payload) {
      setPortfolioData(res.data.payload);
    } else {
      setPortfolioData({ holdings: [], summary: { totalInvested: 0, totalValue: 0, totalPnl: 0, totalPnlPct: 0 } });
    }
  } catch (err) {
    console.error('Portfolio API error:', err.response?.data || err.message);
    setError(`Failed to fetch: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
  } finally {
    setLoading(false);
  }
};

fetchPortfolio();

},[]);

return(

<div className="p-6 space-y-4">
  {error && (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>
  )}
  {loading && (
    <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )}
  {!loading && portfolioData.holdings.length === 0 && !error && (
    <div className="text-center py-12 text-gray-500">
      <p>No holdings yet. Make some trades to see your portfolio!</p>
    </div>
  )}
  {!loading && portfolioData.holdings.length > 0 && (
    <div>
      <table className="w-full border-collapse border border-gray-300 overflow-hidden rounded-lg shadow-md">
  

<thead>
<tr className="bg-blue-200 font-bold">
  <th colSpan="4" className="text-left p-3 border-b-2 border-blue-300">Summary</th>
</tr>
<tr className="bg-blue-100 font-bold">
  <td colSpan="5" className="p-3"></td>
  <td className="p-3 font-bold">${portfolioData.summary.totalInvested.toFixed(2)}</td>
  <td className="p-3 font-bold">${portfolioData.summary.totalValue.toFixed(2)}</td>
  <td className={portfolioData.summary.totalPnl >= 0 ? 'text-green-600 p-3 font-bold' : 'text-red-600 p-3 font-bold'}>${portfolioData.summary.totalPnl.toFixed(2)}</td>
  <td className={portfolioData.summary.totalPnlPct >= 0 ? 'text-green-600 p-3 font-bold' : 'text-red-600 p-3 font-bold' }>{portfolioData.summary.totalPnlPct.toFixed(2)}%</td>
</tr>
<tr className="bg-gray-200">
  <th>Symbol</th>
  <th>Company</th>
  <th>Qty</th>
  <th>Avg Price</th>
  <th>Live Price</th>
  <th>Invested</th>
  <th>Current Value</th>
  <th>P&amp;L</th>
  <th>P&amp;L %</th>
</tr>
</thead>

<tbody>

{portfolioData.holdings.map((stock, index) => (
  <tr key={stock.symbol || index} className={`text-center border ${stock.pnl >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
    <td>{stock.symbol}</td>
    <td>{stock.companyName || 'N/A'}</td>
    <td>{stock.quantity}</td>
    <td>${stock.avgBuyPrice?.toFixed(2) || 0}</td>
    <td>${stock.livePrice?.toFixed(2) || 0}</td>
    <td>${stock.invested?.toFixed(2) || 0}</td>
    <td>${stock.currentValue?.toFixed(2) || 0}</td>
    <td className={stock.pnl >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
      ${stock.pnl?.toFixed(2) || 0}
    </td>
    <td className={stock.pnlPct >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
      {stock.pnlPct?.toFixed(2)}%
    </td>
  </tr>
))}

</tbody>
</table>
</div>
)}
</div>

);

}

export default Portfolio;