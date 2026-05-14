import { useEffect, useState } from "react"
import axios from "axios"

function TradeHistory() {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("ALL")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })

  const fetchTrades = async (type, pageNum) => {
    try {
      setLoading(true)
      setError(null)
      const params = { page: pageNum, limit: 20 }
      if (type !== "ALL") params.type = type
      const res = await axios.get("http://localhost:3000/trade-api/trades", {
        params,
        withCredentials: true,
      })
      setTrades(res.data.payload)
      setPagination(res.data.pagination)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrades(filter, page)
  }, [filter, page])

  const handleFilter = (type) => {
    setFilter(type)
    setPage(1)
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Trade History</h1>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-4">
        {["ALL", "BUY", "SELL"].map((type) => (
          <button
            key={type}
            onClick={() => handleFilter(type)}
            className={`px-4 py-1 rounded font-semibold text-sm border transition ${
              filter === type
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button
            onClick={() => fetchTrades(filter, page)}
            className="ml-4 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && trades.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl mb-2">No trades yet</p>
          <p>Execute a buy or sell to see history here.</p>
        </div>
      )}

      {!loading && trades.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 bg-white shadow rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-left text-sm uppercase tracking-wider font-semibold">
                  <th className="p-4 border">Symbol</th>
                  <th className="p-4 border">Type</th>
                  <th className="p-4 border text-right">Qty</th>
                  <th className="p-4 border text-right">Price</th>
                  <th className="p-4 border text-right">Total</th>
                  <th className="p-4 border">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t, i) => (
                  <tr key={t._id || i} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-semibold">{t.symbol}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        t.type === "BUY"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono">{t.quantity}</td>
                    <td className="p-4 text-right font-mono">₹{t.price?.toFixed(2)}</td>
                    <td className="p-4 text-right font-mono font-semibold">₹{t.total?.toFixed(2)}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(t.createdAt).toLocaleString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <span>{pagination.total} total trades</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100"
                >
                  Prev
                </button>
                <span className="px-3 py-1">Page {page} of {pagination.pages}</span>
                <button
                  disabled={page === pagination.pages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TradeHistory