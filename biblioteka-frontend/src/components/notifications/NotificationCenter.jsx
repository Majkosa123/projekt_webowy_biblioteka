import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../context/AuthContext";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    newSocket.on("42", ([event, data]) => {
      if (event === "book_notification") {
        handleNotification(data);
      }
    });

    newSocket.on("user_notification", (data) => {
      handleNotification(data);
    });

    newSocket.on("book_status_change", (data) => {
      handleNotification(data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

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
    <div className="fixed top-20 right-4 z-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`mb-2 p-4 rounded-lg shadow-lg max-w-sm animate-slide-in
            ${
              notification.type === "CREATE"
                ? "bg-green-100 border-l-4 border-green-500"
                : notification.type === "UPDATE"
                ? "bg-blue-100 border-l-4 border-blue-500"
                : notification.type === "DELETE"
                ? "bg-red-100 border-l-4 border-red-500"
                : "bg-gray-100 border-l-4 border-gray-500"
            }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{notification.message}</p>
              <p className="text-sm text-gray-600">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() =>
                setNotifications((prev) =>
                  prev.filter((n) => n.id !== notification.id)
                )
              }
              className="text-gray-500 hover:text-gray-700"
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
