'use client';

import { motion } from 'framer-motion';

interface DraggableLetterProps {
    letter: string;
    onDrop?: (letter: string) => void;
}

export function DraggableLetter({ letter, onDrop }: DraggableLetterProps) {
    return (
        <motion.div
            drag
            dragSnapToOrigin        // Regresa a posición si no se suelta en zona válida
            dragElastic={0.5}
            whileDrag={{ scale: 1.2, zIndex: 50 }}
            whileTap={{ scale: 0.95 }}
            onDragEnd={(_, info) => {
                // Simplificación para MVP: Al soltar cerca o hacer click, se evalúa.
                // En un juego real con colisiones complejas se usa info.point
                if (onDrop) onDrop(letter);
            }}
            className="w-20 h-20 md:w-28 md:h-28 rounded-3xl bg-primary text-dark
                 font-kids text-5xl md:text-6xl flex items-center justify-center cursor-grab
                 shadow-[0_6px_0_0_#D97706] active:translate-y-1 hover:brightness-110 active:shadow-none transition-all"
        >
            {letter}
        </motion.div>
    );
}
