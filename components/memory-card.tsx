'use client';

import { useState, useEffect } from 'react';

type MemoryCardProps = {
    content: string; // The text or emoji to show
    isText?: boolean; // If true, applies text styling, if false applies emoji styling
    isFlipped: boolean;
    isMatched: boolean;
    onClick: () => void;
};

export default function MemoryCard({ content, isText = false, isFlipped, isMatched, onClick }: MemoryCardProps) {
    const [isClientFlipped, setIsClientFlipped] = useState(isFlipped);

    // Smooth over the animation initial states
    useEffect(() => {
        setIsClientFlipped(isFlipped);
    }, [isFlipped]);

    return (
        <div
            className="relative w-24 h-32 md:w-32 md:h-40 perspective-1000"
            onClick={!isMatched && !isFlipped ? onClick : undefined}
            style={{ perspective: '1000px' }}
        >
            <div
                className={`w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${isClientFlipped || isMatched ? 'rotate-y-180' : ''}`}
                style={{ transformStyle: 'preserve-3d', transform: (isClientFlipped || isMatched) ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
                {/* Frente de la carta (Reverso oculto) */}
                <div
                    className={`absolute w-full h-full backface-hidden bg-primary border-4 border-white rounded-2xl shadow-sm flex items-center justify-center`}
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {/* Patrón Infantil Simple - Estrellas bg */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:16px_16px]"></div>
                    <span className="text-4xl md:text-5xl text-white font-kids drop-shadow-md pb-2">?</span>
                </div>

                {/* Reverso de la carta (El Contenido Real) */}
                <div
                    className={`absolute w-full h-full backface-hidden bg-white border-4 ${isMatched ? 'border-success' : 'border-secondary'} rounded-2xl shadow-sm flex items-center justify-center`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    <span className={`${isText ? 'text-5xl md:text-6xl font-kids text-dark pb-2' : 'text-6xl md:text-7xl drop-shadow-sm'} transition-all ${isMatched ? 'scale-110' : ''}`}>
                        {content}
                    </span>

                    {isMatched && (
                        <div className="absolute inset-0 border-4 border-success rounded-xl animate-ping opacity-20"></div>
                    )}
                </div>
            </div>
        </div>
    );
}
