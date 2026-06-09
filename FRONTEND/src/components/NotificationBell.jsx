import { useEffect, useState } from "react";
import socket from "../services/socket";
import {
  getNotifications,
  markAsRead,
} from "../api/notificationApi";
import { useAuth } from "../context/AuthContext";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const { user } = useAuth();

  // JOIN USER 
  useEffect(() => {
    if (user?._id) {
      socket.emit("join-user", user._id);
    }
  }, [user]);
  // LOAD NOTIFICATIONS
  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications);
    } catch (err) {
      console.log(err);
    }
  };

  
  // SOCKET LISTENER
  useEffect(() => {
    loadNotifications();

    const handleNotification = (data) => {
  console.log("LIVE NOTIFICATION RECEIVED:", data);

  setNotifications((prev) => [
    {
      _id: Date.now(),
      message: data.message,
      isRead: false,
      createdAt: new Date(),
    },
    ...prev,
  ]);
};

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, []);

  // UNREAD COUNT
  const unreadCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  // MARK AS READ
  const handleRead = async (id) => {
    try {
      await markAsRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id
            ? { ...n, isRead: true }
            : n
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  // UI

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <button
        className="nav-btn"
        onClick={() => setOpen(!open)}
      >
        🔔 {unreadCount}
      </button>

      {open && (
        <div className="notification-dropdown">
          <h4>Notifications</h4>

          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className="notification-item"
                onClick={() =>
                  !n.isRead &&
                  handleRead(n._id)
                }
              >
                <p>{n.message}</p>

                {!n.isRead && (
                  <span>●</span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;