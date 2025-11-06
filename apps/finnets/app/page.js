import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Hola!</h1>
      <Link href='/chat'>Finnet Bot Chat</Link>
    </div>
  );
}
