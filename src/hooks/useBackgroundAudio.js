import { useRef, useEffect } from 'react';
import { gsap } from '../gsap';

/**
 * useBackgroundAudio Hook - Cinematic Dual-Buffer Loop
 * 
 * Features:
 * 1. Seamless Crossfade Loop: Uses two audio buffers to overlap the end/start.
 * 2. Resume Capability: Pauses/Resumes exactly where left off.
 * 3. Smooth Toggle Fades: S-Curve volume transitions using GSAP.
 */
export const useBackgroundAudio = (isSoundOn) => {
    const track1Ref = useRef(null);
    const track2Ref = useRef(null);
    const activeTrackRef = useRef(1); // 1 or 2
    const isCrossfadingRef = useRef(false);
    const tweenRef = useRef(null);

    // Configuration
    const CROSSFADE_DURATION = 4; // seconds of overlap
    const TARGET_VOLUME = 0.4;
    const TOGGLE_FADE_DURATION = 1.5;

    useEffect(() => {
        // Fix: Use absolute URL construction to prevent relative path errors on 404/deep routes
        const getAssetPath = (path) => {
            let base = import.meta.env.BASE_URL || '/';
            // Force absolute if relative dot is present
            if (base === './' || base === '.') base = '/';

            const cleanBase = base.endsWith('/') ? base : `${base}/`;
            const cleanPath = path.startsWith('/') ? path.slice(1) : path;
            return `${cleanBase}${cleanPath}`;
        };

        const src = getAssetPath('assets/sounds/background-ost.mp3');

        // Initialize Dual Buffers
        const t1 = new Audio(src);
        const t2 = new Audio(src);

        t1.volume = 0;
        t2.volume = 0;

        // We don't use 'loop' property because we handle it manually
        t1.loop = false;
        t2.loop = false;

        track1Ref.current = t1;
        track2Ref.current = t2;

        const handleTimeUpdate = () => {
            // Only check crossfade if we are actually playing and sound is on
            // We access the wrapper function's current 'isCrossfadingRef'
            if (isCrossfadingRef.current) return;

            const activeId = activeTrackRef.current;
            const activeTrack = activeId === 1 ? track1Ref.current : track2Ref.current;

            if (activeTrack && activeTrack.duration) {
                const timeLeft = activeTrack.duration - activeTrack.currentTime;

                // Trigger crossfade early
                if (timeLeft <= CROSSFADE_DURATION) {
                    performCrossfade();
                }
            }
        };

        t1.addEventListener('timeupdate', handleTimeUpdate);
        t2.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            if (track1Ref.current) {
                track1Ref.current.pause();
                track1Ref.current.removeEventListener('timeupdate', handleTimeUpdate);
            }
            if (track2Ref.current) {
                track2Ref.current.pause();
                track2Ref.current.removeEventListener('timeupdate', handleTimeUpdate);
            }
            if (tweenRef.current) tweenRef.current.kill();
        };
    }, []);

    const performCrossfade = () => {
        isCrossfadingRef.current = true;

        const outgoingId = activeTrackRef.current;
        const incomingId = outgoingId === 1 ? 2 : 1;
        activeTrackRef.current = incomingId;

        const outgoing = outgoingId === 1 ? track1Ref.current : track2Ref.current;
        const incoming = incomingId === 1 ? track1Ref.current : track2Ref.current;

        // Prepare incoming
        incoming.currentTime = 0;
        incoming.volume = 0;

        // Only play if sound is technically ON globally (double check)
        // Note: performCrossfade is triggered by timeupdate, which only happens if playing.
        incoming.play().catch(e => console.warn(e));

        // GSAP Crossfade
        gsap.to(outgoing, {
            volume: 0,
            duration: CROSSFADE_DURATION,
            ease: "linear",
            onComplete: () => {
                outgoing.pause();
                outgoing.currentTime = 0; // Reset for next time it becomes incoming
            }
        });

        gsap.to(incoming, {
            volume: TARGET_VOLUME,
            duration: CROSSFADE_DURATION,
            ease: "linear",
            onComplete: () => {
                isCrossfadingRef.current = false;
            }
        });
    };

    // --- Master Control Effect (Robust Tween Manager) ---
    // Ref to track latest state, preventing race conditions in callbacks
    const isSoundOnRef = useRef(isSoundOn);
    useEffect(() => { isSoundOnRef.current = isSoundOn; }, [isSoundOn]);

    useEffect(() => {
        const activeId = activeTrackRef.current;
        const activeTrack = activeId === 1 ? track1Ref.current : track2Ref.current;
        const inactiveTrack = activeId === 1 ? track2Ref.current : track1Ref.current;

        if (!activeTrack) return;

        // 1. Kill all conflicting tweens immediately
        if (tweenRef.current) tweenRef.current.kill();
        gsap.killTweensOf(activeTrack);
        gsap.killTweensOf(inactiveTrack);

        if (isSoundOn) {
            // == SOUND ON SEQUENCE ==

            // A. Ensure track is playing (if paused)
            if (activeTrack.paused) {
                // FORCE volume to 0 to ensure fade-in is actually audible/smooth
                // This fixes the "Instant On" bug where volume might persist from previous session or default
                activeTrack.volume = 0;

                const playPromise = activeTrack.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => console.warn("Autoplay blocked, waiting for interaction", e));
                }
            }

            // B. Animate Volume Up (Seamless Interpolation)
            // We use fromTo ensuring we start exactly where we are, to target.
            // Overwrite: true ensures we take full control.
            tweenRef.current = gsap.to(activeTrack, {
                volume: TARGET_VOLUME,
                duration: TOGGLE_FADE_DURATION,
                ease: "power2.out", // 'out' ease feels snappier for On
                overwrite: true
            });

            // C. Ensure inactive track is silent
            inactiveTrack.volume = 0;
            inactiveTrack.pause();

        } else {
            // == SOUND OFF SEQUENCE ==

            // Animate Volume Down
            tweenRef.current = gsap.to(activeTrack, {
                volume: 0,
                ease: "power2.in", // 'in' ease clears audio out cleanly
                overwrite: true,
                duration: 0.5, // Fast snappy fade out
                onComplete: () => {
                    // CRITICAL: Only pause if we are STILL supposed to be off.
                    // This prevents pausing if user toggled back ON mid-fade.
                    if (!isSoundOnRef.current) {
                        activeTrack.pause();
                    }
                }
            });
        }

    }, [isSoundOn]);
};
