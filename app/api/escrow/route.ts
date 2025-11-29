import { NextRequest, NextResponse } from 'next/server';
import { getEscrows, saveEscrows } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const applicationId = request.nextUrl.searchParams.get('applicationId');
    const escrows = getEscrows();

    if (applicationId) {
      return NextResponse.json(
        escrows.find((e: any) => e.applicationId === applicationId) || null
      );
    }

    return NextResponse.json(escrows);
  } catch (error) {
    console.error('Error fetching escrows:', error);
    return NextResponse.json({ error: 'Failed to fetch escrows' }, { status: 500 });
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

    const escrows = getEscrows();

    // Check if escrow already exists
    const existingEscrow = escrows.find((e: any) => e.applicationId === applicationId);
    if (existingEscrow) {
      return NextResponse.json(existingEscrow);
    }

    const newEscrow = {
      id: `escrow_${Date.now()}`,
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
      confirmationStatus: 'pending', // pending, confirmed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    escrows.push(newEscrow);
    saveEscrows(escrows);

    return NextResponse.json(newEscrow, { status: 201 });
  } catch (error) {
    console.error('Error creating escrow:', error);
    return NextResponse.json({ error: 'Failed to create escrow' }, { status: 500 });
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
    const index = escrows.findIndex((e: any) => e.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Escrow not found' }, { status: 404 });
    }

    const escrow = escrows[index] as any;
    if (status) {
      escrow.status = status;
    }

    if (confirmationStatus) {
      escrow.confirmationStatus = confirmationStatus;
    }

    if (paymentStatus) {
      escrow.paymentStatus = paymentStatus;
    }

    escrow.updatedAt = new Date().toISOString();

    saveEscrows(escrows);
    return NextResponse.json(escrow);
  } catch (error) {
    console.error('Error updating escrow:', error);
    return NextResponse.json({ error: 'Failed to update escrow' }, { status: 500 });
  }
}
