'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/lib/store';
import { ArrowLeft, MessageCircle, Search } from 'lucide-react';
import Link from 'next/link';

interface Conversation {
  conversationId: string;
  otherUserId: string;
  otherUserName: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

export default function MessagesPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [user?.id]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const messagesRes = await fetch('/api/messages');
      const usersRes = await fetch('/api/users');

      if (messagesRes.ok && usersRes.ok) {
        const messages = await messagesRes.json();
        const users = await usersRes.json();

        // Get all conversations for current user
        const userMessages = messages.filter(
          (m: any) => m.senderId === user.id || m.receiverId === user.id
        );

        // Group by conversation
        const conversationMap = new Map<string, any>();

        userMessages.forEach((msg: any) => {
          const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
          const convId = [user.id, otherUserId].sort().join('_');

          if (!conversationMap.has(convId)) {
            const otherUser = users.find((u: any) => u.id === otherUserId);
            conversationMap.set(convId, {
              conversationId: convId,
              otherUserId,
              otherUserName: otherUser?.name || 'Unknown',
              lastMessage: msg.message,
              lastMessageTime: msg.createdAt,
              unread: 0,
            });
          } else {
            const conv = conversationMap.get(convId);
            if (new Date(msg.createdAt) > new Date(conv.lastMessageTime)) {
              conv.lastMessage = msg.message;
              conv.lastMessageTime = msg.createdAt;
            }
            if (msg.receiverId === user.id && !msg.read) {
              conv.unread += 1;
            }
          }
        });

        const convList = Array.from(conversationMap.values()).sort(
          (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
        );

        setConversations(convList);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.otherUserName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated || !user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8 pb-32 md:pb-8">
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center gap-4 animate-fadeInUp">
          <Link href="/" className="p-2 rounded-lg hover:bg-white/10 transition-all">
            <ArrowLeft size={24} className="text-primary-400" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold gradient-text">Messages</h1>
            <p className="text-dark-300 mt-2">Your conversations</p>
          </div>
        </div>

        {/* Search */}
        <div className="glass-dark rounded-xl p-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-dark-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            />
          </div>
        </div>

        {/* Conversations List */}
        {loading ? (
          <div className="glass-dark rounded-xl p-12 text-center">
            <p className="text-dark-400">Loading conversations...</p>
          </div>
        ) : filteredConversations.length > 0 ? (
          <div className="space-y-3 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            {filteredConversations.map((conv) => (
              <Link
                key={conv.conversationId}
                href={`/chat/${conv.conversationId}?name=${conv.otherUserName}`}
                className="glass-dark rounded-xl p-4 hover:border-primary-500/50 transition-all flex items-center justify-between group"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-white group-hover:text-primary-400 transition-all">
                    {conv.otherUserName}
                  </h3>
                  <p className="text-sm text-dark-400 truncate">{conv.lastMessage}</p>
                  <p className="text-xs text-dark-500 mt-1">
                    {new Date(conv.lastMessageTime).toLocaleString()}
                  </p>
                </div>
                {conv.unread > 0 && (
                  <div className="ml-4 px-3 py-1 bg-primary-500 text-white text-sm font-bold rounded-full">
                    {conv.unread}
                  </div>
                )}
                <MessageCircle size={20} className="ml-4 text-primary-400 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-dark rounded-xl p-12 text-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <MessageCircle size={48} className="mx-auto mb-4 text-dark-500" />
            <h3 className="text-xl font-bold text-white mb-2">No conversations yet</h3>
            <p className="text-dark-400 mb-6">
              {searchTerm ? 'No conversations match your search' : 'Start a conversation by connecting with someone'}
            </p>
            <Link
              href="/network"
              className="inline-block px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-bold rounded-lg transition-all"
            >
              Go to Network
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
