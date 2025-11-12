'use server';
import { cookies } from 'next/headers';

/**
 * Try to get session from cookie (works in production with nginx)
 * Falls back to null if no cookie exists
 */
export async function getSessionFromCookie() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    if (!sessionCookie) {
      return null;
    }

    // The session cookie is a JWT that we could decode
    // But we'll just pass it along to mock_bank API which will validate it
    return sessionCookie;
  } catch (error) {
    console.error('Error reading session cookie:', error);
    return null;
  }
}

/**
 * Decode JWT to extract payload (without verification)
 * This is safe for reading non-sensitive info like username
 * The actual auth verification happens on mock_bank API
 */
export async function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

