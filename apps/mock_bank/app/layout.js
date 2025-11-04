import { Ubuntu, Ubuntu_Mono } from 'next/font/google';
import './globals.css';

const ubuntu = Ubuntu({
  variable: '--font-ubuntu',
  subsets: ['latin'],
  weight: '400',
});

const ubuntuMono = Ubuntu_Mono({
  variable: '--font-ubuntu',
  subsets: ['latin'],
  weight: '400',
});

export const metadata = {
  title: 'Mock Bank for Finnets Testing',
  description: 'NOT REAL BANK!',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${ubuntu.variable} ${ubuntuMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
