import React from "react";
import { PencilIcon, TrashIcon, CheckIcon, XIcon } from "lucide-react";

const ChatMessage = ({ message, currentUser }) => {
  if (!message || !message.sender) {
    console.warn("Invalid message props:", message);
    return null;
  }

  const isOwnMessage = message.sender._id === currentUser?.userId;

  return (
    <div
      className={`p-4 rounded-lg max-w-[85%] ${
        isOwnMessage ? "ml-auto bg-indigo-100" : "mr-auto bg-gray-100"
      }`}
    >
      <div className="font-medium text-sm text-gray-600">
        {message.sender?.username || "Unknown"}
      </div>
      <div className="text-gray-800 break-words">{message.content}</div>
      <div className="text-xs text-gray-500 mt-1">
        {new Date(message.sentAt).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default ChatMessage;
