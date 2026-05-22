import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {

  const { register, handleSubmit, formState: { errors } } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const onUserRegister = async (newUser) => {

    setLoading(true);
    setError(null);
    try {

      let resObj = await axios.post(
  `${import.meta.env.VITE_API_URL}/user-api/register`,
  newUser
);

      console.log(resObj);

      if (resObj.status === 201) {
        navigate("/login");
      }

    } catch (error) {

      console.log("FULL ERROR:", error.response);
      console.log("ERROR DATA:", error.response?.data);

      setError(error.response?.data?.message || "Registration failed");

    }

    setLoading(false);
  };

  return (

    <div className="flex justify-center bg-[#F3F4F4] flex-col items-center h-screen">

      <form
        onSubmit={handleSubmit(onUserRegister)}
        className="bg-blue-950 rounded-lg px-10 py-10 shadow-lg w-96"
      >

        <h2 className="text-zinc-200 text-4xl mb-5 text-center">
          Register
        </h2>

        {error && (
          <p className="text-red-400 text-center mb-3">
            {error}
          </p>
        )}

        <input
          placeholder="Name"
          className="rounded-lg p-2 mb-3 w-full"
          {...register("username", { required: true })}
        />
        {errors.username && (
          <p className="text-red-300 text-sm mb-2">
            Name is required
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="rounded-lg p-2 mb-3 w-full"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <p className="text-red-300 text-sm mb-2">
            Email is required
          </p>
        )}

        <input
          type="password"
          placeholder="Password"
          className="rounded-lg p-2 mb-3 w-full"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <p className="text-red-300 text-sm mb-2">
            Password is required
          </p>
        )}

        <input
          type="tel"
          placeholder="Mobile Number"
          className="rounded-lg p-2 mb-4 w-full"
          {...register("mobile", { required: true })}
        />
        {errors.mobile && (
          <p className="text-red-300 text-sm mb-2">
            Mobile number is required
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#F08D39] text-white rounded-xl px-4 py-2 w-full"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-red-50 mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-rose-200 underline">
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Register;