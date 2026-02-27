'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import KidsZoneWrapper from '@/components/kids-zone-wrapper';
import { playSound } from '@/lib/utils/sound-helper';
import { useSpeech } from '@/hooks/use-speech';
import { KidButton } from '@/components/kid-button';
import { ALL_MATH_LEVELS } from '@/lib/constants/math-levels';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { saveProgress } from '@/lib/actions/save-progress';
import { queueProgress } from '@/lib/utils/offline-queue';

function NumbersGame() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { speak } = useSpeech();
    const [levelIndex, setLevelIndex] = useState(0);

    const currentLevel = ALL_MATH_LEVELS[levelIndex];

    const [isWon, setIsWon] = useState(false);
    const [shakeKey, setShakeKey] = useState(0);
    const [mistakes, setMistakes] = useState(0);

    useEffect(() => {
        const lvlId = searchParams.get('lvl');
        if (lvlId) {
            const idx = ALL_MATH_LEVELS.findIndex(l => l.id === lvlId);
            if (idx !== -1) {
                setLevelIndex(idx);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        setIsWon(false);
        setMistakes(0);
        playSound('click');
        // Announce the number of items they need to count
        setTimeout(() => speak(`¿Cuántos hay?`), 600);
    }, [currentLevel, speak]);

    const handleGuess = (guessedNumber: number) => {
        if (isWon) return;

        if (guessedNumber === currentLevel.targetNumber) {
            playSound('correct');
            setTimeout(() => speak(guessedNumber.toString()), 400);
            handleWin();
        } else {
            playSound('wrong');
            setMistakes(prev => prev + 1);
            setShakeKey(prev => prev + 1);
        }
    };

    const handleWin = async () => {
        setIsWon(true);
        playSound('celebration');

        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C']
        });

        const storedKidId = sessionStorage.getItem('kidId');

        const progressData = {
            lessonType: 'math' as const,
            lessonId: currentLevel.id,
            score: Math.max(0, 100 - (mistakes * 20)),
            mistakes,
            ...(storedKidId && storedKidId !== 'null' && storedKidId !== 'unknown' ? { kidId: storedKidId } : {})
        };

        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            queueProgress(progressData);
        } else {
            try {
                const res = await saveProgress(progressData);
                if (!res?.data?.success) {
                    queueProgress(progressData);
                }
            } catch (err) {
                queueProgress(progressData);
            }
        }
    };

    const nextLevel = () => {
        if (levelIndex < ALL_MATH_LEVELS.length - 1) {
            setLevelIndex(levelIndex + 1);
        } else {
            router.push('/play');
        }
    };

    const goBack = () => {
        playSound('click');
        router.push('/play');
    };

    if (!currentLevel) return null;

    // Array of elements to render the exact targetNumber of items
    const itemsToCount = Array.from({ length: currentLevel.targetNumber }, (_, i) => i);

    return (
        <KidsZoneWrapper>
            <div className="min-h-screen bg-bg-kids flex flex-col p-6 items-center overflow-hidden">
                {/* Header Navbar */}
                <div className="w-full max-w-5xl flex flex-wrap justify-center sm:justify-between items-center gap-2 sm:gap-4 mb-4 sm:mb-8 bg-white/60 p-3 sm:p-4 rounded-3xl z-10">
                    <button
                        onClick={goBack}
                        className="font-kids text-xl sm:text-3xl text-dark bg-white px-4 sm:px-6 py-2 rounded-2xl shadow-[0_4px_0_0_#cbd5e1] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all"
                    >
                        ⬅️ Volver
                    </button>
                    <div className="font-kids text-xl sm:text-3xl text-primary bg-white px-4 sm:px-6 py-2 rounded-2xl text-center">
                        Nivel {levelIndex + 1}: Cuenta los objetos
                    </div>
                </div>

                <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center gap-8 sm:gap-12 relative">

                    {/* Contenedor de los objetos a contar */}
                    <motion.div
                        key={`items-${levelIndex}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 bg-white/40 p-8 sm:p-12 rounded-[3rem] backdrop-blur-sm shadow-inner min-h-[300px] w-full max-w-3xl"
                    >
                        <AnimatePresence>
                            {itemsToCount.map((idx) => (
                                <motion.div
                                    key={`item-${idx}`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", bounce: 0.6, delay: idx * 0.1 }}
                                    className="text-[4rem] sm:text-[6rem] md:text-[8rem] filter drop-shadow-lg"
                                >
                                    {currentLevel.itemEmoji}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Botones de opciones */}
                    {!isWon && (
                        <motion.div
                            key={`shake-${shakeKey}`}
                            animate={shakeKey > 0 ? { x: [-10, 10, -10, 10, 0] } : {}}
                            transition={{ duration: 0.4 }}
                            className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-4 z-10 w-full"
                        >
                            {currentLevel.options.map((num, idx) => (
                                <button
                                    key={`opt-${idx}`}
                                    onClick={() => handleGuess(num)}
                                    className="w-24 h-24 sm:w-32 sm:h-32 bg-white text-primary font-kids text-5xl sm:text-7xl rounded-[2rem] shadow-[0_8px_0_0_#cbd5e1] hover:-translate-y-2 active:translate-y-2 active:shadow-none transition-all border-4 border-secondary/20 flex items-center justify-center"
                                >
                                    {num}
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {/* Mensaje de Victoria */}
                    {isWon && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center">
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-[3rem]"></div>

                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                className="bg-white p-8 sm:p-12 rounded-[3rem] flex flex-col items-center text-center shadow-2xl border-8 border-success relative z-10"
                            >
                                <h1 className="font-kids text-5xl sm:text-6xl text-success mb-6">¡EXCELENTE! 🎉</h1>
                                <p className="font-parent text-2xl sm:text-3xl font-bold mb-8 text-dark">
                                    ¡Son {currentLevel.targetNumber} {currentLevel.itemEmoji}!
                                </p>
                                <KidButton
                                    icon={levelIndex < ALL_MATH_LEVELS.length - 1 ? "➡️" : "🏆"}
                                    label={levelIndex < ALL_MATH_LEVELS.length - 1 ? "Siguiente Nivel" : "Terminar Nivel"}
                                    onClick={nextLevel}
                                    variant="success"
                                />
                            </motion.div>
                        </div>
                    )}

                </div>
            </div>
        </KidsZoneWrapper>
    );
}

export default function NumbersGamePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-bg-kids flex items-center justify-center"><p className="font-kids text-4xl text-primary">Cargando juego...</p></div>}>
            <NumbersGame />
        </Suspense>
    );
}
