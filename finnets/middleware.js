import { NextResponse } from 'next/server';

const INTERNAL_SECRET = process.env.INTERNAL_SECRET;

const PUBLIC_PATHS = [
  /^\/_next\/.*/,
  /^\/api\/.*/,
  /^\/favicon\.ico$/,
  /^\/(.*)\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|map|json|txt|woff|woff2|ttf|eot)$/i,
];

export function middleware(request) {
  const url = request.nextUrl.pathname;
  const isPublicPath = PUBLIC_PATHS.some((regex) => regex.test(url));
  if (isPublicPath) {
    return NextResponse.next();
  }
  const secretHeader = request.headers.get('x-internal-secret');
  if (secretHeader !== INTERNAL_SECRET) {
    console.error(
      `ACCESS DENIED: Invalid or missing X-Internal-Secret for path: ${url}`
    );
    return new NextResponse('Jared Grace, leave this place', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
  return NextResponse.next();
}
export const config = {
  matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
