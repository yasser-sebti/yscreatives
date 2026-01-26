import { useRef } from 'react';
import { gsap, useGSAP } from '../../gsap';
import { useTransition } from '../../context/TransitionContext';

const CTA = () => {
    const containerRef = useRef(null);
    const starsRef = useRef(null);
    const textRef = useRef(null);
    const { navigateWithTransition } = useTransition();

    useGSAP(() => {
        // --- 1. STARS BACKGROUND ---
        const starsContainer = starsRef.current;
        if (starsContainer) {
            starsContainer.innerHTML = '';
            const numStars = 150; // Optimized count for CTA
            for (let i = 0; i < numStars; i++) {
                const star = document.createElement("div");
                star.className = "ys-cta__star";
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                const size = Math.random() * 2 + 0.5;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.opacity = Math.random() * 0.5 + 0.1;
                starsContainer.appendChild(star);
            }

            // Subtle floating animation for stars
            const stars = gsap.utils.toArray(".ys-cta__star");
            stars.forEach((star) => {
                gsap.to(star, {
                    y: `random(-20, 20)`,
                    x: `random(-20, 20)`,
                    opacity: `random(0.1, 0.6)`,
                    duration: `random(3, 6)`,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            });
        }

        // --- 2. MAGNETIC EFFECT ---
        const el = textRef.current;
        if (el) {
            const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
            const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

            const onMove = (e) => {
                const { clientX, clientY } = e;
                const { height, width, left, top } = el.getBoundingClientRect();
                const x = clientX - (left + width / 2);
                const y = clientY - (top + height / 2);
                xTo(x * 0.4);
                yTo(y * 0.4);

                // Active glow effect on hover
                gsap.to(el, {
                    textShadow: "0 0 30px rgba(255,255,255,0.4)",
                    color: "#ffffff",
                    duration: 0.4
                });
            };

            const onLeave = () => {
                xTo(0);
                yTo(0);
                gsap.to(el, {
                    textShadow: "0 0 0px rgba(255,255,255,0)",
                    color: "rgba(255,255,255,0.8)",
                    duration: 0.4
                });
            };

            el.addEventListener("mousemove", onMove);
            el.addEventListener("mouseleave", onLeave);
        }

    }, { scope: containerRef });

    const handleClick = (e) => {
        e.preventDefault();

        // --- 3. CLICK ANIMATION ---
        // Quick scale down and fade out effect
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
    };

    return (
        <section className="ys-cta" ref={containerRef}>
            <div className="ys-cta__gradient"></div>
            <div className="ys-cta__stars" ref={starsRef}></div>

            <a
                href="/contact"
                className="ys-cta-magnetic ys-cta__title"
                ref={textRef}
                onClick={handleClick}
            >
                Let's work together
            </a>
        </section>
    );
};

export default CTA;
