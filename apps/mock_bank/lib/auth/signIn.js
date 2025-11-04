'use server';
import executeQuery from '@/db/MySQLDriver'; //! UPDATE WITH PROPER LOGIN LATER
import { jwtEncrypt } from '@/lib/auth/jwtCrypt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function signIn(previousState, formData) {
  const email = formData.get('email');
  const name = formData.get('name');
  if (!email || !name) {
    console.error('email/name not working');
    return 'ERROR';
  }

  const user = {
    email: email,
    name: name,
  };

  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const session = await jwtEncrypt({ user, expires });

  const cookieStore = await cookies();
  cookieStore.set('session', session, { expires, httpOnly: true, path: '/' });
  redirect('/');
  return '';
}
