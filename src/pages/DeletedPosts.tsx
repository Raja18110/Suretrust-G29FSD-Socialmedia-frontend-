import React, { useState, useEffect } from "react";
import { getDeletedPosts, restorePost } from "../api/postApi";

type DeletedPost = {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
    profilePic: string;
  };
  text: string;
  image?: string;
  deletedAt: string;
  createdAt: string;
};

const formatDeletedTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

const DeletedPosts: React.FC = () => {
  const [deletedPosts, setDeletedPosts] = useState<DeletedPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<DeletedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeletedPosts();
  }, []);

  const fetchDeletedPosts = async () => {
    try {
      setLoading(true);
      const response = await getDeletedPosts();
      setDeletedPosts(response.posts);
      if (response.posts.length > 0) {
        setSelectedPost(response.posts[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch deleted posts");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restorePost(id);
      // Remove from local state
      setDeletedPosts((prev) => prev.filter((post) => post._id !== id));
      setSelectedPost((prev) => {
        if (!prev || prev._id !== id) return prev;
        const remaining = deletedPosts.filter((p) => p._id !== id);
        return remaining[0] ?? null;
      });
      alert("Post restored successfully");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to restore post");
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex">
      {/* LEFT PANEL – timing + restore option */}
      <div className="w-2/5 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Deleted Posts</h2>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {deletedPosts.length === 0 && !loading && (
          <p className="text-gray-500 text-sm">No deleted posts.</p>
        )}

        {deletedPosts.map((post) => (
          <div
            key={post._id}
            className={`w-full p-3 rounded-lg mb-2 border text-left transition ${
              selectedPost?._id === post._id
                ? "border-red-500 bg-red-50"
                : "border-red-100 hover:bg-red-50"
            }`}
            onClick={() => setSelectedPost(post)}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-sm">Post by {post.user.username}</span>
              <span className="text-xs text-red-500">
                Deleted: {formatDeletedTime(post.deletedAt)}
              </span>
            </div>
            <p className="text-xs text-gray-700 mb-2 line-clamp-2">
              {post.text}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRestore(post._id);
              }}
              className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
            >
              Restore
            </button>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL – selected deleted post */}
      <div className="w-3/5 p-6 flex justify-center items-start">
        {selectedPost ? (
          <div className="bg-white rounded-xl shadow max-w-xl w-full p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="font-semibold text-sm">
                  Deleted Post by {selectedPost.user.username}
                </div>
                <div className="text-xs text-red-500">
                  Deleted: {formatDeletedTime(selectedPost.deletedAt)}
                </div>
              </div>
            </div>

            <p className="mb-3 text-gray-800">{selectedPost.text}</p>

            {selectedPost.image && (
              <img
                src={selectedPost.image}
                alt="deleted post"
                className="w-full rounded-lg object-cover"
              />
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">No deleted post selected.</div>
        )}
      </div>
    </div>
  );
};

export default DeletedPosts;
