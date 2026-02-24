'use client';

import { useRouter } from 'next/navigation';
import KidsZoneWrapper from '@/components/kids-zone-wrapper';
import { playSound } from '@/lib/utils/sound-helper';
import { useState, useEffect } from 'react';
import { ALL_PHONETICS_LEVELS } from '@/lib/constants/levels';
import { ALL_STORIES } from '@/lib/constants/stories';
import { getCompletedLevels } from '@/lib/actions/level-actions';

export default function PlayLobby() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [completedLevelIds, setCompletedLevelIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        setMounted(true);
        playSound('correct'); // Pequeño sonido al entrar al lobby

        async function fetchLevels() {
            try {
                const progress = await getCompletedLevels();
                const completedSet = new Set(progress.map((p: any) => p.lesson_id));
                setCompletedLevelIds(completedSet);
            } catch (e) {
                console.error("Error fetching levels:", e);
            }
        }
        fetchLevels();
    }, []);

    const goToLevel = (levelId: string, isLocked: boolean) => {
        if (isLocked) {
            playSound('wrong');
            return;
        }
        playSound('click');
        router.push(`/play/phonetics?lvl=${levelId}`);
    };

    const goToStory = (storyId: string) => {
        playSound('click');
        router.push(`/play/story/${storyId}`);
    };

    const goToRewards = () => {
        playSound('swoosh');
        router.push('/rewards');
    };

    const goToParent = () => {
        playSound('click');
        router.push('/parent');
    };

    if (!mounted) return null;

    return (
        <KidsZoneWrapper>
            <div className="min-h-screen bg-bg-kids flex flex-col items-center p-6 relative">
                <header className="w-full max-w-5xl flex justify-between items-center p-4 bg-white/50 backdrop-blur-md rounded-3xl mb-10 shadow-sm border-2 border-white z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={goToParent}
                            className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-gray-200 text-gray-400 hover:bg-gray-300 hover:text-gray-600 rounded-3xl transition-colors shadow-inner"
                            title="Área de Padres"
                        >
                            <span className="text-3xl md:text-4xl">⚙️</span>
                        </button>
                        <h1 className="font-kids text-4xl md:text-5xl text-primary drop-shadow-sm">Mapa de Aventuras</h1>
                    </div>
                    <button
                        onClick={goToRewards}
                        className="font-kids text-2xl md:text-3xl text-secondary bg-white px-6 py-4 rounded-3xl shadow-[0_6px_0_0_#e2e8f0] active:translate-y-2 active:shadow-none transition-all flex items-center gap-3"
                    >
                        <span className="text-3xl md:text-4xl">⭐</span> Mis Premios
                    </button>
                </header>

                <main className="flex-1 w-full max-w-5xl relative flex flex-col items-center gap-16">

                    {/* Sección: Cuentos Narrados */}
                    <div className="w-full flex w-full flex-col items-center z-10">
                        <h2 className="font-kids text-3xl md:text-4xl text-white mb-8 bg-secondary/90 px-8 py-3 rounded-full shadow-lg border-4 border-white">
                            📚 El Rincón de Cuentos
                        </h2>
                        <div className="flex flex-row flex-wrap justify-center items-center gap-8 w-full p-8 bg-white/40 rounded-[3rem]">
                            {ALL_STORIES.map((story) => {
                                const isCompleted = completedLevelIds.has(story.id);

                                return (
                                    <div
                                        key={story.id}
                                        onClick={() => goToStory(story.id)}
                                        className="relative flex flex-col items-center cursor-pointer group"
                                    >
                                        <div className="w-40 h-48 md:w-48 md:h-56 bg-white border-8 border-[#9d4edd] rounded-3xl flex items-center justify-center shadow-[0_8px_0_0_#7b2cbf] hover:-translate-y-2 hover:shadow-[0_12px_0_0_#7b2cbf] active:translate-y-2 active:shadow-none transition-all duration-300 relative overflow-hidden">
                                            <span className="text-6xl md:text-8xl">{story.coverIcon}</span>

                                            {isCompleted && (
                                                <div className="absolute top-2 right-2 bg-success text-white w-10 h-10 flex items-center justify-center rounded-full text-xl border-4 border-white shadow-sm">
                                                    ✅
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-kids text-2xl md:text-3xl mt-6 text-dark max-w-[12rem] text-center leading-tight">
                                            {story.title}
                                        </h3>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Separador Visual */}
                    <div className="w-full border-t-8 border-dashed border-white/40 my-8"></div>

                    {/* Sección: Mundos Fonética */}
                    <div className="flex flex-col gap-16 w-full relative z-10 pb-20">
                        {Object.entries(
                            ALL_PHONETICS_LEVELS.reduce((acc, level, index) => {
                                if (!acc[level.world]) acc[level.world] = [];
                                acc[level.world].push({ level, globalIndex: index });
                                return acc;
                            }, {} as Record<string, { level: typeof ALL_PHONETICS_LEVELS[0], globalIndex: number }[]>)
                        ).map(([worldName, levels]) => (
                            <div key={worldName} className="flex flex-col items-center w-full">
                                <h2 className="font-kids text-3xl md:text-4xl text-secondary mb-8 bg-white/80 px-8 py-3 rounded-full shadow-sm">
                                    {worldName}
                                </h2>
                                <div className="flex flex-row flex-wrap justify-center items-center gap-12 md:gap-16 relative w-full">
                                    {/* Path Line (Decorative) for this world */}
                                    <div className="absolute top-1/2 left-10 right-10 h-6 bg-white/60 rounded-full -translate-y-1/2 z-0 hidden lg:block" />

                                    {levels.map(({ level, globalIndex }) => {
                                        const isFirst = globalIndex === 0;
                                        const prevLevelId = globalIndex > 0 ? ALL_PHONETICS_LEVELS[globalIndex - 1].id : null;
                                        const isPrevCompleted = prevLevelId ? completedLevelIds.has(prevLevelId) : false;
                                        const isCompleted = completedLevelIds.has(level.id);

                                        const isUnlocked = isFirst || isPrevCompleted || isCompleted;

                                        return (
                                            <div
                                                key={level.id}
                                                onClick={() => goToLevel(level.id, !isUnlocked)}
                                                className={`relative flex flex-col items-center group ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                                            >
                                                {/* Bubble */}
                                                <div className={`
                                                    w-32 h-32 md:w-44 md:h-44 rounded-full flex items-center justify-center text-6xl md:text-8xl 
                                                    shadow-[0_8px_0_0_rgba(0,0,0,0.1)] transition-all duration-300 relative
                                                    ${isUnlocked
                                                        ? 'bg-white border-8 border-primary hover:-translate-y-2 hover:shadow-[0_12px_0_0_rgba(0,0,0,0.15)] active:translate-y-2 active:shadow-none'
                                                        : 'bg-gray-200 border-8 border-gray-300 grayscale'
                                                    }
                                                `}>
                                                    {level.imageIcon}

                                                    {/* Lock Icon */}
                                                    {!isUnlocked && (
                                                        <div className="absolute -bottom-4 bg-gray-400 text-white w-12 h-12 flex items-center justify-center rounded-full text-2xl border-4 border-white shadow-sm">
                                                            🔒
                                                        </div>
                                                    )}

                                                    {/* Checkmark Icon */}
                                                    {isCompleted && (
                                                        <div className="absolute -bottom-4 bg-success text-white w-12 h-12 flex items-center justify-center rounded-full text-2xl border-4 border-white shadow-sm">
                                                            ✅
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Label */}
                                                <h3 className={`font-kids text-2xl md:text-3xl mt-6 ${isUnlocked ? 'text-dark' : 'text-gray-400'}`}>
                                                    {level.word}
                                                </h3>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </KidsZoneWrapper>
    );
}
