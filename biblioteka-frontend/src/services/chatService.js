import api from "./api";

export const chatService = {
  getAdminId: async () => {
    return await api.get("/chat/admin-id");
  },

  getChatHistory: async (chatRoom, page = 1, limit = 50) => {
    return await api.get(`/chat/rooms/${chatRoom}/messages`, {
      params: { page, limit },
    });
  },

  sendMessage: async (receiverId, content, chatRoom) => {
    return await api.post("/chat/messages", {
      receiverId,
      content,
      chatRoom,
    });
  },

  editMessage: async (messageId, content) => {
    return await api.put(`/chat/messages/${messageId}`, { content });
  },

  deleteMessage: async (messageId) => {
    return await api.delete(`/chat/messages/${messageId}`);
  },

  markMessagesAsRead: async (messageIds) => {
    return await api.post("/chat/messages/read", { messageIds });
  },

  getUserChats: async () => {
    return await api.get("/chat/user/chats");
  },

  // Pobranie szczegółów rozmówcy
  getUserDetails: async (userId) => {
    return await api.get(`/chat/users/${userId}`);
  },
};

// Subskrypcja zdarzeń WebSocket
export const subscribeToChatEvents = (socket, handlers) => {
  if (!socket) return;

  const events = [
    "new_message",
    "message_edited",
    "message_deleted",
    "message_read",
    "user_typing",
    "user_online",
    "user_offline",
  ];

  events.forEach((event) => {
    if (handlers[event]) {
      socket.on(event, handlers[event]);
    }
  });

  return () => {
    events.forEach((event) => {
      if (handlers[event]) {
        socket.off(event, handlers[event]);
      }
    });
  };
};
