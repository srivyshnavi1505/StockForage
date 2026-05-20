# StockForage — Live Stock Market Simulator

StockForage is a full-stack stock market simulator that lets users practice stock trading with a virtual wallet. Buy and sell real US stocks at live Finnhub prices, track your portfolio performance with interactive charts, and compete on the leaderboard.

---

## Features

### Authentication
- User registration & login with JWT
- Session verification with HTTP-only cookies
- Dynamic user profile sidebar
- Secure logout

### Live Market Data
- Real-time stock prices from **Finnhub API**
- 1,000 curated US companies (FAANG, mega caps, tech, pharma, EVs + more)
- Open / High / Low / Close (OHLC) data for every stock
- In-memory caching (15s quotes, 5min symbol list) to stay within API rate limits
- Batch quote fetching — single API call loads all stocks per page

### Trading
- Virtual wallet (₹1,00,000 starting balance)
- Buy & sell stocks at live market prices
- Quantity input per trade
- Real-time wallet balance updates
- Trade validation (insufficient funds, can't sell unowned stocks)

### Dashboard
- **Wallet Balance**, **Portfolio Value**, **Total Profit** summary cards
- **Stock Search Bar** — search 1,000 stocks by symbol or company name with debounced dropdown
- **Stock Price Chart** (Recharts) — interactive line chart with Close/High/Low lines and 7D/30D/90D toggle
- **Market Grid** — paginated stock cards (12 per page) sorted by price, with O/H/L stats
- **Portfolio History Chart** (Chart.js) — portfolio value, total value, and P&L over time

### Portfolio
- Holdings table with live P&L per stock
- Summary cards (Invested, Current Value, Total P&L, Returns %)
- Portfolio history chart showing value trajectory over time
- Refresh button for latest data

### Trade History
- Paginated trade log with buy/sell filters
- Timestamps and trade details

### Leaderboard
- Profit-based ranking across all users
- Database-connected live standings

---

## Tech Stack

### Frontend
- **React 19** + **Vite 8**
- **Tailwind CSS** for styling
- **Recharts** — stock price line charts
- **Chart.js** + **react-chartjs-2** — portfolio history charts
- **Zustand** — auth state management
- **React Context API** — app-wide trading state
- **React Router DOM** — client-side routing
- **React Hot Toast** — notifications
- **Axios** — HTTP client

### Backend
- **Node.js** + **Express 5**
- **MongoDB** + **Mongoose** — database & ODM
- **Finnhub API** — live stock quotes & company symbols (free tier)
- **Yahoo Finance API** — historical OHLC chart data (free, no API key)
- **JWT** + **bcryptjs** — authentication
- **node-cron** — stock & portfolio snapshots every 5 minutes
- **In-memory cache** — rate limit friendly caching layer (quotes 15s, symbols 5min, history 10min)

---

## Project Structure

```
StockForage/
├── backend/
│   ├── APIS/
│   │   ├── UserAPI.js            # Registration, login, logout
│   │   ├── TradeAPI.js           # Buy/sell execution, trade history
│   │   ├── PortfolioAPI.js       # Holdings, P&L, portfolio history
│   │   └── fetchStockInfoAPI.js  # Quotes, symbols, batch, history
│   ├── models/
│   │   ├── usermodel.js          # User schema
│   │   ├── Portfolio.js          # Holdings per user
│   │   ├── PortfolioSnapshot.js  # Daily portfolio value snapshots
│   │   ├── Trade.js              # Trade records
│   │   ├── StockSnapshot.js      # OHLC price snapshots
│   │   ├── Watchlist.js          # User watchlists
│   │   └── AlertModel.js         # Price alerts
│   ├── services/
│   │   ├── Authservices.js       # Password hashing, JWT generation
│   │   ├── TradeService.js       # Trade execution logic
│   │   └── PortfolioService.js   # Live P&L calculation
│   ├── middlewares/
│   │   └── verifyToken.js        # JWT auth middleware
│   ├── crons/
│   │   └── SnapshotCron.js       # Scheduled stock & portfolio snapshots
│   ├── server.js                 # Express app entry point
│   └── .env                      # MONGO_URL, FINN_APIKEY, JWT_SECRET
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StockCard.jsx           # Stock card with O/H/L + buy/sell
│   │   │   ├── SearchBar.jsx           # Debounced stock search dropdown
│   │   │   ├── StockPriceChart.jsx     # Recharts line chart (OHLC)
│   │   │   └── PortfolioHistoryChart.jsx # Chart.js portfolio history
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx           # Main dashboard with charts
│   │   │   ├── Portfolio.jsx           # Holdings + history chart
│   │   │   ├── TradeHistory.jsx
│   │   │   └── Leaderboard.jsx
│   │   ├── context/
│   │   │   └── AppContext.jsx          # Wallet, portfolio, trades state
│   │   ├── stores/
│   │   │   └── authStore.js            # Zustand auth store
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── readme.md
```

---

## API Endpoints

### User API (`/user-api`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/user` | Register new user |
| POST | `/login` | Login |
| POST | `/logout` | Logout |
| GET | `/users` | Get all users |
| GET | `/verify` | Verify JWT session |

### Stock API (`/stock`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/symbols` | Top 1,000 US stock symbols (cached 5min) |
| POST | `/batch` | Batch quotes for multiple symbols |
| GET | `/history/:symbol?days=30` | Historical OHLC data via Yahoo Finance |
| GET | `/:symbol` | Single stock quote (cached 15s) |

### Trade API (`/trade-api`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/trade` | Execute buy/sell trade |
| GET | `/trades?page=1&type=BUY` | Paginated trade history |

### Portfolio API (`/portfolio-api`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/portfolio` | Holdings with live P&L |
| GET | `/portfolio/history` | Portfolio value snapshots |
| GET | `/portfolio/summary` | Portfolio totals |

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Finnhub API key (free at [finnhub.io](https://finnhub.io))

### 1. Clone & Install

```bash
git clone https://github.com/srivyshnavi1505/StockForage.git
cd StockForage

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Create `backend/.env`:
```env
MONGO_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/stockforage
FINN_APIKEY=your_finnhub_api_key
JWT_SECRET=your_jwt_secret
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend
node server.js

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Screenshots

> *Coming soon — register, dashboard with charts, portfolio, and leaderboard views.*

---

## License

ISC
