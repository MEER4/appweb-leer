// tailwind.config.ts — Extensiones para Leer Jugando
import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#FFD166',    // Amarillo brillante — acciones, CTAs
                secondary: '#118AB2',  // Azul cielo — fondos, navegación
                success: '#06D6A0',    // Verde menta — acierto
                error: '#EF476F',      // Rosa coral — error, rebote
                dark: '#073B4C',       // Gris pizarra — texto principal
                'bg-kids': '#E8F8F5',  // Fondo suave zona infantil
            },
            fontFamily: {
                kids: ['var(--font-kids)', 'Fredoka One', 'Balsamiq Sans', 'cursive'],
                parent: ['var(--font-parent)', 'Nunito', 'Inter', 'sans-serif'],
            },
            borderRadius: {
                kid: '24px',
            },
            minWidth: {
                touch: '64px',
            },
            minHeight: {
                touch: '64px',
            },
            screens: {
                sm: '640px',
                md: '768px',    // Tablet portrait
                lg: '1024px',   // Tablet landscape / Desktop
                xl: '1280px',
            },
        },
    },
    plugins: [],
};

export default config;
