import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useAuth } from "../stores/authStore"
import { useApp } from "../context/AppContext"

function StockCard({ stock }) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const updateWallet = useAuth((state) => state.updateWallet)
  const { buyStock, sellStock } = useApp()

  const executeTrade = async (type) => {
    if (!quantity || quantity < 1) {
      toast.error("Enter a valid quantity")
      return
    }
    try {
      setLoading(true)
      const res = await axios.post(
        "http://localhost:3000/trade-api/trade",
        { symbol: stock.symbol, type, quantity: Number(quantity) },
        { withCredentials: true }
      )
      const newWallet = res.data.payload.wallet

      // 1. Update wallet in Sidebar via authStore
      if (updateWallet) updateWallet(newWallet)

      // 2. Update portfolio/trades in AppContext — this fixes Dashboard stats
      if (type === "BUY") buyStock(stock)
      else sellStock(stock)

      toast.success(
        `${type === "BUY" ? "Bought" : "Sold"} ${quantity} ${stock.symbol} · Wallet: ₹${newWallet.toLocaleString("en-IN")}`
      )
    } catch (err) {
      toast.error(err.response?.data?.payload || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow p-4 rounded space-y-3">
      <div>
        <h2 className="font-bold text-lg">{stock.symbol}</h2>
        {stock.companyName && (
          <p className="text-gray-500 text-sm">{stock.companyName}</p>
        )}
        <p className="text-xl font-semibold mt-1">₹{stock.price}</p>
        {stock.change && (
          <p className={stock.change.toString().includes("-") ? "text-red-500 text-sm" : "text-green-500 text-sm"}>
            {stock.change}
          </p>
        )}
        {/* OHLC row */}
        {(stock.open || stock.high || stock.low) && (
          <div className="flex gap-3 mt-2 text-xs text-gray-500">
            <span>O: <span className="font-medium text-gray-700">{stock.open}</span></span>
            <span>H: <span className="font-medium text-green-600">{stock.high}</span></span>
            <span>L: <span className="font-medium text-red-500">{stock.low}</span></span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Qty</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border rounded px-2 py-1 w-20 text-center text-sm"
        />
      </div>

      <div className="flex gap-2">
        <button
          disabled={loading}
          onClick={() => executeTrade("BUY")}
          className="bg-green-500 text-white px-4 py-1 rounded flex-1 hover:bg-green-600 disabled:opacity-50 text-sm font-semibold"
        >
          {loading ? "..." : "Buy"}
        </button>
        <button
          disabled={loading}
          onClick={() => executeTrade("SELL")}
          className="bg-red-500 text-white px-4 py-1 rounded flex-1 hover:bg-red-600 disabled:opacity-50 text-sm font-semibold"
        >
          {loading ? "..." : "Sell"}
        </button>
      </div>
    </div>
  )
}

export default StockCard