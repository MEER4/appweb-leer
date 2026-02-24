'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface RewardUnlocked {
    id: string;
    name: string;
    type: 'badge' | 'sticker' | 'character';
}

/**
 * Secuencia de animación al desbloquear una recompensa:
 * 1. Overlay oscuro con fade-in
 * 2. Cofre aparece con bounce (scale 0→1 + rotate -180→0)
 * 3. Nombre de la recompensa con fade-in
 * 4. Botón "¡Genial!" para cerrar
 */
export function RewardUnlockAnimation({
    rewardUnlocked,
    onDismiss,
}: {
    rewardUnlocked: RewardUnlocked | null;
    onDismiss: () => void;
}) {
    return (
        <AnimatePresence>
            {rewardUnlocked && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 10 }}
                        className="bg-white rounded-3xl p-8 text-center shadow-2xl"
                    >
                        <h2 className="font-kids text-4xl text-primary mb-4">
                            🎉 ¡Nueva Recompensa!
                        </h2>
                        {/* TODO: Reemplazar con imagen real del sticker/insignia */}
                        <div className="my-6 text-8xl">
                            {rewardUnlocked.type === 'badge' && '🏅'}
                            {rewardUnlocked.type === 'sticker' && '⭐'}
                            {rewardUnlocked.type === 'character' && '🤖'}
                        </div>
                        <p className="font-kids text-2xl text-dark mt-4">
                            {rewardUnlocked.name}
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onDismiss}
                            className="mt-8 min-w-touch min-h-touch rounded-2xl bg-success
                         text-dark font-kids text-3xl px-8 py-4 shadow-lg active:translate-y-1"
                        >
                            ¡Genial!
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
