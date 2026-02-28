import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-black/40 backdrop-blur-md border-b border-gray-700 font-sans">
      
      <h1
        className="text-3xl font-bold tracking-wide bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent cursor-pointer"
        onClick={() => navigate("/")}
      >
        SmartConfess
      </h1>

      <div className="space-x-6">
        {!token ? (
          <>
            <Link to="/login" className="hover:text-purple-400">
              Login
            </Link>
            <Link to="/register" className="hover:text-purple-400">
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={logoutHandler}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;