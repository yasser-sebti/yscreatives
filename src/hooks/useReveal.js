import { useGSAP, gsap, ScrollTrigger, SplitText } from '../gsap';

/**
 * Global Reveal System v2 - Optimized for seamless transitions
 * 
 * Features:
 * 1. Immediate Preparation: Elements are hidden as soon as the path changes.
 * 2. Deferred Activation: Animations only start after the transition shutters open.
 * 3. Layout Sync: Automatically handles SplitText and ScrollTrigger refresh.
 */
export const useGlobalReveal = (containerRef, path, isAnimating, isPendingReveal, appReady = true) => {

    useGSAP(() => {
        if (!containerRef.current) return;

        // --- 1. PREPARATION PHASE ---
        // We only want to hide/prepare elements for the NEW page. 
        // If the shutters are just STARTING to close (animating but not pending reveal), 
        // we keep the current content visible so it's covered properly.
        if (isAnimating && !isPendingReveal) return;

        const textElements = gsap.utils.toArray("[data-ys-reveal='text']", containerRef.current);
        const imageElements = gsap.utils.toArray("[data-ys-reveal='image']", containerRef.current);
        const fadeUpElements = gsap.utils.toArray("[data-ys-reveal='fade-up']", containerRef.current);
        const scaleXElements = gsap.utils.toArray("[data-ys-reveal='scale-x']", containerRef.current);
        const fadeElements = gsap.utils.toArray("[data-ys-reveal='fade']", containerRef.current);

        const splits = [];

        // Pre-hide everything immediately - Guarded against missing targets
        if (fadeUpElements.length > 0) gsap.set(fadeUpElements, { opacity: 0, y: 30 });
        if (scaleXElements.length > 0) gsap.set(scaleXElements, { scaleX: 0, transformOrigin: "left" });
        if (fadeElements.length > 0) gsap.set(fadeElements, { opacity: 0 });
        if (imageElements.length > 0) gsap.set(imageElements, { clipPath: "inset(100% 0% 0% 0%)" });

        // Split text early to avoid layout shift during reveal
        textElements.forEach((el) => {
            const split = new SplitText(el, { type: "lines", mask: "lines" });
            splits.push(split);
            gsap.set(split.lines, { yPercent: 100, opacity: 0 });
        });

        // --- 2. ACTIVATION PHASE ---
        // Only proceed to reveal if:
        // 1. Page is NOT pending anymore (Shuffler signal received)
        // 2. App preloader is finished
        // We REMOVE 'isAnimating' here so reveal starts WHILE shutters are opening.
        if (isPendingReveal || !appReady) return;

        // Force a total refresh to sync ScrollTrigger with the new page's layout
        ScrollTrigger.refresh();

        // Reveal Logic
        textElements.forEach((el, i) => {
            if (el.getAttribute('data-ys-skip') === 'true') return;
            const delay = parseFloat(el.getAttribute('data-ys-delay')) || 0;
            const split = splits[i];

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
        });

        imageElements.forEach((el) => {
            const img = el.querySelector('img') || el.querySelector('.ys-simple-image');
            const delay = parseFloat(el.getAttribute('data-ys-delay')) || 0;

            // Advanced Reveal: Vertical shutter + Scale down for depth
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: el,
                    start: "top 95%", // Earlier reveal for better flow
                    toggleActions: "play none none none"
                }
            });

            // Initial state for image containers using clipPath for a refined mask reveal
            // We use 'inset(0% 0% 100% 0%)' to reveal from bottom to top, or 
            // 'inset(100% 0% 0% 0%)' for top to bottom.
            tl.to(el, {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.6,
                ease: "expo.inOut", // Sophisticated acceleration/deceleration
                delay: delay
            });

            if (img) {
                tl.fromTo(img,
                    {
                        scale: 1.4,
                        filter: "brightness(0.5) blur(10px)" // Atmospheric entrance
                    },
                    {
                        scale: 1,
                        filter: "brightness(1) blur(0px)",
                        duration: 2.2,
                        ease: "power2.out"
                    },
                    "<" // Start simultaneously with the mask reveal
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

    }, { scope: containerRef, dependencies: [path, isAnimating, isPendingReveal, appReady] });
};
