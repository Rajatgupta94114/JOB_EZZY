import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const RATINGS_FILE = path.join(DATA_DIR, 'ratings.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function initializeRatingsFile() {
  ensureDataDir();
  if (!fs.existsSync(RATINGS_FILE)) {
    fs.writeFileSync(RATINGS_FILE, JSON.stringify([], null, 2));
  }
}

function getRatings() {
  initializeRatingsFile();
  const data = fs.readFileSync(RATINGS_FILE, 'utf-8');
  return JSON.parse(data);
}

function saveRatings(ratings: any[]) {
  ensureDataDir();
  fs.writeFileSync(RATINGS_FILE, JSON.stringify(ratings, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const companyId = request.nextUrl.searchParams.get('companyId');
    const candidateId = request.nextUrl.searchParams.get('candidateId');
    
    const ratings = getRatings();

    if (companyId) {
      return NextResponse.json(
        ratings.filter((r: any) => r.companyId === companyId)
      );
    }

    if (candidateId) {
      return NextResponse.json(
        ratings.filter((r: any) => r.candidateId === candidateId)
      );
    }

    return NextResponse.json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json({ error: 'Failed to fetch ratings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyId,
      candidateId,
      escrowId,
      rating,
      comment,
    } = body;

    if (!companyId || !candidateId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Missing required fields or invalid rating' },
        { status: 400 }
      );
    }

    const ratings = getRatings();

    // Check if rating already exists
    const existingIndex = ratings.findIndex(
      (r: any) => r.companyId === companyId && r.candidateId === candidateId && r.escrowId === escrowId
    );

    if (existingIndex !== -1) {
      // Update existing rating
      ratings[existingIndex] = {
        ...ratings[existingIndex],
        rating,
        comment: comment || '',
        updatedAt: new Date().toISOString(),
      };
      saveRatings(ratings);
      return NextResponse.json(ratings[existingIndex]);
    }

    const newRating = {
      id: `rating_${Date.now()}`,
      companyId,
      candidateId,
      escrowId,
      rating,
      comment: comment || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    ratings.push(newRating);
    saveRatings(ratings);

    return NextResponse.json(newRating, { status: 201 });
  } catch (error) {
    console.error('Error creating rating:', error);
    return NextResponse.json({ error: 'Failed to create rating' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, rating, comment } = body;

    if (!id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Missing required fields or invalid rating' },
        { status: 400 }
      );
    }

    const ratings = getRatings();
    const index = ratings.findIndex((r: any) => r.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Rating not found' }, { status: 404 });
    }

    ratings[index].rating = rating;
    if (comment !== undefined) ratings[index].comment = comment;
    ratings[index].updatedAt = new Date().toISOString();

    saveRatings(ratings);
    return NextResponse.json(ratings[index]);
  } catch (error) {
    console.error('Error updating rating:', error);
    return NextResponse.json({ error: 'Failed to update rating' }, { status: 500 });
  }
}
