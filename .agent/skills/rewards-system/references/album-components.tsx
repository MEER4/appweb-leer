'use client';

import { motion } from 'framer-motion';

/** Silueta gris con "?" para recompensas no desbloqueadas */
export function LockedReward({ name }: { name: string }) {
    return (
        <div className="w-24 h-24 rounded-2xl bg-gray-200 flex items-center justify-center">
            <span className="text-4xl text-gray-400">?</span>
        </div>
    );
}

/** Recompensa desbloqueada con animación hover/tap */
export function UnlockedReward({
    reward,
    onClick,
}: {
    reward: { reward_type: string; reward_name: string; unlocked_at: string };
    onClick?: () => void;
}) {
    const emoji =
        reward.reward_type === 'badge'
            ? '🏅'
            : reward.reward_type === 'sticker'
                ? '⭐'
                : '🤖';

    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-success
                 flex items-center justify-center shadow-lg cursor-pointer"
        >
            <span className="text-4xl">{emoji}</span>
        </motion.div>
    );
}
