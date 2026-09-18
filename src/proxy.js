import { NextResponse } from 'next/server';

export function proxy(request) {
  const path = request.nextUrl.pathname;
  
  // Protect all /admin routes except /admin/login
  if (path.startsWith('/admin') && path !== '/admin/login') {
    // Check for the admin_token cookie
    const token = request.cookies.get('admin_token')?.value;
    
    // If there is no token or it's not our valid token, redirect to login
    if (!token || token !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // If user is already logged in, prevent them from accessing the login page
  if (path === '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;
    if (token === 'authenticated') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

// Specify the paths the middleware should run on to optimize performance
export const config = {
  matcher: ['/admin/:path*'],
};
