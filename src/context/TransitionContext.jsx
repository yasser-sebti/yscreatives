import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from '../gsap';
import { useSound } from './SoundContext';

const TransitionContext = createContext();

// --- Constants ---
const SHUTTER_COUNT = 5;
const SHUTTER_DURATION = 0.7;
const SHUTTER_STAGGER = 0.04;

export const TransitionProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const overlayRef = useRef(null);
    const shuttersRef = useRef([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPendingReveal, setIsPendingReveal] = useState(true);
    const [hasIntroPlayed, setHasIntroPlayed] = useState(false);
    const { isSoundOn } = useSound();
    const swooshAudioRef = useRef(null);

    // Initialize swoosh audio
    useEffect(() => {
        const getAssetPath = (path) => {
            let base = import.meta.env.BASE_URL || '/';
            if (base === './' || base === '.') base = '/';
            const cleanBase = base.endsWith('/') ? base : `${base}/`;
            const cleanPath = path.startsWith('/') ? path.slice(1) : path;
            return `${cleanBase}${cleanPath}`;
        };

        swooshAudioRef.current = new Audio(getAssetPath('assets/sounds/swoosh-audio.MP3'));
        swooshAudioRef.current.volume = 0; // Start silent
    }, []);

    const playSwoosh = () => {
        const audio = swooshAudioRef.current;
        if (!audio) return;

        // Reset and play
        audio.currentTime = 0;

        // Only play and fade in if global sound is on
        if (isSoundOn) {
            audio.volume = 0;
            audio.play().catch(() => { });
            gsap.fromTo(audio, { volume: 0 }, { volume: 0.5, duration: 0.3, ease: 'power2.out' });
        }
    };

    // FEATURE: Real-time volume update.
    // If user toggles sound ON while swoosh is playing, they will hear the rest of it.
    useEffect(() => {
        if (swooshAudioRef.current) {
            swooshAudioRef.current.volume = isSoundOn ? 0.5 : 0;
        }
    }, [isSoundOn]);

    // --- AUTOMATION: Global Reveal Trigger ---
    useEffect(() => {
        if (isPendingReveal) {
            const shutters = shuttersRef.current;
            const totalDuration = SHUTTER_DURATION + (SHUTTER_COUNT - 1) * SHUTTER_STAGGER;

            // 1. Reset state
            gsap.set(overlayRef.current, { display: 'flex' });
            gsap.set(shutters, { yPercent: 0 });

            // 2. Premium Shutter Sequence
            const tl = gsap.timeline({
                onStart: () => {
                    // FEATURE: Only play swoosh on Home Page Intro
                    if (location.pathname === '/' || location.pathname === '/yscreatives/') {
                        playSwoosh();
                    }
                },
                onComplete: () => {
                    gsap.set(overlayRef.current, { display: 'none' });
                    setIsAnimating(false);
                }
            });

            tl.to(shutters, {
                yPercent: 100,
                duration: SHUTTER_DURATION,
                stagger: SHUTTER_STAGGER,
                ease: "expo.inOut"
            })
                // Unlock page logic at 65% of the total transition duration for a seamless overlap feel
                .add(() => {
                    setIsPendingReveal(false);
                    setIsAnimating(false);
                }, totalDuration * 0.65);
        }
    }, [location.pathname]);

    const navigateWithTransition = (to) => {
        if (location.pathname === to) return;
        if (isAnimating) return;

        setIsAnimating(true);
        const shutters = shuttersRef.current;

        const tl = gsap.timeline({
            onStart: () => {
                if (to === '/' || to === '/yscreatives/') {
                    playSwoosh();
                }
            },
            onComplete: () => {
                setIsPendingReveal(true);
                // FEATURE: Re-enable intro animation if navigating back to home
                if (to === '/') {
                    setHasIntroPlayed(false);
                }
                navigate(to);
            }
        });

        gsap.set(overlayRef.current, { display: 'flex' });
        gsap.set(shutters, { yPercent: -100 });

        tl.to(shutters, {
            yPercent: 0,
            duration: 0.5,
            stagger: SHUTTER_STAGGER,
            ease: "expo.inOut"
        });
    };

    const revealPage = () => setIsPendingReveal(false);

    return (
        <TransitionContext.Provider value={{ navigateWithTransition, isAnimating, revealPage, isPendingReveal, hasIntroPlayed, setHasIntroPlayed }}>
            {children}

            {/* THE MASTER TRANSITION LAYER */}
            <div
                ref={overlayRef}
                className="ys-master-transition"
                style={{
                    display: 'flex',
                    flexDirection: 'row'
                }}
            >
                {Array.from({ length: SHUTTER_COUNT }).map((_, i) => (
                    <div
                        key={i}
                        ref={el => (shuttersRef.current[i] = el)}
                        style={{
                            flex: 1,
                            height: '100%',
                            backgroundColor: '#000000',
                            position: 'relative',
                            willChange: 'transform',
                            transform: 'translateY(0%)'
                        }}
                    />
                ))}
            </div>
        </TransitionContext.Provider>
    );
};

export const useTransition = () => useContext(TransitionContext);
