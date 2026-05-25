# StockForage — Frontend

React + Vite client for the StockForage live stock market simulator. Lets users browse real US stock prices, trade with a virtual wallet, track portfolio performance, and compete on a leaderboard.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| **React 19** + **Vite 8** | UI framework & build tool |
| **Tailwind CSS** | Utility-first styling |
| **Recharts** | Stock price line charts (OHLC) |
| **Chart.js** + **react-chartjs-2** | Portfolio history charts |
| **Zustand** | Auth state management |
| **React Context API** | App-wide wallet & trading state |
| **React Router DOM** | Client-side routing |
| **React Hot Toast** | Toast notifications |
| **Axios** | HTTP client for API calls |

---

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx                  # Top navigation bar
│   │   ├── Sidebar.jsx                 # User profile sidebar
│   │   ├── StockCard.jsx               # Stock card with O/H/L stats + buy/sell
│   │   ├── SearchBar.jsx               # Debounced stock search with dropdown
│   │   ├── StockPriceChart.jsx         # Recharts OHLC line chart
│   │   └── PortfolioHistoryChart.jsx   # Chart.js portfolio value over time
│   ├── pages/
│   │   ├── Landing.jsx                 # Public landing page
│   │   ├── Login.jsx                   # Login form
│   │   ├── Register.jsx                # Registration form
│   │   ├── Dashboard.jsx               # Main dashboard (charts + market grid)
│   │   ├── Portfolio.jsx               # Holdings table + history chart
│   │   ├── TradeHistory.jsx            # Paginated trade log
│   │   └── Leaderboard.jsx             # Profit-based user rankings
│   ├── context/
│   │   └── AppContext.jsx              # Wallet, portfolio, trades state
│   ├── stores/
│   │   └── authStore.js                # Zustand auth store
│   ├── App.jsx                         # Route definitions
│   └── main.jsx                        # Entry point
└── package.json
```

---

## Pages & Features

### Dashboard (`/dashboard`)
- **Summary cards** — Wallet Balance, Portfolio Value, Total Profit
- **Stock Search Bar** — search 1,000 stocks by symbol or name; debounced dropdown
- **Stock Price Chart** — interactive Recharts line chart with Close/High/Low lines; toggle 7D / 30D / 90D
- **Market Grid** — paginated stock cards (12/page) sorted by price; shows Open, High, Low stats with buy/sell buttons

### Portfolio (`/portfolio`)
- Holdings table with live P&L per stock
- Summary cards — Invested, Current Value, Total P&L, Returns %
- Portfolio history chart (Chart.js) showing value trajectory over time
- Refresh button to pull latest live data

### Trade History (`/trades`)
- Paginated trade log with BUY / SELL filter
- Timestamps and full trade details per entry

### Leaderboard (`/leaderboard`)
- Live profit-based rankings across all registered users

### Auth Pages
- `/register` — new user registration
- `/login` — JWT login; session stored via HTTP-only cookie

---

## State Management

- **Zustand (`authStore.js`)** — holds authenticated user info; persists across page refreshes
- **React Context (`AppContext.jsx`)** — wallet balance, portfolio holdings, and trade list; shared across Dashboard, Portfolio, and Trade History pages

---

## Getting Started

### Prerequisites
- Node.js v18+
- Backend server running (see backend README)

### Install & Run

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

### Environment
No `.env` file required on the frontend by default. API calls proxy to the backend at `http://localhost:5000` (configure in `vite.config.js` if needed).

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server at port 5173 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |

---

## API Integration

The frontend communicates with the following backend base routes:

| Route | Used By |
|-------|---------|
| `/user-api` | Login, Register, Logout, Verify session |
| `/stock` | Fetch symbols, batch quotes, OHLC history |
| `/trade-api` | Execute trades, fetch trade history |
| `/portfolio-api` | Holdings, P&L summary, portfolio history |

All requests are made via Axios. Auth state is verified on app load via `GET /user-api/verify`.

---

## License

ISC