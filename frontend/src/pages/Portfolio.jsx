import { useEffect, useState } from "react";
import axios from "axios";

function Portfolio() {
  const [portfolioData, setPortfolioData] = useState({ holdings: [], summary: { totalInvested: 0, totalValue: 0, totalPnl: 0, totalPnlPct: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const refreshPortfolio = () => {
    fetchPortfolio();
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-6">My Portfolio</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={refreshPortfolio}
            className="ml-4 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      )}
      
      {loading && (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {!loading && portfolioData.holdings.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl mb-4">📈 No holdings yet</p>
          <p>Make some trades to see your portfolio!</p>
        </div>
      )}
      
      {!loading && portfolioData.holdings.length > 0 && !error && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Portfolio Holdings</h2>
            <button 
              onClick={refreshPortfolio}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
            >
              🔄 Refresh
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-lg shadow-md bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <th colSpan="9" className="text-left p-4 border-b-2 border-blue-400 bg-blue-700">
                    📊 Portfolio Summary
                  </th>
                </tr>
                <tr className="bg-blue-50">
                  <td colSpan="5" className="p-4"></td>
                  <td className="p-4 font-bold text-lg">${portfolioData.summary.totalInvested.toFixed(2)}</td>
                  <td className="p-4 font-bold text-lg">${portfolioData.summary.totalValue.toFixed(2)}</td>
                  <td className={`p-4 font-bold text-lg ${(portfolioData.summary.totalPnl >= 0 ? 'text-green-600' : 'text-red-600')}`}>
                    ${portfolioData.summary.totalPnl.toFixed(2)}
                  </td>
                  <td className={`p-4 font-bold text-lg ${(portfolioData.summary.totalPnlPct >= 0 ? 'text-green-600' : 'text-red-600')}`}>
                    {portfolioData.summary.totalPnlPct.toFixed(2)}%
                  </td>
                </tr>
                <tr className="bg-gray-200 text-left font-semibold text-sm uppercase tracking-wider">
                  <th className="p-4 border">Symbol</th>
                  <th className="p-4 border">Company</th>
                  <th className="p-4 border text-right">Qty</th>
                  <th className="p-4 border text-right">Avg Price</th>
                  <th className="p-4 border text-right">Live Price</th>
                  <th className="p-4 border text-right">Invested</th>
                  <th className="p-4 border text-right">Current</th>
                  <th className="p-4 border text-right">P&L</th>
                  <th className="p-4 border text-right">P&L %</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.holdings.map((stock, index) => (
                  <tr key={stock.symbol || index} className={`hover:bg-gray-50 transition-colors border-b ${stock.pnl >= 0 ? 'bg-green-50/50' : 'bg-red-50/50'}`}>
                    <td className="p-4 font-medium">{stock.symbol}</td>
                    <td className="p-4">{stock.companyName || 'N/A'}</td>
                    <td className="p-4 text-right font-mono">{stock.quantity}</td>
                    <td className="p-4 text-right font-mono">${stock.avgBuyPrice?.toFixed(2) || 0}</td>
                    <td className="p-4 text-right font-mono">${stock.livePrice?.toFixed(2) || 0}</td>
                    <td className="p-4 text-right font-mono">${stock.invested?.toFixed(2) || 0}</td>
                    <td className="p-4 text-right font-mono">${stock.currentValue?.toFixed(2) || 0}</td>
                    <td className={`p-4 text-right font-mono font-bold ${stock.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${stock.pnl?.toFixed(2) || 0}
                    </td>
                    <td className={`p-4 text-right font-mono font-bold ${stock.pnlPct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.pnlPct?.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolio;

