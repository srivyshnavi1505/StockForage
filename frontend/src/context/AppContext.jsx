/* eslint-disable react-refresh/only-export-components */

import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useAuth } from "../stores/authStore";

export const AppContext = createContext();

const INITIAL_WALLET = 100000;

// Helper — scoped keys per user so different users don't share data
const storageKey = (userId, key) => `trading_${userId}_${key}`;

const loadFromStorage = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

export const AppProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const userId = currentUser?.id || currentUser?._id || "guest";

  // Load from localStorage on mount (or when user changes)
  const [wallet, setWallet] = useState(() =>
    loadFromStorage(storageKey(userId, "wallet"), INITIAL_WALLET)
  );
  const [portfolio, setPortfolio] = useState(() =>
    loadFromStorage(storageKey(userId, "portfolio"), [])
  );
  const [trades, setTrades] = useState(() =>
    loadFromStorage(storageKey(userId, "trades"), [])
  );

  // Re-initialize state when user logs in/out
  useEffect(() => {
    setWallet(loadFromStorage(storageKey(userId, "wallet"), INITIAL_WALLET));
    setPortfolio(loadFromStorage(storageKey(userId, "portfolio"), []));
    setTrades(loadFromStorage(storageKey(userId, "trades"), []));
  }, [userId]);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(storageKey(userId, "wallet"), JSON.stringify(wallet));
  }, [wallet, userId]);

  useEffect(() => {
    localStorage.setItem(storageKey(userId, "portfolio"), JSON.stringify(portfolio));
  }, [portfolio, userId]);

  useEffect(() => {
    localStorage.setItem(storageKey(userId, "trades"), JSON.stringify(trades));
  }, [trades, userId]);

  // Input validation before any trade
  const validateTrade = (stock, type) => {
    if (!stock?.symbol || typeof stock.price !== "number" || stock.price <= 0) {
      console.error("Invalid stock object:", stock);
      return false;
    }
    if (type === "BUY" && wallet < stock.price) {
      return false; // insufficient funds
    }
    if (type === "SELL") {
      const owned = portfolio.find((s) => s.symbol === stock.symbol);
      if (!owned) return false; // can't sell what you don't own
    }
    return true;
  };

  const buyStock = useCallback((stock) => {
    if (!isAuthenticated) return;
    if (!validateTrade(stock, "BUY")) return;

    setWallet((prev) => prev - stock.price);
    setPortfolio((prev) => [...prev, stock]);
    setTrades((prev) => [
      ...prev,
      { ...stock, type: "BUY", date: new Date().toLocaleDateString() },
    ]);
  }, [wallet, portfolio, isAuthenticated]);

  const sellStock = useCallback((stock) => {
    if (!isAuthenticated) return;
    if (!validateTrade(stock, "SELL")) return;

    setPortfolio((prev) => {
      const index = prev.findIndex((s) => s.symbol === stock.symbol);
      if (index === -1) return prev;
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });

    setWallet((prev) => prev + stock.price);
    setTrades((prev) => [
      ...prev,
      { ...stock, type: "SELL", date: new Date().toLocaleDateString() },
    ]);
  }, [portfolio, isAuthenticated]);

  // Clear all data on logout (called when auth state changes to unauthenticated)
  useEffect(() => {
    if (!isAuthenticated && userId === "guest") {
      setWallet(INITIAL_WALLET);
      setPortfolio([]);
      setTrades([]);
    }
  }, [isAuthenticated]);

  const portfolioValue = portfolio.reduce((total, stock) => total + stock.price, 0);
  const totalProfit = portfolioValue + wallet - INITIAL_WALLET;

  // Convenience: how many shares of a symbol the user holds
  const getHoldings = (symbol) =>
    portfolio.filter((s) => s.symbol === symbol).length;

  const canBuy = (stock) => isAuthenticated && wallet >= stock?.price;
  const canSell = (symbol) => isAuthenticated && getHoldings(symbol) > 0;

  return (
    <AppContext.Provider
      value={{
        wallet,
        portfolio,
        trades,
        portfolioValue,
        totalProfit,
        buyStock,
        sellStock,
        getHoldings,
        canBuy,
        canSell,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook — cleaner imports in components
export const useApp = () => useContext(AppContext);