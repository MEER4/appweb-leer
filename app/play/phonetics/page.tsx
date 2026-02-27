'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import KidsZoneWrapper from '@/components/kids-zone-wrapper';
import { DraggableLetter } from '@/components/draggable-letter';
import { LetterSlot } from '@/components/letter-slot';
import { playSound, speakText } from '@/lib/utils/sound-helper';
import { KidButton } from '@/components/kid-button';
import { ALL_PHONETICS_LEVELS } from '@/lib/constants/levels';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { saveProgress } from '@/lib/actions/save-progress';
import { queueProgress } from '@/lib/utils/offline-queue';

export function PhoneticsGame() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [levelIndex, setLevelIndex] = useState(0);

    const currentLevel = ALL_PHONETICS_LEVELS[levelIndex];

    const [filledLetter, setFilledLetter] = useState<string | null>(null);
    const [available, setAvailable] = useState<string[]>([]);
    const [isWon, setIsWon] = useState(false);

    // Estado para animar el temblor (shake) en caso de error
    const [shakeKey, setShakeKey] = useState(0);

    useEffect(() => {
        // Al montar, ver si hay un levelId en URL
        const lvlId = searchParams.get('lvl');
        if (lvlId) {
            const idx = ALL_PHONETICS_LEVELS.findIndex(l => l.id === lvlId);
            if (idx !== -1) {
                setLevelIndex(idx);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        // Al cargar nivel, desordenamos las opciones
        setAvailable([...currentLevel.options].sort(() => Math.random() - 0.5));
        setFilledLetter(null);
        setIsWon(false);
        playSound('click');
        // Pequeño retraso para decir la palabra que vamos a formar
        setTimeout(() => speakText(currentLevel.word), 600);
    }, [currentLevel]);

    const handleDrop = (letter: string) => {
        if (letter === currentLevel.correctLetter) {
            playSound('correct');
            setTimeout(() => speakText(letter), 400);

            setFilledLetter(letter);

            // Remover de opciones disponibles visualmente
            const newAvail = [...available];
            const idx = newAvail.indexOf(letter);
            if (idx > -1) newAvail.splice(idx, 1);
            setAvailable(newAvail);

            handleWin();
        } else {
            playSound('wrong');
            // Disparamos un re-render de la key para que la letra tiemble
            setShakeKey(prev => prev + 1);
        }
    };

    const handleWin = async () => {
        setIsWon(true);
        playSound('celebration');

        // Lanzar confeti espectacular
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C']
        });

        setTimeout(() => speakText(currentLevel.word), 1500);

        const storedKidId = sessionStorage.getItem('kidId');

        const progressData = {
            lessonType: 'phonetics' as const,
            lessonId: currentLevel.id,
            score: 100,
            ...(storedKidId && storedKidId !== 'null' && storedKidId !== 'unknown' ? { kidId: storedKidId } : {})
        };

        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            console.log('Juego offline: Encolando progreso...');
            queueProgress(progressData);
        } else {
            try {
                const res = await saveProgress(progressData);
                if (!res?.data?.success) {
                    console.error('Error guardando progreso:', res);
                    queueProgress(progressData); // Respaldo agresivo por si acaso falla temporalmente
                }
            } catch (err) {
                console.error('Error guardando progreso (Network):', err);
                queueProgress(progressData);
            }
        }
    };

    const nextLevel = () => {
        if (levelIndex < ALL_PHONETICS_LEVELS.length - 1) {
            setLevelIndex(levelIndex + 1);
        } else {
            // Terminó todos los niveles, volvemos al lobby temporalmente
            router.push('/play');
        }
    };

    const goBack = () => {
        playSound('click');
        router.push('/play');
    };

    if (!currentLevel) return null;

    return (
        <KidsZoneWrapper>
            <div className="min-h-screen bg-bg-kids flex flex-col p-6 items-center overflow-hidden">
                {/* Header Navbar simple */}
                <div className="w-full max-w-5xl flex flex-wrap justify-center sm:justify-between items-center gap-2 sm:gap-4 mb-4 sm:mb-8 bg-white/60 p-3 sm:p-4 rounded-3xl z-10">
                    <button
                        onClick={goBack}
                        className="font-kids text-xl sm:text-3xl text-dark bg-white px-4 sm:px-6 py-2 rounded-2xl shadow-[0_4px_0_0_#cbd5e1] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all"
                    >
                        ⬅️ Volver
                    </button>
                    <div className="font-kids text-xl sm:text-3xl text-primary bg-white px-4 sm:px-6 py-2 rounded-2xl text-center">
                        Nivel {levelIndex + 1}: {currentLevel.imageIcon} {currentLevel.word}
                    </div>
                </div>

                <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center gap-12 relative">

                    {/* Imagen objetivo */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="text-[6rem] sm:text-[10rem] md:text-[12rem] bg-white w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full flex items-center justify-center shadow-lg border-[6px] sm:border-8 border-primary relative z-10"
                    >
                        {currentLevel.imageIcon}
                    </motion.div>

                    {/* Slots para armar la palabra */}
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 p-4 sm:p-8 bg-white/40 rounded-[2rem] sm:rounded-[3rem] backdrop-blur-sm z-10 w-full">
                        {currentLevel.word.split('').map((char, index) => {
                            const isMissing = index === currentLevel.missingIndex;

                            if (isMissing) {
                                return (
                                    <motion.div
                                        key={`slot-missing-${index}-${shakeKey}`}
                                        animate={shakeKey > 0 ? { x: [-10, 10, -10, 10, 0] } : {}}
                                        transition={{ duration: 0.4 }}
                                        className="relative"
                                    >
                                        <LetterSlot
                                            expected={currentLevel.correctLetter}
                                            filled={filledLetter}
                                            isCorrect={filledLetter ? filledLetter === currentLevel.correctLetter : null}
                                        />
                                    </motion.div>
                                );
                            }

                            return (
                                <div key={`char-${index}`} className="flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-white rounded-2xl md:rounded-3xl shadow-sm border-2 sm:border-4 border-gray-100">
                                    <span className="font-kids text-3xl sm:text-5xl md:text-6xl text-dark uppercase">{char}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Letras disponibles para arrastrar */}
                    {!isWon && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex flex-wrap justify-center gap-4 mt-8 p-8 bg-white/80 rounded-[3rem] border-4 border-secondary/30 min-h-[160px] z-10"
                        >
                            {available.map((letter, idx) => (
                                <DraggableLetter
                                    key={`drag-${levelIndex}-${idx}-${letter}`}
                                    letter={letter}
                                    onDrop={(l) => {
                                        if (!filledLetter) handleDrop(l);
                                    }}
                                />
                            ))}
                        </motion.div>
                    )}

                    {/* Mensaje de Victoria */}
                    {isWon && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center">
                            {/* Overlay invisible para bloquear clics atrás */}
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-[3rem]"></div>

                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                className="bg-white p-12 rounded-[3rem] flex flex-col items-center text-center shadow-2xl border-8 border-success relative z-10"
                            >
                                <h1 className="font-kids text-6xl text-success mb-6">¡LO LOGRASTE! 🎉</h1>
                                <p className="font-parent text-3xl font-bold mb-8 text-dark">
                                    ¡Muy bien con la {currentLevel.correctLetter}!
                                </p>
                                <KidButton
                                    icon={levelIndex < ALL_PHONETICS_LEVELS.length - 1 ? "➡️" : "🏆"}
                                    label={levelIndex < ALL_PHONETICS_LEVELS.length - 1 ? "Siguiente Nivel" : "Terminar Nivel"}
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

import { Suspense } from 'react';

export default function PhoneticsGamePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-bg-kids flex items-center justify-center"><p className="font-kids text-4xl text-primary">Cargando juego...</p></div>}>
            <PhoneticsGame />
        </Suspense>
    );
}
