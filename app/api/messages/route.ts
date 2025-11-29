import { getMessages, saveMessage } from '@/lib/db-sqlite';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const conversationId = request.nextUrl.searchParams.get('conversationId');
    const messages = getMessages();

    if (conversationId) {
      const conversationMessages = messages.filter(
        (m: any) => m.conversationId === conversationId
      );
      return NextResponse.json(conversationMessages);
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { conversationId, senderId, receiverId, message } = await request.json();

    if (!conversationId || !senderId || !receiverId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      senderId,
      recipientId: receiverId,
      message,
      timestamp: new Date().toISOString(),
    };

    saveMessage(newMessage);

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { messageId } = await request.json();

    if (!messageId) {
      return NextResponse.json(
        { error: 'Missing message id' },
        { status: 400 }
      );
    }

    // Note: SQLite doesn't have a delete function in db-sqlite.ts
    // This would need to be implemented if needed
    return NextResponse.json({ error: 'Delete not implemented' }, { status: 501 });
  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
