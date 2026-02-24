import { PinGate } from '@/components/pin-gate';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Dashboard Parental | Leer Jugando',
    description: 'Panel de estadísticas y configuración para padres.',
};

export default function ParentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F0F4F8] font-parent">
            {/* Nav superior minimalista */}
            <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Link href="/parent" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <span className="text-2xl">📊</span>
                            <h1 className="text-xl font-bold text-dark font-parent">
                                Área de Padres
                            </h1>
                        </Link>
                    </div>
                    <nav className="flex items-center gap-6">
                        <Link
                            href="/parent"
                            className="text-sm font-medium text-gray-500 hover:text-primary transition-colors cursor-pointer"
                        >
                            Estadísticas
                        </Link>
                        <Link
                            href="/parent/settings"
                            className="text-sm font-medium text-gray-500 hover:text-primary transition-colors cursor-pointer"
                        >
                            Configuración
                        </Link>
                        {/* Separator */}
                        <div className="hidden sm:block w-px h-6 bg-gray-200"></div>
                        <Link
                            href="/play"
                            className="hidden sm:flex text-sm font-bold bg-secondary text-white px-4 py-2 rounded-xl hover:scale-105 transition-all cursor-pointer items-center gap-2 shadow-sm"
                        >
                            <span>🎮</span>
                            Volver a Juegos
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Floating button for mobile only */}
            <div className="sm:hidden fixed bottom-6 right-6 z-50">
                <Link
                    href="/play"
                    className="flex text-sm font-bold bg-secondary text-white px-5 py-3 rounded-full shadow-lg active:scale-95 transition-all items-center gap-2"
                >
                    <span>🎮</span> Volver a Juegos
                </Link>
            </div>

            {/* Contenido Principal Protegido por PIN */}
            <PinGate>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
            </PinGate>
        </div>
    );
}
