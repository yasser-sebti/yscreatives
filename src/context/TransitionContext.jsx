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
            const shutters = shuttersRef.current;

            // 1. Immediately ensure overlay is visible and shutters are at 100%
            gsap.set(overlayRef.current, { display: 'flex' });
            gsap.set(shutters, { yPercent: 0 });

            // 2. The Premium Opening Sequence (Balanced Overlap)
            // We use a timeline to precisely trigger the content reveal at 65% of the shuffle.
            const tl = gsap.timeline({
                onComplete: () => {
                    gsap.set(overlayRef.current, { display: 'none' });
                    // Final safety unlock
                    setIsAnimating(false);
                }
            });

            tl.to(shutters, {
                yPercent: 100,
                duration: 0.7,
                stagger: 0.04,
                ease: "expo.inOut"
            })
                // Trigger the reveal + logic unlock at 65% progress (Advanced Clean Technique)
                .add(() => {
                    setIsPendingReveal(false);
                    setIsAnimating(false);
                }, 0.65 * 0.86); // 0.86 is the total calculated duration (0.7 + 4*0.04)
        }
    }, [location.pathname]);

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
