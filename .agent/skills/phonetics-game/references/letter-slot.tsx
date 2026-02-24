'use client';

import { motion } from 'framer-motion';

export function LetterSlot({ expected, filled, isCorrect }: {
    expected: string;
    filled: string | null;
    isCorrect: boolean | null;
}) {
    return (
        <motion.div
            animate={{
                backgroundColor: isCorrect === true ? '#06D6A0' // success
                    : isCorrect === false ? '#EF476F' // error
                        : '#E2E8F0', // default gray
                scale: isCorrect === true ? [1, 1.1, 1] : 1, // pulso de acierto
            }}
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-4 border-dashed
                 border-secondary flex items-center justify-center font-kids text-3xl"
        >
            {filled || ''}
        </motion.div>
    );
}
