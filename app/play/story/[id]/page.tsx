'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import KidsZoneWrapper from '@/components/kids-zone-wrapper';
import { KidButton } from '@/components/kid-button';
import { playSound } from '@/lib/utils/sound-helper';
import { useSpeech } from '@/hooks/use-speech';
import { ALL_STORIES, Story } from '@/lib/constants/stories';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { saveProgress } from '@/lib/actions/save-progress';
import { queueProgress } from '@/lib/utils/offline-queue';

export default function StoryReader({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const storyId = resolvedParams.id;
    const { speak, stop } = useSpeech();

    const [story, setStory] = useState<Story | null>(null);
    const [pageIndex, setPageIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const found = ALL_STORIES.find(s => s.id === storyId);
        if (found) {
            setStory(found);
            playSound('swoosh');
        } else {
            router.push('/play');
        }
    }, [storyId, router]);

    const handleReadText = () => {
        if (!story) return;
        playSound('click');
        speak(story.pages[pageIndex].text);
    };

    const handleNext = () => {
        if (!story) return;
        playSound('click');
        stop();

        if (pageIndex < story.pages.length - 1) {
            setPageIndex(prev => prev + 1);
        } else {
            handleFinish();
        }
    };

    const handlePrev = () => {
        playSound('click');
        stop();
        if (pageIndex > 0) {
            setPageIndex(prev => prev - 1);
        }
    };

    const handleFinish = async () => {
        if (!story) return;
        setIsFinished(true);
        playSound('celebration');

        // Confeti de fin de cuento
        confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.6 },
            colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C']
        });

        // Guardar progreso: Cuento completado
        const storedKidId = sessionStorage.getItem('kidId');
        const progressData = {
            lessonType: 'story' as const,
            lessonId: story.id,
            score: 100,
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

    if (!story) return null;

    const currentPage = story.pages[pageIndex];

    return (
        <KidsZoneWrapper>
            <div className="min-h-screen bg-bg-kids flex flex-col items-center p-4 md:p-8">
                {/* Header Navbar */}
                <div className="w-full max-w-4xl flex justify-between items-center mb-6 bg-white/80 p-4 rounded-3xl z-10 shadow-sm">
                    <button
                        onClick={() => router.push('/play')}
                        className="font-kids text-2xl md:text-3xl text-dark bg-white px-5 py-2 rounded-2xl shadow-[0_4px_0_0_#cbd5e1] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all"
                    >
                        ⬅️ Salir
                    </button>
                    <div className="font-kids text-2xl md:text-3xl text-primary bg-white px-5 py-2 rounded-2xl text-center truncate px-4">
                        {story.title}
                    </div>
                    <div className="font-kids text-xl md:text-2xl text-gray-500 bg-gray-100 px-4 py-2 rounded-2xl">
                        {pageIndex + 1} / {story.pages.length}
                    </div>
                </div>

                {/* Libro interactivo */}
                <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center relative w-full perspective-1000">
                    {!isFinished ? (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`page-${pageIndex}`}
                                initial={{ opacity: 0, x: 50, rotateY: 10 }}
                                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                                exit={{ opacity: 0, x: -50, rotateY: -10 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white w-full max-w-3xl rounded-[3rem] p-8 md:p-12 shadow-2xl border-8 border-gray-100 flex flex-col items-center text-center gap-8 relative overflow-hidden"
                            >
                                {/* Imagen Grande */}
                                <div className="text-[10rem] md:text-[14rem] leading-none select-none">
                                    {currentPage.imageIcon}
                                </div>

                                {/* Texto del cuento */}
                                <h2 className="font-parent text-3xl md:text-5xl font-bold text-dark leading-snug">
                                    {currentPage.text}
                                </h2>

                                {/* Botón Narrar FLOTANTE */}
                                <button
                                    onClick={handleReadText}
                                    className="absolute top-6 right-6 w-16 h-16 md:w-20 md:h-20 bg-secondary rounded-full flex items-center justify-center text-3xl md:text-4xl shadow-[0_6px_0_0_#9d4edd] active:translate-y-1 active:shadow-none transition-all"
                                    title="Leer en voz alta"
                                >
                                    🔊
                                </button>
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] p-12 text-center shadow-2xl border-8 border-success flex flex-col items-center gap-8"
                        >
                            <h1 className="font-kids text-5xl md:text-7xl text-success">¡Fin del Cuento!</h1>
                            <div className="text-[8rem]">📖✨</div>
                            <KidButton
                                icon="🏠"
                                label="Volver al Mapa"
                                onClick={() => router.push('/play')}
                                variant="primary"
                            />
                        </motion.div>
                    )}

                    {/* Controles de Navegación Abajo */}
                    {!isFinished && (
                        <div className="flex w-full max-w-3xl justify-between mt-8 z-20">
                            <button
                                onClick={handlePrev}
                                disabled={pageIndex === 0}
                                className={`font-kids text-3xl px-8 py-4 rounded-3xl transition-all shadow-[0_6px_0_0_rgba(0,0,0,0.1)] flex items-center gap-2 ${pageIndex === 0 ? 'bg-gray-200 text-gray-400 opacity-50 cursor-not-allowed shadow-none' : 'bg-white text-dark hover:-translate-y-1 active:translate-y-1 active:shadow-none'}`}
                            >
                                ⬅️ Atrás
                            </button>

                            <button
                                onClick={handleNext}
                                className="font-kids text-3xl px-8 py-4 rounded-3xl bg-primary text-white transition-all shadow-[0_6px_0_0_#D97706] hover:-translate-y-1 active:translate-y-1 active:shadow-none flex items-center gap-2"
                            >
                                {pageIndex === story.pages.length - 1 ? 'Terminar 🏁' : 'Siguiente ➡️'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </KidsZoneWrapper>
    );
}
