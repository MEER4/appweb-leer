export const REWARDS_CATALOG = [
    // Insignias por cantidad de lecciones
    {
        id: 'badge-first-lesson',
        type: 'badge',
        name: 'Primera Lección',
        description: 'Completaste tu primera lección',
        condition: { totalLessons: 1 },
    },
    {
        id: 'badge-vowels-master',
        type: 'badge',
        name: 'Mago de Vocales',
        description: '¡Aprendiste las 5 vocales!',
        condition: { totalLessons: 5 },
    },
    {
        id: 'badge-10-lessons',
        type: 'badge',
        name: 'Explorador de Letras',
        description: '10 lecciones completadas',
        condition: { totalLessons: 10 },
    },

    // Stickers por perfección
    {
        id: 'sticker-dino',
        type: 'sticker',
        name: 'Dinosaurio Lector',
        description: '3 estrellas en fonética',
        condition: { perfectIn: 'phonetics' },
    },
    {
        id: 'sticker-unicorn',
        type: 'sticker',
        name: 'Unicornio Mágico',
        description: '3 estrellas en cuento',
        condition: { perfectIn: 'story' },
    },

    // Personajes por hitos
    {
        id: 'char-robot',
        type: 'character',
        name: 'Robot Letrín',
        description: '20 lecciones totales',
        condition: { totalLessons: 20 },
    },
] as const;
