export type MathLevel = {
    id: string;
    targetNumber: number;
    options: number[]; // Array containing the correct answer and 2 wrong options
    itemEmoji: string;
    world: string;
};

// Catálogo Centralizado de Niveles - Minijuego de Números
export const ALL_MATH_LEVELS: MathLevel[] = [
    // --- MUNDO 1: Primeros Pasos (1 al 5) ---
    {
        id: 'math_1',
        targetNumber: 1,
        options: [2, 1, 3],
        itemEmoji: '☀️',
        world: 'Primeros Pasos'
    },
    {
        id: 'math_2',
        targetNumber: 2,
        options: [2, 4, 1],
        itemEmoji: '🍒',
        world: 'Primeros Pasos'
    },
    {
        id: 'math_3',
        targetNumber: 3,
        options: [5, 2, 3],
        itemEmoji: '🎈',
        world: 'Primeros Pasos'
    },
    {
        id: 'math_4',
        targetNumber: 4,
        options: [4, 6, 3],
        itemEmoji: '🚗',
        world: 'Primeros Pasos'
    },
    {
        id: 'math_5',
        targetNumber: 5,
        options: [2, 5, 7],
        itemEmoji: '⭐',
        world: 'Primeros Pasos'
    },

    // --- MUNDO 2: Contando con los dedos (6 al 10) ---
    {
        id: 'math_6',
        targetNumber: 6,
        options: [8, 5, 6],
        itemEmoji: '🍎',
        world: 'Contando Más'
    },
    {
        id: 'math_7',
        targetNumber: 7,
        options: [7, 4, 9],
        itemEmoji: '🦋',
        world: 'Contando Más'
    },
    {
        id: 'math_8',
        targetNumber: 8,
        options: [6, 8, 10],
        itemEmoji: '🐢',
        world: 'Contando Más'
    },
    {
        id: 'math_9',
        targetNumber: 9,
        options: [9, 7, 5],
        itemEmoji: '🌻',
        world: 'Contando Más'
    },
    {
        id: 'math_10',
        targetNumber: 10,
        options: [8, 10, 12],
        itemEmoji: '🍄',
        world: 'Contando Más'
    }
];
