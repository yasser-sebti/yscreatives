import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from '../gsap';

const TransitionContext = createContext();

export const TransitionProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const overlayRef = useRef(null);
    const shuttersRef = useRef([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPendingReveal, setIsPendingReveal] = useState(true);

    // --- AUTOMATION: Global Reveal Trigger ---
    useEffect(() => {
        if (isPendingReveal) {
            const shutters = shuttersRef.current.filter(el => el !== null);

            // 0. Safety Catch: Ensure display is flex when starting animation
            gsap.set(overlayRef.current, { display: 'flex' });

            if (shutters.length === 0) {
                // Should not happen, but prevents permanent black screen
                setIsPendingReveal(false);
                setIsAnimating(false);
                gsap.set(overlayRef.current, { display: 'none' });
                return;
            }

            // 1. Immediately reset shutter position
            gsap.set(shutters, { yPercent: 0 });

            // 2. The Premium Opening Sequence
            const tl = gsap.timeline({
                onComplete: () => {
                    gsap.set(overlayRef.current, { display: 'none' });
                    setIsAnimating(false);
                    setIsPendingReveal(false);
                }
            });

            tl.to(shutters, {
                yPercent: 100,
                duration: 0.8,
                stagger: 0.05,
                ease: "expo.inOut"
            })
                // Unlock logic slightly before visual completion
                .add(() => {
                    setIsPendingReveal(false);
                    setIsAnimating(false);
                }, 0.5);

            // 3. NUCLEAR FAILSAFE: If for any reason GSAP is blocked, force reveal after 3s
            const failSafe = setTimeout(() => {
                if (overlayRef.current && overlayRef.current.style.display !== 'none') {
                    console.warn("Transition Failsafe Triggered");
                    gsap.set(overlayRef.current, { display: 'none' });
                    setIsPendingReveal(false);
                    setIsAnimating(false);
                }
            }, 3000);

            return () => clearTimeout(failSafe);
        }
    }, [location.pathname, isPendingReveal]);

    const navigateWithTransition = (to) => {
        if (location.pathname === to) return;
        if (isAnimating) return;

        setIsAnimating(true);
        const shutters = shuttersRef.current;

        const tl = gsap.timeline({
            onComplete: () => {
                // Set pending flag then navigate
                setIsPendingReveal(true);
                navigate(to);
            }
        });

        // ANIMATION IN: Close shutters from top to center
        gsap.set(overlayRef.current, { display: 'flex' });
        gsap.set(shutters, { yPercent: -100 });

        tl.to(shutters, {
            yPercent: 0,
            duration: 0.5,
            stagger: 0.04,
            ease: "expo.inOut"
        });
    };

    const revealPage = () => setIsPendingReveal(false);

    return (
        <TransitionContext.Provider value={{ navigateWithTransition, isAnimating, revealPage, isPendingReveal }}>
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
                {[0, 1, 2, 3, 4].map(i => (
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
