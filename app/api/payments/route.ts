import { NextRequest, NextResponse } from 'next/server';
import { getPayments, savePayments } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const escrowId = request.nextUrl.searchParams.get('escrowId');
    const companyId = request.nextUrl.searchParams.get('companyId');
    const candidateId = request.nextUrl.searchParams.get('candidateId');
    
    const payments = getPayments();

    if (escrowId) {
      return NextResponse.json(
        payments.filter((p: any) => p.escrowId === escrowId)
      );
    }

    if (companyId) {
      return NextResponse.json(
        payments.filter((p: any) => p.companyId === companyId)
      );
    }

    if (candidateId) {
      return NextResponse.json(
        payments.filter((p: any) => p.candidateId === candidateId)
      );
    }

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      escrowId,
      companyId,
      candidateId,
      amount,
      currency,
      candidateWalletAddress,
      transactionHash,
      status = 'pending',
    } = body;

    if (!escrowId || !companyId || !candidateId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const payments = getPayments();

    const newPayment = {
      id: `payment_${Date.now()}`,
      escrowId,
      companyId,
      candidateId,
      amount,
      currency: currency || 'TON',
      candidateWalletAddress: candidateWalletAddress || null,
      transactionHash: transactionHash || null,
      status, // pending, wallet_requested, wallet_received, completed, failed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    payments.push(newPayment);
    savePayments(payments);

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, candidateWalletAddress, transactionHash } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing payment id' }, { status: 400 });
    }

    const payments = getPayments() as any[];
    const index = payments.findIndex((p: any) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const payment = payments[index] as any;
    if (status) payment.status = status;
    if (candidateWalletAddress) payment.candidateWalletAddress = candidateWalletAddress;
    if (transactionHash) payment.transactionHash = transactionHash;

    payment.updatedAt = new Date().toISOString();

    savePayments(payments);
    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}
