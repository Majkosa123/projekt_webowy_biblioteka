import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { io } from "socket.io-client";
import api from "../../services/api";
import ChatMessage from "./ChatMessagelist";
import { SendIcon } from "lucide-react";

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Inicjalizacja WebSocket
  useEffect(() => {
    if (user) {
      const newSocket = io("http://localhost:3000", {
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        console.log("Connected to WebSocket");
      });

      newSocket.on("new_message", (data) => {
        console.log("Otrzymano nową wiadomość:", data);
        if (data.message) {
          setMessages((prev) => [...prev, data.message]);
          scrollToBottom();
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const setupChat = async () => {
        try {
          console.log("Pobieranie ID admina...");
          const adminResponse = await api.get("/chat/admin-id");
          console.log("Odpowiedź z serwera:", adminResponse);

          if (adminResponse.data && adminResponse.data.adminId) {
            setAdminId(adminResponse.data.adminId);
          } else {
            console.error("Brak adminId w odpowiedzi:", adminResponse.data);
            setError("Nie można znaleźć admina");
          }

          const messagesResponse = await api.get("/chat/messages");
          console.log("Odpowiedź z historii wiadomości:", messagesResponse);

          if (messagesResponse.data && messagesResponse.data.messages) {
            const sortedMessages = messagesResponse.data.messages.sort(
              (a, b) => new Date(a.sentAt) - new Date(b.sentAt)
            );
            setMessages(sortedMessages);
          } else {
            console.error(
              "Brak wiadomości w odpowiedzi:",
              messagesResponse.data
            );
          }

          setLoading(false);
          scrollToBottom();
        } catch (error) {
          console.error("Błąd inicjalizacji czatu:", error);
          setError(
            error.response?.data?.message || "Nie udało się załadować czatu"
          );
          setLoading(false);
        }
      };

      setupChat();
    }
  }, [user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !adminId) return;

    try {
      const messageData = {
        receiverId: adminId,
        content: newMessage,
      };

      console.log("Wysyłanie wiadomości:", messageData);
      const response = await api.post("/chat/messages", messageData);
      console.log("Odpowiedź po wysłaniu wiadomości:", response);

      if (response.data && response.data.data) {
        // Emitowanie wiadomosci przez WebSocket
        if (socket) {
          socket.emit("chat_message", {
            ...response.data.data,
            senderId: user.userId,
          });
        }

        setNewMessage("");
        scrollToBottom();
      } else {
        console.error("Nieprawidłowa odpowiedź po wysłaniu:", response.data);
        setError("Błąd podczas wysyłania wiadomości");
      }
    } catch (error) {
      console.error("Błąd wysyłania wiadomości:", error);
      setError(
        error.response?.data?.message || "Nie udało się wysłać wiadomości"
      );
    }
  };

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 w-96 bg-white p-4 rounded-lg shadow-xl">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse delay-75" />
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse delay-150" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 w-96 bg-white p-4 rounded-lg shadow-xl">
        <div className="text-red-600 flex items-center space-x-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col">
      <div className="bg-indigo-600 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">Interaktywny czat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.isArray(messages) &&
          messages.map((message) => (
            <ChatMessage
              key={message._id}
              message={message}
              currentUser={user}
            />
          ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Napisz wiadomość..."
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              newMessage.trim()
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <SendIcon className="w-4 h-4" />
            <span>Wyślij</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatContainer;
