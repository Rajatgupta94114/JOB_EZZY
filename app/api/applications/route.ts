import { getApplications, saveApplications } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get('jobId');
    const candidateId = searchParams.get('candidateId');

    const applications = getApplications();

    if (jobId) {
      return NextResponse.json(applications.filter((a: any) => a.jobId === jobId));
    }

    if (candidateId) {
      return NextResponse.json(applications.filter((a: any) => a.candidateId === candidateId));
    }

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, candidateId, candidateName, resume, details, status = 'pending' } = body;

    if (!jobId || !candidateId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const applications = getApplications();
    const newApplication = {
      id: Date.now().toString(),
      jobId,
      candidateId,
      candidateName,
      resume,
      details,
      status,
      createdAt: new Date().toISOString(),
      escrowContractId: null,
    };

    applications.push(newApplication);
    saveApplications(applications);

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, escrowContractId, contractAccepted, contractAcceptedAt } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing application id' }, { status: 400 });
    }

    const applications = getApplications();
    const index = applications.findIndex((a: any) => a.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (status) applications[index].status = status;
    if (escrowContractId) applications[index].escrowContractId = escrowContractId;
    if (contractAccepted !== undefined) applications[index].contractAccepted = contractAccepted;
    if (contractAcceptedAt) applications[index].contractAcceptedAt = contractAcceptedAt;

    saveApplications(applications);
    return NextResponse.json(applications[index]);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
