# StockForage — Live Stock Market Simulator

StockForage is a full-stack stock market simulator web application that allows users to practice stock trading using a virtual wallet. Users can buy and sell stocks, track profits/losses, monitor portfolios, and compete on the leaderboard.

---

#  Features

##  Authentication
- User Registration
- User Login
- Logout Functionality
- Dynamic User Profile Sidebar

##  Trading Features
- Virtual Wallet
- Buy Stocks
- Sell Stocks
- Portfolio Tracking
- Profit / Loss Calculation
- Trade History Tracking

## Dashboard
- Wallet Balance
- Portfolio Value
- Total Profit
- Stock Market Cards
- Responsive UI

##  Leaderboard
- Dynamic Leaderboard
- Profit-based Ranking
- Database Connected Users

## UI Features
- Responsive Design
- Fixed Sidebar
- Toast Notifications
- Loading Skeletons
- Tailwind CSS Styling

---

#  Tech Stack

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


#  API Endpoints

## Get Users

```http
GET /user-api/users
```

## Register User

```http
POST /user-api/user
```


