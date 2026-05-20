import { useEffect, useState } from "react";

function Leaderboard() {

  const [users, setUsers] = useState([]);

  useEffect(() => {

    fetch("http://localhost:3000/user-api/users")
      .then((res) => res.json())
      .then((data) => {

        const usersArray = Array.isArray(data.payload)
          ? data.payload
          : [];

        // Group by user and keep latest snapshot

        const userMap = {};

        usersArray.forEach((entry) => {

          const userId = entry.userId || entry._id;

          const existing = userMap[userId];

          if (
            !existing ||
            new Date(entry.createdAt) >
              new Date(existing.createdAt)
          ) {

            userMap[userId] = entry;

          }

        });

        // Sort by profit

        const uniqueUsers = Object.values(userMap);

        uniqueUsers.sort(
          (a, b) => (b.totalPnl || 0) - (a.totalPnl || 0)
        );

        setUsers(uniqueUsers);

      })
      .catch((err) => console.log(err));

  }, []);

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#111827] text-white p-8">

      {/* HEADER */}

      <div className="max-w-7xl mx-auto">

        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-purple-500/20 border border-white/10 backdrop-blur-xl p-10 mb-10 shadow-2xl">

          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full"></div>

          <div className="relative z-10">

            <h1 className="text-5xl font-extrabold mb-4">

              Trading <br />

              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Leaderboard
              </span>

            </h1>

            <p className="text-gray-300 text-lg max-w-2xl">
              Compete with traders, track profits, and climb to the top rankings.
            </p>

          </div>

        </div>

        {/* TOP 3 CARDS */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {users.slice(0, 3).map((user, index) => (

            <div
              key={user._id}
              className={`relative overflow-hidden rounded-[28px] border border-white/10 backdrop-blur-xl p-8 shadow-2xl ${
                index === 0
                  ? "bg-gradient-to-br from-yellow-400/20 to-yellow-600/10"
                  : index === 1
                  ? "bg-gradient-to-br from-gray-300/20 to-gray-500/10"
                  : "bg-gradient-to-br from-orange-400/20 to-orange-600/10"
              }`}
            >

              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-[80px] rounded-full"></div>

              <div className="relative z-10">

                <div className="text-5xl mb-4">

                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : "🥉"}

                </div>

                <h2 className="text-2xl font-bold mb-2">
                  {user.username}
                </h2>

                <p className="text-gray-300 mb-6">
                  Elite Trader
                </p>

                <div className="space-y-3">

                  <div className="flex justify-between">

                    <span className="text-gray-400">
                      Wallet
                    </span>

                    <span className="font-semibold">
                      ${user.walletBalance || 0}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-400">
                      Portfolio
                    </span>

                    <span className="font-semibold">
                      ${user.totalValue || 0}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-400">
                      Profit
                    </span>

                    <span
                      className={`font-bold ${
                        (user.totalPnl || 0) >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      ${user.totalPnl || 0}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* LEADERBOARD TABLE */}

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">

          {/* TABLE HEADER */}

          <div className="px-8 py-6 border-b border-white/10">

            <h2 className="text-3xl font-bold">
              Global Rankings
            </h2>

            <p className="text-gray-400 mt-2">
              Top performing traders ranked by total profit.
            </p>

          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-white/5 text-gray-300">

                <tr>

                  <th className="p-6 text-left font-semibold">
                    Rank
                  </th>

                  <th className="p-6 text-left font-semibold">
                    Trader
                  </th>

                  <th className="p-6 text-left font-semibold">
                    Wallet
                  </th>

                  <th className="p-6 text-left font-semibold">
                    Portfolio
                  </th>

                  <th className="p-6 text-left font-semibold">
                    Profit / Loss
                  </th>

                </tr>

              </thead>

              <tbody>

                {users.map((user, index) => (

                  <tr
                    key={user._id}
                    className="border-b border-white/5 hover:bg-white/5 transition-all duration-300"
                  >

                    <td className="p-6 font-bold text-lg">

                      {index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : `#${index + 1}`}

                    </td>

                    <td className="p-6">

                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg">

                          {user.username?.charAt(0).toUpperCase()}

                        </div>

                        <div>

                          <p className="font-semibold text-lg">
                            {user.username}
                          </p>

                          <p className="text-gray-400 text-sm">
                            Stock Trader
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="p-6 font-medium">
                      ${user.walletBalance || 0}
                    </td>

                    <td className="p-6 font-medium">
                      ${user.totalValue || 0}
                    </td>

                    <td
                      className={`p-6 font-bold text-lg ${
                        (user.totalPnl || 0) >= 0
                          ? "text-green-400"
                          : "text-red-400"
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

      </div>

    </div>

  );

}

export default Leaderboard;