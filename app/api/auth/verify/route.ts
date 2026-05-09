import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Verify error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 200 }
    );
  }
}
