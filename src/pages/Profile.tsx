import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PostCard from "../components/Post";
import { baseUrl } from "../baseUrl";

interface ProfileResponse {
  user: {
    name: string;
    email: string;
    profilePic?: string;
  };
  counts: {
    friends: number;
    pendingRequests: number;
  };
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* ---------------- Fetch profile ---------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token");

        const res = await axios.get(`${baseUrl}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(res.data);
        localStorage.setItem("name", res.data.user.name || "");
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  /* ---------------- Fetch my posts ---------------- */
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${baseUrl}/post/myposts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMyPosts(res.data.posts || []);
      } catch {
        console.error("Failed to fetch posts");
      }
    };
    fetchMyPosts();
  }, []);

  /* ---------------- Upload profile pic ---------------- */
  const handleProfilePicUpload = async () => {
    if (!image) return alert("Select an image first");
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("profilePic", image);

      const res = await axios.post(
        `${baseUrl}/user/uploadProfilePic`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              user: { ...prev.user, profilePic: res.data.user.profilePic },
            }
          : prev
      );

      setImage(null);
      alert("Profile picture updated");
    } catch {
      alert("Upload failed");
    }
  };

  /* ---------------- Delete post ---------------- */
  const handleDeletePost = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(`${baseUrl}/post/delete/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMyPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch {
      alert("Failed to delete post");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (error || !profile)
    return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex relative">
      {/* HAMBURGER */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 w-12 h-12 bg-linear-to-r from-red-600 to-rose-500 rounded-full shadow-lg flex items-center justify-center text-white"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isSidebarOpen ? (
            <path
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* OVERLAY */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 top-16"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed lg:static top-16 bottom-0 left-0 z-40
          w-64 bg-white border-r border-gray-200 p-4 shadow-lg
          transform transition-transform duration-300
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          overflow-y-auto
        `}
      >
        <div className="space-y-2">
          {/* My Posts */}
          <Link to="/profile" onClick={() => setIsSidebarOpen(false)}>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-all group cursor-pointer">
              
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14-4H5m14 8H5m14 4H5"
                  />
                </svg>
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-red-600">
                
                My Posts
              </span>
            </div>
          </Link>

          {/* Liked Posts */}
          <Link to="/liked-posts" onClick={() => setIsSidebarOpen(false)}>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-all group cursor-pointer">
              
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682 4.318 12.682a4.5 4.5 0 010-6.364z"
                  />
                </svg>
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-red-600">
                
                Liked Posts
              </span>
            </div>
          </Link>

          {/* Deleted Posts */}
          <Link to="/deleted-posts" onClick={() => setIsSidebarOpen(false)}>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-all group cursor-pointer">
              
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m2 0V5a2 2 0 012-2h2a2 2 0 012 2v2"
                  />
                </svg>
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-red-600">
                
                Deleted Posts
              </span>
            </div>
          </Link>

          {/* Settings */}
          <Link to="/settings" onClick={() => setIsSidebarOpen(false)}>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-linear-to-r hover:from-red-50 hover:to-rose-50 transition-all duration-300 group cursor-pointer">
              
              <div className="w-10 h-10 bg-linear-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                
                Settings
              </span>
            </div>
          </Link>

          {/* Logout */}
          <Link to="/login" onClick={() => localStorage.clear()}>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-all group cursor-pointer">
              
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                  />
                </svg>
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-red-600">
                
                Logout
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* CENTER CONTENT */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        {/* PROFILE HEADER */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <img
              src={profile.user.profilePic || "https://via.placeholder.com/150"}
              className="w-28 h-28 rounded-full ring-4 ring-red-100"
            />

            <div>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
              <button
                onClick={handleProfilePicUpload}
                className="mt-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-1.5 rounded-full text-sm"
              >
                Change profile pic
              </button>
            </div>

            <div>
              <h1 className="text-2xl font-bold">{profile.user.name}</h1>
              <p className="text-gray-500">{profile.user.email}</p>

              {/* FRIENDS & PENDING — ADDED */}
              <div className="flex gap-3 mt-3">
                <span className="px-4 py-1 bg-red-50 text-red-600 rounded-full text-sm">
                  Friends · {profile.counts.friends}
                </span>
                <span className="px-4 py-1 bg-amber-50 text-amber-600 rounded-full text-sm">
                  Pending · {profile.counts.pendingRequests}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* POSTS */}
        <div className="flex flex-col items-center gap-6">
          {myPosts.map((post) => (
            <PostCard
              key={post._id}
              id={post._id}
              profilePhoto={post.user?.profilePic}
              userName={localStorage.getItem("name") || "User"}
              caption={post.text}
              likes={post.likes?.length || 0}
              comments_count={post.comments?.length || 0}
              postImage={post.image}
              isProfilePage
              onDelete={handleDeletePost}
              comments={post.comments}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
