import { useEffect, useState } from "react"
import { api } from "../stores/authStore"

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

      const params = {
        page: pageNum,
        limit: 20,
      }

      if (type !== "ALL") {
        params.type = type
      }

      const res = await api.get(
        "/trade-api/trades",
        {
          params
        }
      )

      setTrades(res.data.payload)
      setPagination(res.data.pagination)

    } catch (err) {

      setError(
        err.response?.data?.message || err.message
      )

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

    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#111827] text-white p-8">

      <div className="max-w-7xl mx-auto">

        {/* HERO */}

        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/20 border border-white/10 backdrop-blur-xl p-10 mb-10 shadow-2xl">

          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full"></div>

          <div className="relative z-10">

            <h1 className="text-5xl font-extrabold mb-4">

              Trade <br />

              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                History
              </span>

            </h1>

            <p className="text-gray-300 text-lg max-w-2xl">
              Track your buy and sell activities with detailed transaction history.
            </p>

          </div>

        </div>

        {/* FILTERS */}

        <div className="flex flex-wrap gap-4 mb-8">

          {["ALL", "BUY", "SELL"].map((type) => (

            <button
              key={type}
              onClick={() => handleFilter(type)}
              className={`px-6 py-3 rounded-2xl font-semibold border transition-all duration-300 ${
                filter === type
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-500 text-white shadow-lg"
                  : "bg-white/10 border-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >

              {type}

            </button>

          ))}

        </div>

        {/* ERROR */}

        {error && (

          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-6 py-4 rounded-2xl mb-6 flex items-center justify-between">

            <span>{error}</span>

            <button
              onClick={() => fetchTrades(filter, page)}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white font-semibold transition"
            >
              Retry
            </button>

          </div>

        )}

        {/* LOADING */}

        {loading && (

          <div className="flex justify-center items-center py-20">

            <div className="w-14 h-14 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>

          </div>

        )}

        {/* EMPTY */}

        {!loading && trades.length === 0 && !error && (

          <div className="bg-white/10 border border-white/10 rounded-[32px] p-16 text-center backdrop-blur-xl shadow-2xl">

            <h2 className="text-3xl font-bold mb-4">
              No Trades Yet
            </h2>

            <p className="text-gray-400 text-lg">
              Execute a buy or sell order to view your trade history here.
            </p>

          </div>

        )}

        {/* TABLE */}

        {!loading && trades.length > 0 && (

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">

            {/* HEADER */}

            <div className="px-8 py-6 border-b border-white/10">

              <h2 className="text-3xl font-bold">
                Transaction Records
              </h2>

              <p className="text-gray-400 mt-2">
                Complete record of your stock trading activities.
              </p>

            </div>

            {/* TABLE */}

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-white/5 text-gray-300">

                  <tr>

                    <th className="p-6 text-left font-semibold">
                      Symbol
                    </th>

                    <th className="p-6 text-left font-semibold">
                      Type
                    </th>

                    <th className="p-6 text-right font-semibold">
                      Qty
                    </th>

                    <th className="p-6 text-right font-semibold">
                      Price
                    </th>

                    <th className="p-6 text-right font-semibold">
                      Total
                    </th>

                    <th className="p-6 text-left font-semibold">
                      Date & Time
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {trades.map((t, i) => (

                    <tr
                      key={t._id || i}
                      className="border-b border-white/5 hover:bg-white/5 transition-all duration-300"
                    >

                      <td className="p-6">

                        <div className="flex items-center gap-4">

                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg">

                            {t.symbol?.charAt(0)}

                          </div>

                          <div>

                            <p className="font-bold text-lg">
                              {t.symbol}
                            </p>

                            <p className="text-gray-400 text-sm">
                              Stock Asset
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="p-6">

                        <span
                          className={`px-4 py-2 rounded-xl text-sm font-bold ${
                            t.type === "BUY"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >

                          {t.type}

                        </span>

                      </td>

                      <td className="p-6 text-right font-mono font-semibold">
                        {t.quantity}
                      </td>

                      <td className="p-6 text-right font-mono">
                        ₹{t.price?.toFixed(2)}
                      </td>

                      <td className="p-6 text-right font-bold text-cyan-400">
                        ₹{t.total?.toFixed(2)}
                      </td>

                      <td className="p-6 text-gray-400 text-sm">

                        {new Date(t.createdAt).toLocaleString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* PAGINATION */}

            {pagination.pages > 1 && (

              <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-8 py-6 border-t border-white/10">

                <span className="text-gray-400">
                  {pagination.total} total trades
                </span>

                <div className="flex items-center gap-3">

                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-5 py-2 rounded-2xl bg-white/10 border border-white/10 disabled:opacity-40 hover:bg-white/20 transition"
                  >
                    ← Prev
                  </button>

                  <span className="px-4 py-2 text-gray-300">
                    Page {page} of {pagination.pages}
                  </span>

                  <button
                    disabled={page === pagination.pages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-5 py-2 rounded-2xl bg-cyan-500 hover:bg-cyan-600 transition disabled:opacity-40"
                  >
                    Next →
                  </button>

                </div>

              </div>

            )}

          </div>

        )}

      </div>

    </div>

  )

}

export default TradeHistory