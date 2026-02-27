'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface SoundContextType {
    /** Whether all sounds (SFX + background) are muted */
    muted: boolean;
    /** Toggle the mute state */
    toggleMute: () => void;
}

const SoundContext = createContext<SoundContextType>({
    muted: false,
    toggleMute: () => { },
});

export const useSoundSettings = () => useContext(SoundContext);

// ───── Soft Background Music Generator (Web Audio API) ─────
// Creates a gentle, looping pad using two detuned sine oscillators.
// Very low volume so it doesn't overpower speech or SFX.

function createBackgroundMusic(audioCtx: AudioContext) {
    const masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.04; // Very subtle
    masterGain.connect(audioCtx.destination);

    // Pad oscillator 1
    const osc1 = audioCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 262; // C4
    const gain1 = audioCtx.createGain();
    gain1.gain.value = 0.5;
    osc1.connect(gain1);
    gain1.connect(masterGain);

    // Pad oscillator 2 (detuned for shimmer)
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 330; // E4
    osc2.detune.value = 5;
    const gain2 = audioCtx.createGain();
    gain2.gain.value = 0.3;
    osc2.connect(gain2);
    gain2.connect(masterGain);

    // Pad oscillator 3 (fifth for warmth)
    const osc3 = audioCtx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = 392; // G4
    const gain3 = audioCtx.createGain();
    gain3.gain.value = 0.2;
    osc3.connect(gain3);
    gain3.connect(masterGain);

    // Slow LFO for gentle volume modulation (breathing effect)
    const lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.15; // Very slow pulse
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 0.015; // Slight modulation depth
    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain);

    return {
        start: () => {
            osc1.start();
            osc2.start();
            osc3.start();
            lfo.start();
        },
        stop: () => {
            try { osc1.stop(); } catch { }
            try { osc2.stop(); } catch { }
            try { osc3.stop(); } catch { }
            try { lfo.stop(); } catch { }
        },
        masterGain,
    };
}

// ───── Provider ─────

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const [muted, setMuted] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const bgMusicRef = useRef<ReturnType<typeof createBackgroundMusic> | null>(null);
    const startedRef = useRef(false);

    // Read initial mute preference from localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const stored = localStorage.getItem('leer-jugando-muted');
        if (stored === 'true') setMuted(true);
    }, []);

    // Start background music on first user interaction (autoplay policy)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const startMusic = () => {
            if (startedRef.current) return;
            startedRef.current = true;

            try {
                const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                audioCtxRef.current = ctx;

                const bg = createBackgroundMusic(ctx);
                bgMusicRef.current = bg;
                bg.start();

                // Apply current mute state
                if (muted) {
                    bg.masterGain.gain.value = 0;
                }
            } catch (e) {
                console.warn('Background music not supported', e);
            }
        };

        // Only start on first touch/click (browser autoplay policy)
        window.addEventListener('click', startMusic, { once: true });
        window.addEventListener('touchstart', startMusic, { once: true });

        return () => {
            window.removeEventListener('click', startMusic);
            window.removeEventListener('touchstart', startMusic);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync mute state with background music
    useEffect(() => {
        if (bgMusicRef.current) {
            bgMusicRef.current.masterGain.gain.setTargetAtTime(
                muted ? 0 : 0.04,
                audioCtxRef.current?.currentTime || 0,
                0.3 // Smooth fade duration
            );
        }
    }, [muted]);

    const toggleMute = useCallback(() => {
        setMuted(prev => {
            const next = !prev;
            localStorage.setItem('leer-jugando-muted', String(next));
            return next;
        });
    }, []);

    return (
        <SoundContext.Provider value={{ muted, toggleMute }}>
            {children}
        </SoundContext.Provider>
    );
}
