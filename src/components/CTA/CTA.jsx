import { useRef, memo, useCallback } from 'react';
import { gsap, useGSAP } from '../../gsap';
import { useTransition } from '../../context/TransitionContext';
import { useMagnetic } from '../../hooks/useMagnetic';

const CTA = () => {
    const containerRef = useRef(null);
    const starsRef = useRef(null);
    const textRef = useRef(null);
    const { navigateWithTransition } = useTransition();

    // --- 1. MAGNETIC EFFECT (Centralized) ---
    useMagnetic(containerRef, ".ys-cta-magnetic", 0.4);

    useGSAP(() => {
        // --- 2. STARS BACKGROUND (Optimized) ---
        const starsContainer = starsRef.current;
        if (starsContainer) {
            starsContainer.innerHTML = '';
            const numStars = 100; // Performance-first optimized count
            for (let i = 0; i < numStars; i++) {
                const star = document.createElement("div");
                star.className = "ys-cta__star";
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                const size = Math.random() * 2 + 0.5;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.opacity = Math.random() * 0.5 + 0.1;
                star.style.willChange = "transform, opacity"; // Layer optimization
                starsContainer.appendChild(star);
            }

            const stars = gsap.utils.toArray(".ys-cta__star");
            stars.forEach((star) => {
                gsap.to(star, {
                    y: `random(-20, 20)`,
                    x: `random(-20, 20)`,
                    opacity: `random(0.1, 0.6)`,
                    duration: `random(3, 6)`,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    force3D: true
                });
            });
        }
    }, { scope: containerRef });

    const handleClick = useCallback((e) => {
        e.preventDefault();

        // --- 3. CLICK ANIMATION ---
        const tl = gsap.timeline({
            onComplete: () => {
                navigateWithTransition('/contact');
            }
        });

        tl.to(textRef.current, {
            scale: 0.95,
            opacity: 0.5,
            duration: 0.15,
            ease: "power2.in"
        });

        tl.to(textRef.current, {
            scale: 1.1,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out"
        });
    }, [navigateWithTransition]);

    return (
        <section className="ys-cta" ref={containerRef}>
            <div className="ys-cta__gradient"></div>
            <div className="ys-cta__stars" ref={starsRef}></div>

            <a
                href="/contact"
                className="ys-cta-magnetic ys-cta__title"
                ref={textRef}
                onClick={handleClick}
                data-ys-reveal="fade-up"
                data-ys-delay="0.2"
            >
                Let's work together
            </a>
        </section>
    );
};

export default memo(CTA);
