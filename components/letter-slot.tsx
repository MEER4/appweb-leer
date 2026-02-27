'use client';

import { motion } from 'framer-motion';

interface LetterSlotProps {
    expected: string;
    filled: string | null;
    isCorrect: boolean | null;
}

export function LetterSlot({ expected, filled, isCorrect }: LetterSlotProps) {
    return (
        <motion.div
            animate={{
                backgroundColor: isCorrect === true ? '#06D6A0' // success
                    : isCorrect === false ? '#EF476F' // error
                        : '#E2E8F0', // default gray
                scale: isCorrect === true ? [1, 1.1, 1] : 1, // pulso de acierto
            }}
            transition={{ duration: 0.3 }}
            className={`w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-2xl md:rounded-3xl border-2 sm:border-4 ${filled ? 'border-solid' : 'border-dashed'}
                 border-secondary flex items-center justify-center font-kids text-3xl sm:text-5xl md:text-6xl text-dark shadow-inner`}
        >
            {filled || ''}
        </motion.div>
    );
}
