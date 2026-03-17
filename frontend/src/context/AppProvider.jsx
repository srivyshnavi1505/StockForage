import { useState } from "react";
import { AppContext } from "./AppContext";

export const AppProvider = ({ children }) => {

const initialWallet = 100000;

const [wallet, setWallet] = useState(initialWallet);
const [portfolio, setPortfolio] = useState([]);
const [trades, setTrades] = useState([]);

const buyStock = (stock) => {

if(wallet < stock.price) return;

setWallet(prev => prev - stock.price);

setPortfolio(prev => [...prev, stock]);

setTrades(prev => [
...prev,
{
...stock,
type: "BUY",
date: new Date().toLocaleDateString()
}
]);

};

const sellStock = (stock) => {

setPortfolio(prev => {

const index = prev.findIndex(s => s.name === stock.name);

if(index === -1) return prev;

const updated = [...prev];
updated.splice(index,1);

return updated;

});

setWallet(prev => prev + stock.price);

setTrades(prev => [
...prev,
{
...stock,
type: "SELL",
date: new Date().toLocaleDateString()
}
]);

};

const portfolioValue = portfolio.reduce(
(total, stock) => total + stock.price,
0
);

const totalProfit = portfolioValue + wallet - initialWallet;

return (

<AppContext.Provider
value={{
wallet,
portfolio,
trades,
portfolioValue,
totalProfit,
buyStock,
sellStock
}}
>

{children}

</AppContext.Provider>

);

};