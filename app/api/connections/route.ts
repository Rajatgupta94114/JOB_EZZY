import { getConnections, saveConnection } from '@/lib/db-sqlite';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const connections = getConnections();

    if (userId) {
      const userConnections = connections.filter(
        (c: any) => c.userId === userId || c.connectedUserId === userId
      );
      return NextResponse.json(userConnections);
    }

    return NextResponse.json(connections);
  } catch (error) {
    console.error('Get connections error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, connectedUserId } = await request.json();

    if (!userId || !connectedUserId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const connections = getConnections() as any[];

    // Check if connection already exists
    const existingConnection = connections.find(
      (c: any) =>
        (c.userId === userId && c.connectedUserId === connectedUserId) ||
        (c.userId === connectedUserId && c.connectedUserId === userId)
    );

    if (existingConnection) {
      return NextResponse.json(existingConnection);
    }

    const newConnection = {
      id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      connectedUserId,
      status: 'connected',
      createdAt: new Date().toISOString(),
    };

    saveConnection(newConnection);

    return NextResponse.json(newConnection);
  } catch (error) {
    console.error('Create connection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
