import { useState, useMemo } from "react"
import toast from "react-hot-toast"
import { useAuth, api } from "../stores/authStore"
import { ResponsiveContainer, LineChart, Line } from "recharts"

function StockCard({ stock, onClick }) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const refreshDashboard = useAuth((state) => state.refreshDashboard)
  const watchlist = useAuth((state) => state.watchlist) || []
  const toggleWatchlist = useAuth((state) => state.toggleWatchlist)
  
  const isWatched = watchlist.includes(stock.symbol)

  const isUp = stock.change && !stock.change.toString().includes("-")
  
  // Simulate a 7-point sparkline based on current price and daily trend
  const sparklineData = useMemo(() => {
    const base = Number(stock.price) || 100
    const changePct = stock.change ? parseFloat(stock.change) : 0
    let current = base - (base * (changePct / 100))
    const step = (base - current) / 6
    
    return Array.from({ length: 7 }).map((_, i) => {
      const val = current + (step * i) + (Math.random() * (base * 0.005) * (Math.random() > 0.5 ? 1 : -1))
      return { val }
    })
  }, [stock.price, stock.change])

  const executeTrade = async (type) => {
    if (!quantity || quantity < 1) {
      toast.error("Enter a valid quantity")
      return
    }
    try {
      setLoading(true)
      const res = await api.post(
        "/trade-api/trade",
        { symbol: stock.symbol, type, quantity: Number(quantity) }
      )
      const newWallet = res.data.payload.wallet

      // Refresh wallet + portfolio value from the server
      await refreshDashboard()

      toast.success(
        `${type === "BUY" ? "Bought" : "Sold"} ${quantity} ${stock.symbol} · Wallet: ₹${newWallet.toLocaleString("en-IN")}`
      )
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.payload || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      onClick={() => onClick && onClick(stock)}
      className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-xl transition-all duration-300 hover:bg-white/15 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between cursor-pointer"
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="font-bold text-xl text-white tracking-wide">{stock.symbol}</h2>
            {stock.companyName && (
              <p className="text-gray-400 text-xs truncate max-w-[120px]">{stock.companyName}</p>
            )}
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); toggleWatchlist(stock.symbol); }}
            className="text-2xl hover:scale-110 transition-transform focus:outline-none"
            title="Toggle Watchlist"
          >
            {isWatched ? "⭐" : "☆"}
          </button>
        </div>

        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-2xl font-bold text-white mt-1">₹{stock.price}</p>
            {stock.change && (
              <p className={`font-semibold text-sm ${isUp ? "text-green-400" : "text-red-400"}`}>
                {isUp ? "▲" : "▼"} {stock.change}
              </p>
            )}
          </div>
          
          <div className="w-20 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line 
                  type="monotone" 
                  dataKey="val" 
                  stroke={isUp ? "#22c55e" : "#ef4444"} 
                  strokeWidth={2} 
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* OHLC row */}
        {(stock.open || stock.high || stock.low) && (
          <div className="flex gap-4 mt-3 mb-4 text-[10px] text-gray-400 font-mono bg-black/20 p-2 rounded-xl">
            <span className="flex flex-col"><span>OPN</span><span className="text-gray-200">{stock.open}</span></span>
            <span className="flex flex-col"><span>HGH</span><span className="text-green-400">{stock.high}</span></span>
            <span className="flex flex-col"><span>LOW</span><span className="text-red-400">{stock.low}</span></span>
          </div>
        )}
      </div>

      <div className="space-y-3 mt-auto">
        <div className="flex items-center gap-3 bg-black/20 p-1.5 rounded-2xl">
          <label className="text-xs text-gray-400 ml-2 font-semibold tracking-wider">QTY</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setQuantity(e.target.value)}
            className="bg-transparent text-white font-mono font-bold px-2 py-1 w-full text-center outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            disabled={loading}
            onClick={(e) => { e.stopPropagation(); executeTrade("BUY"); }}
            className="bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 rounded-xl flex-1 hover:bg-green-500 hover:text-white transition-colors disabled:opacity-50 text-sm font-bold tracking-wider"
          >
            BUY
          </button>
          <button
            disabled={loading}
            onClick={(e) => { e.stopPropagation(); executeTrade("SELL"); }}
            className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl flex-1 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 text-sm font-bold tracking-wider"
          >
            SELL
          </button>
        </div>
      </div>
    </div>
  )
}

export default StockCard