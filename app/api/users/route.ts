import { getUsers } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = getUsers();
    // Return only necessary fields
    const publicUsers = users.map((u: any) => ({
      id: u.id,
      name: u.name,
      role: u.role,
      rating: u.rating,
      pointsBalance: u.pointsBalance,
    }));
    return NextResponse.json(publicUsers);
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
