import {
  Ubuntu,
  Ubuntu_Mono,
  Inter,
  Comic_Neue,
  Cormorant,
} from 'next/font/google';

export const ubuntu = Ubuntu({
  variable: '--font-ubuntu',
  subsets: ['latin'],
  weight: '400',
});

export const ubuntuMono = Ubuntu_Mono({
  variable: '--font-ubuntu',
  subsets: ['latin'],
  weight: '400',
});

export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: '400',
});

export const comic_neue = Comic_Neue({
  variable: '--font-comic-neue',
  subsets: ['latin'],
  weight: '400',
});

export const cormorant = Cormorant({
  variable: '--font-comic-neue',
  subsets: ['latin'],
  weight: '400',
  fallback: ['Times New Roman', 'Times', 'serif'],
});
