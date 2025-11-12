import { NextResponse } from 'next/server';
import { secureSite } from './lib/middleware/security';
const INTERNAL_SECRET = process.env.INTERNAL_SECRET;

const PUBLIC_PATHS = [
  /^\/_next\/.*/,
  /^\/api\/.*/,
  /^\/favicon\.ico$/,
  /^\/(.*)\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|map|json|txt|woff|woff2|ttf|eot)$/i,
];

export async function middleware(request) {
  if (process.env.NODE_ENV === 'production') {
    const secSite = await secureSite(request);
    return secSite ?? NextResponse.next();
  }
}

export const config = {
  matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
