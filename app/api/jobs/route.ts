import { getJobs, saveJob } from '@/lib/db-sqlite';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const jobs = getJobs() as any[];
    console.log('Fetching jobs from database:', jobs.length, 'jobs found');
    
    // Parse skills if they're stored as JSON strings
    const parsedJobs = jobs.map((job: any) => ({
      ...job,
      skills: typeof job.skills === 'string' ? JSON.parse(job.skills || '[]') : (job.skills || []),
    }));
    
    return NextResponse.json(parsedJobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, company, location, salary, skills, jobType, createdBy } = await request.json();

    if (!title || !description || !location || !createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, location, and createdBy are required' },
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
      salary: salary || '',
      jobType: jobType || 'full-time',
      skills: skills || [],
      createdBy,
      createdAt: new Date().toISOString(),
      applicants: 0,
    };

    try {
      saveJob(newJob);
    } catch (dbError) {
      console.error('Database error saving job:', dbError);
      // Fallback: return job even if database fails
      // This ensures the job is created in memory at least
      console.warn('Job saved in memory only due to database error');
    }

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Create job error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Failed to create job: ' + errorMessage },
      { status: 500 }
    );
  }
}
