'use client';

import { motion } from 'framer-motion';

export function DraggableLetter({ letter, onDrop }: { letter: string; onDrop: (letter: string) => void }) {
    return (
        <motion.div
            drag
            dragSnapToOrigin        // Regresa a posición si no se suelta en zona válida
            dragElastic={0.5}
            whileDrag={{ scale: 1.2, zIndex: 50 }}
            whileTap={{ scale: 0.95 }}
            // En producción onDragEnd debe calcular si cayó sobre un slot válido
            onDragEnd={(_, info) => {
                // Lógica simplificada: onDrop se llamaría si colisiona con el slot deseado
                // onDrop(letter); 
            }}
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary text-dark
                 font-kids text-3xl flex items-center justify-center cursor-grab
                 shadow-lg active:cursor-grabbing"
        >
            {letter}
        </motion.div>
    );
}
