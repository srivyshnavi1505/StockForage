import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import StockCard from "../components/StockCard";
import SearchBar from "../components/SearchBar";
import StockPriceChart from "../components/StockPriceChart";
import PortfolioHistoryChart from "../components/PortfolioHistoryChart";
import { useApp } from "../context/AppContext";
import axios from "axios";

const PAGE_SIZE = 12;

function Dashboard() {

const { wallet, portfolioValue, totalProfit } = useApp();

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

<div className="bg-gray-100 min-h-screen">

<div className="flex">

<Sidebar/>

<div className="flex-1 p-6">

{/* Dashboard Cards */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

<div className="bg-white shadow p-6 rounded-lg">
<h3 className="text-gray-500">Wallet Balance</h3>
<p className="text-2xl font-bold">${wallet}</p>
</div>

<div className="bg-white shadow p-6 rounded-lg">
<h3 className="text-gray-500">Portfolio Value</h3>
<p className="text-2xl font-bold">${portfolioValue}</p>
</div>

<div className="bg-white shadow p-6 rounded-lg">
<h3 className="text-gray-500">Total Profit</h3>
<p className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
${totalProfit}
</p>
</div>

</div>

{/* Stock Price Chart */}

<div className="mb-6">
  <StockPriceChart
    symbol={selectedStock?.symbol}
    companyName={selectedStock?.companyName}
  />
</div>

{/* Search + Market Section */}

<div className="bg-white shadow rounded-lg p-6">

{/* Search Bar */}
<div className="mb-4">
  <SearchBar
    allSymbols={allSymbols}
    onSelectStock={(stock) => setSelectedStock(stock)}
  />
</div>

<div className="flex items-center justify-between mb-4">
  <h2 className="text-xl font-bold">
    Market
    {!loadingSymbols && allSymbols.length > 0 && (
      <span className="text-sm font-normal text-gray-400 ml-2">
        ({allSymbols.length.toLocaleString()} companies · showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, allSymbols.length)})
      </span>
    )}
  </h2>
  <div className="flex items-center gap-2">
    <button
      disabled={page === 0 || loadingStocks}
      onClick={() => setPage(p => p - 1)}
      className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
    >
      ← Prev
    </button>
    <span className="text-sm text-gray-500">Page {page + 1}{allSymbols.length > 0 ? ` / ${Math.ceil(allSymbols.length / PAGE_SIZE)}` : ''}</span>
    <button
      disabled={(page + 1) * PAGE_SIZE >= allSymbols.length || loadingStocks}
      onClick={() => setPage(p => p + 1)}
      className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
    >
      Next →
    </button>
  </div>
</div>

<div className="grid md:grid-cols-2 gap-4">

{loadingSymbols
  ? <p className="text-gray-400 col-span-2 text-center py-4">Loading available stocks...</p>
  : loadingStocks
  ? <p className="text-gray-400 col-span-2 text-center py-4">Fetching live prices...</p>
  : stocks.map((stock, index) => (
    <StockCard key={index} stock={stock} />
  ))
}

</div>

</div>

{/* Portfolio History Chart */}

<div className="mt-6">
  <PortfolioHistoryChart />
</div>

</div>

</div>

</div>

);

}

export default Dashboard;