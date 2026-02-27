import type { Metadata, Viewport } from 'next';
import { Fredoka, Nunito } from 'next/font/google';
import './globals.css';
import { SoundProvider } from '@/contexts/sound-context';
import { MuteButton } from '@/components/mute-button';

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-kids',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-parent',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#FF6B6B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Leer Jugando — Aprende a leer de forma divertida',
  description:
    'Plataforma interactiva para enseñar a leer a niños de 3 a 6 años con juegos de fonética, cuentos narrados y recompensas.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Leer Jugando',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${fredoka.variable} ${nunito.variable} antialiased`}>
        <SoundProvider>
          {children}
          <MuteButton />
        </SoundProvider>
      </body>
    </html>
  );
}
