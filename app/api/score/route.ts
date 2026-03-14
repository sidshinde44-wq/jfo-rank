import { NextResponse } from 'next/server';

export async function GET() {
  // Replace with your real DB logic
  const previousScore = 75;
  const refreshedScore = Math.floor(Math.random() * 100) + 1;

  return NextResponse.json({ previousScore, refreshedScore });
}