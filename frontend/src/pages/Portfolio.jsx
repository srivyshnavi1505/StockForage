import { useEffect, useState } from "react"
import { api } from "../stores/authStore"
import PortfolioHistoryChart from "../components/PortfolioHistoryChart"

function Portfolio() {
  const [portfolioData, setPortfolioData] = useState({
    holdings: [],
    summary: { totalInvested: 0, totalValue: 0, totalPnl: 0, totalPnlPct: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPortfolio = async () => {
    try {
      setLoading(true)
      setError(null)
      // Uses the centralized api instance so 401 errors are intercepted
      const res = await api.get("/portfolio-api/portfolio")
      if (res.data.payload) {
        setPortfolioData(res.data.payload)
      } else {
        setPortfolioData({ holdings: [], summary: { totalInvested: 0, totalValue: 0, totalPnl: 0, totalPnlPct: 0 } })
      }
    } catch (err) {
      setError(`Failed to fetch: ${err.response?.status} - ${err.response?.data?.message || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const { summary, holdings } = portfolioData
  const isPnlPositive = summary.totalPnl >= 0

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Portfolio</h1>
        <button
          onClick={fetchPortfolio}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button onClick={fetchPortfolio} className="ml-4 bg-blue-500 text-white px-3 py-1 rounded text-sm">
            Retry
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Summary Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Invested</p>
            <p className="text-xl font-bold">₹{summary.totalInvested.toFixed(2)}</p>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Value</p>
            <p className="text-xl font-bold">₹{summary.totalValue.toFixed(2)}</p>
          </div>
          <div className={`border rounded-lg p-4 shadow-sm ${isPnlPositive ? "bg-green-50" : "bg-red-50"}`}>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total P&L</p>
            <p className={`text-xl font-bold ${isPnlPositive ? "text-green-600" : "text-red-600"}`}>
              ₹{summary.totalPnl.toFixed(2)}
            </p>
          </div>
          <div className={`border rounded-lg p-4 shadow-sm ${isPnlPositive ? "bg-green-50" : "bg-red-50"}`}>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Returns</p>
            <p className={`text-xl font-bold ${isPnlPositive ? "text-green-600" : "text-red-600"}`}>
              {summary.totalPnlPct.toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      {/* Portfolio History Chart */}
      {!loading && !error && (
        <div className="mb-6">
          <PortfolioHistoryChart />
        </div>
      )}

      {!loading && holdings.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl mb-4">📈 No holdings yet</p>
          <p>Make some trades to see your portfolio!</p>
        </div>
      )}

      {!loading && holdings.length > 0 && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 rounded-lg shadow-md bg-white">
            <thead>
              <tr className="bg-gray-200 text-left text-sm uppercase tracking-wider font-semibold">
                <th className="p-4 border">Symbol</th>
                <th className="p-4 border">Company</th>
                <th className="p-4 border text-right">Qty</th>
                <th className="p-4 border text-right">Avg Buy</th>
                <th className="p-4 border text-right">Live Price</th>
                <th className="p-4 border text-right">Invested</th>
                <th className="p-4 border text-right">Current</th>
                <th className="p-4 border text-right">P&L</th>
                <th className="p-4 border text-right">P&L %</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((stock, index) => (
                <tr
                  key={stock.symbol || index}
                  className={`hover:bg-gray-50 transition-colors border-b ${stock.pnl >= 0 ? "bg-green-50/50" : "bg-red-50/50"}`}
                >
                  <td className="p-4 font-semibold">{stock.symbol}</td>
                  <td className="p-4 text-gray-600">{stock.companyName || "N/A"}</td>
                  <td className="p-4 text-right font-mono">{stock.quantity}</td>
                  <td className="p-4 text-right font-mono">₹{stock.avgBuyPrice?.toFixed(2) || 0}</td>
                  <td className="p-4 text-right font-mono">₹{stock.livePrice?.toFixed(2) || 0}</td>
                  <td className="p-4 text-right font-mono">₹{stock.invested?.toFixed(2) || 0}</td>
                  <td className="p-4 text-right font-mono">₹{stock.currentValue?.toFixed(2) || 0}</td>
                  <td className={`p-4 text-right font-mono font-bold ${stock.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ₹{stock.pnl?.toFixed(2) || 0}
                  </td>
                  <td className={`p-4 text-right font-mono font-bold ${stock.pnlPct >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {stock.pnlPct?.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Portfolio