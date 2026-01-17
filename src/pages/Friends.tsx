import { useEffect, useState } from "react";
import axios from "axios";
import ProfileCard from "../components/ProfileCard";
import { Users, Clock, UserX } from "lucide-react";
import { baseUrl } from "../baseUrl"

const Friends = () => {
  const [activeTab, setActiveTab] = useState<"friends" | "pending" | "rejected">(
    "pending"
  );
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);

  const token = localStorage.getItem("token");

  const getFriendRequests = async () => {
    try {
      if (!token) return;

      const res = await axios.get(
        `${baseUrl}/friendrequest/getfriendrequests`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const allRequests = res.data.friendRequests || [];

      const pending = allRequests.filter(
        (req: any) => req.status === "pending"
      );

      const rejected = allRequests.filter(
        (req: any) => req.status === "rejected"
      );

      setFriendRequests(pending);
      setRejectedRequests(rejected);
    } catch (error) {
      console.log("Error fetching friend requests", error);
    }
  };

  const getAllFriends = async () => {
    try {
      if (!token) return;

      const res = await axios.get(
        `${baseUrl}/friendrequest/getAllFriends`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFriends(res.data.friends || []);
    } catch (error) {
      console.log("Error fetching friends", error);
    }
  };

  const handleRequestAction = async (
    requestId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      if (!token) return;

      await axios.post(
        `${baseUrl}/friendrequest/stauschange`,
        { requestId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      getFriendRequests();

      if (status === "accepted") {
        getAllFriends();
      }
    } catch (error) {
      console.log("Error updating friend request", error);
    }
  };

  useEffect(() => {
    getFriendRequests();
    getAllFriends();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-200 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <div className="md:w-64 w-full bg-white border-b md:border-b-0 md:border-r p-4 shadow-sm">
        <div className="flex md:flex-col gap-2 overflow-x-auto">
          {/* Friends */}
          <div
            onClick={() => setActiveTab("friends")}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all min-w-max
            ${
              activeTab === "friends"
                ? "bg-linear-to-r from-red-50 to-rose-50"
                : "hover:bg-linear-to-r hover:from-red-50 hover:to-rose-50"
            }`}
          >
            <div className="w-9 h-9 bg-linear-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white">
              <Users size={20} />
            </div>
            <span
              className={`font-semibold ${
                activeTab === "friends"
                  ? "text-red-600"
                  : "text-gray-700"
              }`}
            >
              My Friends
            </span>
          </div>

          {/* Pending */}
          <div
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all min-w-max
            ${
              activeTab === "pending"
                ? "bg-linear-to-r from-red-50 to-rose-50"
                : "hover:bg-linear-to-r hover:from-red-50 hover:to-rose-50"
            }`}
          >
            <div className="w-9 h-9 bg-linear-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white">
              <Clock size={20} />
            </div>
            <span
              className={`font-semibold ${
                activeTab === "pending"
                  ? "text-red-600"
                  : "text-gray-700"
              }`}
            >
              Pending Requests
            </span>
          </div>

          {/* Rejected */}
          <div
            onClick={() => setActiveTab("rejected")}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all min-w-max
            ${
              activeTab === "rejected"
                ? "bg-linear-to-r from-red-50 to-rose-50"
                : "hover:bg-linear-to-r hover:from-red-50 hover:to-rose-50"
            }`}
          >
            <div className="w-9 h-9 bg-linear-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white">
              <UserX size={20} />
            </div>
            <span
              className={`font-semibold ${
                activeTab === "rejected"
                  ? "text-red-600"
                  : "text-gray-700"
              }`}
            >
              Rejected Requests
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        {/* FRIENDS */}
        {activeTab === "friends" && (
          <>
            <h2 className="text-2xl font-semibold mb-4">My Friends</h2>
            {friends.length === 0 ? (
              <p>No friends found</p>
            ) : (
              <ul className="space-y-3">
                {friends.map((friend) => (
                  <li
                    key={friend._id}
                    className="bg-white p-4 rounded-xl shadow flex items-center gap-4"
                  >
                    <img
                      src={
                        friend.profilePic || "https://via.placeholder.com/150"
                      }
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{friend.name}</p>
                      <p className="text-sm text-gray-500">{friend.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* PENDING */}
        {activeTab === "pending" && (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              Pending Requests
            </h2>
            {friendRequests.length === 0 ? (
              <p>No pending requests</p>
            ) : (
              <ul className="space-y-4">
                {friendRequests.map((request) => (
                  <li key={request._id}>
                    <ProfileCard
                      name={request.from.name}
                      image={
                        request.from.profilePic ||
                        "https://via.placeholder.com/150"
                      }
                      onAccept={() =>
                        handleRequestAction(request._id, "accepted")
                      }
                      onReject={() =>
                        handleRequestAction(request._id, "rejected")
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* REJECTED */}
        {activeTab === "rejected" && (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              Rejected Requests
            </h2>
            {rejectedRequests.length === 0 ? (
              <p>No rejected requests</p>
            ) : (
              <ul className="space-y-3">
                {rejectedRequests.map((req) => (
                  <li
                    key={req._id}
                    className="bg-red-50 p-4 rounded-xl shadow"
                  >
                    <p className="font-semibold">{req.from.name}</p>
                    <p className="text-sm text-gray-600">{req.from.email}</p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Friends;
