'use client';

import { useRouter } from 'next/navigation';
import KidsZoneWrapper from '@/components/kids-zone-wrapper';
import { playSound } from '@/lib/utils/sound-helper';
import { useState, useEffect } from 'react';
import { ALL_PHONETICS_LEVELS } from '@/lib/constants/levels';
import { ALL_STORIES } from '@/lib/constants/stories';
import { MEMORY_LEVELS } from '@/lib/constants/memory-levels';
import { TRACING_LEVELS } from '@/lib/constants/tracing-levels';
import { getCompletedLevels } from '@/lib/actions/level-actions';
import { getKids } from '@/lib/actions/dashboard-actions';
import { Kid } from '@/types/database.types';
import KidOnboarding from '@/components/kid-onboarding';

export default function PlayLobby() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [completedLevelIds, setCompletedLevelIds] = useState<Set<string>>(new Set());
    const [activeKid, setActiveKid] = useState<Kid | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {
        setMounted(true);
        playSound('correct'); // Pequeño sonido al entrar al lobby

        async function fetchInitialData() {
            try {
                // Fetch progress
                const progressPromise = getCompletedLevels();
                // Fetch active kid (Para MVP asumimos el primer niño)
                const kidsPromise = getKids();

                const [progress, kids] = await Promise.all([progressPromise, kidsPromise]);

                const completedSet = new Set(progress.map((p: any) => p.lesson_id));
                setCompletedLevelIds(completedSet);

                if (kids.length > 0) {
                    setActiveKid(kids[0]);

                    // ONBOARDING VERIFICATION
                    const tutorialSeen = localStorage.getItem(`tutorial_seen_${kids[0].id}`);
                    if (!tutorialSeen) {
                        setShowTutorial(true);
                    }
                }
            } catch (e) {
                console.error("Error fetching data:", e);
            }
        }
        fetchInitialData();
    }, []);

    const finishTutorial = () => {
        if (activeKid) {
            localStorage.setItem(`tutorial_seen_${activeKid.id}`, 'true');
            setShowTutorial(false);
        }
    };

    const goToLevel = (levelId: string, isLocked: boolean) => {
        if (isLocked) {
            playSound('wrong');
            return;
        }
        playSound('click');
        router.push(`/play/phonetics?lvl=${levelId}`);
    };

    const goToMemory = (levelId: string, isLocked: boolean) => {
        if (isLocked) {
            playSound('wrong');
            return;
        }
        playSound('click');
        router.push(`/play/memory?lvl=${levelId}`);
    };

    const goToTracing = (levelId: string, isLocked: boolean) => {
        if (isLocked) {
            playSound('wrong');
            return;
        }
        playSound('click');
        router.push(`/play/tracing?lvl=${levelId}`);
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
            {/* Tutorial Cinemático de Bienvenida */}
            {showTutorial && activeKid && (
                <KidOnboarding
                    kidName={activeKid.name}
                    kidAvatar={activeKid.avatar_url || '👦'}
                    onComplete={finishTutorial}
                />
            )}

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

                        {/* Avatar Display */}
                        {activeKid && (
                            <div className="hidden sm:flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                                <span className="text-3xl md:text-4xl">{activeKid.avatar_url || '🧑'}</span>
                                <span className="font-kids text-2xl text-dark hidden md:inline-block">¡Hola {activeKid.name}!</span>
                            </div>
                        )}

                    </div>
                    <button
                        onClick={goToRewards}
                        className="font-kids text-2xl md:text-3xl text-secondary bg-white px-6 py-4 rounded-3xl shadow-[0_6px_0_0_#e2e8f0] hover:-translate-y-1 hover:shadow-[0_8px_0_0_#e2e8f0] active:translate-y-2 active:shadow-none transition-all flex items-center gap-3"
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
                    {/* Separador Visual para Memoria */}
                    <div className="w-full border-t-8 border-dashed border-white/40 my-8"></div>

                    {/* Sección: Minijuego Memorama */}
                    <div className="w-full flex w-full flex-col items-center z-10 pb-20">
                        <h2 className="font-kids text-3xl md:text-4xl text-white mb-8 bg-[#3b82f6]/90 px-8 py-3 rounded-full shadow-lg border-4 border-white">
                            🧩 Cueva de Concentración
                        </h2>

                        <div className="flex flex-row flex-wrap justify-center items-center gap-8 w-full p-8 bg-blue-100/50 rounded-[3rem]">
                            {MEMORY_LEVELS.map((level, index) => {
                                const isFirst = index === 0;
                                const prevLevelId = index > 0 ? MEMORY_LEVELS[index - 1].id : null;
                                const isPrevCompleted = prevLevelId ? completedLevelIds.has(prevLevelId) : false;
                                const isCompleted = completedLevelIds.has(level.id);

                                const isUnlocked = isFirst || isPrevCompleted || isCompleted;

                                return (
                                    <div
                                        key={level.id}
                                        onClick={() => goToMemory(level.id, !isUnlocked)}
                                        className={`relative flex flex-col items-center group bg-white/60 p-6 rounded-[2rem] border-4 border-white shadow-sm transition-all ${isUnlocked ? 'cursor-pointer hover:bg-white hover:-translate-y-2 hover:shadow-md active:translate-y-1' : 'opacity-70 grayscale cursor-not-allowed'}`}
                                    >
                                        <div className={`w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-2xl bg-gradient-to-br ${isUnlocked ? 'from-blue-400 to-indigo-500 shadow-inner text-white' : 'from-gray-300 to-gray-400 text-gray-500'} text-5xl md:text-6xl mb-4 relative`}>
                                            🧠

                                            {!isUnlocked && (
                                                <div className="absolute -bottom-2 -right-2 bg-gray-400 text-white w-10 h-10 flex items-center justify-center rounded-full text-xl border-4 border-white">
                                                    🔒
                                                </div>
                                            )}

                                            {isCompleted && (
                                                <div className="absolute -bottom-2 -right-2 bg-success text-white w-10 h-10 flex items-center justify-center rounded-full text-xl border-4 border-white z-10">
                                                    ✅
                                                </div>
                                            )}
                                        </div>

                                        <h3 className={`font-kids text-xl md:text-2xl text-center max-w-[10rem] ${isUnlocked ? 'text-dark' : 'text-gray-500'}`}>
                                            {level.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-bold mt-2 bg-white px-3 py-1 rounded-full">
                                            {level.gridSize} Pares
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Separador Visual para Trazos */}
                    <div className="w-full border-t-8 border-dashed border-white/40 my-8"></div>

                    {/* Sección: Minijuego de Trazos */}
                    <div className="w-full flex w-full flex-col items-center z-10 pb-20">
                        <h2 className="font-kids text-3xl md:text-4xl text-white mb-8 bg-green-500/90 px-8 py-3 rounded-full shadow-lg border-4 border-white">
                            🎨 Pizarra de Trazos
                        </h2>

                        <div className="flex flex-row flex-wrap justify-center items-center gap-8 w-full p-8 bg-green-100/50 rounded-[3rem]">
                            {TRACING_LEVELS.map((level, index) => {
                                const isFirst = index === 0;
                                const prevLevelId = index > 0 ? TRACING_LEVELS[index - 1].id : null;
                                const isPrevCompleted = prevLevelId ? completedLevelIds.has(prevLevelId) : false;
                                const isCompleted = completedLevelIds.has(level.id);

                                const isUnlocked = isFirst || isPrevCompleted || isCompleted;

                                return (
                                    <div
                                        key={level.id}
                                        onClick={() => goToTracing(level.id, !isUnlocked)}
                                        className={`relative flex flex-col items-center group bg-white/60 p-6 rounded-[2rem] border-4 border-white shadow-sm transition-all ${isUnlocked ? 'cursor-pointer hover:bg-white hover:-translate-y-2 hover:shadow-md active:translate-y-1' : 'opacity-70 grayscale cursor-not-allowed'}`}
                                    >
                                        <div className={`w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-2xl bg-gradient-to-br ${isUnlocked ? 'from-green-400 to-emerald-500 shadow-inner text-white' : 'from-gray-300 to-gray-400 text-gray-500'} text-5xl md:text-6xl mb-4 relative`}>
                                            🖍️

                                            {!isUnlocked && (
                                                <div className="absolute -bottom-2 -right-2 bg-gray-400 text-white w-10 h-10 flex items-center justify-center rounded-full text-xl border-4 border-white">
                                                    🔒
                                                </div>
                                            )}

                                            {isCompleted && (
                                                <div className="absolute -bottom-2 -right-2 bg-success text-white w-10 h-10 flex items-center justify-center rounded-full text-xl border-4 border-white z-10">
                                                    ✅
                                                </div>
                                            )}
                                        </div>

                                        <h3 className={`font-kids text-xl md:text-2xl text-center max-w-[10rem] ${isUnlocked ? 'text-dark' : 'text-gray-500'}`}>
                                            {level.name}
                                        </h3>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </main>
            </div>
        </KidsZoneWrapper>
    );
}
