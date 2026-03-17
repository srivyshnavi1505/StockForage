import { useForm } from "react-hook-form";
import { useAuth } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function Login(){


const {register,handleSubmit}=useForm()
  const login=useAuth((state)=>(state.login))
  const isAuthenticated=useAuth((state)=>(state.isAuthenticate))
  const currentUser=useAuth((state)=>(state.currentUser))
  const navigate=useNavigate()



const onUserLogin = async (userCredObj) => {
  await login(userCredObj);
};

useEffect(()=>{
  if(isAuthenticated){
    navigate("/dashboard");
  }
},[isAuthenticated, currentUser, navigate]);

return(

<div className="flex justify-center items-center h-screen">

<form
onSubmit={handleSubmit(onUserLogin)}
className="bg-white p-10 shadow w-80"
>

<h2 className="text-xl mb-5 text-center">Login</h2>

<input
type="email"
placeholder="Email"
className="border p-2 mb-3 w-full"
{...register("email", { required: true })}
/>

<input
type="password"
placeholder="Password"
className="border p-2 mb-3 w-full"
{...register("password", { required: true })}
/>

<button
type="submit"
className="bg-blue-500 text-white px-4 py-2 w-full"
>
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