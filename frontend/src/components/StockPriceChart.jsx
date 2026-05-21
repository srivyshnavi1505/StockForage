import { useState, useEffect } from "react"
import { api, useAuth } from "../stores/authStore"
import { useApp } from "../context/AppContext"
import toast from "react-hot-toast"
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, ComposedChart, Line
} from "recharts"

const CustomTooltip = ({ active, payload, label, startPrice }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const currentPrice = data.Close
    const change = currentPrice - startPrice
    const changePct = startPrice > 0 ? (change / startPrice) * 100 : 0
    const isUp = change >= 0
    const smaVal = payload.find(p => p.dataKey === "SMA")?.value

    return (
      <div className="bg-[#111827] border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
        <p className="text-gray-400 text-xs mb-2 font-mono tracking-wider">{label}</p>
        <p className="text-white font-bold text-2xl mb-1">₹{currentPrice?.toFixed(2)}</p>
        <div className="flex gap-4">
          <p className={`text-sm font-bold tracking-wider ${isUp ? "text-green-400" : "text-red-400"}`}>
            {isUp ? "▲" : "▼"} ₹{Math.abs(change).toFixed(2)} ({Math.abs(changePct).toFixed(2)}%)
          </p>
          {smaVal && (
            <p className="text-purple-400 text-sm font-bold tracking-wider">
              SMA: ₹{smaVal.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    )
  }
  return null
}

function StockPriceChart({ stock }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("1M")
  
  const [details, setDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  
  const [quantity, setQuantity] = useState(1)
  const [tradeLoading, setTradeLoading] = useState(false)

  const watchlist = useAuth((state) => state.watchlist) || []
  const toggleWatchlist = useAuth((state) => state.toggleWatchlist)
  const isWatched = stock ? watchlist.includes(stock.symbol) : false
  
  const updateWallet = useAuth((state) => state.updateWallet)
  const { buyStock, sellStock } = useApp()

  useEffect(() => {
    if (!stock?.symbol) return

    const fetchHistory = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/stock/history/${stock.symbol}?timeframe=${timeframe}`)
        const raw = res.data.payload || []
        
        const formatted = raw.map((d) => ({
          date: new Date(d.date).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: timeframe === '1D' || timeframe === '1W' ? '2-digit' : undefined,
            minute: timeframe === '1D' || timeframe === '1W' ? '2-digit' : undefined,
          }),
          Open: d.open,
          High: d.high,
          Low: d.low,
          Close: d.close,
        }))
        
        // Calculate SMA (Simple Moving Average) - period of 7
        const SMA_PERIOD = 7;
        const withSMA = formatted.map((d, i, arr) => {
            if (i < SMA_PERIOD - 1) return { ...d, SMA: null };
            let sum = 0;
            for(let j = 0; j < SMA_PERIOD; j++) {
                sum += arr[i - j].Close;
            }
            return { ...d, SMA: sum / SMA_PERIOD };
        });

        setData(withSMA)
      } catch (err) {
        console.error("Failed to fetch stock history:", err)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [stock?.symbol, timeframe])

  useEffect(() => {
    if (!stock?.symbol) return
    const fetchDetails = async () => {
      try {
        setLoadingDetails(true)
        const res = await api.get(`/stock/details/${stock.symbol}`)
        setDetails(res.data.payload)
      } catch (err) {
        console.error("Failed to fetch stock details:", err)
        setDetails(null)
      } finally {
        setLoadingDetails(false)
      }
    }
    fetchDetails()
  }, [stock?.symbol])

  if (!stock?.symbol) return null

  const startPrice = data.length > 0 ? data[0].Close : 0
  const endPrice = data.length > 0 ? data[data.length - 1].Close : 0
  const isUp = endPrice >= startPrice
  const strokeColor = isUp ? "#22c55e" : "#ef4444"
  
  const executeTrade = async (type) => {
    if (!quantity || quantity < 1) {
      toast.error("Enter a valid quantity")
      return
    }
    try {
      setTradeLoading(true)
      const res = await api.post(
        "/trade-api/trade",
        { symbol: stock.symbol, type, quantity: Number(quantity) }
      )
      const newWallet = res.data.payload.wallet

      // Update globally
      if (updateWallet) updateWallet(newWallet)
      if (type === "BUY") buyStock(stock)
      else sellStock(stock)

      toast.success(`${type === "BUY" ? "Bought" : "Sold"} ${quantity} ${stock.symbol}`)
    } catch (err) {
      toast.error(err.response?.data?.payload || err.message)
    } finally {
      setTradeLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
      {/* LEFT COLUMN: Chart + Details */}
      <div className="xl:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h3 className="text-4xl font-extrabold text-white tracking-wide">
                {stock.symbol}
              </h3>
              <button 
                onClick={() => toggleWatchlist(stock.symbol)}
                className="text-3xl hover:scale-110 transition-transform focus:outline-none"
                title="Toggle Watchlist"
              >
                {isWatched ? "⭐" : "☆"}
              </button>
            </div>
            {stock.companyName && (
              <p className="text-base text-gray-400 font-medium">{stock.companyName}</p>
            )}
          </div>
          <div className="flex gap-2 bg-black/20 p-1.5 rounded-2xl overflow-x-auto">
            {["1D", "1W", "1M", "1Y"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 whitespace-nowrap ${
                  timeframe === tf
                    ? "bg-white/20 text-white shadow-lg backdrop-blur-md"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="w-14 h-14 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex justify-center items-center h-[400px] bg-black/10 rounded-2xl border border-white/5">
            <p className="text-gray-400 text-lg font-medium">No historical data available for {stock.symbol}</p>
          </div>
        ) : (
          <div className="h-[320px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#9ca3af", fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={40}
                  dy={10}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#9ca3af", fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  domain={["auto", "auto"]}
                  tickFormatter={(v) => `₹${v.toFixed(0)}`}
                  orientation="right"
                  dx={10}
                />
                <Tooltip
                  content={<CustomTooltip startPrice={startPrice} />}
                  cursor={{ stroke: '#ffffff40', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area
                  type="monotone"
                  dataKey="Close"
                  stroke={strokeColor}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorClose)"
                  isAnimationActive={true}
                  animationDuration={1500}
                />
                <Line
                  type="monotone"
                  dataKey="SMA"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="4 4"
                  isAnimationActive={true}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* COMPANY DETAILS GRID */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {loadingDetails ? (
                <div className="col-span-full text-center text-gray-500 py-4">Fetching live metrics...</div>
            ) : details ? (
                <>
                    <DetailItem label="Market Cap" value={formatCompactNumber(details.marketCap)} />
                    <DetailItem label="Volume" value={formatCompactNumber(details.volume)} />
                    <DetailItem label="P/E Ratio" value={details.peRatio?.toFixed ? details.peRatio.toFixed(2) : details.peRatio} />
                    <DetailItem label="Div Yield" value={details.dividendYield} />
                    <DetailItem label="52W High" value={`₹${details.fiftyTwoWeekHigh?.toFixed ? details.fiftyTwoWeekHigh.toFixed(2) : details.fiftyTwoWeekHigh}`} />
                    <DetailItem label="52W Low" value={`₹${details.fiftyTwoWeekLow?.toFixed ? details.fiftyTwoWeekLow.toFixed(2) : details.fiftyTwoWeekLow}`} />
                </>
            ) : (
                <div className="col-span-full text-center text-gray-500 py-4">Details currently unavailable</div>
            )}
        </div>
      </div>
      
      {/* RIGHT COLUMN: Trading Station */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col">
        <h3 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">Trading Station</h3>
        
        <div className="mb-6 flex flex-wrap justify-between items-center gap-3 bg-black/20 p-4 rounded-2xl border border-white/5">
           <div>
              <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Current Price</p>
              <p className="text-2xl 2xl:text-3xl font-bold text-white mt-1">₹{(stock.price || endPrice)?.toFixed(2)}</p>
           </div>
           {stock.change && (
             <div className={`text-sm 2xl:text-lg font-bold px-3 py-1 rounded-lg ${!stock.change.toString().includes("-") ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"}`}>
                {stock.change}
             </div>
           )}
        </div>

        <div className="space-y-4 mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                <span className="text-sm text-gray-400 font-semibold px-2 uppercase tracking-wider">Quantity</span>
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="bg-white/10 text-white font-bold px-3 py-2 w-20 2xl:w-24 rounded-lg text-center outline-none focus:ring-2 focus:ring-cyan-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-400 px-2 py-2 mb-4">
                <span className="font-semibold uppercase tracking-wider">Total Cost</span>
                <span className="font-bold text-white text-base 2xl:text-lg">₹{((stock.price || endPrice || 0) * quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <div className="flex gap-4 w-full">
                <button
                    disabled={tradeLoading}
                    onClick={() => executeTrade("BUY")}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white py-4 rounded-2xl font-bold tracking-widest shadow-lg shadow-green-500/20 transition-all disabled:opacity-50 hover:-translate-y-1"
                >
                    BUY
                </button>
                <button
                    disabled={tradeLoading}
                    onClick={() => executeTrade("SELL")}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white py-4 rounded-2xl font-bold tracking-widest shadow-lg shadow-red-500/20 transition-all disabled:opacity-50 hover:-translate-y-1"
                >
                    SELL
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}

function DetailItem({ label, value }) {
    return (
        <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex flex-col justify-center">
            <p className="text-gray-400 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-1 truncate">{label}</p>
            <p className="text-white font-bold text-sm sm:text-base truncate" title={value}>{value || "N/A"}</p>
        </div>
    )
}

function formatCompactNumber(number) {
    if (!number || isNaN(number)) return number;
    const formatter = Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 });
    return formatter.format(number);
}

export default StockPriceChart
