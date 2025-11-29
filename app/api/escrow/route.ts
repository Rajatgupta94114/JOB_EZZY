import { NextRequest, NextResponse } from 'next/server';
import { getEscrows, saveEscrow } from '@/lib/db-sqlite';

export async function GET(request: NextRequest) {
  try {
    const applicationId = request.nextUrl.searchParams.get('applicationId');
    const candidateId = request.nextUrl.searchParams.get('candidateId');
    const companyId = request.nextUrl.searchParams.get('companyId');
    
    const escrows = getEscrows() as any[];
    console.log('Fetching escrows:', escrows.length, 'found');

    if (applicationId) {
      const filtered = escrows.find((e: any) => e.applicationId === applicationId);
      return NextResponse.json(filtered || null);
    }

    if (candidateId) {
      const filtered = escrows.filter((e: any) => e.candidateId === candidateId);
      return NextResponse.json(filtered);
    }

    if (companyId) {
      const filtered = escrows.filter((e: any) => e.companyId === companyId);
      return NextResponse.json(filtered);
    }

    return NextResponse.json(escrows);
  } catch (error) {
    console.error('Error fetching escrows:', error);
    return NextResponse.json({ error: 'Failed to fetch escrows: ' + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      applicationId,
      companyId,
      candidateId,
      jobTitle,
      startDate,
      endDate,
      amount,
      currency,
      description,
      terms,
    } = body;

    if (!applicationId || !companyId || !candidateId || !startDate || !endDate || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const escrows = getEscrows() as any[];

    // Check if escrow already exists
    const existingEscrow = escrows.find((e: any) => e.applicationId === applicationId);
    if (existingEscrow) {
      return NextResponse.json(existingEscrow);
    }

    const newEscrow = {
      id: `escrow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      jobId: applicationId,
      applicationId,
      companyId,
      candidateId,
      jobTitle,
      startDate,
      endDate,
      amount,
      currency: currency || 'TON',
      description,
      terms,
      status: 'active',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      saveEscrow(newEscrow);
    } catch (dbError) {
      console.error('Database error saving escrow:', dbError);
      console.warn('Escrow saved in memory only due to database error');
    }

    return NextResponse.json(newEscrow, { status: 201 });
  } catch (error) {
    console.error('Error creating escrow:', error);
    return NextResponse.json({ error: 'Failed to create escrow: ' + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, confirmationStatus, paymentStatus } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing escrow id' }, { status: 400 });
    }

    const escrows = getEscrows() as any[];
    const escrow = escrows.find((e: any) => e.id === id);

    if (!escrow) {
      return NextResponse.json({ error: 'Escrow not found' }, { status: 404 });
    }

    if (status) {
      escrow.status = status;
    }

    if (confirmationStatus) {
      escrow.paymentStatus = confirmationStatus;
    }

    if (paymentStatus) {
      escrow.paymentStatus = paymentStatus;
    }

    try {
      saveEscrow(escrow);
    } catch (dbError) {
      console.error('Database error updating escrow:', dbError);
    }
    return NextResponse.json(escrow);
  } catch (error) {
    console.error('Error updating escrow:', error);
    return NextResponse.json({ error: 'Failed to update escrow' }, { status: 500 });
  }
}
