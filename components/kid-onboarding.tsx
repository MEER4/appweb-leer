'use client';

import { useState, useEffect } from 'react';
import { playSound } from '@/lib/utils/sound-helper';
import Confetti from 'react-confetti';

type KidOnboardingProps = {
    kidName: string;
    kidAvatar: string;
    onComplete: () => void;
};

export default function KidOnboarding({ kidName, kidAvatar, onComplete }: KidOnboardingProps) {
    const [step, setStep] = useState(0);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });

        // Sonido de bienvenida al montar
        playSound('correct');

        const resize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    const nextStep = () => {
        playSound('swoosh');
        if (step < 2) {
            setStep(step + 1);
            if (step + 1 === 2) {
                // Sonido especial para el último paso
                setTimeout(() => playSound('correct'), 300);
            }
        } else {
            playSound('click');
            onComplete();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-bg-kids flex flex-col items-center justify-center p-4">

            {step === 2 && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />}

            <div className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 shadow-2xl border-8 border-white text-center relative overflow-hidden min-h-[50vh] flex flex-col justify-center items-center">

                {/* Paso 0: Bienvenida */}
                {step === 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col items-center">
                        <div className="text-8xl md:text-[10rem] mb-6 animate-bounce">
                            {kidAvatar}
                        </div>
                        <h1 className="font-kids text-5xl md:text-7xl text-primary mb-4">
                            ¡Hola, {kidName}!
                        </h1>
                        <p className="text-2xl md:text-3xl text-gray-600 font-bold mb-8">
                            ¡Qué alegría que estés aquí!
                        </p>
                    </div>
                )}

                {/* Paso 1: Explicación del Mapa */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col items-center">
                        <div className="text-7xl md:text-8xl mb-6 bg-blue-100 rounded-full w-32 h-32 flex items-center justify-center border-4 border-white shadow-inner">
                            🗺️
                        </div>
                        <h2 className="font-kids text-4xl md:text-6xl text-secondary mb-4">
                            Este es tu Mapa Mágico
                        </h2>
                        <p className="text-2xl text-gray-600 font-bold max-w-2xl px-4">
                            Aquí encontrarás cuevas de memoria, letras secretas y divertidas pizarras mágicas para dibujar.
                        </p>
                    </div>
                )}

                {/* Paso 2: Motivación Estrellas */}
                {step === 2 && (
                    <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
                        <div className="flex gap-4 mb-6">
                            <span className="text-6xl md:text-8xl animate-pulse">⭐</span>
                            <span className="text-6xl md:text-8xl animate-pulse delay-75">🌟</span>
                            <span className="text-6xl md:text-8xl animate-pulse delay-150">⭐</span>
                        </div>
                        <h2 className="font-kids text-4xl md:text-6xl text-success mb-4">
                            ¡Gana premios geniales!
                        </h2>
                        <p className="text-2xl text-gray-600 font-bold max-w-2xl px-4">
                            Cada vez que juegues y aprendas algo nuevo, ganarás estrellas para desbloquear medallas y stickers increíbles.
                        </p>
                    </div>
                )}

            </div>

            {/* Controles Flotantes Inferiores */}
            <div className="mt-8 z-10 flex flex-col items-center gap-4">
                {/* Indicadores de progreso (Dot indicators) */}
                <div className="flex gap-3 mb-4">
                    <div className={`w-4 h-4 rounded-full transition-colors ${step === 0 ? 'bg-white' : 'bg-white/40'}`} />
                    <div className={`w-4 h-4 rounded-full transition-colors ${step === 1 ? 'bg-white' : 'bg-white/40'}`} />
                    <div className={`w-4 h-4 rounded-full transition-colors ${step === 2 ? 'bg-white' : 'bg-white/40'}`} />
                </div>

                <button
                    onClick={nextStep}
                    className="bg-white text-primary font-kids text-3xl md:text-5xl py-4 px-12 rounded-full shadow-[0_8px_0_0_#e2e8f0] hover:-translate-y-2 active:translate-y-2 active:shadow-none transition-all"
                >
                    {step < 2 ? '¡Siguiente! ➡️' : '¡A Jugar! 🚀'}
                </button>
            </div>
        </div>
    );
}
