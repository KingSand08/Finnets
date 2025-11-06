'use server';
import executeQuery from '@/db/MySQLDriver'; //! UPDATE WITH PROPER LOGIN LATER
import { jwtEncrypt } from '@/lib/auth/jwtCrypt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load users from JSON file
function loadUsers() {
  try {
    // Path relative to the project root (where next.config.mjs is located)
    const filePath = join(process.cwd(), 'lib', 'auth', 'users.json');
    const fileContents = readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error loading users:', error);
    // Return empty array if file can't be loaded (will cause all logins to fail)
    return [];
  }
}

export default async function signIn(previousState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  
  if (!email || !password) {
    console.error('email/password not provided');
    return 'ERROR';
  }

  // Load users from JSON
  const users = loadUsers();
  
  // Find user by email or username matching the email input
  const user = users.find(
    (u) => (u.email === email || u.username === email) && u.password === password
  );

  if (!user) {
    console.error('Invalid credentials');
    return 'ERROR';
  }

  // Create user object for JWT (without password)
  const userData = {
    email: user.email,
    name: user.name,
    username: user.username,
  };

  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const session = await jwtEncrypt({ user: userData, expires });

  const cookieStore = await cookies();
  cookieStore.set('session', session, { expires, httpOnly: true, path: '/' });
  redirect('/');
  return '';
}
