import { Link } from "react-router-dom";

function Landing() {

return (

<div className="bg-gray-50 min-h-screen">

{/* HERO SECTION */}

<section className="bg-gradient-to-r from-blue-900 to-indigo-700 text-white py-24">

<div className="max-w-6xl mx-auto px-6 text-center">

<h1 className="text-5xl font-bold mb-6">
Stock Market Simulator
</h1>

<p className="text-lg mb-8">
Practice stock trading using virtual money and learn how the market works
without risking real funds.
</p>

<div className="space-x-4">

<Link
to="/register"
className="bg-green-500 px-6 py-3 rounded-lg font-semibold hover:bg-green-600"
>
Start Trading
</Link>

<Link
to="/login"
className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold"
>
Login
</Link>

</div>

</div>

</section>

{/* FEATURES */}

<section className="max-w-6xl mx-auto py-16 px-6">

<h2 className="text-3xl font-bold text-center mb-12">
Why Use Our Simulator
</h2>

<div className="grid md:grid-cols-3 gap-8">

<div className="bg-white p-6 rounded-lg shadow">

<h3 className="text-xl font-semibold mb-3">
Virtual Trading
</h3>

<p>
Trade stocks with virtual money and practice strategies without financial risk.
</p>

</div>

<div className="bg-white p-6 rounded-lg shadow">

<h3 className="text-xl font-semibold mb-3">
Portfolio Tracking
</h3>

<p>
Monitor your investments and track profit or loss in real time.
</p>

</div>

<div className="bg-white p-6 rounded-lg shadow">

<h3 className="text-xl font-semibold mb-3">
Leaderboard
</h3>

<p>
Compete with other traders and see who earns the highest profit.
</p>

</div>

</div>

</section>

{/* HOW IT WORKS */}

<section className="bg-gray-100 py-16">

<div className="max-w-6xl mx-auto px-6">

<h2 className="text-3xl font-bold text-center mb-12">
How It Works
</h2>

<div className="grid md:grid-cols-4 gap-8 text-center">

<div>
<div className="text-3xl font-bold text-blue-600 mb-3">1</div>
<p>Create your free account</p>
</div>

<div>
<div className="text-3xl font-bold text-blue-600 mb-3">2</div>
<p>Receive virtual trading balance</p>
</div>

<div>
<div className="text-3xl font-bold text-blue-600 mb-3">3</div>
<p>Buy and sell stocks</p>
</div>

<div>
<div className="text-3xl font-bold text-blue-600 mb-3">4</div>
<p>Track profits and leaderboard</p>
</div>

</div>

</div>

</section>

{/* CTA */}

<section className="bg-blue-900 text-white py-16 text-center">

<h2 className="text-3xl font-bold mb-4">
Start Learning Stock Trading Today
</h2>

<p className="mb-6">
Practice trading before investing real money in the market.
</p>

<Link
to="/register"
className="bg-green-500 px-6 py-3 rounded-lg font-semibold hover:bg-green-600"
>
Create Free Account
</Link>

</section>

{/* FOOTER */}

<footer className="bg-gray-900 text-white py-6 text-center">

<p>
© {new Date().getFullYear()} Stock Market Simulator
</p>

</footer>

</div>

);

}

export default Landing;