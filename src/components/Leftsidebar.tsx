import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUnreadNotificationCount } from '../api/notificationApi';

const LeftSidebar = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await getUnreadNotificationCount();
        setUnreadCount(res.data.unreadCount);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };
    fetchUnreadCount();
  }, []);

  return (
    <div className="w-64 bg-gray-100 h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <ul className="space-y-2">
        <li>
          <Link to="/" className="block p-2 rounded hover:bg-gray-200">Home</Link>
        </li>
        <li>
          <Link to="/profile" className="block p-2 rounded hover:bg-gray-200">Profile</Link>
        </li>
        <li>
          <Link to="/friends" className="block p-2 rounded hover:bg-gray-200">Friends</Link>
        </li>
        <li className="relative">
          <Link to="/notification" className="block p-2 rounded hover:bg-gray-200 flex items-center">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </Link>
        </li>
        <li>
          <Link to="/settings" className="block p-2 rounded hover:bg-gray-200">Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default LeftSidebar;