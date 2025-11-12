import './globals.css';
import CookieWatchHandler from '@/components/handler/CookieWatchHandler';
import Taskbar from '@/components/Taskbar';
import { ubuntu, ubuntuMono, inter, comic_neue, cormorant } from '@/lib/Fonts';

export const metadata = {
  title: 'Finnets Applet',
  description: 'An AI bank helpbot here to help the user!',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${ubuntu.variable} ${ubuntuMono.variable} ${inter.variable} ${comic_neue.variable} ${cormorant.variable}`}
      >
        <CookieWatchHandler />
        <Taskbar />
        <div className='content'>{children}</div>
      </body>
    </html>
  );
}
