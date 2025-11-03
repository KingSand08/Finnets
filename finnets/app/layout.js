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
  title: 'Finnets Applet',
  description: 'An AI bank helpbot here to help the user!',
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
