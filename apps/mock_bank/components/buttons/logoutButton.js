'use client';
import { logout } from '@/lib/auth/logout';

const LogoutButton = () => {
  return (
    <>
      <form action={logout}>
        <button type='submit'>Logout</button>
      </form>
    </>
  );
};

export default LogoutButton;
