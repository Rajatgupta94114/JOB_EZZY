import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function initializeNotificationsFile() {
  ensureDataDir();
  if (!fs.existsSync(NOTIFICATIONS_FILE)) {
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify([], null, 2));
  }
}

function getNotifications() {
  initializeNotificationsFile();
  const data = fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8');
  return JSON.parse(data);
}

function saveNotifications(notifications: any[]) {
  ensureDataDir();
  fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const notifications = getNotifications();

    if (userId) {
      const userNotifications = notifications.filter(
        (n: any) => n.recipientId === userId
      );
      return NextResponse.json(userNotifications);
    }

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId, recipientId, type, title, message, escrowId, applicationId } = body;

    if (!senderId || !recipientId || !type || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const notifications = getNotifications();

    const newNotification = {
      id: `notif_${Date.now()}`,
      senderId,
      recipientId,
      type, // 'escrow_created', 'escrow_approved', etc.
      title,
      message,
      escrowId,
      applicationId,
      read: false,
      createdAt: new Date().toISOString(),
    };

    notifications.push(newNotification);
    saveNotifications(notifications);

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, read } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing notification id' }, { status: 400 });
    }

    const notifications = getNotifications();
    const index = notifications.findIndex((n: any) => n.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    if (read !== undefined) {
      notifications[index].read = read;
    }

    saveNotifications(notifications);
    return NextResponse.json(notifications[index]);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing notification id' }, { status: 400 });
    }

    const notifications = getNotifications();
    const filtered = notifications.filter((n: any) => n.id !== id);

    if (filtered.length === notifications.length) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    saveNotifications(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
