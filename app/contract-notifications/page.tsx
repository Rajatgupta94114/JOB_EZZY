'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/lib/store';
import { ArrowLeft, Bell, FileText, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: string;
  senderId: string;
  recipientId: string;
  type: string;
  title: string;
  message: string;
  escrowId: string;
  applicationId: string;
  read: boolean;
  createdAt: string;
}

export default function ContractNotificationsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notificationId, read: true }),
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notificationId }),
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (!isAuthenticated || !user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
        {/* Back Button */}
        <Link href="/" className="mb-8 p-2 rounded-lg hover:bg-white/10 transition-all inline-block">
          <ArrowLeft size={24} className="text-primary-400" />
        </Link>

        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Bell size={32} className="text-primary-400" />
            <span className="gradient-text">Contract Notifications</span>
          </h1>
          <p className="text-dark-300">Manage your escrow contract notifications</p>
        </div>

        {/* Notifications List */}
        {!loading ? (
          notifications.length > 0 ? (
            <div className="space-y-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`glass-dark rounded-xl p-6 hover:border-primary-500/50 transition-all ${
                    !notif.read ? 'border-primary-500/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {notif.type === 'escrow_created' ? (
                          <Clock size={20} className="text-yellow-400" />
                        ) : (
                          <CheckCircle size={20} className="text-green-400" />
                        )}
                        <h3 className="text-xl font-bold text-white">{notif.title}</h3>
                        {!notif.read && (
                          <span className="px-2 py-1 bg-primary-500/20 text-primary-300 text-xs rounded-full font-bold">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-dark-300 mb-3">{notif.message}</p>
                      <p className="text-xs text-dark-500">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/escrow-view/${notif.escrowId}`)}
                      className="flex-1 py-2 px-4 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-all flex items-center justify-center gap-2 font-medium"
                    >
                      <FileText size={16} />
                      View Contract
                    </button>
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="flex-1 py-2 px-4 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all font-medium"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="py-2 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-dark rounded-xl p-12 text-center animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <Bell size={48} className="mx-auto mb-4 text-dark-500" />
              <h3 className="text-xl font-bold text-white mb-2">No notifications</h3>
              <p className="text-dark-400">You don't have any contract notifications yet</p>
            </div>
          )
        ) : (
          <div className="text-center text-dark-300">Loading notifications...</div>
        )}
      </div>
    </main>
  );
}
