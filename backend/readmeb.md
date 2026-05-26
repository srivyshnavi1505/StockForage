# StockForage — Backend

Node.js + Express API server for StockForage. Handles authentication, live stock data from Finnhub, trade execution, portfolio management, and scheduled snapshots.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Node.js** + **Express 5** | HTTP server & routing |
| **MongoDB** + **Mongoose** | Database & ODM |
| **Finnhub API** | Live US stock quotes & company symbols (free tier) |
| **Yahoo Finance API** | Historical OHLC chart data (free, no key needed) |
| **JWT** + **bcryptjs** | Authentication & password hashing |
| **node-cron** | Scheduled stock & portfolio snapshots (every 5 min) |
| **In-memory cache** | Rate-limit-friendly caching (quotes 15s, symbols 5min, history 10min) |

---

## Project Structure

```
backend/
├── APIS/
│   ├── UserAPI.js              # Registration, login, logout routes
│   ├── TradeAPI.js             # Buy/sell execution, trade history
│   ├── PortfolioAPI.js         # Holdings, P&L, portfolio history
│   └── fetchStockInfoAPI.js    # Quotes, symbols, batch fetch, OHLC history
├── models/
│   ├── usermodel.js            # User schema
│   ├── Portfolio.js            # Holdings per user
│   ├── PortfolioSnapshot.js    # Periodic portfolio value snapshots
│   ├── Trade.js                # Individual trade records
│   ├── StockSnapshot.js        # OHLC price snapshots
│   ├── Watchlist.js            # User watchlists
│   └── AlertModel.js           # Price alert definitions
├── services/
│   ├── Authservices.js         # Password hashing & JWT generation
│   ├── TradeService.js         # Core trade execution logic
│   └── PortfolioService.js     # Live P&L calculation
├── middlewares/
│   └── verifyToken.js          # JWT auth middleware
├── crons/
│   └── SnapshotCron.js         # Scheduled stock & portfolio snapshot jobs
├── server.js                   # Express app entry point
└── .env                        # Environment variables
```

---

## API Reference

### User API — `/user-api`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/user` | ❌ | Register new user |
| POST | `/login` | ❌ | Login; sets HTTP-only JWT cookie |
| POST | `/logout` | ✅ | Clear session cookie |
| GET | `/users` | ✅ | Get all users (leaderboard data) |
| GET | `/verify` | ✅ | Verify current JWT session |

### Stock API — `/stock`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/symbols` | ✅ | Top 1,000 US stock symbols (cached 5 min) |
| POST | `/batch` | ✅ | Batch quotes for multiple symbols in one call |
| GET | `/history/:symbol` | ✅ | Historical OHLC data via Yahoo Finance; `?days=7\|30\|90` |
| GET | `/:symbol` | ✅ | Single stock live quote (cached 15s) |

### Trade API — `/trade-api`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/trade` | ✅ | Execute buy or sell trade |
| GET | `/trades` | ✅ | Paginated trade history; `?page=1&type=BUY\|SELL` |

### Portfolio API — `/portfolio-api`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/portfolio` | ✅ | All holdings with live P&L |
| GET | `/portfolio/history` | ✅ | Portfolio value snapshots over time |
| GET | `/portfolio/summary` | ✅ | Aggregate totals (invested, current value, P&L) |

---

## Data Models

### User
- `username`, `email`, `passwordHash`
- `walletBalance` — starts at ₹10,00,000

### Portfolio
- `userId`, `symbol`, `companyName`
- `quantity`, `averageBuyPrice`

### Trade
- `userId`, `symbol`, `type` (BUY/SELL)
- `quantity`, `price`, `timestamp`

### PortfolioSnapshot
- `userId`, `totalValue`, `investedValue`, `pnl`
- `createdAt` — recorded every 5 minutes by cron

### StockSnapshot
- `symbol`, `open`, `high`, `low`, `close`
- `createdAt` — for charting history

---

## Caching Strategy

All Finnhub calls go through an in-memory cache to avoid hitting rate limits on the free tier:

| Data | TTL |
|------|-----|
| Single stock quote | 15 seconds |
| Symbol list (1,000 stocks) | 5 minutes |
| Historical OHLC | 10 minutes |

Batch quote fetches (`POST /stock/batch`) make a single Finnhub call to load all stocks for a dashboard page.

---

## Scheduled Jobs

`SnapshotCron.js` runs two jobs every 5 minutes via `node-cron`:

1. **Stock Snapshot** — records current OHLC prices for tracked symbols into `StockSnapshot`
2. **Portfolio Snapshot** — calculates and saves each user's total portfolio value into `PortfolioSnapshot`

These snapshots power the portfolio history chart on the frontend.

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas cluster (or local MongoDB instance)
- Finnhub API key — free at [finnhub.io](https://finnhub.io)

### Install

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MONGO_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/stockforage
FINN_APIKEY=your_finnhub_api_key
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Run

```bash
node server.js
```

Server starts at **http://localhost:5000**.

---

## Trade Execution Logic

Handled in `TradeService.js`:

- **BUY** — validates sufficient wallet balance, deducts cost, upserts holding in `Portfolio`, records `Trade`
- **SELL** — validates user owns sufficient quantity, credits proceeds to wallet, updates/removes holding, records `Trade`
- All operations are atomic per trade; wallet and portfolio update together

---

## Authentication Flow

1. `POST /user-api/login` — verifies credentials, signs JWT, sets it as an HTTP-only cookie
2. `verifyToken.js` middleware — reads cookie, verifies JWT, attaches `req.user` to protected routes
3. `GET /user-api/verify` — used by the frontend on load to restore session state
4. `POST /user-api/logout` — clears the cookie

---

## License

ISC