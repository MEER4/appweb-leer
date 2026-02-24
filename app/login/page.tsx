'use client';

import { useState } from 'react';
import { loginAction } from '@/lib/actions/auth-actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const result = await loginAction(formData);

        if (result.error) {
            setError(result.error);
        } else {
            router.push('/play');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-bg-kids flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 text-8xl opacity-30 select-none">📚</div>
            <div className="absolute -bottom-10 -right-10 text-8xl opacity-30 select-none">✨</div>

            <div className="bg-white rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl relative z-10 border-4 border-white/50">
                <h1 className="font-kids text-5xl text-primary text-center mb-2">¡Hola!</h1>
                <p className="font-parent text-center text-gray-500 mb-8 font-bold">Inicia sesión y empieza a jugar</p>

                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 font-parent font-bold text-center border-2 border-red-200 shadow-inner">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 font-parent">
                    <div>
                        <label className="block text-dark font-bold mb-2 text-lg">Email de Papá/Mamá</label>
                        <input type="email" name="email" required placeholder="tucorreo@ejemplo.com" className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-dark font-bold mb-2 text-lg">Contraseña</label>
                        <input type="password" name="password" required placeholder="••••••••" className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all" />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 bg-secondary text-white font-bold text-2xl py-4 rounded-2xl shadow-[0_6px_0_0_#d85573] hover:-translate-y-1 hover:shadow-[0_8px_0_0_#d85573] active:translate-y-2 active:shadow-[0_0px_0_0_#d85573] transition-all disabled:opacity-60 disabled:pointer-events-none"
                    >
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>

                    <p className="text-center mt-6 text-gray-500 font-bold">
                        ¿No tienes cuenta? <Link href="/register" className="text-primary hover:text-secondary transition-colors underline decoration-2 underline-offset-4">Regístrate</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
