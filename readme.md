# 📈 StockForage — Live Stock Market Simulator

StockForage is a full-stack stock market simulator web application that allows users to practice stock trading using a virtual wallet. Users can buy and sell stocks, track profits/losses, monitor portfolios, and compete on the leaderboard.

---

# 🚀 Features

## 👤 Authentication
- User Registration
- User Login
- Logout Functionality
- Dynamic User Profile Sidebar

## 💰 Trading Features
- Virtual Wallet
- Buy Stocks
- Sell Stocks
- Portfolio Tracking
- Profit / Loss Calculation
- Trade History Tracking

## 📊 Dashboard
- Wallet Balance
- Portfolio Value
- Total Profit
- Stock Market Cards
- Responsive UI

## 🏆 Leaderboard
- Dynamic Leaderboard
- Profit-based Ranking
- Database Connected Users

## 🎨 UI Features
- Responsive Design
- Fixed Sidebar
- Toast Notifications
- Loading Skeletons
- Tailwind CSS Styling

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- React Hot Toast
- Context API

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

---

#  Project Structure

```bash
StockForage
│
├── backend
│   ├── APIs
│   ├── models
│   ├── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── assets
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/StockForage.git
```

---

# 🔧 Backend Setup

## Move to backend folder

```bash
cd backend
```

## Install dependencies

```bash
npm install
```

## Start backend server

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:3000
```

---

# 💻 Frontend Setup

## Move to frontend folder

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

## Run frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🗄️ MongoDB Setup

Make sure MongoDB is running locally.

Connection used:

```js
mongodb://localhost:27017/stocks
```

---

# 📌 API Endpoints

## Get Users

```http
GET /user-api/users
```

## Register User

```http
POST /user-api/user
```


## Dashboard
- Wallet Balance
- Market Cards
- Fixed Sidebar
- Portfolio Tracking

## Leaderboard
- Dynamic User Rankings
- Profit/Loss Display


