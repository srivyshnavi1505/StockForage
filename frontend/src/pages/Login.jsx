import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

function Login(){

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const navigate=useNavigate();

const handleSubmit=(e)=>{
e.preventDefault();

if(!email || !password){
toast.error("Fill all fields");
return;
}

toast.success("Login Successful");
navigate("/dashboard");
};

return(

<div className="flex justify-center items-center h-screen">

<form onSubmit={handleSubmit} className="bg-white p-10 shadow w-80">

<h2 className="text-xl mb-5 text-center">Login</h2>

<input
type="email"
placeholder="Email"
className="border p-2 mb-3 w-full"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="border p-2 mb-3 w-full"
onChange={(e)=>setPassword(e.target.value)}
/>

<button className="bg-blue-500 text-white px-4 py-2 w-full">
Login
</button>

<p className="text-center mt-4 text-sm">
Don't have an account?{" "}
<Link to="/register" className="text-blue-500 underline">
Register
</Link>
</p>

</form>

</div>

);

}

export default Login;