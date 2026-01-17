import  { useState, useEffect } from 'react';
import { UserPlus } from "lucide-react";
import PostCard from '../components/Post';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../baseUrl';

interface FriendProfileType {
  profilePic?: string;
  name: string;
  email: string;
  friends?: any[];
  isFriend?: boolean;
  isPending?: boolean;
}

const FriendProfile = () => {
  const { _id } = useParams<{ _id: string }>();

  const [profile, setProfile] = useState<FriendProfileType | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleSendRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Login required");

      await axios.post(
        `${baseUrl}/friendrequest/send`,
        { receiver: _id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert("Friend Request Sent!");
      setProfile(prev => prev ? { ...prev, isPending: true } : prev);

    } catch (err) {
      console.log(err);
      alert("Failed to send request");
    }
  };

  useEffect(() => {
    const fetchFriendProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !_id) return;

        const res = await axios.get(
          `${baseUrl}/user/friendprofile/${_id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setProfile({
          ...res.data.user,
          isFriend: res.data.is_friend,
          isPending: res.data.is_pending
        });

        setPosts(res.data.posts || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendProfile();
  }, [_id]);

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (!profile) {
    return (
      <p className="text-center text-red-600 mt-10">
        Failed to load profile
      </p>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-200 flex">
      {/* LEFT PANEL */}
      <div className="w-1/5 bg-white border-r p-4">
        <h2 className="text-xl font-bold mb-6">Profile</h2>

        <ul className="space-y-4">
          <li className="cursor-pointer hover:text-blue-600">
            <Link to="/profile">My Posts</Link>
          </li>
          <li className="cursor-pointer hover:text-blue-600">
            <Link to="/liked-posts">Liked Posts</Link>
          </li>
          <li className="cursor-pointer hover:text-blue-600">
            <Link to="/deleted-posts">Deleted Posts</Link>
          </li>
          <li className="cursor-pointer hover:text-blue-600">
            <Link to="/settings">Settings</Link>
          </li>
        </ul>
      </div>

      {/* MIDDLE PANEL */}
      <div className="w-3/5 p-4 space-y-4 overflow-y-auto h-screen">
        {/* PROFILE HEADER */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={profile.profilePic || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-blue-600 object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-gray-600">
                Friends: {profile.friends ? profile.friends.length : 0}
              </p>

              {/* SHOW SEND REQUEST ONLY IF NOT FRIEND AND NOT PENDING */}
              {!profile.isFriend && !profile.isPending && (
                <button
                  onClick={handleSendRequest}
                  className="flex items-center gap-2 mt-3 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                  <UserPlus size={18} />
                  Send Friend Request
                </button>
              )}

              {/* SHOW PENDING BUTTON IF REQUEST SENT */}
              {profile.isPending && !profile.isFriend && (
                <button
                  disabled
                  className="flex items-center gap-2 mt-3 px-4 py-2 bg-yellow-500 text-white rounded-full"
                >
                  ⏳ Pending
                </button>
              )}

              {/* SHOW FRIEND TEXT IF ALREADY FRIEND */}
              {profile.isFriend && (
                <p className="text-green-600 font-semibold mt-2">Friend</p>
              )}
            </div>
          </div>
        </div>

        {/* POSTS SECTION */}
        <div className="items-center flex flex-col gap-y-3">
          {posts.length === 0 && (
            <p className="text-gray-500">No posts to show</p>
          )}

          {posts.map((post: any) => (
            <PostCard
              key={post._id}
              profilePhoto={post.user?.profilePic || 'https://via.placeholder.com/150'}
              userName={post.user?.name || 'User'}
              caption={post.text}
              likes={post.likes?.length || 0}
              comments={post.comments?.length || 0}
              postImage={post.image}
              id={post._id} comments_count={0}            />
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-1/5 bg-gray-100 border-2 p-4">
        <h2 className="text-xl font-bold mb-4">Friends</h2>
        <p className="text-gray-600">Total Friends: {profile.friends?.length || 0}</p>
      </div>
    </div>
  );
};

export default FriendProfile;

