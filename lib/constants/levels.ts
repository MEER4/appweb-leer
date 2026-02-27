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
    { id: 'lvl_1_a', word: 'Abeja', correctLetter: 'A', missingIndex: 0, options: ['O', 'A', 'E'], imageIcon: '🐝', world: 'Las Vocales' },
    { id: 'lvl_2_e', word: 'Elefante', correctLetter: 'E', missingIndex: 0, options: ['I', 'U', 'E'], imageIcon: '🐘', world: 'Las Vocales' },
    { id: 'lvl_3_i', word: 'Isla', correctLetter: 'I', missingIndex: 0, options: ['A', 'I', 'O'], imageIcon: '🏝️', world: 'Las Vocales' },
    { id: 'lvl_4_o', word: 'Oso', correctLetter: 'O', missingIndex: 0, options: ['U', 'E', 'O'], imageIcon: '🐻', world: 'Las Vocales' },
    { id: 'lvl_5_u', word: 'Uva', correctLetter: 'U', missingIndex: 0, options: ['A', 'U', 'I'], imageIcon: '🍇', world: 'Las Vocales' },

    // --- MUNDO 2: Primeras Letras ---
    { id: 'lvl_6_m', word: 'Mamá', correctLetter: 'M', missingIndex: 0, options: ['P', 'M', 'S'], imageIcon: '👩', world: 'Primeras Letras' },
    { id: 'lvl_7_p', word: 'Pato', correctLetter: 'P', missingIndex: 0, options: ['T', 'B', 'P'], imageIcon: '🦆', world: 'Primeras Letras' },
    { id: 'lvl_8_s', word: 'Sol', correctLetter: 'S', missingIndex: 0, options: ['S', 'C', 'Z'], imageIcon: '☀️', world: 'Primeras Letras' },
    { id: 'lvl_9_l', word: 'Luna', correctLetter: 'L', missingIndex: 0, options: ['R', 'L', 'N'], imageIcon: '🌙', world: 'Primeras Letras' },

    // --- MUNDO 3: Letras Fuertes ---
    { id: 'lvl_10_b', word: 'Búho', correctLetter: 'B', missingIndex: 0, options: ['V', 'D', 'B'], imageIcon: '🦉', world: 'Letras Fuertes' },
    { id: 'lvl_11_c', word: 'Casa', correctLetter: 'C', missingIndex: 0, options: ['K', 'S', 'C'], imageIcon: '🏠', world: 'Letras Fuertes' },
    { id: 'lvl_12_d', word: 'Dedo', correctLetter: 'D', missingIndex: 0, options: ['B', 'D', 'P'], imageIcon: '👆', world: 'Letras Fuertes' },
    { id: 'lvl_13_f', word: 'Fuego', correctLetter: 'F', missingIndex: 0, options: ['F', 'P', 'V'], imageIcon: '🔥', world: 'Letras Fuertes' },
    { id: 'lvl_14_g', word: 'Gato', correctLetter: 'G', missingIndex: 0, options: ['J', 'G', 'C'], imageIcon: '🐱', world: 'Letras Fuertes' },
    { id: 'lvl_15_j', word: 'Jugo', correctLetter: 'J', missingIndex: 0, options: ['G', 'J', 'Y'], imageIcon: '🧃', world: 'Letras Fuertes' },
    { id: 'lvl_16_r', word: 'Rana', correctLetter: 'R', missingIndex: 0, options: ['L', 'RR', 'R'], imageIcon: '🐸', world: 'Letras Fuertes' },
    { id: 'lvl_17_t', word: 'Tren', correctLetter: 'T', missingIndex: 0, options: ['D', 'T', 'P'], imageIcon: '🚂', world: 'Letras Fuertes' },

    // --- MUNDO 4: Letras Suaves ---
    { id: 'lvl_18_h', word: 'Hielo', correctLetter: 'H', missingIndex: 0, options: ['I', 'J', 'H'], imageIcon: '🧊', world: 'Letras Suaves' },
    { id: 'lvl_19_k', word: 'Koala', correctLetter: 'K', missingIndex: 0, options: ['C', 'Q', 'K'], imageIcon: '🐨', world: 'Letras Suaves' },
    { id: 'lvl_20_n', word: 'Nube', correctLetter: 'N', missingIndex: 0, options: ['M', 'N', 'Ñ'], imageIcon: '☁️', world: 'Letras Suaves' },
    { id: 'lvl_21_ny', word: 'Ñandú', correctLetter: 'Ñ', missingIndex: 0, options: ['N', 'Ñ', 'Y'], imageIcon: '🦤', world: 'Letras Suaves' },
    { id: 'lvl_22_v', word: 'Vaca', correctLetter: 'V', missingIndex: 0, options: ['B', 'V', 'F'], imageIcon: '🐄', world: 'Letras Suaves' },
    { id: 'lvl_23_y', word: 'Yoyo', correctLetter: 'Y', missingIndex: 0, options: ['LL', 'I', 'Y'], imageIcon: '🪀', world: 'Letras Suaves' },

    // --- MUNDO 5: Letras Especiales ---
    { id: 'lvl_24_q', word: 'Queso', correctLetter: 'Q', missingIndex: 0, options: ['K', 'C', 'Q'], imageIcon: '🧀', world: 'Letras Especiales' },
    { id: 'lvl_25_w', word: 'Wifi', correctLetter: 'W', missingIndex: 0, options: ['V', 'W', 'U'], imageIcon: '📶', world: 'Letras Especiales' },
    { id: 'lvl_26_x', word: 'Xilófono', correctLetter: 'X', missingIndex: 0, options: ['S', 'Z', 'X'], imageIcon: '🎹', world: 'Letras Especiales' },
    { id: 'lvl_27_z', word: 'Zorro', correctLetter: 'Z', missingIndex: 0, options: ['S', 'C', 'Z'], imageIcon: '🦊', world: 'Letras Especiales' }
];
