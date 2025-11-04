import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div>
      <main className={styles.main}>
        <h1>Welcome to BanksRntUs</h1>
        <Link href='/login'>Login</Link>
      </main>
    </div>
  );
}
