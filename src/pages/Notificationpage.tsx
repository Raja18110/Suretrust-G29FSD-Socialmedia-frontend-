import React, { useEffect, useState } from "react";
// @ts-ignore
import { getAllNotifications, markAsChecked, markAllAsChecked } from "../api/notificationApi";
import NotificationItem from "../components/Notificationitem";

export interface NotificationData {
  _id: string;
  from: {
    name: string;
    profilePic: string;
  };
  post?: {
    text?: string;
    imageUrl?: string;
  };
  checked: boolean;
  createdAt: string;
  type: string;
  message?: string;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = async () => {
    try {
      const response = await getAllNotifications();
      console.log("API RESPONSE =", response.data);

      const notificationsWithChecked = (response.data.notifications || []).map((n: any) => ({
        ...n,
        checked: n.checked,
      }));
      setNotifications(notificationsWithChecked);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsChecked = async (id: string) => {
    try {
      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, checked: true } : n))
      );

      await markAsChecked(id);
      // Refetch to ensure sync with server
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking notification:", error);
    }
  };

  const handleMarkAllAsChecked = async () => {
    try {
      // Optimistically update UI
      setNotifications((prev) => prev.map((n) => ({ ...n, checked: true })));

      await markAllAsChecked();
      // Refetch to ensure sync with server
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications:", error);
    }
  };

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.checked) 
    : notifications;

  const unreadCount = notifications.filter(n => !n.checked).length;

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    You have <span className="font-semibold text-red-600">{unreadCount}</span> unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleMarkAllAsChecked}
              disabled={unreadCount === 0}
              className="flex items-center gap-2 bg-linear-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white font-semibold px-5 py-2.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mark All as Read
            </button>
          </div>

          {/* FILTER TABS */}
          <div className="flex gap-2 mt-5 pt-5 border-t border-gray-100">
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                filter === "all"
                  ? "bg-linear-to-r from-red-600 to-rose-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                filter === "unread"
                  ? "bg-linear-to-r from-red-600 to-rose-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>
{/* stats */}
    {!loading && notifications.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-5 border border-gray-100 mb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-linear-to-br from-red-50 to-rose-50 rounded-xl">
                <div className="text-2xl font-bold text-red-600">{notifications.length}</div>
                <div className="text-xs text-gray-600 mt-1">Total</div>
              </div>
              <div className="p-3 bg-linear-to-br from-amber-50 to-yellow-50 rounded-xl">
                <div className="text-2xl font-bold text-amber-600">{unreadCount}</div>
                <div className="text-xs text-gray-600 mt-1">Unread</div>
              </div>
              <div className="p-3 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</div>
                <div className="text-xs text-gray-600 mt-1">Read</div>
              </div>
              <div className="p-3 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl">
                <div className="text-2xl font-bold text-gray-700">
                  {notifications.filter(n => {
                    const now = new Date();
                    const notifDate = new Date(n.createdAt);
                    const diffHours = (now.getTime() - notifDate.getTime()) / (1000 * 60 * 60);
                    return diffHours < 24;
                  }).length}
                </div>
                <div className="text-xs text-gray-600 mt-1">Today</div>
              </div>
            </div>
          </div>
        )}
        {/* LOADING STATE */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-semibold">Loading notifications...</p>
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-24 h-24 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {filter === "unread" ? "No unread notifications" : "No notifications yet"}
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                {filter === "unread" 
                  ? "You're all caught up! Check back later for new updates."
                  : "When you get notifications, they'll show up here."}
              </p>
            </div>
          </div>
        ) : (
          /* NOTIFICATIONS LIST */
          <div className="space-y-3">
            {filteredNotifications.map((notif, index) => (
              <div
                key={notif._id}
                className="transform transition-all duration-300 hover:scale-[1.01]"
                style={{
                  animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                <NotificationItem
                  notification={notif}
                  onMarkChecked={handleMarkAsChecked}
                />
              </div>
            ))}
          </div>
        )}


    
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationPage;
