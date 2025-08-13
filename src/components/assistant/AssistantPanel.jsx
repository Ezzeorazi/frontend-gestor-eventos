import React, { useState } from 'react';
import MessageBubble from './MessageBubble.jsx';
import PromptBox from './PromptBox.jsx';
import api from '../../services/axios.js';

export default function AssistantPanel() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content) => {
    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { messages: next.slice(-10) });
      if (Array.isArray(data?.messages)) setMessages(data.messages);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <aside className="fixed right-0 top-0 z-40 flex h-full w-80 flex-col border-l border-gray-200 bg-white">
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
        {loading && <div className="text-sm text-gray-500">Pensando...</div>}
      </div>
      <PromptBox onSend={sendMessage} disabled={loading} />
    </aside>
  );
}
