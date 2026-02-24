'use client';

import { useState } from 'react';
import { registerAction } from '@/lib/actions/auth-actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerSchema } from '@/lib/schemas/auth';

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Validación en Front-end con Zod
        const parsed = registerSchema.safeParse(data);
        if (!parsed.success) {
            setError(parsed.error.issues[0]?.message || 'Error de validación');
            setLoading(false);
            return;
        }

        const result = await registerAction(parsed.data);

        if (result.error) {
            setError(result.error);
        } else {
            router.push('/play');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-bg-kids flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-20 right-10 text-7xl opacity-30 select-none">🎨</div>
            <div className="absolute bottom-20 left-10 text-7xl opacity-30 select-none">🧩</div>

            <div className="bg-white rounded-3xl p-8 md:p-12 max-w-lg w-full shadow-2xl relative z-10 border-4 border-white/50">
                <h1 className="font-kids text-5xl text-success text-center mb-2">Nueva Cuenta</h1>
                <p className="font-parent text-center text-gray-500 mb-8 font-bold">Crea un perfil para gestionar a tus pequeños</p>

                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 font-parent font-bold text-center border-2 border-red-200 shadow-inner">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-parent">
                    <div>
                        <label className="block text-dark font-bold mb-1 text-md">Email</label>
                        <input type="email" name="email" required placeholder="tucorreo@ejemplo.com" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-success focus:ring-4 focus:ring-success/20 outline-none transition-all" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-dark font-bold mb-1 text-md">Contraseña</label>
                            <input type="password" name="password" required minLength={6} placeholder="Mínimo 6" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-success focus:ring-4 focus:ring-success/20 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-dark font-bold mb-1 text-md">Confirmar</label>
                            <input type="password" name="confirmPassword" required minLength={6} placeholder="Repítela" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-success focus:ring-4 focus:ring-success/20 outline-none transition-all" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-end mb-1">
                            <label className="block text-dark font-bold text-md">PIN Parental</label>
                            <span className="text-xs text-gray-400 font-bold">4 dígitos numericos</span>
                        </div>
                        <input type="password" name="pin" required maxLength={4} pattern="\d{4}" className="w-full px-4 py-3 text-center text-xl tracking-[1em] rounded-xl border-2 border-gray-200 focus:border-success focus:ring-4 focus:ring-success/20 outline-none transition-all" placeholder="••••" />
                        <p className="text-xs text-gray-500 mt-2 text-center">Este PIN protegerá la configuración de la cuenta y las métricas de tus hijos.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 bg-success text-white font-bold text-2xl py-4 rounded-2xl shadow-[0_6px_0_0_#05b587] hover:-translate-y-1 hover:shadow-[0_8px_0_0_#05b587] active:translate-y-2 active:shadow-[0_0px_0_0_#05b587] transition-all disabled:opacity-60 disabled:pointer-events-none"
                    >
                        {loading ? 'Registrando...' : 'Crear Cuenta'}
                    </button>

                    <p className="text-center mt-6 text-gray-500 font-bold">
                        ¿Ya tienes cuenta? <Link href="/login" className="text-success hover:text-primary transition-colors underline decoration-2 underline-offset-4">Inicia Sesión</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
