import { useEffect, useState } from "react";

function Leaderboard() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
  fetch("http://localhost:3000/user-api/users")
    .then((res) => res.json())
    .then((data) => {
      const usersArray = Array.isArray(data.payload) ? data.payload : [];

      // Group by user and keep only the LATEST snapshot per user
      const userMap = {};
      usersArray.forEach((entry) => {
        const userId = entry.userId || entry._id; // adjust key to match your data
        const existing = userMap[userId];

        // Keep the most recent snapshot (assumes createdAt or a timestamp field)
        if (!existing || new Date(entry.createdAt) > new Date(existing.createdAt)) {
          userMap[userId] = entry;
        }
      });

      // Convert map back to array and sort by profit
      const uniqueUsers = Object.values(userMap);
      uniqueUsers.sort((a, b) => (b.totalPnl || 0) - (a.totalPnl || 0));

      setUsers(uniqueUsers);
    })
    .catch((err) => console.log(err));
}, []);

  return (

    <div className="p-6 bg-gray-100 min-h-screen">

      <h2 className="text-3xl font-bold mb-6">
        Trading Leaderboard
      </h2>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-black text-white">

            <tr>

              <th className="p-4 text-left">
                Rank
              </th>

              <th className="p-4 text-left">
                Trader
              </th>

              <th className="p-4 text-left">
                Wallet
              </th>

              <th className="p-4 text-left">
                Portfolio
              </th>

              <th className="p-4 text-left">
                Profit / Loss
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map((user, index) => (

              <tr
                key={user._id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4 font-semibold">

                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : `#${index + 1}`}

                </td>

                <td className="p-4 font-medium">
                  {user.username}
                </td>

                <td className="p-4">
                  ${user.walletBalance || 0}
                </td>

                <td className="p-4">
                  ${user.totalValue || 0}
                </td>

                <td
                  className={`p-4 font-semibold ${
                    (user.totalPnl || 0) >= 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >

                  ${user.totalPnl || 0}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default Leaderboard;