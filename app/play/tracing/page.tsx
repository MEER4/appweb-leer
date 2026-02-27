'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import KidsZoneWrapper from '@/components/kids-zone-wrapper';
import { playSound } from '@/lib/utils/sound-helper';
import { TRACING_LEVELS, TracingLevel } from '@/lib/constants/tracing-levels';
import TracingBoard, { TracingBoardRef } from '@/components/tracing-board';
import { saveProgress } from '@/lib/actions/save-progress';
import { getKids } from '@/lib/actions/dashboard-actions';
import Confetti from 'react-confetti';

const COLORS = [
    { id: 'red', hex: '#ef4444', class: 'bg-red-500' },
    { id: 'blue', hex: '#3b82f6', class: 'bg-blue-500' },
    { id: 'green', hex: '#22c55e', class: 'bg-green-500' },
    { id: 'yellow', hex: '#eab308', class: 'bg-yellow-500' },
    { id: 'purple', hex: '#a855f7', class: 'bg-purple-500' },
    { id: 'pink', hex: '#ec4899', class: 'bg-pink-500' },
    { id: 'black', hex: '#1f2937', class: 'bg-gray-800' }
];

function TracingGameContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const boardRef = useRef<TracingBoardRef>(null);

    const [level, setLevel] = useState<TracingLevel | null>(null);
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [isWon, setIsWon] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });

        const resize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    // Cargar el Nivel
    useEffect(() => {
        const lvlId = searchParams.get('lvl');
        const currentLevel = TRACING_LEVELS.find((l) => l.id === lvlId);

        if (!currentLevel) {
            router.push('/play');
            return;
        }

        setLevel(currentLevel);
        setIsWon(false);
    }, [searchParams, router]);

    const handleClear = () => {
        playSound('swoosh');
        boardRef.current?.clearBoard();
    };

    const handleWin = async () => {
        if (isWon) return; // Prevent double clicks

        setIsWon(true);
        playSound('correct');

        try {
            const activeKids = await getKids();
            if (activeKids.length > 0) {
                await saveProgress({
                    kidId: activeKids[0].id,
                    lessonId: level!.id,
                    lessonType: 'tracing',
                    score: 100,
                    stars: 3,
                    mistakes: 0
                });
            }
        } catch (e) {
            console.error('Error al guardar progreso de trazo', e);
        }
    };

    if (!level) return <div className="min-h-screen bg-bg-kids flex items-center justify-center text-white text-2xl font-kids">Cargando pizarra...</div>;

    return (
        <KidsZoneWrapper>
            <div className="min-h-screen bg-bg-kids flex flex-col items-center p-4 py-8 md:p-8 relative">
                {isWon && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300} />}

                {/* Header Superior */}
                <div className="w-full max-w-5xl flex justify-between items-center bg-white/40 p-3 rounded-full shadow-sm border border-white/50 mb-6 z-10">
                    <button
                        onClick={() => { playSound('click'); router.push('/play'); }}
                        className="bg-white text-primary px-6 py-2 rounded-full font-bold shadow-sm hover:scale-105 transition-transform"
                    >
                        ◀ Volver
                    </button>
                    <h1 className="font-kids text-2xl md:text-3xl text-dark hidden md:block">{level.name}</h1>
                    <button
                        onClick={handleClear}
                        className="bg-gray-100 text-gray-500 px-6 py-2 rounded-full font-bold shadow-sm hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                        🧹 Borrar
                    </button>
                </div>

                {/* Zona Principal de Trabajo */}
                <div className="flex-1 w-full max-w-5xl flex flex-col xl:flex-row gap-6 items-center justify-center opacity-100 transition-opacity">

                    {/* El Canvas (Pizarra) */}
                    <div className="flex-1 w-full relative">
                        <TracingBoard
                            ref={boardRef}
                            color={selectedColor.hex}
                            brushSize={30}
                            targetLetter={level.target}
                            guideColorClass={level.guideColor}
                        />
                    </div>

                    {/* Paleta de Colores (Menú lateral/inferior) */}
                    <div className="w-full xl:w-24 bg-white/60 p-4 rounded-3xl border-4 border-white shadow-sm flex xl:flex-col items-center justify-center gap-4 flex-wrap">
                        {COLORS.map(c => (
                            <button
                                key={c.id}
                                onClick={() => { playSound('click'); setSelectedColor(c); }}
                                className={`w-12 h-12 md:w-16 md:h-16 rounded-full shadow-inner border-4 transition-all ${selectedColor.id === c.id ? `border-white scale-110 shadow-md ${c.class}` : `border-transparent opacity-80 ${c.class}`}`}
                            />
                        ))}
                    </div>

                </div>

                {/* Botón Flotante Gigante para Validar */}
                {!isWon && (
                    <div className="mt-8 flex justify-center w-full z-10">
                        <button
                            onClick={handleWin}
                            className="bg-success text-white font-kids text-3xl md:text-5xl py-4 px-12 rounded-full shadow-[0_8px_0_0_#16a34a] hover:-translate-y-2 active:translate-y-2 active:shadow-none transition-all flex items-center gap-4"
                        >
                            🎉 ¡Lo Logré!
                        </button>
                    </div>
                )}

                {/* Modal de Victoria */}
                {isWon && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="bg-white p-8 rounded-[3rem] shadow-2xl flex flex-col items-center text-center animate-in zoom-in slide-in-from-bottom-8 mx-4">
                            <span className="text-8xl mb-4">🏆</span>
                            <h2 className="font-kids text-5xl text-primary mb-2">¡Qué obra de arte!</h2>
                            <p className="text-xl text-gray-500 font-bold mb-8">Tus trazos se ven increíbles.</p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => router.push('/play')}
                                    className="bg-gray-100 text-gray-600 font-bold py-4 px-8 rounded-full text-xl hover:bg-gray-200 transition-colors"
                                >
                                    Ir al Mapa
                                </button>
                                <button
                                    onClick={() => {
                                        handleClear();
                                        setIsWon(false);
                                    }}
                                    className="bg-secondary text-white font-bold py-4 px-8 rounded-full text-xl shadow-[0_6px_0_0_#d97706] active:translate-y-1 active:shadow-none hover:-translate-y-1 transition-all"
                                >
                                    Dibujar de Nuevo
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </KidsZoneWrapper>
    );
}

export default function TracingGamePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-bg-kids flex items-center justify-center font-kids text-3xl text-white">Cargando pinceles...</div>}>
            <TracingGameContent />
        </Suspense>
    );
}
