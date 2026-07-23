import { NextResponse } from 'next/server';

export async function GET(request) {
  // Return an empty JSON object to prevent unhandled rejection errors
  // from plugins like Revolution Slider that try to fetch WordPress API endpoints
  return NextResponse.json({});
}

export async function POST(request) {
  return NextResponse.json({});
}
