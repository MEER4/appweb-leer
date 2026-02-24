// app/layout.tsx — Root layout con fuentes Google
import type { Metadata } from 'next';
import { Fredoka, Nunito } from 'next/font/google';
import './globals.css';

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

export const metadata: Metadata = {
    title: 'Leer Jugando — Aprende a leer de forma divertida',
    description:
        'Plataforma interactiva para enseñar a leer a niños de 3 a 6 años con juegos de fonética, cuentos narrados y recompensas.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className={`${fredoka.variable} ${nunito.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
}
