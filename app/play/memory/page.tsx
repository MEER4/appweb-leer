'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import KidsZoneWrapper from '@/components/kids-zone-wrapper';
import { playSound } from '@/lib/utils/sound-helper';
import { MEMORY_LEVELS, MemoryLevel, MemoryItem } from '@/lib/constants/memory-levels';
import MemoryCard from '@/components/memory-card';
import { saveProgress } from '@/lib/actions/save-progress';
import { getKids } from '@/lib/actions/dashboard-actions';
import Confetti from 'react-confetti';

// Componente para mezclar arrays
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Tipo interno de carta
type GameCard = {
    uniqueId: string;
    originalId: string; // The match key "A", "E" etc
    content: string; // "A" or "🐝"
    isText: boolean;
};

function MemoryGameContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [level, setLevel] = useState<MemoryLevel | null>(null);

    const [cards, setCards] = useState<GameCard[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matchedOriginalIds, setMatchedOriginalIds] = useState<Set<string>>(new Set());

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
        const currentLevel = MEMORY_LEVELS.find((l) => l.id === lvlId);

        if (!currentLevel) {
            router.push('/play');
            return;
        }

        setLevel(currentLevel);
        initGame(currentLevel);
    }, [searchParams, router]);

    const initGame = (currentLevel: MemoryLevel) => {
        setIsWon(false);
        setFlippedIndices([]);
        setMatchedOriginalIds(new Set());

        // Tomar items basados en el gridSize
        const itemsToUse = currentLevel.items.slice(0, currentLevel.gridSize);

        // Crear las cartas paradas (Texto vs Ícono)
        const gameCards: GameCard[] = [];
        itemsToUse.forEach((item, index) => {
            gameCards.push({ uniqueId: `${item.id}-text-${index}`, originalId: item.id, content: item.text, isText: true });
            gameCards.push({ uniqueId: `${item.id}-icon-${index}`, originalId: item.id, content: item.icon, isText: false });
        });

        setCards(shuffleArray(gameCards));
    };

    const handleCardClick = (index: number) => {
        if (isWon) return; // Si ya ganó, bloqueamos
        if (flippedIndices.length === 2) return; // Si hay 2 cartas no evaluadas bloqueamos
        if (flippedIndices.includes(index)) return; // Si toca la misma que ya está levantada bloqueamos

        const card = cards[index];
        if (matchedOriginalIds.has(card.originalId)) return; // Si ya encontró el match bloqueamos

        playSound('click');
        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        // Si es la segunda carta que levanta
        if (newFlipped.length === 2) {
            const firstCard = cards[newFlipped[0]];
            const secondCard = cards[newFlipped[1]];

            if (firstCard.originalId === secondCard.originalId) {
                // Hay Match
                setTimeout(() => {
                    playSound('correct');
                    setMatchedOriginalIds(prev => new Set(prev).add(firstCard.originalId));
                    setFlippedIndices([]);
                }, 500); // Pequeña pausa
            } else {
                // NO hay Match
                setTimeout(() => {
                    playSound('wrong');
                    setFlippedIndices([]);
                }, 1000); // 1 segundo visible para memorizar
            }
        }
    };

    // Evaluar Victoria
    useEffect(() => {
        if (!level || cards.length === 0) return;

        // Si la cantidad de IDs matcheados iguala a la cantidad de pares (gridSize)
        if (matchedOriginalIds.size === level.gridSize && !isWon) {
            handleWin();
        }
    }, [matchedOriginalIds, level, cards.length, isWon]);

    const handleWin = async () => {
        setIsWon(true);
        playSound('swoosh');

        try {
            const activeKids = await getKids();
            if (activeKids.length > 0) {
                await saveProgress({
                    kidId: activeKids[0].id,
                    lessonId: level!.id,
                    lessonType: 'memory',
                    score: 100,
                    stars: 3,
                    mistakes: 0 // Simplificado para memorama (podría llevar lógica de turnos después)
                });
            }
        } catch (e) {
            console.error('Error al guardar progreso del memorama', e);
        }
    };

    if (!level) return <div className="min-h-screen bg-bg-kids flex items-center justify-center text-white text-2xl font-kids">Cargando juego...</div>;

    const gridColsOptions = {
        4: 'grid-cols-2 md:grid-cols-4',
        6: 'grid-cols-3 md:grid-cols-4',
        8: 'grid-cols-4 md:grid-cols-4',
    };

    return (
        <KidsZoneWrapper>
            <div className="min-h-screen bg-bg-kids flex flex-col items-center p-4 py-8 md:p-8">
                {isWon && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300} />}

                {/* Header Superior Pequeño */}
                <div className="w-full max-w-4xl flex justify-between items-center bg-white/40 p-3 rounded-full shadow-sm border border-white/50 mb-8 z-10">
                    <button
                        onClick={() => { playSound('click'); router.push('/play'); }}
                        className="bg-white text-primary px-6 py-2 rounded-full font-bold shadow-sm hover:scale-105 transition-transform"
                    >
                        ◀ Volver
                    </button>
                    <div className="flex gap-4">
                        {/* Indicadores Visuales de Match */}
                        <div className="bg-white/80 px-4 py-2 rounded-full text-secondary font-bold shadow-sm">
                            {matchedOriginalIds.size} / {level.gridSize} Pares
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl opacity-100 transition-opacity">
                    <h1 className="font-kids text-4xl md:text-5xl text-white mb-4 bg-secondary/80 px-8 py-2 rounded-full shadow-lg border-4 border-white">
                        {level.name}
                    </h1>

                    <div className={`grid gap-4 md:gap-6 mt-8 p-6 md:p-8 bg-white/20 rounded-3xl border-4 border-white/50 shadow-inner ${gridColsOptions[level.gridSize as 4 | 6 | 8]}`}>
                        {cards.map((card, index) => {
                            const isFlipped = flippedIndices.includes(index);
                            const isMatched = matchedOriginalIds.has(card.originalId);

                            return (
                                <MemoryCard
                                    key={card.uniqueId}
                                    content={card.content}
                                    isText={card.isText}
                                    isFlipped={isFlipped}
                                    isMatched={isMatched}
                                    onClick={() => handleCardClick(index)}
                                />
                            );
                        })}
                    </div>
                </div>

                {isWon && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="bg-white p-8 rounded-[3rem] shadow-2xl flex flex-col items-center text-center animate-in zoom-in slide-in-from-bottom-8">
                            <span className="text-8xl mb-4">🏆</span>
                            <h2 className="font-kids text-5xl text-primary mb-2">¡Excelente Memoria!</h2>
                            <p className="text-xl text-gray-500 font-bold mb-8">Completaste las parejas de forma perfecta.</p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => router.push('/play')}
                                    className="bg-gray-100 text-gray-600 font-bold py-4 px-8 rounded-full text-xl hover:bg-gray-200 transition-colors"
                                >
                                    Ir al Mapa
                                </button>
                                <button
                                    onClick={() => initGame(level)}
                                    className="bg-secondary text-white font-bold py-4 px-8 rounded-full text-xl shadow-[0_6px_0_0_#d97706] active:translate-y-1 active:shadow-none hover:-translate-y-1 transition-all"
                                >
                                    Jugar de Nuevo
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </KidsZoneWrapper>
    );
}

export default function MemoryGamePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-bg-kids flex items-center justify-center font-kids text-3xl text-white">Cargando Memorama...</div>}>
            <MemoryGameContent />
        </Suspense>
    );
}
