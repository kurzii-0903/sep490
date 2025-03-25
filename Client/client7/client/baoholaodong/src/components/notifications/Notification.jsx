import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";

export default function Notification({ userId, onMarkAsRead }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!userId) {
      setError("Không có userId để lấy thông báo");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/Notification/get-noti-customer?userid=${userId}`
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadNotifications = notifications.filter((notif) => !notif.isRead);

  const handleNotificationClick = (notificationId, orderId) => {
    onMarkAsRead(notificationId, orderId);
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
    setShowNotifications(false);
  };

  if (unreadNotifications.length === 0 && !loading && !error) {
    return null;
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-300 transition"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {unreadNotifications.length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white border shadow-lg rounded-lg overflow-hidden">
          <div className="p-3 border-b bg-gray-100 font-semibold text-gray-700">
            Thông báo
          </div>
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <p className="p-3 text-gray-500 text-sm text-center">Đang tải...</p>
            ) : error ? (
              <p className="p-3 text-red-500 text-sm text-center">{error}</p>
            ) : unreadNotifications.length === 0 ? (
              <p className="p-3 text-gray-500 text-sm text-center">
                Không có thông báo mới
              </p>
            ) : (
              unreadNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 border-b text-sm bg-blue-50 text-blue-900 cursor-pointer hover:bg-blue-100"
                  onClick={() => handleNotificationClick(notif.id, notif.orderId)}
                >
                  <p className="font-semibold">{notif.title}</p>
                  <p className="text-xs">{notif.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}