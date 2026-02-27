export type MemoryItem = {
    id: string; // Ej: 'A'
    text: string; // Ej: 'Aa'
    icon: string; // Ej: '🐝'
    matchSound?: string; // Ej: 'a.mp3'
};

export type MemoryLevel = {
    id: string;
    world: string;
    name: string;
    description: string;
    gridSize: 4 | 6 | 8; // Número total de pares a encontrar (8, 12, 16 cartas)
    items: MemoryItem[];
};

export const MEMORY_LEVELS: MemoryLevel[] = [
    {
        id: 'mem-vowels-1',
        world: 'Cueva de Concentración',
        name: 'Vocales Mágicas',
        description: 'Encuentra las parejas de las vocales con sus dibujos.',
        gridSize: 4, // 8 cartas en total
        items: [
            { id: 'A', text: 'A', icon: '🐝' },
            { id: 'E', text: 'E', icon: '🐘' },
            { id: 'I', text: 'I', icon: '🦎' },
            { id: 'O', text: 'O', icon: '🐻' },
        ],
    },
    {
        id: 'mem-vowels-2',
        world: 'Cueva de Concentración',
        name: 'Más Vocales',
        description: '¡Un reto un poco más grande!',
        gridSize: 6, // 12 cartas en total
        items: [
            { id: 'A', text: 'A', icon: '🐝' },
            { id: 'E', text: 'E', icon: '🐘' },
            { id: 'I', text: 'I', icon: '🦎' },
            { id: 'O', text: 'O', icon: '🐻' },
            { id: 'U', text: 'U', icon: '🍇' },
            { id: 'M', text: 'M', icon: '🍎' }, // Mezcla para 6
        ],
    },
    {
        id: 'mem-consonants-1',
        world: 'Cueva de Concentración',
        name: 'Letras Saltinas',
        description: 'Memoriza dónde están las nuevas letras.',
        gridSize: 6,
        items: [
            { id: 'M', text: 'M', icon: '🍎' },
            { id: 'P', text: 'P', icon: '🐶' },
            { id: 'S', text: 'S', icon: '🐍' },
            { id: 'L', text: 'L', icon: '🦁' },
            { id: 'T', text: 'T', icon: '🐢' },
            { id: 'D', text: 'D', icon: '🐬' },
        ],
    },
    {
        id: 'mem-challenge-1',
        world: 'Cueva de Concentración',
        name: 'El Gran Reto',
        description: '¡Demuestra tu increíble memoria!',
        gridSize: 8, // 16 cartas en total
        items: [
            { id: 'A', text: 'A', icon: '🐝' },
            { id: 'E', text: 'E', icon: '🐘' },
            { id: 'P', text: 'P', icon: '🐶' },
            { id: 'S', text: 'S', icon: '🐍' },
            { id: 'L', text: 'L', icon: '🦁' },
            { id: 'M', text: 'M', icon: '🍎' },
            { id: 'T', text: 'T', icon: '🐢' },
            { id: 'D', text: 'D', icon: '🐬' },
        ],
    }
];
