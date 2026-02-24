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
            className={`min-w-touch min-h-touch px-6 py-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg font-kids text-2xl text-dark ${bgClass}`}
        >
            <span className="text-4xl">{icon}</span>
            <span>{label}</span>
        </motion.button>
    );
}
