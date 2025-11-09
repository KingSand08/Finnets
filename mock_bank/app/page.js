'use server';
import Link from 'next/link';
import styles from './page.module.css';
import { getSession } from '@/lib/auth/getSession';
import LogoutButton from '@/components/buttons/LogoutButton';
import ChatBotButton from '@/components/buttons/ChatbotButton';

export default async function Home() {
  const session = await getSession();
  const chatbotUrl =
    process.env.NODE_ENV === 'production'
      ? '/finnets/'
      : 'http://localhost:3001';
  return (
    <>
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
          </>
        )}
      </main>
      {session && (
        <ChatBotButton
          btnSrcImg='/finnets/finnets.png'
          src={chatbotUrl}
          title='Finnets Chatbot'
        />
      )}
    </>
  );
}
