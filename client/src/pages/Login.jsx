import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../config";
import Navbar from "../components/Navbar";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password }
      );

      // ✅ STORE TOKEN CORRECTLY
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      toast.success("Login successful 🚀");
      navigate("/");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed ❌"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-md mx-auto mt-10 bg-gray-800 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        <form onSubmit={loginHandler}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 rounded-lg bg-gray-900 border border-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 rounded-lg bg-gray-900 border border-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-blue-600 py-3 rounded-lg hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;