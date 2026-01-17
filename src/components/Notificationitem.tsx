import React from "react";
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

interface NotificationItemProps {
  notification: NotificationData;
  onMarkChecked: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkChecked,
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
          </div>
        );
      case "comment":
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
      case "follow":
      case "friend_request":
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-md border transition-all duration-300 hover:shadow-xl group ${
        notification.checked
          ? "border-gray-100"
          : "border-red-200 bg-gradient-to-r from-red-50/50 to-rose-50/50"
      }`}
    >
      <div className="flex gap-4">
        {/* ICON */}
        <div className="flex-shrink-0">
          {getNotificationIcon(notification.type)}
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <img
                src={notification.from.profilePic || "https://via.placeholder.com/40"}
                alt={notification.from.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
              />
              <div>
                <span className="font-semibold text-gray-900 hover:text-red-600 transition-colors cursor-pointer">
                  {notification.from.name}
                </span>
                <span className="text-gray-600 ml-1">
                  {notification.message || "interacted with your post"}
                </span>
              </div>
            </div>

            {!notification.checked && (
              <button
                onClick={() => onMarkChecked(notification._id)}
                className="flex-shrink-0 text-xs bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1.5 rounded-full font-semibold transition-all duration-300 group-hover:scale-105"
              >
                Mark Read
              </button>
            )}
          </div>

          {/* POST PREVIEW */}
          {notification.post && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              {notification.post.text && (
                <p className="text-sm text-gray-700 line-clamp-2">
                  {notification.post.text}
                </p>
              )}
              {notification.post.imageUrl && (
                <img
                  src={notification.post.imageUrl}
                  alt="Post"
                  className="mt-2 w-full h-32 object-cover rounded-lg"
                />
              )}
            </div>
          )}

          {/* TIMESTAMP */}
          <div className="flex items-center gap-2 mt-3">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-gray-500">
              {getTimeAgo(notification.createdAt)}
            </span>
            {!notification.checked && (
              <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
