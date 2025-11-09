'use server';
import { NextResponse } from 'next/server';
import { jwtDecrypt, jwtEncrypt } from '@/lib/auth/jwtCrypt';

export async function updateSession(request) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  const parsed = await jwtDecrypt(session);
  parsed.expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: 'session',
    value: await jwtEncrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
    sameSite: 'none',
    secure: true, // Required for SameSite=None (browsers allow on localhost)
  });
  return res;
}
