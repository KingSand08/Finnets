'use server';
import { authenticateUser } from '@/db/queries/authenticateUser';
import { jwtEncrypt } from '@/lib/auth/jwtCrypt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function signIn(previousState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');
  
  if (!username || !email || !password) {
    console.error('username/email/password not provided');
    return 'ERROR';
  }

  // Authenticate user from database - all three must match the same customer
  const user = await authenticateUser(username, email, password);

  if (!user) {
    console.error('Invalid credentials');
    return 'ERROR';
  }

  // Create user object for JWT (without password)
  // Combine first_name and last_name to match the previous "name" field
  const userData = {
    email: user.email,
    name: `${user.first_name} ${user.last_name}`,
    username: user.username,
  };

  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const session = await jwtEncrypt({ user: userData, expires });

  const cookieStore = await cookies();
  
  // Set cookie with proper settings for cross-origin iframe access
  // Note: SameSite=None requires Secure flag, but browsers allow it on localhost for dev
  const cookieOptions = {
    expires,
    httpOnly: true,
    path: '/',
    sameSite: 'none', // Allow cross-origin iframe access
    secure: true, // Required for SameSite=None (browsers allow on localhost)
  };
  
  cookieStore.set('session', session, cookieOptions);
  redirect('/');
  return '';
}
