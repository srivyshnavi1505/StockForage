import { Link } from "react-router-dom";
import {
  FiTrendingUp,
  FiPieChart,
  FiAward,
} from "react-icons/fi";

function Landing() {

  return (

    <div className="bg-[#020617] text-white min-h-screen overflow-hidden">

      {/* HERO SECTION */}

      <section className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#1E293B] text-white py-24">

        {/* Blur Effects */}

        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT CONTENT */}

            <div>

              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-xl rounded-full px-5 py-2 mb-8">

                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>

                <span className="text-sm text-gray-300">
                  Virtual Stock Trading Platform
                </span>

              </div>

              <h1 className="text-6xl font-extrabold mb-6 leading-tight">

                Stock Market <br />

                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Simulator
                </span>

              </h1>

              <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl">

                Practice stock trading using virtual money and learn how the
                market works without risking real funds.

              </p>

              <div className="flex flex-wrap gap-5">

                <Link
                  to="/register"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-2xl font-semibold shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Start Trading
                </Link>

                <Link
                  to="/login"
                  className="bg-white/10 border border-white/10 backdrop-blur-xl px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  Login
                </Link>

              </div>

            </div>

            {/* RIGHT IMAGE */}

            <div className="relative">

              <div className="absolute inset-0 bg-cyan-500/20 blur-[80px] rounded-full"></div>

              <img
                src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=1200&auto=format&fit=crop"
                alt="stock market dashboard"
                className="relative z-10 rounded-[32px] shadow-2xl border border-white/10"
              />

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}

      <section className="max-w-7xl mx-auto py-20 px-6">

        <h2 className="text-5xl font-bold text-center mb-5">
          Why Use Our Simulator
        </h2>

        <p className="text-center text-gray-400 text-lg max-w-3xl mx-auto mb-16">
          Learn investing and improve your trading strategy using realistic
          market simulations and portfolio tracking.
        </p>

        <div className="grid md:grid-cols-3 gap-8">

          {/* CARD */}

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl hover:translate-y-[-8px] hover:bg-white/15 transition-all duration-300">

            <img
              src="https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=1200&auto=format&fit=crop"
              alt="trading"
              className="h-52 w-full object-cover"
            />

            <div className="p-8">

              <div className="bg-cyan-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <FiTrendingUp className="text-3xl text-cyan-400" />
              </div>

              <h3 className="text-2xl font-bold mb-4">
                Virtual Trading
              </h3>

              <p className="text-gray-400 leading-relaxed">
                Trade stocks with virtual money and practice strategies without
                financial risk.
              </p>

            </div>

          </div>

          {/* CARD */}

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl hover:translate-y-[-8px] hover:bg-white/15 transition-all duration-300">

            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
              alt="portfolio"
              className="h-52 w-full object-cover"
            />

            <div className="p-8">

              <div className="bg-purple-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <FiPieChart className="text-3xl text-purple-400" />
              </div>

              <h3 className="text-2xl font-bold mb-4">
                Portfolio Tracking
              </h3>

              <p className="text-gray-400 leading-relaxed">
                Monitor your investments and track profit or loss in real time.
              </p>

            </div>

          </div>

          {/* CARD */}

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl hover:translate-y-[-8px] hover:bg-white/15 transition-all duration-300">

            <img
              src="https://plus.unsplash.com/premium_photo-1681487769650-a0c3fbaed85a?q=80&w=1255&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="leaderboard"
              className="h-52 w-full object-cover"
            />

            <div className="p-8">

              <div className="bg-green-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <FiAward className="text-3xl text-green-400" />
              </div>

              <h3 className="text-2xl font-bold mb-4">
                Leaderboard
              </h3>

              <p className="text-gray-400 leading-relaxed">
                Compete with other traders and see who earns the highest profit.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* EXTRA SHOWCASE SECTION */}

      <section className="max-w-7xl mx-auto py-24 px-6">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold mb-6">
            Experience Real Market Trading
          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore advanced analytics, trading dashboards, and realistic market
            simulations designed for learning.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* IMAGE CARD */}

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl group">

            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop"
              alt="market analytics"
              className="h-[420px] w-full object-cover group-hover:scale-105 transition-all duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

            <div className="absolute bottom-8 left-8">

              <h3 className="text-3xl font-bold mb-3">
                Advanced Market Analytics
              </h3>

              <p className="text-gray-300 max-w-md">
                Analyze trends, monitor stock performance, and improve trading
                decisions using live market data.
              </p>

            </div>

          </div>

          {/* IMAGE CARD */}

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl group">

            <img
              src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1200&auto=format&fit=crop"
              alt="trading experience"
              className="h-[420px] w-full object-cover group-hover:scale-105 transition-all duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

            <div className="absolute bottom-8 left-8">

              <h3 className="text-3xl font-bold mb-3">
                Real-Time Trading Experience
              </h3>

              <p className="text-gray-300 max-w-md">
                Experience a realistic trading environment with virtual funds
                and interactive stock simulations.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}

      <section className="bg-white/5 border-y border-white/10 py-20">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-5xl font-bold text-center mb-5">
            How It Works
          </h2>

          <p className="text-center text-gray-400 text-lg mb-16">
            Start trading in four simple steps.
          </p>

          <div className="grid md:grid-cols-4 gap-8 text-center">

            {[
              "Create your free account",
              "Receive virtual trading balance",
              "Buy and sell stocks",
              "Track profits and leaderboard",
            ].map((step, index) => (

              <div
                key={index}
                className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl hover:translate-y-[-6px] transition-all duration-300"
              >

                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {index + 1}
                </div>

                <p className="text-lg text-gray-300">
                  {step}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="py-20">

        <div className="max-w-5xl mx-auto px-6">

          <div className="relative overflow-hidden bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-white/10 rounded-[40px] p-16 text-center backdrop-blur-2xl shadow-2xl">

            <div className="absolute inset-0 bg-cyan-500/10 blur-[120px]"></div>

            <div className="relative z-10">

              <h2 className="text-5xl font-bold mb-6">
                Start Learning Stock Trading Today
              </h2>

              <p className="text-xl text-gray-300 mb-10">
                Practice trading before investing real money in the market.
              </p>

              <Link
                to="/register"
                className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Create Free Account
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="bg-[#0F172A] border-t border-white/10 text-white py-8 text-center">

        <p className="text-gray-400">
          © {new Date().getFullYear()} Stock Market Simulator
        </p>

      </footer>

    </div>

  );

}

export default Landing;