import { users } from "../data/users";

function Leaderboard(){

const initialBalance = 100000;

const leaderboard = users.map(user => {

const profit = user.wallet + user.portfolioValue - initialBalance;

return {
...user,
profit
};

}).sort((a,b)=>b.profit-a.profit);

return(

<div className="p-6">

<h2 className="text-2xl font-bold mb-4">
Leaderboard
</h2>

<table className="w-full bg-white shadow rounded-lg">

<thead className="bg-gray-200">

<tr>
<th className="p-3">Rank</th>
<th>Name</th>
<th>Profit</th>
</tr>

</thead>

<tbody>

{leaderboard.map((user,index)=>(
<tr key={index} className="text-center border-b">

<td>{index+1}</td>

<td>{user.name}</td>

<td className={user.profit>=0?"text-green-600":"text-red-600"}>
${user.profit}
</td>

</tr>
))}

</tbody>

</table>

</div>

);

}

export default Leaderboard;