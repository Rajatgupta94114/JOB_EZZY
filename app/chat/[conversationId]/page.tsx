'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/lib/store';
import { ArrowLeft, Send, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function ChatPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationId, setConversationId] = useState('');
  const otherUserName = searchParams.get('name') || 'User';

  useEffect(() => {
    params.then((p) => setConversationId(p.conversationId));
  }, [params]);

  // Extract the other user ID from conversation ID
  const userIds = conversationId.split('_');
  const otherUserId = userIds[0] === user?.id ? userIds[1] : userIds[0];

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !user) return;

    try {
      setLoading(true);
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          senderId: user.id,
          receiverId: otherUserId,
          message: newMessage.trim(),
        }),
      });

      if (response.ok) {
        setNewMessage('');
        await fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId }),
      });

      if (response.ok) {
        await fetchMessages();
      } else {
        alert('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
    }
  };

  if (!isAuthenticated || !user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex flex-col">
      <Navigation />

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-8 pb-32">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href="/messages" className="p-2 rounded-lg hover:bg-white/10 transition-all">
            <ArrowLeft size={24} className="text-primary-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">{otherUserName}</h1>
            <p className="text-dark-300 text-sm">Chat</p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 glass-dark rounded-xl p-6 mb-6 overflow-y-auto space-y-4 max-h-96">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-dark-400">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'} group`}
              >
                <div className="flex gap-2 items-end">
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.senderId === user.id
                        ? 'bg-primary-500/30 text-primary-100 rounded-br-none'
                        : 'bg-dark-800 text-dark-100 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {msg.senderId === user.id && (
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded text-red-400"
                      title="Delete message"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all flex items-center gap-2"
          >
            <Send size={18} />
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
