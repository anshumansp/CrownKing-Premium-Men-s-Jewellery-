import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;
  
  // Allow access to cart, wishlist, and checkout for everyone
  // No authentication checks for these paths

  // Check for protected routes that require authentication
  // This would be for other protected routes that still need auth
  
  // Use proper NextResponse next time to avoid warnings
  return NextResponse.next();
}

// Configure which paths should use this middleware
export const config = {
  // Skip static files and API routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 