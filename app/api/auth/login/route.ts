import { getUsers, saveUsers } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, walletAddress, role } = await request.json();

    if (!username || !role) {
      return NextResponse.json(
        { error: 'Username and role are required' },
        { status: 400 }
      );
    }

    const users = getUsers() as any[];
    
    // Check if user exists
    const existingUser = users.find((u: any) => u.username === username) as any;

    let user;
    if (existingUser) {
      // Update wallet if provided
      if (walletAddress) {
        existingUser.walletAddress = walletAddress;
        saveUsers(users);
      }
      user = existingUser;
    } else {
      // Create new user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newUser = {
        id: userId,
        name: username,
        username: username,
        role: role,
        walletAddress: walletAddress || null,
        rating: 0,
        pointsBalance: 0,
        kycStatus: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      users.push(newUser);
      saveUsers(users);
      user = newUser;
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
