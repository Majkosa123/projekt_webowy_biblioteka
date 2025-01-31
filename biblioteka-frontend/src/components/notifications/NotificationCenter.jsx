import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../context/AuthContext";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io("http://localhost:3000", {
        withCredentials: true,
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on("connect", () => {
        console.log("Connected to WebSocket");
      });

      newSocket.on("connect_error", (error) => {
        console.log("WebSocket connection error:", error);
      });

      newSocket.on("42", ([event, data]) => {
        if (event === "book_notification") {
          handleNotification(data);
        }
      });

      setSocket(newSocket);

      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    }
  }, [user]);

  const handleNotification = (notification) => {
    setNotifications((prev) =>
      [
        {
          id: Date.now(),
          ...notification,
          timestamp: new Date(),
        },
        ...prev,
      ].slice(0, 5)
    );
  };

  if (!user) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`mb-2 p-4 rounded-lg shadow-lg bg-white border-l-4
            ${
              notification.type === "STATUS_CHANGE"
                ? "border-blue-500"
                : notification.type === "AVAILABILITY"
                ? "border-green-500"
                : "border-gray-500"
            }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {notification.message}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
              {notification.source === "MQTT" && (
                <p className="text-xs text-indigo-600 mt-1">via MQTT</p>
              )}
            </div>
            <button
              onClick={() =>
                setNotifications((prev) =>
                  prev.filter((n) => n.id !== notification.id)
                )
              }
              className="ml-4 text-gray-400 hover:text-gray-500"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;
