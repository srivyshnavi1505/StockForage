function Portfolio(){

const portfolio=[
{stock:"AAPL",shares:5,value:900},
{stock:"TSLA",shares:3,value:750},
{stock:"AMZN",shares:2,value:260}
];

return(

<div className="p-6">

<h2 className="text-2xl font-bold mb-4">
Portfolio
</h2>

<table className="w-full bg-white shadow rounded-lg">

<thead className="bg-gray-200">

<tr>
<th className="p-3">Stock</th>
<th>Shares</th>
<th>Value</th>
</tr>

</thead>

<tbody>

{portfolio.map((p,i)=>(
<tr key={i} className="text-center border-b">

<td>{p.stock}</td>
<td>{p.shares}</td>
<td>${p.value}</td>

</tr>
))}

</tbody>

</table>

</div>

);

}

export default Portfolio;