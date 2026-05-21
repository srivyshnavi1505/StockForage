import { useState, useEffect } from "react"
import { api } from "../stores/authStore"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
)

function PortfolioHistoryChart() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        const res = await api.get("/portfolio-api/portfolio/history")
        setHistory(res.data.payload || [])
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Login to see portfolio history")
        } else {
          setError("Could not load portfolio history")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Portfolio History</h3>
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-400 text-sm">Loading portfolio history...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Portfolio History</h3>
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Portfolio History</h3>
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-400 text-sm">No portfolio snapshots yet. Make some trades to start tracking!</p>
        </div>
      </div>
    )
  }

  const labels = history.map((h) =>
    new Date(h.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  )

  const chartData = {
    labels,
    datasets: [
      {
        label: "Portfolio Value",
        data: history.map((h) => h.portfolioValue),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.08)",
        fill: true,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
      {
        label: "Total Value (Portfolio + Cash)",
        data: history.map((h) => h.totalValue),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.05)",
        fill: true,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
      {
        label: "P&L",
        data: history.map((h) => h.pnl),
        borderColor: history[history.length - 1]?.pnl >= 0 ? "#22c55e" : "#ef4444",
        backgroundColor: history[history.length - 1]?.pnl >= 0
          ? "rgba(34, 197, 94, 0.06)"
          : "rgba(239, 68, 68, 0.06)",
        fill: true,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 11 }, usePointStyle: true, padding: 16 },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y?.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 }, color: "#999" },
      },
      y: {
        grid: { color: "#f3f4f6" },
        ticks: {
          font: { size: 10 },
          color: "#999",
          callback: (v) => `$${v}`,
        },
      },
    },
    interaction: { mode: "nearest", axis: "x", intersect: false },
  }

  return (
    <div className="bg-white shadow rounded-lg p-5">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Portfolio History</h3>
      <div style={{ height: "300px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}

export default PortfolioHistoryChart
