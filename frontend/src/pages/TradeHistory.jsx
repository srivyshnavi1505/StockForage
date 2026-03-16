import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function TradeHistory(){

const {trades}=useContext(AppContext);

return(

<div className="p-10">

<h2 className="text-2xl mb-6">Trade History</h2>

<table className="w-full border">

<thead>
<tr className="bg-gray-200">
<th>Stock</th>
<th>Type</th>
<th>Price</th>
<th>Date</th>
</tr>
</thead>

<tbody>

{trades.map((t,i)=>(
<tr key={i} className="text-center border">

<td>{t.name}</td>
<td>{t.type}</td>
<td>{t.price}</td>
<td>{t.date}</td>

</tr>
))}

</tbody>

</table>

</div>

);

}

export default TradeHistory;