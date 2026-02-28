import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { API_URL } from "../config";

dayjs.extend(relativeTime);

const Home = () => {
  const [confessions, setConfessions] = useState([]);
  const [search, setSearch] = useState("");
  const [newConfession, setNewConfession] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // 🔥 SAFE USER PARSE (fixes white screen)
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    user = null;
  }

  // ================= FETCH =================
  const fetchConfessions = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/confessions?search=${search}`,
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      );

      setConfessions(data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= POST =================
  const postConfession = async (e) => {
    e.preventDefault();

    if (!newConfession.trim()) {
      toast.error("Confession cannot be empty ❌");
      return;
    }

    if (!token) {
      toast.error("Please login first ❌");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("text", newConfession);
      if (image) {
        formData.append("image", image);
      }

      await axios.post(`${API_URL}/api/confessions`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Confession posted 🚀");
      setNewConfession("");
      setImage(null);
      fetchConfessions();
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error("Failed to post confession ❌");
    }
  };

  // ================= LIKE =================
  const likeHandler = async (id) => {
    if (!token) return;

    try {
      await axios.put(
        `${API_URL}/api/confessions/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchConfessions();
    } catch (error) {
      toast.error("Like failed ❌");
    }
  };

  // ================= DELETE =================
  const deleteHandler = async (id) => {
    if (!token) return;

    try {
      await axios.delete(`${API_URL}/api/confessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Deleted 🗑️");
      fetchConfessions();
    } catch (error) {
      toast.error("Delete failed ❌");
    }
  };

  // ================= EDIT =================
  const editHandler = async (id, oldText) => {
    const newText = prompt("Edit your confession:", oldText);
    if (!newText) return;

    try {
      await axios.put(
        `${API_URL}/api/confessions/${id}`,
        { text: newText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Updated ✏️");
      fetchConfessions();
    } catch (error) {
      toast.error("Update failed ❌");
    }
  };

  useEffect(() => {
    fetchConfessions();
  }, [search]);

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">

        {/* ================= POST FORM ================= */}
        {token && (
          <form onSubmit={postConfession} className="mb-8">
            <textarea
              className="w-full p-3 border rounded-lg mb-3 bg-gray-900 text-white border-gray-700"
              placeholder="Write your confession..."
              value={newConfession}
              onChange={(e) => setNewConfession(e.target.value)}
            />

            {/* FILE INPUT */}
            <label className="block mb-3 cursor-pointer bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition w-fit">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
              />
            </label>

            <button className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Post Confession
            </button>
          </form>
        )}

        <h1 className="text-3xl font-bold mb-6 text-center">
          All Confessions
        </h1>

        {/* ================= SEARCH ================= */}
        <input
          type="text"
          placeholder="Search confessions..."
          className="w-full p-3 mb-6 border rounded-lg bg-gray-900 text-white border-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ================= CONFESSIONS ================= */}
        {confessions.map((conf) => (
          <div
            key={conf._id}
            className="bg-gray-800 rounded-xl p-6 mb-6 shadow-lg"
          >
            {/* USERNAME */}
            <p
              onClick={() => navigate(`/profile/${conf.user._id}`)}
              className="cursor-pointer text-blue-400 mb-2 hover:underline"
            >
              @{conf.user.username}
            </p>

            {/* TEXT */}
            <p className="text-lg mb-3">{conf.text}</p>

            {/* IMAGE */}
            {conf.image && (
              <img
                src={`${API_URL}/uploads/${conf.image}`}
                alt="confession"
                className="rounded-lg mb-3 max-h-96 w-full object-cover"
              />
            )}

            {/* TIME */}
            <p className="text-sm text-gray-400 mb-3">
              Posted {dayjs(conf.createdAt).fromNow()}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 items-center flex-wrap">
              <button
                onClick={() => likeHandler(conf._id)}
                className="bg-pink-500 px-4 py-2 rounded-lg hover:bg-pink-600 transition"
              >
                ❤️ {conf.likes.length}
              </button>

              {user && conf.user._id === user._id && (
                <>
                  <button
                    onClick={() =>
                      editHandler(conf._id, conf.text)
                    }
                    className="bg-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteHandler(conf._id)
                    }
                    className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;