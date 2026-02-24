// Global audio context for the browser
let audioCtx: AudioContext | null = null;

function getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Si estaba suspendido, intentar reanudar
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

export function speakText(text: string) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        // Cancelar cualquier audio hablando en este momento para evitar colas
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES'; // Castellano
        utterance.rate = 0.9; // Un poco más lento para los niños
        utterance.pitch = 1.1; // Un poco más agudo/amigable

        // Intentar buscar una voz en español
        const voices = window.speechSynthesis.getVoices();
        const esVoice = voices.find(v => v.lang.startsWith('es'));
        if (esVoice) utterance.voice = esVoice;

        window.speechSynthesis.speak(utterance);
    }
}

export function playSound(name: 'correct' | 'wrong' | 'celebration' | 'unlock' | 'click' | 'swoosh') {
    try {
        const ctx = getAudioContext();
        if (!ctx) return; // Estamos en SSR o no soportado

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;

        switch (name) {
            case 'correct':
                // Campana aguda (Ding)
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.5, now + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
                break;

            case 'wrong':
                // Zumbido grave (Buzzer)
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;

            case 'celebration':
            case 'unlock':
                // Arpegio feliz (Fanfarria corta estilo 8-bits)
                osc.type = 'square';

                osc.frequency.setValueAtTime(400, now);
                osc.frequency.setValueAtTime(500, now + 0.15);
                osc.frequency.setValueAtTime(600, now + 0.3);
                osc.frequency.setValueAtTime(800, now + 0.45);

                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.2, now + 0.02);
                gainNode.gain.setValueAtTime(0.2, now + 0.14);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.15);

                gainNode.gain.linearRampToValueAtTime(0.2, now + 0.16);
                gainNode.gain.setValueAtTime(0.2, now + 0.29);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.3);

                gainNode.gain.linearRampToValueAtTime(0.2, now + 0.31);
                gainNode.gain.setValueAtTime(0.2, now + 0.44);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.45);

                gainNode.gain.linearRampToValueAtTime(0.3, now + 0.46);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

                osc.start(now);
                osc.stop(now + 1.2);
                break;

            case 'click':
                // Pop suave
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;

            case 'swoosh':
                // Barrido rápido
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
                gainNode.gain.linearRampToValueAtTime(0.01, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
        }
    } catch (error) {
        console.error('Error generating sound', error);
    }
}
