import { useState, useEffect } from "react"
import axios from "axios"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts"

function StockPriceChart({ symbol, companyName }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    if (!symbol) return

    const fetchHistory = async () => {
      try {
        setLoading(true)
        const res = await axios.get(
          `http://localhost:3000/stock/history/${symbol}?days=${days}`,
          { withCredentials: true }
        )
        const raw = res.data.payload || []
        const formatted = raw.map((d) => ({
          date: new Date(d.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          Open: d.open,
          High: d.high,
          Low: d.low,
          Close: d.close,
        }))
        setData(formatted)
      } catch (err) {
        console.error("Failed to fetch stock history:", err)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [symbol, days])

  if (!symbol) return null

  return (
    <div className="bg-white shadow rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {symbol} Price History
          </h3>
          {companyName && (
            <p className="text-sm text-gray-500">{companyName}</p>
          )}
        </div>
        <div className="flex gap-1">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 text-xs rounded-full border transition ${
                days === d
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {d}D
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-400 text-sm">Loading chart data...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-400 text-sm">No historical data available for {symbol}</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#999" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#999" }}
              tickLine={false}
              domain={["auto", "auto"]}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value) => [`$${value.toFixed(2)}`]}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
            />
            <Line
              type="monotone"
              dataKey="Close"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="High"
              stroke="#22c55e"
              strokeWidth={1}
              dot={false}
              strokeDasharray="4 2"
            />
            <Line
              type="monotone"
              dataKey="Low"
              stroke="#ef4444"
              strokeWidth={1}
              dot={false}
              strokeDasharray="4 2"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default StockPriceChart
