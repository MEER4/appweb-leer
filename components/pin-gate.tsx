'use client';

import { useState, useEffect } from 'react';

/**
 * Wrapper de seguridad para las vistas `/parent/*`
 */
export function PinGate({ children }: { children: React.ReactNode }) {
    const [verified, setVerified] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Verificar si el PIN ya fue autenticado en esta sesión
        const stored = sessionStorage.getItem('pin_verified');
        if (stored === 'true') {
            setVerified(true);
        }
    }, []);

    if (!isClient) return null; // Prevenir hidratación mismatch

    if (!verified) {
        // En un entorno real llamaremos a un Server Action para verificar el PIN del Supabase Parent Auth
        return <PinModal onSuccess={() => {
            sessionStorage.setItem('pin_verified', 'true');
            setVerified(true);
        }} />;
    }

    return <>{children}</>;
}

function PinModal({ onSuccess }: { onSuccess: () => void }) {
    const [pin, setPin] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica simplificada: Aceptamos 1234 como prueba
        if (pin === '1234') {
            onSuccess();
        } else {
            alert('PIN incorrecto. (Usa 1234 para probar)');
            setPin('');
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl">
                <h2 className="text-2xl font-parent font-bold text-center text-dark mb-2">
                    Acceso Parental
                </h2>
                <p className="text-gray-500 text-center mb-6 font-parent text-sm">
                    Ingresa tu PIN de 4 dígitos para acceder al panel de control.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="password"
                        maxLength={4}
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} // Solo números
                        className="text-center text-4xl tracking-[1em] py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-0 transition-colors font-parent outline-none"
                        placeholder="••••"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={pin.length < 4}
                        className="bg-primary text-white font-parent font-bold rounded-xl py-4 mt-2 hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Desbloquear
                    </button>
                </form>
            </div>
        </div>
    );
}
