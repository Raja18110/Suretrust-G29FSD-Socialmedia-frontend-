import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Users,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Clock,
  Trash2,
  BarChart3,
  TrendingUp,
  FileText
} from "lucide-react";
import axios from "axios";
import { baseUrl } from "../baseUrl";

interface User {
  _id: string;
  username: string;
  profilePic?: string;
}

interface Comment {
  _id: string;
  user: User;
  text: string;
  createdAt: string;
}

interface Post {
  _id: string;
  text: string;
  image?: string;
  likes: User[];
  comments: Comment[];
  createdAt: string;
  user: User;
}

interface PostStats {
  totalPosts: number;
  deletedPosts: number;
  activePosts: number;
  totalLikes: number;
  deletedPercentage: string;
  avgLikesPerPost: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const LikedPosts: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"i-liked" | "my-liked">("i-liked");
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<PostStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [unliking, setUnliking] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);

  const fetchLikedPosts = async (page: number) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const endpoint = activeTab === "i-liked"
      ? `${baseUrl}/post/liked-by-me`
      : `${baseUrl}/post/my-liked-posts`;

    try {
      const response = await axios.get(
        `${endpoint}?page=${page}&limit=${pagination.itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts(response.data.posts || []);
      setPagination(response.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      });

      if (response.data.posts && response.data.posts.length > 0) {
        setSelectedPost(response.data.posts[0]);
        // Fetch detailed view of the first post
        fetchPostDetails(response.data.posts[0]._id);
      } else {
        setSelectedPost(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch posts");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostStats = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}/post/stats/overview`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStats(response.data.stats);
    } catch (err: any) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleUnlike = async (postId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setUnliking(postId);
      const response = await axios.post(
        `${baseUrl}/post/unlike/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh the posts
      fetchLikedPosts(pagination.currentPage);
      fetchPostStats();

      alert(response.data.message);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to unlike post");
    } finally {
      setUnliking(null);
    }
  };

  const fetchPostDetails = async (postId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(
        `${baseUrl}/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedPost(response.data.post);
    } catch (err: any) {
      console.error("Error fetching post details:", err);
    }
  };

  useEffect(() => {
    fetchLikedPosts(1);
    fetchPostStats();
  }, [activeTab]);

  useEffect(() => {
    fetchLikedPosts(pagination.currentPage);
  }, [pagination.currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const timeAgo = (dateString: string): string => {
    const diffMs: number = Date.now() - new Date(dateString).getTime();
    const hours: number = Math.floor(diffMs / (1000 * 60 * 60));

    if (hours < 1) return "Less than 1 hour ago";
    if (hours < 24) return `${hours} hour(s) ago`;
    const days: number = Math.floor(hours / 24);
    return `${days} day(s) ago`;
  };

  const getDetailedTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateLikesStats = () => {
    if (!stats || activeTab !== "i-liked") return null;

    const likesGiven = posts.reduce((acc, post) => acc + (post.likes?.length || 0), 0);
    const likesReceived = stats.totalLikes;

    return {
      likesGiven,
      likesReceived,
      ratio: likesGiven > 0 ? (likesReceived / likesGiven).toFixed(2) : "0.00"
    };
  };

  const likesStats = calculateLikesStats();

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* LEFT PANEL */}
      <div className="w-full md:w-2/5 bg-white border-r p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Liked Posts</h2>
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
          >
            <BarChart3 className="w-4 h-4" />
            {showStats ? "Hide Stats" : "Show Stats"}
          </button>
        </div>

        {/* Stats Panel */}
        {showStats && stats && (
          <div className="mb-6 bg-gray-50 rounded-lg p-4 border">
            <h3 className="font-semibold text-gray-700 mb-3">Your Post Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Posts</p>
                    <p className="text-xl font-bold text-blue-600">{stats.activePosts}</p>
                  </div>
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Likes</p>
                    <p className="text-xl font-bold text-green-600">{stats.totalLikes}</p>
                  </div>
                  <Heart className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Avg Likes/Post</p>
                    <p className="text-xl font-bold text-purple-600">{stats.avgLikesPerPost}</p>
                  </div>
                  <TrendingUp className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              {likesStats && (
                <div className="bg-white p-3 rounded border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Likes Ratio</p>
                      <p className="text-xl font-bold text-orange-600">{likesStats.ratio}</p>
                    </div>
                    <Users className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <p>Deleted: {stats.deletedPosts} posts ({stats.deletedPercentage}%)</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`flex-1 py-2 text-center ${activeTab === "i-liked" ? "border-b-2 border-blue-500 font-semibold" : ""
              }`}
            onClick={() => {
              setActiveTab("i-liked");
              setPagination(prev => ({ ...prev, currentPage: 1 }));
            }}
          >
            <div className="flex items-center justify-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Posts I Liked</span>
            </div>
          </button>
          <button
            className={`flex-1 py-2 text-center ${activeTab === "my-liked" ? "border-b-2 border-blue-500 font-semibold" : ""
              }`}
            onClick={() => {
              setActiveTab("my-liked");
              setPagination(prev => ({ ...prev, currentPage: 1 }));
            }}
          >
            <div className="flex items-center justify-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Liked My Posts</span>
            </div>
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">
              {activeTab === "i-liked"
                ? "You haven't liked any posts yet"
                : "No one has liked your posts yet"}
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Explore Posts
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          posts.map((post) => (
            <button
              key={post._id}
              onClick={() => {
                setSelectedPost(post);
                fetchPostDetails(post._id);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 text-left border transition ${selectedPost?._id === post._id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
                }`}
            >
              {post.user.profilePic ? (
                <img
                  src={post.user.profilePic}
                  alt={post.user.username}
                  className="w-10 h-10 rounded-full object-cover border"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border">
                  <span className="text-blue-600 font-semibold">
                    {post.user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <div className="font-semibold text-sm">{post.user.username}</div>
                <div className="text-xs text-gray-500">
                  {timeAgo(post.createdAt)}
                </div>
                <div className="text-xs text-gray-700 truncate mt-1">
                  {post.text?.substring(0, 60) || "No text content"}
                  {post.text && post.text.length > 60 ? "..." : ""}
                </div>
                <div className="flex items-center space-x-3 mt-1">
                  <div className="flex items-center space-x-1 text-red-500">
                    <Heart className="w-3 h-3" />
                    <span className="text-xs">{post.likes?.length || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-500">
                    <MessageCircle className="w-3 h-3" />
                    <span className="text-xs">{post.comments?.length || 0}</span>
                  </div>
                </div>
              </div>
              {activeTab === "i-liked" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnlike(post._id);
                  }}
                  disabled={unliking === post._id}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50"
                  title="Unlike"
                >
                  {unliking === post._id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              )}
            </button>
          ))}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 flex items-center text-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 flex items-center text-sm"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-3/5 p-4 md:p-6">
        {selectedPost ? (
          <div className="bg-white rounded-xl shadow max-w-2xl w-full mx-auto">
            {/* Post Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4 flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3">
                  {selectedPost.user.profilePic ? (
                    <img
                      src={selectedPost.user.profilePic}
                      alt={selectedPost.user.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                      <span className="text-blue-600 font-bold text-lg">
                        {selectedPost.user.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-lg">
                      @{selectedPost.user.username}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {getDetailedTime(selectedPost.createdAt)}
                    </div>
                  </div>
                </div>
                {activeTab === "i-liked" && (
                  <button
                    onClick={() => handleUnlike(selectedPost._id)}
                    disabled={unliking === selectedPost._id}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm disabled:opacity-50"
                  >
                    {unliking === selectedPost._id ? "Unliking..." : "Unlike"}
                  </button>
                )}
              </div>

              {/* Post Content */}
              <p className="text-gray-800 text-lg mb-4">{selectedPost.text}</p>

              {/* Post Image */}
              {selectedPost.image && (
                <div className="rounded-lg overflow-hidden mb-4">
                  <img
                    src={selectedPost.image}
                    alt="post"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
              )}

              {/* Post Stats */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-red-600">
                    <Heart className="w-5 h-5" />
                    <span className="font-semibold">
                      {selectedPost.likes?.length || 0} likes
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-semibold">
                      {selectedPost.comments?.length || 0} comments
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* People who liked */}
            {selectedPost.likes && selectedPost.likes.length > 0 && (
              <div className="p-6 border-b">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Liked by {selectedPost.likes.length} people
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPost.likes.slice(0, 10).map((like: User, index: number) => (
                    <div
                      key={like._id || index}
                      className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-full"
                      title={like.username}
                    >
                      {like.profilePic ? (
                        <img
                          src={like.profilePic}
                          alt={like.username}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-semibold">
                            {like.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-sm text-gray-700">
                        {like.username}
                      </span>
                    </div>
                  ))}
                  {selectedPost.likes.length > 10 && (
                    <div className="text-sm text-gray-500">
                      +{selectedPost.likes.length - 10} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recent Comments */}
            {selectedPost.comments && selectedPost.comments.length > 0 && (
              <div className="p-6">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Recent Comments ({selectedPost.comments.length})
                </h3>
                <div className="space-y-4">
                  {selectedPost.comments.slice(0, 3).map((comment: Comment, index: number) => (
                    <div key={comment._id || index} className="flex items-start space-x-3">
                      {comment.user?.profilePic ? (
                        <img
                          src={comment.user.profilePic}
                          alt={comment.user.username}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-600 text-xs">
                            {comment.user?.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm">
                            {comment.user?.username}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {timeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm mt-1">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                  {selectedPost.comments.length > 3 && (
                    <button
                      onClick={() => navigate(`/post/${selectedPost._id}`)}
                      className="text-blue-600 text-sm hover:text-blue-800"
                    >
                      View all {selectedPost.comments.length} comments →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <Heart className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Select a post
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              {activeTab === "i-liked"
                ? "Select a post from the list to view details of posts you've liked"
                : "Select a post from the list to see who liked your content"}
            </p>
            {posts.length === 0 && (
              <button
                onClick={() => setShowStats(true)}
                className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
              >
                View Statistics
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedPosts;