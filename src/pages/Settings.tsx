import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../baseUrl";

interface Friend {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
}

const Settings: React.FC = () => {
  // UI & Loading States
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Prevents white screen blink
  const [serverError, setServerError] = useState(false); // Handles backend down/starting

  // Data State
  const [friends, setFriends] = useState<Friend[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Form States
  const [confirmForUpdate, setConfirmForUpdate] = useState("");
  const [loadingGeneral, setLoadingGeneral] = useState(false);
  const [generalMsg, setGeneralMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch Data on Load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setServerError(false);
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Fetch Profile and Friends simultaneously for efficiency
        const [userRes, friendsRes] = await Promise.all([
          axios.get(`${baseUrl}/user/me`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${baseUrl}/friendrequest/getFriends`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (userRes.data?.user) {
          setName(userRes.data.user.name || "");
          setEmail(userRes.data.user.email || "");
        }
        
        setFriends(friendsRes.data?.friends || []);
      } catch (err) {
        console.error("Backend connection error:", err);
        setServerError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const submitGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralMsg(null);
    setLoadingGeneral(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${baseUrl}/user/update`, 
        { name, email, password: confirmForUpdate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGeneralMsg({ type: "success", text: res.data.message || "Profile updated successfully." });
      setConfirmForUpdate("");
    } catch (err: any) {
      setGeneralMsg({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
    } finally {
      setLoadingGeneral(false);
    }
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    setLoadingPassword(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${baseUrl}/user/change-password`, 
        { oldPassword: currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordMsg({ type: "success", text: res.data.message || "Password changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordMsg({ type: "error", text: err.response?.data?.message || "Failed to change password." });
    } finally {
      setLoadingPassword(false);
    }
  };

  // 1. LOADING VIEW (Prevents Blinking during Fetch)
  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Loading settings...</p>
      </div>
    );
  }

  // 2. ERROR VIEW (Prevents White Screen if Backend is restarting)
  if (serverError) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Server Connection Lost</h2>
          <p className="text-gray-500 mb-6">The backend is currently unreachable. Please try again in a moment.</p>
          <button onClick={() => window.location.reload()} className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition-colors">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex relative">
      {/* MOBILE HAMBURGER BUTTON */}
      <button
        onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 w-12 h-12 bg-gradient-to-r from-red-600 to-rose-500 rounded-full shadow-lg flex items-center justify-center text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {leftSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* MOBILE OVERLAY */}
      {leftSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 top-16" onClick={() => setLeftSidebarOpen(false)} />
      )}

      {/* LEFT SIDEBAR */}
      <div className={`fixed lg:static top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-gray-200 p-4 shadow-lg transform transition-transform duration-300 ease-in-out ${leftSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} overflow-y-auto`}>
        <div className="space-y-2">
          {/* PROFILE */}
          <Link to="/profile" onClick={() => setLeftSidebarOpen(false)}>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-red-600 transition-colors">Profile</span>
            </div>
          </Link>

          {/* NOTIFICATIONS (RESTORED) */}
          <Link to="/notification" onClick={() => setLeftSidebarOpen(false)}>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">5</span>
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-red-600 transition-colors">Notifications</span>
            </div>
          </Link>

          {/* FRIENDS */}
          <Link to="/friends" onClick={() => setLeftSidebarOpen(false)}>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-red-600 transition-colors">Friends</span>
            </div>
          </Link>

          {/* SETTINGS (Active) */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 text-red-600 border border-red-100 shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center text-white shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
            </div>
            <span className="font-bold">Settings</span>
          </div>
        </div>
      </div>

      {/* CENTER CONTENT */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto lg:mr-80">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-gray-800 px-2">Account Settings</h1>

          {/* GENERAL INFO CARD */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
              General Information
            </h2>
            {generalMsg && (
              <div className={`mb-4 p-3 rounded-xl text-sm font-semibold ${generalMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {generalMsg.text}
              </div>
            )}
            <form onSubmit={submitGeneral} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase ml-1 mb-1">Name</label>
                  <input
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-red-500 transition-all"
                    value={name} onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase ml-1 mb-1">Email</label>
                  <input
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-red-500 transition-all"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-red-500 uppercase ml-1 mb-1">Password to Confirm</label>
                <input
                  type="password"
                  className="w-full bg-gray-50 border-2 border-red-100 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-red-500 transition-all"
                  value={confirmForUpdate} onChange={(e) => setConfirmForUpdate(e.target.value)}
                  placeholder="Enter current password to save changes"
                />
              </div>
              <button
                disabled={loadingGeneral}
                className="w-full bg-gradient-to-r from-red-600 to-rose-500 hover:opacity-90 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loadingGeneral ? "Saving..." : "Save Profile Changes"}
              </button>
            </form>
          </div>

          {/* PASSWORD CARD */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
              Update Password
            </h2>
            {passwordMsg && (
              <div className={`mb-4 p-3 rounded-xl text-sm font-semibold ${passwordMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {passwordMsg.text}
              </div>
            )}
            <form onSubmit={submitPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase ml-1 mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-red-500 transition-all"
                  value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase ml-1 mb-1">New Password</label>
                  <input
                    type="password"
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-red-500 transition-all"
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase ml-1 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-red-500 transition-all"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <button
                disabled={loadingPassword}
                className="w-full bg-gradient-to-r from-red-600 to-rose-500 hover:opacity-90 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loadingPassword ? "Updating..." : "Change Password Now"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="hidden lg:block fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 p-5 shadow-sm overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800">Friends</h2>
          <span className="text-xs bg-red-600 text-white px-3 py-1 rounded-full font-semibold">
            {friends?.length || 0}
          </span>
        </div>
        <div className="space-y-3">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <Link key={friend._id} to={`/friend/${friend._id}`}>
                <div className="bg-white hover:bg-red-50 p-3 rounded-xl border border-gray-100 hover:border-red-200 transition-all duration-300 cursor-pointer group shadow-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={friend.profilePic || "https://i.pravatar.cc/150"}
                      alt={friend.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-red-200"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors text-sm">{friend.name}</p>
                      <p className="text-xs text-gray-500">Active now</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-400 text-sm py-10">No friends connected</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;