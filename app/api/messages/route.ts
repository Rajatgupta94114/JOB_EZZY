import { getMessages, saveMessages } from '@/lib/db';
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

    const messages = getMessages();

    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      senderId,
      receiverId,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    messages.push(newMessage);
    saveMessages(messages);

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

    const messages = getMessages();
    const filteredMessages = messages.filter((m: any) => m.id !== messageId);

    if (filteredMessages.length === messages.length) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    saveMessages(filteredMessages);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
