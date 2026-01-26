import { useGSAP, gsap, ScrollTrigger, SplitText } from '../gsap';

/**
 * Global Reveal System v3 - "Pro Max" Performance Edition
 * 
 * Performance Optimization Techniques:
 * 1. Batching: Uses ScrollTrigger.batch to drastically reduce trigger calculations.
 * 2. Contextual Cleanup: Uses gsap.context() to prevent memory leaks and handle scoped selects.
 * 3. GPU Acceleration: Forces layers on all animated elements using hardware-accelerated transforms.
 * 4. Lazy Initialization: Splits and triggers are only created when the app is idle/ready.
 */
export const useGlobalReveal = (containerRef, path, isAnimating, isPendingReveal, appReady = true) => {

    useGSAP(() => {
        if (!containerRef.current || isAnimating && !isPendingReveal || isPendingReveal || !appReady) return;

        // Global GSAP Default for smoother rendering across mid-range GPUs (like RTX 3050 mobile)
        gsap.config({ force3D: true });

        const ctx = gsap.context((self) => {
            const container = containerRef.current;

            // --- 1. Query Selectors (Scoped) ---
            const textElements = self.selector("[data-ys-reveal='text']");
            const imageElements = self.selector("[data-ys-reveal='image']");
            const fadeUpElements = self.selector("[data-ys-reveal='fade-up']");
            const scaleXElements = self.selector("[data-ys-reveal='scale-x']");
            const fadeElements = self.selector("[data-ys-reveal='fade']");

            // --- 2. Initial State (Hardware-Accelerated) ---
            // Using set() with force3D and will-change to prepare GPU layers
            if (fadeUpElements.length) gsap.set(fadeUpElements, { opacity: 0, y: 30, willChange: "transform, opacity" });
            if (scaleXElements.length) gsap.set(scaleXElements, { scaleX: 0, transformOrigin: "left", willChange: "transform" });
            if (fadeElements.length) gsap.set(fadeElements, { opacity: 0, willChange: "opacity" });
            if (imageElements.length) gsap.set(imageElements, { clipPath: "inset(0% 0% 100% 0%)", willChange: "clip-path" });

            // --- 3. Text Reveal Optimization ---
            textElements.forEach((el) => {
                if (el.getAttribute('data-ys-skip') === 'true') return;

                const delay = parseFloat(el.getAttribute('data-ys-delay')) || 0;
                const split = new SplitText(el, { type: "lines", mask: "lines" });

                gsap.set(split.lines, { yPercent: 105, opacity: 0, willChange: "transform, opacity" });

                gsap.to(split.lines, {
                    yPercent: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.1,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 95%",
                        toggleActions: "play none none none"
                    },
                    delay: delay
                });
            });

            // --- 4. Image Masking (Optimized Line-Style) ---
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
                    gsap.set(img, { willChange: "transform" });
                    tl.fromTo(img,
                        { yPercent: 30, scale: 1.1 },
                        { yPercent: 0, scale: 1, duration: 1.8, ease: "expo.out" },
                        "<"
                    );
                }
            });

            // --- 5. Batch Revealing for Fade Elements ---
            // Batching improves performance significantly on Windows/NVIDIA systems
            if (fadeUpElements.length) {
                ScrollTrigger.batch(fadeUpElements, {
                    start: "top 95%",
                    onEnter: (batch) => gsap.to(batch, {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        stagger: 0.15,
                        ease: "power3.out",
                        overwrite: true
                    })
                });
            }

            if (scaleXElements.length) {
                ScrollTrigger.batch(scaleXElements, {
                    start: "top 95%",
                    onEnter: (batch) => gsap.to(batch, {
                        scaleX: 1,
                        duration: 1.5,
                        stagger: 0.1,
                        ease: "power3.inOut",
                        overwrite: true
                    })
                });
            }

            if (fadeElements.length) {
                ScrollTrigger.batch(fadeElements, {
                    start: "top 95%",
                    onEnter: (batch) => gsap.to(batch, {
                        opacity: 1,
                        duration: 1.5,
                        stagger: 0.1,
                        ease: "power2.out",
                        overwrite: true
                    })
                });
            }

        }, containerRef);

        return () => ctx.revert();

    }, { dependencies: [path, isAnimating, isPendingReveal, appReady] });
};
