import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { id, password } = await request.json();
    
    // Check credentials against environment-configured admin account
    if (id === process.env.ADMIN_ID && password === process.env.ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true });
      
      // Set HTTP-only secure cookie
      response.cookies.set({
        name: 'admin_token',
        value: 'authenticated',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      
      return response;
    } else {
      return NextResponse.json(
        { error: 'Invalid ID or Password' }, 
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
