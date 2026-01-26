import { useGSAP, gsap, ScrollTrigger, SplitText } from '../gsap';
import { useTransition } from '../context/TransitionContext';

/**
 * usePageReveal Hook
 * Surgical reveal system for lazy-loaded pages.
 * Ensures animations only trigger once the component is mounted 
 * and the transition shutters have opened.
 */
export const usePageReveal = (containerRef) => {
    const { isAnimating, isPendingReveal } = useTransition();

    useGSAP(() => {
        if (!containerRef.current) return;

        // --- 1. PREPARATION PHASE ---
        const textElements = gsap.utils.toArray("[data-ys-reveal='text']", containerRef.current);
        const imageElements = gsap.utils.toArray("[data-ys-reveal='image']", containerRef.current);
        const fadeUpElements = gsap.utils.toArray("[data-ys-reveal='fade-up']", containerRef.current);
        const scaleXElements = gsap.utils.toArray("[data-ys-reveal='scale-x']", containerRef.current);
        const fadeElements = gsap.utils.toArray("[data-ys-reveal='fade']", containerRef.current);

        const splits = [];

        // Pre-hide everything immediately - Guarded against missing targets
        gsap.set(fadeUpElements, { opacity: 0, y: 30 });
        gsap.set(scaleXElements, { scaleX: 0, transformOrigin: "left" });
        gsap.set(fadeElements, { opacity: 0 });
        gsap.set(imageElements, { clipPath: "inset(100% 0% 0% 0%)" });

        textElements.forEach((el) => {
            const split = new SplitText(el, { type: "lines", linesClass: "ys-reveal-line" });
            splits.push(split);
            gsap.set(split.lines, { yPercent: 100, opacity: 0 });
        });

        // --- 2. ACTIVATION PHASE ---
        // We wait until transition is done.
        if (isAnimating || isPendingReveal) return;

        // Reveal Logic
        textElements.forEach((el, i) => {
            if (el.getAttribute('data-ys-skip') === 'true') return;
            const delay = parseFloat(el.getAttribute('data-ys-delay')) || 0;
            const split = splits[i];

            if (split && split.lines.length > 0) {
                gsap.to(split.lines, {
                    yPercent: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.1,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 100%",
                        toggleActions: "play none none none"
                    },
                    delay: delay
                });
            }
        });

        imageElements.forEach((el) => {
            const img = el.querySelector('img') || el.querySelector('.ys-simple-image');
            const delay = parseFloat(el.getAttribute('data-ys-delay')) || 0;
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none none"
                }
            });

            tl.to(el, {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.4,
                ease: "power4.inOut",
                delay: delay
            });

            if (img) {
                tl.fromTo(img,
                    { yPercent: 40, scale: 1.1 },
                    { yPercent: 0, scale: 1, duration: 1.8, ease: "expo.out" },
                    "<"
                );
            }
        });

        fadeUpElements.forEach((el) => {
            const delay = parseFloat(el.getAttribute('data-ys-delay')) || 0;
            gsap.to(el, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 100%",
                    toggleActions: "play none none none"
                },
                delay: delay
            });
        });

        scaleXElements.forEach((el) => {
            const delay = parseFloat(el.getAttribute('data-ys-delay')) || 0;
            gsap.to(el, {
                scaleX: 1,
                duration: 1.5,
                ease: "power3.inOut",
                scrollTrigger: {
                    trigger: el,
                    start: "top 100%",
                    toggleActions: "play none none none"
                },
                delay: delay
            });
        });

        fadeElements.forEach((el) => {
            const delay = parseFloat(el.getAttribute('data-ys-delay')) || 0;
            gsap.to(el, {
                opacity: 1,
                duration: 1.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 100%"
                },
                delay: delay
            });
        });

        return () => {
            splits.forEach(s => s.revert());
        };

    }, { scope: containerRef, dependencies: [isAnimating, isPendingReveal] });
};
