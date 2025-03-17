import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";

export default function Notification({ notifications, onMarkAsRead }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const dropdownRef = useRef(null);

  // Xử lý click bên ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {notifications.some((n) => !n.isRead) && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {notifications.filter((n) => !n.isRead).length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white border shadow-lg rounded-lg overflow-hidden">
          <div className="p-3 border-b bg-gray-100 font-semibold text-gray-700">Thông báo</div>
          <div className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-3 text-gray-500 text-sm text-center">Không có thông báo</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 border-b text-sm ${notif.isRead ? "bg-gray-100 text-gray-600" : "bg-blue-50 text-blue-900"
                    }`}
                    onClick={() => onMarkAsRead(notif.id)}
                >
                  <p className="font-semibold">{notif.title}</p>
                  <p className="text-xs">{notif.message}</p>
                  <p className="text-xs text-gray-500">{notif.createdAt}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
