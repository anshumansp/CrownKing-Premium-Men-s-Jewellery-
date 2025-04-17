import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Use proper NextResponse next time to avoid warnings
  return NextResponse.next();
}

// Configure which paths should use this middleware
export const config = {
  // Skip static files and API routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 