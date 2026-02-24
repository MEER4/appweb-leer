export interface PhonicsLesson {
    id: string;                    // Ej: 'phonics-001'
    targetWord: string;            // Ej: 'CASA'
    displayLetters: string[];      // Letras mostradas: ['C','A','S','A','X','M']
    difficulty: 'easy' | 'medium' | 'hard';
    audioHint?: string;            // URL del audio que pronuncia la palabra
    imageHint?: string;            // URL de imagen pista (ej: dibujo)
}

export interface GameScore {
    totalSlots: number;
    correctOnFirstTry: number;     // Sin errores en ese hueco
    totalErrors: number;
    timeSeconds: number;
}
