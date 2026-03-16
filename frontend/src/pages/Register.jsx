import { Link } from "react-router-dom";

function Register(){

return(

<div className="flex justify-center items-center h-screen">

<form className="bg-white p-10 shadow w-80">

<h2 className="text-xl mb-5 text-center">Register</h2>

<input
placeholder="Name"
className="border p-2 mb-3 w-full"
/>

<input
placeholder="Email"
className="border p-2 mb-3 w-full"
/>

<input
type="password"
placeholder="Password"
className="border p-2 mb-3 w-full"
/>

<button className="bg-green-500 text-white px-4 py-2 w-full">
Register
</button>

<p className="text-center mt-4 text-sm">
Already have an account?{" "}
<Link to="/login" className="text-blue-500 underline">
Login
</Link>
</p>

</form>

</div>

);

}

export default Register;