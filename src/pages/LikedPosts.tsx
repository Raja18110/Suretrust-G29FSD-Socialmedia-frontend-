// LikedPosts.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "../baseUrl";

interface PostUser {
  _id: string;
  username: string;
  profilePic?: string;
}

interface Comment {
  user: PostUser;
  text: string;
  createdAt: string;
  _id?: string;
}

interface Post {
  _id: string;
  user: PostUser;
  text: string;
  image?: string;
  likes: PostUser[];
  comments: Comment[];
  createdAt: string;
  isDeleted: boolean;
  deletedAt?: string;
  updatedAt?: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const LikedPosts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"i-liked" | "my-liked">("i-liked");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  /* ---------------- Fetch liked posts ---------------- */
  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const endpoint = activeTab === "i-liked"
          ? `${baseUrl}/posts/liked-by-me`
          : `${baseUrl}/posts/my-liked-posts`;

        const res = await fetch(
          `${endpoint}?page=${pagination.currentPage}&limit=${pagination.itemsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          }
        );

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Session expired. Please login again.");
          }
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data = await res.json();

        if (data.posts) {
          // Filter out deleted posts
          const activePosts = data.posts.filter((post: Post) => !post.isDeleted);
          setPosts(activePosts);

          if (data.pagination) {
            setPagination(data.pagination);
          } else {
            // Create default pagination
            setPagination({
              currentPage: 1,
              totalPages: 1,
              totalItems: activePosts.length,
              itemsPerPage: 10,
            });
          }
        } else {
          setPosts([]);
        }
      } catch (err: any) {
        console.error("Failed to fetch liked posts:", err);
        setError(err.message || "Failed to load liked posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedPosts();
  }, [activeTab, pagination.currentPage]);

  /* ---------------- Handle unlike post ---------------- */
  const handleUnlikePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to unlike this post?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to continue");
        return;
      }

      const res = await fetch(`${baseUrl}/posts/unlike/${postId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (res.ok) {
        // Remove the post from the list
        setPosts(posts.filter(post => post._id !== postId));
        alert("Post unliked successfully");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to unlike post");
      }
    } catch (err: any) {
      alert(err.message || "Failed to unlike post. Please try again.");
      console.error("Unlike error:", err);
    }
  };

  /* ---------------- Handle page change ---------------- */
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  /* ---------------- Format date ---------------- */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  /* ---------------- Calculate stats ---------------- */
  const calculateStats = () => {
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
    const totalComments = posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);

    return {
      totalLikes,
      totalComments,
      avgLikesPerPost: posts.length > 0 ? (totalLikes / posts.length).toFixed(1) : "0.0"
    };
  };

  const stats = calculateStats();

  /* ---------------- Render loading state ---------------- */
  if (loading && posts.length === 0) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex relative">
        <div className="flex-1 p-4 md:p-6 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading liked posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex relative">
      {/* HAMBURGER */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 w-12 h-12 bg-gradient-to-r from-red-600 to-rose-500 rounded-full shadow-lg flex items-center justify-center text-white"
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
          ${isSidebarOpen
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

          {/* Liked Posts - Active */}
          <Link to="/liked-posts" onClick={() => setIsSidebarOpen(false)}>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 transition-all group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-600 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
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
              <span className="font-semibold text-red-600">
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
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
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
        {/* HEADER WITH TABS */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h1 className="text-2xl font-bold mb-6">Liked Posts</h1>

          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              className={`flex-1 py-2 text-center ${activeTab === "i-liked"
                ? "border-b-2 border-red-500 font-semibold text-red-600"
                : "text-gray-500 hover:text-red-600"}`}
              onClick={() => {
                setActiveTab("i-liked");
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
            >
              <div className="flex items-center justify-center space-x-2">
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
                <span>Posts I Liked</span>
              </div>
            </button>

            <button
              className={`flex-1 py-2 text-center ${activeTab === "my-liked"
                ? "border-b-2 border-red-500 font-semibold text-red-600"
                : "text-gray-500 hover:text-red-600"}`}
              onClick={() => {
                setActiveTab("my-liked");
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
            >
              <div className="flex items-center justify-center space-x-2">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-6.198a6 6 0 00-9 5.197"
                  />
                </svg>
                <span>My Posts Liked by Others</span>
              </div>
            </button>
          </div>

          {/* Tab Description */}
          <p className="text-gray-600 mb-4">
            {activeTab === "i-liked"
              ? "Posts you've liked from other users"
              : "Your posts that have been liked by other users"}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-1 bg-red-50 text-red-600 rounded-full text-sm">
              Total Posts · {posts.length}
            </span>
            <span className="px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
              Total Likes · {stats.totalLikes}
            </span>
            <span className="px-4 py-1 bg-green-50 text-green-600 rounded-full text-sm">
              Total Comments · {stats.totalComments}
            </span>
            <span className="px-4 py-1 bg-purple-50 text-purple-600 rounded-full text-sm">
              Avg Likes · {stats.avgLikesPerPost}
            </span>
          </div>
        </div>

        {/* Error Display */}
        {error && posts.length === 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 text-center">
            <svg
              className="w-12 h-12 text-red-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-2 rounded-full"
            >
              Retry
            </button>
          </div>
        )}

        {/* POSTS LIST */}
        <div className="flex flex-col items-center gap-6">
          {posts.length === 0 && !loading && !error ? (
            <div className="text-center py-12 w-full bg-white rounded-2xl shadow">
              <svg
                className="w-20 h-20 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682 4.318 12.682a4.5 4.5 0 010-6.364z"
                />
              </svg>
              <p className="text-gray-500 text-lg mb-2">
                {activeTab === "i-liked"
                  ? "You haven't liked any posts yet"
                  : "No one has liked your posts yet"}
              </p>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {activeTab === "i-liked"
                  ? "When you like posts from others, they will appear here for easy access."
                  : "When people like your posts, they will appear here."}
              </p>
              <Link
                to="/feed"
                className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-2 rounded-full inline-block hover:shadow-lg transition-shadow"
              >
                {activeTab === "i-liked" ? "Browse Posts" : "Create Posts"}
              </Link>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="bg-white rounded-2xl shadow w-full max-w-2xl overflow-hidden">
                {/* Post Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={post.user?.profilePic || "https://via.placeholder.com/150"}
                          alt={post.user?.username}
                          className="w-12 h-12 rounded-full object-cover border-2 border-red-100"
                        />
                        {post.isDeleted && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">@{post.user?.username}</h3>
                        <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                      </div>
                    </div>
                    {activeTab === "i-liked" && (
                      <button
                        onClick={() => handleUnlikePost(post._id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Unlike</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  {post.text && (
                    <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.text}</p>
                  )}

                  {post.image && (
                    <div className="rounded-xl overflow-hidden mb-4 border border-gray-200">
                      <img
                        src={post.image}
                        alt="Post"
                        className="w-full h-auto max-h-96 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Post Stats */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span className="font-semibold text-gray-700">{post.likes?.length || 0}</span>
                        <span className="text-sm text-gray-500">Likes</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="font-semibold text-gray-700">{post.comments?.length || 0}</span>
                        <span className="text-sm text-gray-500">Comments</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Comments Preview */}
                {post.comments && post.comments.length > 0 && (
                  <div className="px-6 py-4 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-700 mb-3">Recent Comments</h4>
                    <div className="space-y-3">
                      {post.comments.slice(0, 2).map((comment, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <img
                            src={comment.user?.profilePic || "https://via.placeholder.com/150"}
                            alt={comment.user?.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-sm">{comment.user?.username}</span>
                              <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                      {post.comments.length > 2 && (
                        <button className="text-blue-600 text-sm hover:text-blue-800">
                          View all {post.comments.length} comments →
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {/* PAGINATION */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || loading}
                className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages || loading}
                className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikedPosts;