import { NextResponse } from 'next/server';
import { getToken } from './getSession';

export async function pageRedirections(request) {
  const session = await getToken(request);

  if (session) {
    if (request.nextUrl.pathname === '/login')
      return NextResponse.redirect(new URL('/', request.url));
  }
  return;
}
