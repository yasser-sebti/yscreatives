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

        const curtainElements = gsap.utils.toArray("[data-ys-reveal='curtain']", containerRef.current);
        const heroZoomElements = gsap.utils.toArray("[data-ys-reveal='hero-zoom']", containerRef.current);

        const splits = [];

        // Pre-hide everything immediately
        if (fadeUpElements.length > 0) gsap.set(fadeUpElements, { opacity: 0, y: 30 });
        if (scaleXElements.length > 0) gsap.set(scaleXElements, { scaleX: 0, transformOrigin: "left" });
        if (fadeElements.length > 0) gsap.set(fadeElements, { opacity: 0 });
        if (imageElements.length > 0) gsap.set(imageElements, { clipPath: "inset(100% 0% 0% 0%)" });

        // Hero Specific Prep
        if (curtainElements.length > 0) gsap.set(curtainElements, { opacity: 1 }); // Start covering
        if (heroZoomElements.length > 0) gsap.set(heroZoomElements, { scale: 1.15 });

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

        // 1. Hero Curtain Reveal
        curtainElements.forEach((el) => {
            const delay = parseFloat(el.getAttribute('data-ys-delay')) || 0;
            gsap.to(el, {
                opacity: 0,
                duration: 2,
                ease: "power2.inOut",
                delay: delay
            });
        });

        // 2. Hero Zoom Reveal
        heroZoomElements.forEach((el) => {
            const delay = parseFloat(el.getAttribute('data-ys-delay')) || 0;
            gsap.to(el, {
                scale: 1,
                duration: 3,
                ease: "power3.out",
                delay: delay
            });
        });

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

            // Advanced "Line-style" Image Masking:
            // Container acts as the window, image slides UP into view.
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%", // Reveal begins slightly early for flow
                    toggleActions: "play none none none"
                }
            });

            // 1. Open the mask window cleanly
            tl.to(el, {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.4,
                ease: "power4.inOut",
                delay: delay
            });

            if (img) {
                // 2. The physical image slides UP from behind the mask line
                // Removed blur and brightness filters per request
                tl.fromTo(img,
                    {
                        yPercent: 40, // Subtle slide-up for a clean, minimal look
                        scale: 1.1    // Slight scale for depth
                    },
                    {
                        yPercent: 0,
                        scale: 1,
                        duration: 1.8,
                        ease: "expo.out"
                    },
                    "<" // Sync with mask opening
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
