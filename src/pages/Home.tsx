import React, { useState, useEffect, useRef, useCallback } from "react";
import PostCard from "../components/Post";
import axios from "axios";
import { baseUrl } from "../baseUrl";
import { Link } from "react-router-dom";

interface Friend {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
}

interface Post {
  _id: string;
  text: string;
  image?: string;
  likes: string[];
  comments: any[];
  user: {
    _id: string;
    name: string;
    profilePic?: string;
  };
  createdAt: string;
}

const Home: React.FC = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [myProfilePic, setMyProfilePic] = useState(
    localStorage.getItem("profilePic") || ""
  );

  // Infinite scroll & pagination state
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Intersection observer logic
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Sync profile pic from database on load
  useEffect(() => {
    const syncUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${baseUrl}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const freshPic = res.data.user.profilePic;
        if (freshPic) {
          setMyProfilePic(freshPic);
          localStorage.setItem("profilePic", freshPic);
        }
      } catch (err) {
        console.error("Sync failed", err);
        
      }
    };
    syncUser();
  }, []);

  // Global post update function
  // const handleUpdatePost = (updatedPostFromDB: Post) => {
  //   setPosts((prevPosts) =>
  //     prevPosts.map((post) => {
  //       if (post._id === updatedPostFromDB._id) {
  //         return {
  //           ...post,
  //           likes: updatedPostFromDB.likes,
  //           comments: updatedPostFromDB.comments,
  //         };
  //       }
  //       return post;
  //     })
  //   );
  // };

  // Delete post function
  const handleDeletePostFromHome = async (postId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(`${baseUrl}/post/delete/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete post.");
    }
  };

  // Fetch feed function
  const fetchFeed = async (pageNum: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${baseUrl}/user/feed?page=${pageNum}&limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (pageNum === 1) {
        setPosts(res.data.posts);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...res.data.posts]);
      }

      setHasMore(res.data.pagination.hasMore);
    } catch (err) {
      console.error("Error fetching feed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Create post function
  const handleCreatePost = async () => {
    if (!text.trim()) {
      alert("Post text is required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.post(`${baseUrl}/post/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const newPostFromDB = res.data.post;

      setPosts([
        {
          ...newPostFromDB,
          user: {
            ...newPostFromDB.user,
            name: localStorage.getItem("username") || "User",
            profilePic: myProfilePic || "https://i.pravatar.cc/150",
          },
        },
        ...posts,
      ]);

      setText("");
      setImage(null);
    } catch (error: any) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to create post");
    }
  };

  // Fetch friends
  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${baseUrl}/friendrequest/getFriends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(res.data.friends);
    } catch (error) {
      console.error("Failed to fetch friends", error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex relative">
      {/* MOBILE HAMBURGER BUTTON */}
      <button
        onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 w-12 h-12 bg-linear-to-r from-red-600 to-rose-500 rounded-full shadow-lg flex items-center justify-center text-white"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {leftSidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* MOBILE OVERLAY */}
      {leftSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 top-16"
          onClick={() => setLeftSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <div
        className={`
          fixed lg:static top-16 bottom-0 left-0 z-40
          w-64 bg-white border-r border-gray-200 p-4 shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${leftSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          overflow-y-auto
        `}
      >
        <div className="space-y-2">
          <Link to="/profile" onClick={() => setLeftSidebarOpen(false)}>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-linear-to-r hover:from-red-50 hover:to-rose-50 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 bg-linear-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                Profile
              </span>
            </div>
          </Link>

          <Link to="/notification" onClick={() => setLeftSidebarOpen(false)}>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-linear-to-r hover:from-red-50 hover:to-rose-50 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 bg-linear-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform relative">
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                  5
                </span>
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                Notifications
              </span>
            </div>
          </Link>

          <Link to="/friends" onClick={() => setLeftSidebarOpen(false)}>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-linear-to-r hover:from-red-50 hover:to-rose-50 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 bg-linear-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                Friends
              </span>
            </div>
          </Link>

          <Link to="/settings" onClick={() => setLeftSidebarOpen(false)}>
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

          {/* MOBILE FRIENDS SECTION */}
          <div className="lg:hidden mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Friends</h3>
              <span className="text-xs bg-linear-to-r from-red-600 to-rose-500 text-white px-2 py-1 rounded-full font-semibold">
                {friends?.length || 0}
              </span>
            </div>
            <div className="space-y-2">
              {friends && friends.length > 0 ? (
                friends.map((friend) => (
                  <Link
                    key={friend._id}
                    to={`/friend/${friend._id}`}
                    onClick={() => setLeftSidebarOpen(false)}
                  >
                    <div className="bg-linear-to-r from-white to-gray-50 hover:from-red-50 hover:to-rose-50 p-2 rounded-xl border border-gray-100 hover:border-red-200 transition-all duration-300 cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={
                              friend.profilePic ||
                              "https://via.placeholder.com/40"
                            }
                            alt={friend.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-red-200 transition-all"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <p className="font-semibold text-sm text-gray-800 group-hover:text-red-600 transition-colors">
                          {friend.name}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  No friends yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CENTER FEED */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto lg:mr-80">
        {/* CREATE POST CARD */}
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-lg mb-6 border border-gray-100">
          <div className="flex items-center gap-3 md:gap-4">
            {myProfilePic ? (
              <img
                src={myProfilePic}
                alt="Profile"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-md flex-shrink-0 ring-2 ring-gray-200"
              />
            ) : (
              <div className="w-10 h-10 md:w-12 md:h-12 bg-linear-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white font-bold text-base md:text-lg">
                  U
                </span>
              </div>
            )}

            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-full px-4 md:px-5 py-2 md:py-3 text-sm md:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 pt-4 border-t border-gray-100 gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <label className="flex items-center gap-2 px-3 md:px-4 py-2 bg-red-50 text-red-600 rounded-full cursor-pointer hover:bg-red-100 transition-all group">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs md:text-sm font-semibold">
                  {image ? image.name : "Photo"}
                </span>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={(e) =>
                    setImage(e.target.files ? e.target.files[0] : null)
                  }
                  className="hidden"
                />
              </label>

              <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-amber-50 text-amber-600 rounded-full hover:bg-amber-100 transition-all group">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs md:text-sm font-semibold hidden sm:inline">
                  Feeling
                </span>
              </button>
            </div>

            <button
              onClick={handleCreatePost}
              disabled={loading || !text.trim()}
              className="w-full sm:w-auto bg-linear-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white font-semibold py-2 md:py-2.5 px-5 md:px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Post
            </button>
          </div>
        </div>

        {/* POSTS FEED */}
        <div className="space-y-4 md:space-y-6">
          {posts.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-semibold mb-1">
                No posts yet
              </p>
              <p className="text-gray-400 text-sm">
                Be the first to share something!
              </p>
            </div>
          )}

          {posts.map((post, index) => {
            const isLast = posts.length === index + 1;
            const likesCount = Array.isArray(post.likes)
              ? post.likes.length
              : post.likes;

            return (
              <div
                key={post._id}
                ref={isLast ? lastPostElementRef : null}
                className="w-full"
              >
                <PostCard
                  id={post._id}
                  profilePhoto={
                    post.user?.profilePic ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  userName={post.user?.name || "Unknown User"}
                  caption={post.text}
                  likes={likesCount}
                  comments={post.comments}
                  comments_count={post.comments?.length || 0}
                  postImage={post.image}
                  // onUpdate={handleUpdatePost}
                  onDelete={handleDeletePostFromHome}
                  isProfilePage={false}
                />
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                <p className="text-red-600 font-semibold">Loading more posts...</p>
              </div>
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 font-semibold">
                You've reached the end! 🎉
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR - FRIENDS (DESKTOP ONLY) */}
      <div className="hidden lg:block fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 p-5 shadow-sm overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800">Friends</h2>
          <span className="text-xs bg-linear-to-r from-red-600 to-rose-500 text-white px-3 py-1 rounded-full font-semibold">
            {friends?.length || 0}
          </span>
        </div>

        <div className="space-y-3">
          {friends && friends.length > 0 ? (
            friends.map((friend) => (
              <Link key={friend._id} to={`/friend/${friend._id}`}>
                <div className="bg-linear-to-r from-white to-gray-50 hover:from-red-50 hover:to-rose-50 p-3 rounded-xl border border-gray-100 hover:border-red-200 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={
                          friend.profilePic || "https://via.placeholder.com/40"
                        }
                        alt={friend.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-red-200 transition-all"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                        {friend.name}
                      </p>
                      <p className="text-xs text-gray-500">Active now</p>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No friends yet</p>
              <p className="text-gray-400 text-xs mt-1">
                Start connecting with people!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
