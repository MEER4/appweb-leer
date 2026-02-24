/**
 * Utilidad simple para reproducir sonidos de feedback
 * Los archivos deben estar en /public/sounds/
 */
export function playSound(name: 'correct' | 'wrong' | 'celebration' | 'unlock' | 'click' | 'swoosh') {
    try {
        const audio = new Audio(`/sounds/${name}.mp3`);
        audio.volume = 0.5;
        audio.play().catch(() => {
            // Omitir error si el navegador bloquea autoplay sin interacción previa
            console.warn(`Browser prevented playing sound: ${name}`);
        });
    } catch (error) {
        console.error('Error playing sound', error);
    }
}
