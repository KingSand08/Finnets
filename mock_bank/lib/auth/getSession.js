'use server';
import { cookies } from 'next/headers';
import { jwtDecrypt } from '@/lib/auth/jwtCrypt';

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  return await jwtDecrypt(session);
}

export async function getToken(request) {
  // If we have a NextRequest (middleware)
  if (request?.cookies) {
    const session = request.cookies.get('session')?.value;
    if (!session) return null;
    return await jwtDecrypt(session);
  }

  // Otherwise, fall back to server cookies() (server actions, components)
  const cookieStore = cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  return await jwtDecrypt(session);
}
