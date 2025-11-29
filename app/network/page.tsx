'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/lib/store';
import { ArrowLeft, Users, MessageCircle, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface NetworkUser {
  id: string;
  name: string;
  role: string;
  rating: number;
  pointsBalance: number;
}

interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  status: string;
}

export default function NetworkPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [networkUsers, setNetworkUsers] = useState<NetworkUser[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const isConnected = (userId: string) => {
    return connections.some(
      c => (c.userId === user?.id && c.connectedUserId === userId) ||
           (c.userId === userId && c.connectedUserId === user?.id)
    );
  };

  const handleConnect = async (connectedUserId: string) => {
    try {
      const response = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          connectedUserId,
        }),
      });

      if (response.ok) {
        // Refresh connections
        fetchConnections();
        alert('Connected successfully!');
      }
    } catch (error) {
      console.error('Error connecting:', error);
      alert('Failed to connect');
    }
  };

  const fetchConnections = async () => {
    try {
      const response = await fetch(`/api/connections?userId=${user?.id}`);
      if (response.ok) {
        const conns = await response.json();
        setConnections(conns);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const handleMessage = (connectedUserId: string, connectedUserName: string) => {
    const conversationId = [user?.id, connectedUserId].sort().join('_');
    router.push(`/chat/${conversationId}?name=${connectedUserName}`);
  };

  useEffect(() => {
    // Fetch all users except current user and connections
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const users = await response.json();
          let filtered = users.filter((u: NetworkUser) => u.id !== user?.id);
          
          // Filter based on role
          if (user?.role === 'company') {
            // Company sees only candidates
            filtered = filtered.filter((u: NetworkUser) => u.role === 'candidate');
          } else if (user?.role === 'candidate') {
            // Candidate sees only companies
            filtered = filtered.filter((u: NetworkUser) => u.role === 'company');
          }
          
          setNetworkUsers(filtered);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (user) {
      fetchUsers();
      fetchConnections();
    }
  }, [user]);

  const filteredUsers = networkUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated || !user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8 pb-32 md:pb-8">
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center gap-4 animate-fadeInUp">
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={24} className="text-primary-400" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold gradient-text">Network</h1>
            <p className="text-dark-300 mt-2">Connect with other professionals on JOBEZZY</p>
          </div>
        </div>

        {/* Search */}
        <div className="glass-dark rounded-xl p-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or role..."
            className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
          />
        </div>

        {/* Users Grid */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            {filteredUsers.map((networkUser) => {
              const connected = isConnected(networkUser.id);
              return (
                <div key={networkUser.id} className="glass-dark rounded-xl p-6 hover:border-primary-500/50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-white">{networkUser.name}</h3>
                      <p className="text-sm text-dark-400 capitalize">{networkUser.role}</p>
                      {connected && (
                        <p className="text-xs text-green-400 font-bold mt-1">✓ Connected</p>
                      )}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold">
                      {networkUser.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-400">Rating:</span>
                      <span className="text-primary-400 font-bold">⭐ {networkUser.rating}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-400">Points:</span>
                      <span className="text-accent-400 font-bold">{networkUser.pointsBalance}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!connected ? (
                      <button
                        onClick={() => handleConnect(networkUser.id)}
                        className="flex-1 py-2 px-4 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-all flex items-center justify-center gap-2 font-medium"
                      >
                        <UserPlus size={16} />
                        Connect
                      </button>
                    ) : (
                      <div className="flex-1 py-2 px-4 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center gap-2 font-medium">
                        ✓ Connected
                      </div>
                    )}
                    <button
                      onClick={() => handleMessage(networkUser.id, networkUser.name)}
                      className="flex-1 py-2 px-4 bg-accent-500/20 hover:bg-accent-500/30 text-accent-400 rounded-lg transition-all flex items-center justify-center gap-2 font-medium"
                    >
                      <MessageCircle size={16} />
                      Message
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-dark rounded-xl p-12 text-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <Users size={48} className="mx-auto mb-4 text-dark-500" />
            <h3 className="text-xl font-bold text-white mb-2">No users found</h3>
            <p className="text-dark-400">
              {searchTerm ? 'Try adjusting your search criteria' : 'No other users available yet'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
