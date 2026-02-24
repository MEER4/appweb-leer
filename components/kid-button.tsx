'use client';

import { motion } from 'framer-motion';

interface KidButtonProps {
    icon: string | React.ReactNode;
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'success';
}

export function KidButton({ icon, label, onClick, variant = 'primary' }: KidButtonProps) {
    const bgClass =
        variant === 'primary' ? 'bg-primary' :
            variant === 'secondary' ? 'bg-secondary text-white' :
                'bg-success';

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`min-w-touch min-h-touch px-8 py-4 rounded-[2rem] flex items-center justify-center gap-4 text-dark font-kids text-3xl md:text-5xl shadow-[0_6px_0_0_#cbd5e1] active:translate-y-2 active:shadow-none transition-all ${bgClass}`}
        >
            <span className="text-4xl md:text-6xl">{icon}</span>
            <span>{label}</span>
        </motion.button>
    );
}
