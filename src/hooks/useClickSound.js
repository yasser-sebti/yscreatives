import { useEffect, useRef } from 'react';

/**
 * Global Click Sound Hook v2
 * 
 * DESIGN PRINCIPLE:
 * Professional UI feedback must feel instantaneous. 
 * This hook uses 'pointerdown' instead of 'click' for 0ms perceived latency
 * and allows overlapping sounds (polyphony) for rapid interactions.
 */
export const useClickSound = (isSoundOn) => {
    const audioRef = useRef(null);

    useEffect(() => {
        const baseUrl = import.meta.env.BASE_URL || '/';
        const soundPath = `${baseUrl}assets/sounds/click-sound.wav`;

        audioRef.current = new Audio(soundPath);
        audioRef.current.volume = 0.35; // Calibrated for subtle feedback
        audioRef.current.load();
    }, []);

    useEffect(() => {
        if (!isSoundOn) return;

        const handleInteraction = (e) => {
            // Use closest to detect interactive containers
            const target = e.target.closest('button, a, [role="button"], input[type="submit"], input[type="button"]');

            if (target) {
                // Skip if disabled or aria-disabled
                if (target.disabled || target.getAttribute('aria-disabled') === 'true') return;

                if (audioRef.current) {
                    // Polyphonic implementation:
                    // Rapid clicks should not cut each other off.
                    // We clone the preloaded node for overlapping playback.
                    const soundClone = audioRef.current.cloneNode();
                    soundClone.volume = audioRef.current.volume;

                    const playPromise = soundClone.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(() => {
                            // Catch standard browser interaction blocks
                        });
                    }

                    // Cleanup: Remove reference after it finishes playing
                    soundClone.onended = () => {
                        soundClone.remove();
                    };
                }
            }
        };

        // Use pointerdown for maximum responsiveness (immediate feedback)
        document.addEventListener('pointerdown', handleInteraction);

        return () => {
            document.removeEventListener('pointerdown', handleInteraction);
        };
    }, [isSoundOn]);
};
