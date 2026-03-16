import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

const [wallet, setWallet] = useState(100000);
const [portfolio, setPortfolio] = useState([]);
const [trades, setTrades] = useState([]);

const buyStock = (stock) => {

if(wallet < stock.price) return;

setWallet(wallet - stock.price);

setPortfolio([...portfolio, stock]);

setTrades([...trades, { ...stock, type:"BUY", date:new Date().toLocaleDateString() }]);

};

const sellStock = (stock) => {

setWallet(wallet + stock.price);

setTrades([...trades, { ...stock, type:"SELL", date:new Date().toLocaleDateString() }]);

};

return(
<AppContext.Provider value={{wallet,portfolio,trades,buyStock,sellStock}}>
{children}
</AppContext.Provider>
);

};