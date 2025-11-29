import { getJobs, saveJob } from '@/lib/db-sqlite';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const jobs = getJobs();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, company, location, salary, skills, jobType, createdBy } = await request.json();

    if (!title || !description || !location || !createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newJob = {
      id: jobId,
      title,
      description,
      company,
      location,
      salary: salary || null,
      jobType,
      skills: skills || [],
      createdBy,
      createdAt: new Date().toISOString(),
      applicants: 0,
    };

    saveJob(newJob);

    return NextResponse.json(newJob);
  } catch (error) {
    console.error('Create job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
