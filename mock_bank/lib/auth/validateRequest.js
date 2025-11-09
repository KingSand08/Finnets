'use server';
import { jwtDecrypt } from '@/lib/auth/jwtCrypt';

/**
 * Validates a request by checking the session cookie
 * Returns the username if valid, null otherwise
 */
export async function validateRequest(request) {
  // Check session cookie
  const sessionCookie = request.cookies.get('session')?.value;
  if (sessionCookie) {
    try {
      const payload = await jwtDecrypt(sessionCookie);
      if (payload?.user?.username) {
        return payload.user.username;
      }
    } catch (error) {
      console.error('Error validating session cookie:', error);
    }
  }

  return null;
}

