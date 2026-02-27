'use client';

import { useSoundSettings } from '@/contexts/sound-context';

/**
 * A floating button that toggles all sounds (SFX + background music).
 * Positioned at bottom-right corner of the screen.
 */
export function MuteButton() {
    const { muted, toggleMute } = useSoundSettings();

    return (
        <button
            onClick={toggleMute}
            aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
            title={muted ? 'Activar sonido' : 'Silenciar sonido'}
            className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full
                       bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200
                       flex items-center justify-center text-2xl
                       transition-all duration-200
                       hover:scale-110 hover:shadow-xl
                       active:scale-95"
            style={{ WebkitTapHighlightColor: 'transparent' }}
        >
            {muted ? '🔇' : '🔊'}
        </button>
    );
}
