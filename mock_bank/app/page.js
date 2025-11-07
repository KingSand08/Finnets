'use server';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import { getSession } from '@/lib/auth/getSession';
import LogoutButton from '@/components/buttons/LogoutButton';
import ChatBotButton from '@/components/buttons/ChatbotButton';

export default async function Home() {
  const session = await getSession();

  return (
    <div>
      <main className={styles.main}>
        <h1>Welcome to BanksRntUs</h1>
        {!session && (
          <>
            <Link href='/login'>Login</Link>
          </>
        )}
        {session && (
          <>
            <LogoutButton />
            <ChatBotButton />
          </>
        )}
      </main>
    </div>
  );
}
