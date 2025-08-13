import React from 'react';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const bubble = isUser
    ? 'bg-blue-600 text-white self-end'
    : 'bg-gray-100 text-gray-800 self-start';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs rounded-lg px-3 py-2 text-sm ${bubble}`}>{message.content}</div>
    </div>
  );
}
