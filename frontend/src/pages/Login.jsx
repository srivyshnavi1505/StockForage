import { useForm } from "react-hook-form";
import { useAuth } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function Login(){


const {register,handleSubmit}=useForm()
  const login=useAuth((state)=>(state.login))
  const isAuthenticated=useAuth((state)=>(state.isAuthenticated))
  const currentUser=useAuth((state)=>(state.currentUser))
  const navigate=useNavigate()

const onUserLogin = async (userCredObj) => {
  await login(userCredObj);
};

useEffect(()=>{
  if(isAuthenticated){
    navigate("/dashboard");
  }
},[isAuthenticated, currentUser,navigate]);

return(

<div className="flex justify-center bg-[#F3F4F4]  flex-col items-center  h-screen">

<form
onSubmit={handleSubmit(onUserLogin)}
className="bg-blue-950  rounded-lg px-10 py-20 shadow-lg w-80"
>

<h2 className="text-zinc-200 text-4xl  mb-5 text-center">Login</h2>

<input
type="email"
placeholder="Email"
className="border-rose-100  rounded-lg p-2 mb-3 w-full"
{...register("email", { required: true })}
/>

<input
type="password"
placeholder="Password"
className="border-rose-100  rounded-lg p-2 mb-3 w-full"
{...register("password", { required: true })}
/>

<button
type="submit"
className="bg-[#F08D39] text-white rounded-xl px-4 py-2 max-w-full "
>
Login
</button>

<p className="text-center text-red-50 mt-4 text-sm">
Don't have an account?{" "}
<Link to="/register" className="text-rose-200 underline">
Register
</Link>
</p>

</form>

</div>

);

}

export default Login;