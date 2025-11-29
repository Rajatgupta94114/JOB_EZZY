import { getUsers, saveUser } from '@/lib/db-sqlite';
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

    try {
      const users = getUsers() as any[];
      
      // Check if user exists
      const existingUser = users.find((u: any) => u.username === username);

      let user;
      if (existingUser) {
        // Update wallet if provided
        if (walletAddress) {
          existingUser.walletAddress = walletAddress;
          saveUser(existingUser);
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
          sbtBalance: 0,
          kycStatus: 'pending',
          createdAt: new Date().toISOString(),
        };
        
        saveUser(newUser);
        user = newUser;
      }

      return NextResponse.json(user);
    } catch (dbError) {
      console.error('Database error during login:', dbError);
      // Fallback: create user without database (for testing)
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const fallbackUser = {
        id: userId,
        name: username,
        username: username,
        role: role,
        walletAddress: walletAddress || null,
        rating: 0,
        pointsBalance: 0,
        sbtBalance: 0,
        kycStatus: 'pending',
        createdAt: new Date().toISOString(),
      };
      return NextResponse.json(fallbackUser);
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
