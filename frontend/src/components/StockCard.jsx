import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

function StockCard({stock}){

const {buyStock,sellStock} = useContext(AppContext);

return(

<div className="bg-white shadow p-4 flex justify-between rounded">

<div>

<h2 className="font-bold">{stock.name}</h2>

<p>₹{stock.price}</p>

<p className={stock.change.includes("+")
? "text-green-500"
: "text-red-500"}>

{stock.change}

</p>

</div>

<div className="space-x-2">

<button
className="bg-green-500 text-white px-3 py-1 rounded"
onClick={()=>{
buyStock(stock);
toast.success("Stock Bought");
}}
>
Buy
</button>

<button
className="bg-red-500 text-white px-3 py-1 rounded"
onClick={()=>{
sellStock(stock);
toast.success("Stock Sold");
}}
>
Sell
</button>

</div>

</div>

);

}

export default StockCard;