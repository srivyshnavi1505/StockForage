import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import StockCard from "../components/StockCard";
import SearchBar from "../components/SearchBar";
import StockPriceChart from "../components/StockPriceChart";
import PortfolioHistoryChart from "../components/PortfolioHistoryChart";
import axios from "axios";

const PAGE_SIZE = 12;

function Dashboard() {

const [dashboardData, setDashboardData] = useState({
  walletBalance: 0,
  portfolioValue: 0,
  totalProfit: 0
});

useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/portfolio-api/portfolio", {
        withCredentials: true
      });
      if (res.data.payload) {
        setDashboardData({
          walletBalance: res.data.payload.walletBalance || 0,
          portfolioValue: res.data.payload.summary?.totalValue || 0,
          totalProfit: res.data.payload.summary?.totalPnl || 0
        });
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };
  fetchDashboardData();
}, []);

const { walletBalance, portfolioValue, totalProfit } = dashboardData;

// All available symbols (symbol + companyName) from Finnhub
const [allSymbols, setAllSymbols] = useState([]);
const [page, setPage] = useState(0);

// Live quote data for the current page
const [stocks, setStocks] = useState([]);
const [loadingStocks, setLoadingStocks] = useState(true);
const [loadingSymbols, setLoadingSymbols] = useState(true);

// Selected stock for chart display (from search or click)
const [selectedStock, setSelectedStock] = useState(null);

// Step 1: Fetch full symbol list once on mount
useEffect(() => {
  const fetchSymbols = async () => {
    try {
      setLoadingSymbols(true);
      const res = await axios.get("http://localhost:3000/stock/symbols", { withCredentials: true });
      setAllSymbols(res.data.payload || []);
    } catch (err) {
      console.error("Failed to fetch symbol list:", err);
    } finally {
      setLoadingSymbols(false);
    }
  };
  fetchSymbols();
}, []);

// Step 2: Whenever page or symbol list changes, fetch quotes via batch endpoint
useEffect(() => {
  if (!allSymbols.length) return;

  const pageSymbols = allSymbols.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  let isFirstLoad = true;
  const fetchQuotes = async () => {
    try {
      if (isFirstLoad) setLoadingStocks(true);

      // Single batch call instead of N individual calls
      const res = await axios.post(
        "http://localhost:3000/stock/batch",
        { symbols: pageSymbols.map((s) => s.symbol) },
        { withCredentials: true }
      );

      const quotes = res.data.payload || {};
      const liveStocks = pageSymbols
        .map((s) => {
          const q = quotes[s.symbol];
          if (!q) return null;
          return {
            symbol: s.symbol,
            companyName: s.companyName,
            price: q.current,
            open: q.open,
            high: q.high,
            low: q.low,
            change: q.change,
          };
        })
        .filter(Boolean)
        .sort((a, b) => (b.price || 0) - (a.price || 0));
      setStocks(liveStocks);
    } catch (err) {
      console.error("Failed to fetch stock quotes:", err);
    } finally {
      if (isFirstLoad) { setLoadingStocks(false); isFirstLoad = false; }
    }
  };

  fetchQuotes();
  const interval = setInterval(fetchQuotes, 60000);
  return () => clearInterval(interval);
}, [allSymbols, page]);

return (

<div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#111827] text-white">

<div className="flex gap-6 p-6 bg-[#020617] min-h-screen">

<Sidebar />

<div className="flex-1 overflow-auto rounded-[32px]">

<div className="p-10 max-w-[1400px] mx-auto">

{/* HERO */}

<div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/20 border border-white/10 backdrop-blur-xl p-10 mb-10">

<div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full"></div>

<div className="relative z-10">

<h1 className="text-6xl font-extrabold leading-tight mb-4">

Trade Stocks <br />

<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
Risk Free
</span>

</h1>

<p className="text-gray-300 text-lg max-w-2xl mb-8">
Practice real-time trading using virtual money and improve your investing skills.
</p>

<button className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-2xl font-semibold shadow-2xl hover:scale-105 transition">
Explore Market
</button>

</div>

</div>

{/* STATS */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">

<h3 className="text-gray-400 text-sm uppercase tracking-wider">
Wallet Balance
</h3>

<p className="text-4xl font-bold mt-3 text-cyan-400">
₹{walletBalance.toFixed(2)}
</p>

</div>

<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">

<h3 className="text-gray-400 text-sm uppercase tracking-wider">
Portfolio Value
</h3>

<p className="text-4xl font-bold mt-3 text-purple-400">
₹{portfolioValue.toFixed(2)}
</p>

</div>

<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">

<h3 className="text-gray-400 text-sm uppercase tracking-wider">
Total Profit
</h3>

<p
className={`text-4xl font-bold mt-3 ${
totalProfit >= 0
? "text-green-400"
: "text-red-400"
}`}
>
₹{totalProfit.toFixed(2)}
</p>

</div>

<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">

<h3 className="text-gray-400 text-sm uppercase tracking-wider">
Market Status
</h3>

<p className="text-4xl font-bold mt-3 text-orange-400">
OPEN
</p>

</div>

</div>

{/* STOCK CHART */}

<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl mb-10">

{/* HEADER */}

<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

<h2 className="text-3xl font-bold">
Company Specific Analytics
</h2>

<div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-3 w-full lg:w-[350px]">

<SearchBar
allSymbols={allSymbols}
onSelectStock={(stock) => setSelectedStock(stock)}
/>

</div>

</div>

{/* CHART */}

<div className="w-full">

<StockPriceChart
symbol={selectedStock?.symbol}
companyName={selectedStock?.companyName}
/>

</div>

</div>

{/* MARKET */}

<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl">

<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

<div>

<h2 className="text-3xl font-bold">
Market Overview
</h2>

<p className="text-gray-400 mt-1">

{!loadingSymbols && allSymbols.length > 0 && (
<>
{allSymbols.length.toLocaleString()} companies · showing{" "}
{page * PAGE_SIZE + 1}–
{Math.min((page + 1) * PAGE_SIZE, allSymbols.length)}
</>
)}

</p>

</div>

<div className="flex items-center gap-3">

<button
disabled={page === 0 || loadingStocks}
onClick={() => setPage((p) => p - 1)}
className="px-5 py-2 rounded-2xl bg-white/10 border border-white/10 disabled:opacity-40 hover:bg-white/20 transition"
>
← Prev
</button>

<button
disabled={(page + 1) * PAGE_SIZE >= allSymbols.length || loadingStocks}
onClick={() => setPage((p) => p + 1)}
className="px-5 py-2 rounded-2xl bg-cyan-500 hover:bg-cyan-600 transition disabled:opacity-40"
>
Next →
</button>

</div>

</div>

<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

{loadingSymbols ? (

<p className="text-gray-400 col-span-full text-center py-10">
Loading available stocks...
</p>

) : loadingStocks ? (

<p className="text-gray-400 col-span-full text-center py-10">
Fetching live prices...
</p>

) : (

stocks.map((stock, index) => (
<StockCard key={index} stock={stock} />
))

)}

</div>

</div>

{/* PORTFOLIO HISTORY */}

<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl mt-10">

<h2 className="text-2xl font-bold mb-6">
Portfolio Performance
</h2>

<PortfolioHistoryChart />

</div>

</div>

</div>

</div>

</div>

);

}

export default Dashboard;