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

      let { role, ...userObj } = newUser;

      let resObj = await axios.post(
        "http://localhost:3000/user-api/register",
        userObj
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

    <div className="flex justify-center items-center h-screen">

      <form
        className="bg-white p-10 shadow w-80"
        onSubmit={handleSubmit(onUserRegister)}
      >

        <h2 className="text-xl mb-5 text-center">Register</h2>

        {error && (
          <p className="text-red-500 text-center mb-3">{error}</p>
        )}

        <input
          placeholder="Name"
          className="border p-2 mb-3 w-full"
          {...register("username", { required: true })}
        />
        {errors.name && <p className="text-red-500 text-sm">Name is required</p>}

        <input
          placeholder="Email"
          className="border p-2 mb-3 w-full"
          {...register("email", { required: true })}
        />
        {errors.email && <p className="text-red-500 text-sm">Email is required</p>}

        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-3 w-full"
          {...register("password", { required: true })}
        />
        {errors.password && <p className="text-red-500 text-sm">Password is required</p>}

        <input
          placeholder="Mobile Number"
          className="border p-2 mb-3 w-full"
          {...register("mobile", { required: true })}
        />
        {errors.mobile && <p className="text-red-500 text-sm">Mobile number is required</p>}

        <button
          className="bg-green-500 text-white px-4 py-2 w-full"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
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