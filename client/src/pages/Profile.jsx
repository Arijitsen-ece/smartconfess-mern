import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { API_URL } from "../config";
import toast from "react-hot-toast";

const Profile = () => {
  const { id } = useParams();

  const [userData, setUserData] = useState(null);
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Safe current user parsing
  let currentUser = null;
  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") {
      currentUser = JSON.parse(stored);
    }
  } catch (error) {
    currentUser = null;
  }

  // ================= FETCH PROFILE =================
  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/auth/profile/${id}`
      );
      setUserData(data);
    } catch (error) {
      console.log("Profile fetch error:", error);
    }
  };

  // ================= FETCH USER POSTS =================
  const fetchUserPosts = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/confessions/user/${id}`
      );
      setConfessions(data);
    } catch (error) {
      console.log("Posts fetch error:", error);
    }
  };

  // ================= FOLLOW / UNFOLLOW =================
  const followHandler = async () => {
    if (!token) {
      toast.error("Login required ❌");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/api/users/follow/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Follow status updated 🔄");
      fetchProfile();
    } catch (error) {
      toast.error("Follow failed ❌");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchProfile();
      await fetchUserPosts();
      setLoading(false);
    };

    loadData();
  }, [id]);

  // ================= LOADING STATE =================
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-20 text-white">
          Loading profile...
        </div>
      </>
    );
  }

  // ================= USER NOT FOUND =================
  if (!userData) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-20 text-red-400">
          User not found ❌
        </div>
      </>
    );
  }

  const followers = userData.followers || [];
  const following = userData.following || [];

  const isOwnProfile =
    currentUser && currentUser._id === userData._id;

  const isFollowing =
    currentUser &&
    followers.some(
      (followerId) =>
        followerId.toString() === currentUser._id
    );

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">

        {/* PROFILE HEADER */}
        <div className="bg-gray-800 p-6 rounded-xl mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">
            @{userData.username}
          </h2>

          <div className="flex gap-6 mb-4 text-gray-300">
            <p>Followers: {followers.length}</p>
            <p>Following: {following.length}</p>
          </div>

          {!isOwnProfile && token && (
            <button
              onClick={followHandler}
              className={`px-4 py-2 rounded-lg transition ${
                isFollowing
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>

        {/* USER POSTS */}
        <h3 className="text-xl font-bold mb-4 text-white">
          Confessions
        </h3>

        {confessions.length === 0 && (
          <p className="text-gray-400">
            No posts yet.
          </p>
        )}

        {confessions.map((conf) => (
          <div
            key={conf._id}
            className="bg-gray-800 p-4 rounded-lg mb-4"
          >
            <p className="mb-2">{conf.text}</p>

            {conf.image && (
              <img
                src={`${API_URL}/uploads/${conf.image}`}
                alt=""
                className="rounded-lg max-h-80 w-full object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Profile;