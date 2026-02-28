import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const registerHandler = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/register",
        { username, email, password }
      );

      navigate("/login");
    } catch (error) {
      alert("Registration Failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-[80vh]">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-gray-700 w-96">
          <h2 className="text-2xl mb-6 text-center">Register</h2>

          <input
            className="w-full mb-4 p-3 bg-transparent border border-gray-600 rounded-lg"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full mb-4 p-3 bg-transparent border border-gray-600 rounded-lg"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full mb-4 p-3 bg-transparent border border-gray-600 rounded-lg"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={registerHandler}
            className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-700"
          >
            Register
          </button>
        </div>
      </div>
    </>
  );
}

export default Register;