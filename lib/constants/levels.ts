export type GameLevel = {
    id: string;
    word: string;
    correctLetter: string;
    missingIndex: number; // Índice donde falta la letra
    options: string[]; // Opciones de letras para arrastrar (incluyendo la correcta)
    imageIcon: string; // Emoji representativo
    world: string; // Agrupación visual en el mapa
};

// Catálogo Centralizado de Niveles - Minijuego de Fonética
export const ALL_PHONETICS_LEVELS: GameLevel[] = [
    // --- MUNDO 1: Las Vocales ---
    {
        id: 'lvl_1_a',
        word: 'Abeja',
        correctLetter: 'A',
        missingIndex: 0,
        options: ['O', 'A', 'E'],
        imageIcon: '🐝',
        world: 'Las Vocales'
    },
    {
        id: 'lvl_2_e',
        word: 'Elefante',
        correctLetter: 'E',
        missingIndex: 0,
        options: ['I', 'U', 'E'],
        imageIcon: '🐘',
        world: 'Las Vocales'
    },
    {
        id: 'lvl_3_i',
        word: 'Isla',
        correctLetter: 'I',
        missingIndex: 0,
        options: ['A', 'I', 'O'],
        imageIcon: '🏝️',
        world: 'Las Vocales'
    },
    {
        id: 'lvl_4_o',
        word: 'Oso',
        correctLetter: 'O',
        missingIndex: 0,
        options: ['U', 'E', 'O'],
        imageIcon: '🐻',
        world: 'Las Vocales'
    },
    {
        id: 'lvl_5_u',
        word: 'Uva',
        correctLetter: 'U',
        missingIndex: 0,
        options: ['A', 'U', 'I'],
        imageIcon: '🍇',
        world: 'Las Vocales'
    },

    // --- MUNDO 2: Primeras Letras ---
    {
        id: 'lvl_6_m',
        word: 'Mamá',
        correctLetter: 'M',
        missingIndex: 0,
        options: ['P', 'M', 'S'],
        imageIcon: '👩',
        world: 'Primeras Letras'
    },
    {
        id: 'lvl_7_p',
        word: 'Pato',
        correctLetter: 'P',
        missingIndex: 0,
        options: ['T', 'B', 'P'],
        imageIcon: '🦆',
        world: 'Primeras Letras'
    },
    {
        id: 'lvl_8_s',
        word: 'Sol',
        correctLetter: 'S',
        missingIndex: 0,
        options: ['S', 'C', 'Z'],
        imageIcon: '☀️',
        world: 'Primeras Letras'
    },
    {
        id: 'lvl_9_l',
        word: 'Luna',
        correctLetter: 'L',
        missingIndex: 0,
        options: ['R', 'L', 'N'],
        imageIcon: '🌙',
        world: 'Primeras Letras'
    }
];
