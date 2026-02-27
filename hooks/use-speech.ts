'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * A hook to manage Web Speech API text-to-speech.
 * It handles voice loading, selection (preferring Spanish), and provides methods to speak, stop, and check status.
 */
export function useSpeech() {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [supported, setSupported] = useState(true);

    // We keep a reference to the utterance to prevent it from being garbage collected mid-speech
    // which is a known bug in certain browsers (especially Safari and older Chrome)
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Initialize and load voices
    useEffect(() => {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
            setSupported(false);
            return;
        }

        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
            }
        };

        // Voices are often loaded asynchronously by the browser
        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = null;
            }
        };
    }, []);

    // Get the best Spanish voice available
    const getPreferredVoice = useCallback(() => {
        if (voices.length === 0) return null;

        // Try to find a Mexican or Latin American Spanish voice first
        let voice = voices.find(v => v.lang === 'es-MX' || v.lang === 'es-US' || v.lang === 'es-419');

        // Fallback to any Spanish voice
        if (!voice) {
            voice = voices.find(v => v.lang.startsWith('es'));
        }

        // Final fallback to the default voice
        return voice || voices[0];
    }, [voices]);

    const speak = useCallback((text: string, options?: { rate?: number; pitch?: number }) => {
        if (!supported || typeof window === 'undefined') return;

        // Cancel any ongoing speech before starting a new one
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        const voice = getPreferredVoice();
        if (voice) {
            utterance.voice = voice;
        }

        // Kid-friendly defaults: slightly slower, slightly higher pitch depending on voice
        utterance.rate = options?.rate || 0.9;
        utterance.pitch = options?.pitch || 1.1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            // "interrupted" and "canceled" are expected when we call cancel() manually or skip
            if (e.error !== 'interrupted' && e.error !== 'canceled') {
                console.error(`Speech synthesis error [${e.error}]:`, e);
            }
            setIsSpeaking(false);
        };

        // Delay slightly to allow cancel() to fully process before speaking
        // This prevents race condition bugs in Chrome/Safari
        setTimeout(() => {
            window.speechSynthesis.speak(utterance);
        }, 50);
    }, [supported, getPreferredVoice]);

    const stop = useCallback(() => {
        if (!supported || typeof window === 'undefined') return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, [supported]);

    return {
        speak,
        stop,
        isSpeaking,
        supported,
        voicesLoaded: voices.length > 0
    };
}
