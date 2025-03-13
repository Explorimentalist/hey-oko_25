import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
  // A simplified mock endpoint for TinaCMS local mode
  try {
    // Return a basic response that matches GraphQL structure
    return NextResponse.json({
      data: {
        // This is a placeholder; in local mode TinaCMS won't actually use this response
        _placeholder: true
      }
    });
  } catch (error) {
    console.error('TinaCMS API error:', error);
    return NextResponse.json(
      { errors: [{ message: 'Internal server error in TinaCMS handler' }] },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Health check endpoint
  return NextResponse.json({ status: 'ok', mode: 'local' });
} 