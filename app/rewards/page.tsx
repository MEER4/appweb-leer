'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import KidsZoneWrapper from '@/components/kids-zone-wrapper';
import { UnlockedReward, LockedReward } from '@/components/album-components';
import { REWARDS_CATALOG } from '@/lib/constants/rewards-catalog';
import { playSound } from '@/lib/utils/sound-helper';
import { getUnlockedRewards } from '@/lib/actions/rewards-actions';

export default function RewardsAlbumPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [unlockedNames, setUnlockedNames] = useState<string[]>([]);

    useEffect(() => {
        setMounted(true);
        playSound('celebration'); // Fanfarria al entrar al álbum

        // Fetch actual rewards from database
        async function fetchRewards() {
            try {
                const rewards = await getUnlockedRewards();
                setUnlockedNames(rewards.map(r => r.reward_name));
            } catch (err) {
                console.error("Error fetching rewards:", err);
            }
        }
        fetchRewards();
    }, []);

    const goBack = () => {
        playSound('click');
        router.push('/play');
    };

    if (!mounted) return null;

    return (
        <KidsZoneWrapper>
            <div className="min-h-screen bg-bg-kids flex flex-col items-center p-6 relative">

                {/* Header Navbar */}
                <header className="w-full max-w-5xl flex justify-between items-center p-4 bg-white/60 backdrop-blur-md rounded-3xl mb-8 shadow-sm border-2 border-white z-20">
                    <button
                        onClick={goBack}
                        className="font-kids text-2xl md:text-3xl text-dark bg-white px-6 md:px-8 py-3 md:py-4 rounded-3xl shadow-[0_6px_0_0_#cbd5e1] active:translate-y-2 active:shadow-none transition-all"
                    >
                        ⬅️ Volver
                    </button>
                    <h1 className="font-kids text-3xl md:text-6xl text-secondary drop-shadow-sm text-center flex-1 ml-4 md:ml-0">Mi Álbum Mágico ⭐</h1>
                </header>

                {/* Album Grid */}
                <main className="flex-1 w-full max-w-5xl bg-white/40 backdrop-blur-md rounded-[3rem] border-8 border-white p-8 shadow-2xl overflow-y-auto">
                    <p className="font-parent text-center font-bold text-gray-500 text-2xl mb-12">
                        ¡Colecciona todas las estampitas jugando niveles!
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {REWARDS_CATALOG.map((reward) => {
                            const isUnlocked = unlockedNames.includes(reward.name);

                            return isUnlocked ? (
                                <UnlockedReward
                                    key={reward.id}
                                    reward={{
                                        reward_type: reward.type,
                                        reward_name: reward.name,
                                        unlocked_at: new Date().toISOString()
                                    }}
                                />
                            ) : (
                                <LockedReward
                                    key={reward.id}
                                />
                            );
                        })}
                    </div>
                </main>

            </div>
        </KidsZoneWrapper>
    );
}
