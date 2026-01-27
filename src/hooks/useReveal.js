import { useGSAP, gsap, ScrollTrigger, SplitText } from '../gsap';

/**
 * Global Reveal System v3 - Dynamic & Lazy Load Support
 * 
 * Features:
 * 1. Immediate Preparation: Elements are hidden as soon as they exist.
 * 2. Deferred Activation: Animations start after transition or immediately for lazy content.
 * 3. MutationObserver: Automatically detects and enhances new elements (like LazySections).
 */
export const useGlobalReveal = (containerRef, path, isAnimating, isPendingReveal, appReady = true) => {

    useGSAP(() => {
        if (!containerRef.current) return;

        // --- HELPER: Prepare Elements (Hide them) ---
        const prepareElements = (scope) => {
            const ctx = gsap.context(() => {
                const fadeUpElements = gsap.utils.toArray("[data-ys-reveal='fade-up']:not(.ys-ready)", scope);
                const scaleXElements = gsap.utils.toArray("[data-ys-reveal='scale-x']:not(.ys-ready)", scope);
                const fadeElements = gsap.utils.toArray("[data-ys-reveal='fade']:not(.ys-ready)", scope);
                const imageElements = gsap.utils.toArray("[data-ys-reveal='image']:not(.ys-ready)", scope);
                const textElements = gsap.utils.toArray("[data-ys-reveal='text']:not(.ys-ready)", scope);
                const curtainElements = gsap.utils.toArray("[data-ys-reveal='curtain']:not(.ys-ready)", scope);
                const heroZoomElements = gsap.utils.toArray("[data-ys-reveal='hero-zoom']:not(.ys-ready)", scope);

                if (fadeUpElements.length > 0) {
                    gsap.set(fadeUpElements, { opacity: 0, y: 30 });
                    fadeUpElements.forEach(el => el.classList.add('ys-ready'));
                }
                if (scaleXElements.length > 0) {
                    gsap.set(scaleXElements, { scaleX: 0, transformOrigin: "left" });
                    scaleXElements.forEach(el => el.classList.add('ys-ready'));
                }
                if (fadeElements.length > 0) {
                    gsap.set(fadeElements, { opacity: 0 });
                    fadeElements.forEach(el => el.classList.add('ys-ready'));
                }
                if (imageElements.length > 0) {
                    gsap.set(imageElements, { clipPath: "inset(100% 0% 0% 0%)" });
                    imageElements.forEach(el => el.classList.add('ys-ready'));
                }
                if (curtainElements.length > 0) {
                    gsap.set(curtainElements, { opacity: 1 });
                    curtainElements.forEach(el => el.classList.add('ys-ready'));
                }
                if (heroZoomElements.length > 0) {
                    gsap.set(heroZoomElements, { scale: 1.15 });
                    heroZoomElements.forEach(el => el.classList.add('ys-ready'));
                }

                textElements.forEach((el) => {
                    const split = new SplitText(el, { type: "lines", mask: "lines" });
                    // Store split instance on element for later reversion if needed
                    el._gsapSplit = split;
                    gsap.set(split.lines, { yPercent: 100, opacity: 0 });
                    el.classList.add('ys-ready');
                });
            }, scope);
            return ctx;
        };

        // --- HELPER: Animate Elements (Reveal them) ---
        const animateElements = (scope) => {
            const ctx = gsap.context(() => {
                // Select only 'ready' elements that haven't been 'revealed'
                // We mark them as 'ys-revealed' after creating triggers to avoid duplicates
                const targets = gsap.utils.toArray("[data-ys-reveal].ys-ready:not(.ys-revealed)", scope);

                if (targets.length === 0) return;

                ScrollTrigger.refresh();

                targets.forEach(el => {
                    el.classList.add('ys-revealed');
                    const type = el.getAttribute('data-ys-reveal');
                    const delay = parseFloat(el.getAttribute('data-ys-delay')) || 0;

                    if (type === 'text') {
                        if (el._gsapSplit) {
                            gsap.to(el._gsapSplit.lines, {
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
                    } else if (type === 'image') {
                        const img = el.querySelector('img') || el.querySelector('.ys-simple-image');
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
                    } else if (type === 'fade-up') {
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
                    } else if (type === 'scale-x') {
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
                    } else if (type === 'fade') {
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
                    } else if (type === 'curtain') {
                        gsap.to(el, {
                            opacity: 0,
                            duration: 2,
                            ease: "power2.inOut",
                            delay: delay
                        });
                    } else if (type === 'hero-zoom') {
                        gsap.to(el, {
                            scale: 1,
                            duration: 3,
                            ease: "power3.out",
                            delay: delay
                        });
                    }
                });
            }, scope);
            return ctx;
        };

        // 1. Initial Prep (Prepare immediately to prevent FOUC)
        prepareElements(containerRef.current);

        // 2. Observer for Lazy Loaded Content
        const observer = new MutationObserver((mutations) => {
            let hasNewContent = false;
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            // Check if node itself or children need reveal
                            if (node.matches("[data-ys-reveal]") || node.querySelector("[data-ys-reveal]")) {
                                hasNewContent = true;
                            }
                        }
                    });
                }
            });

            if (hasNewContent) {
                // Prepare new elements immediately
                prepareElements(containerRef.current);

                // If app is already stable (not navigating), animate them immediately
                // This handles LazySection appearing during scroll
                if (!isPendingReveal && appReady) {
                    animateElements(containerRef.current);
                }
            }
        });

        observer.observe(containerRef.current, { childList: true, subtree: true });

        // 3. Activation Gate
        // When page transition finishes and app is ready, trigger all pending animations
        if (!isPendingReveal && appReady) {
            animateElements(containerRef.current);
        }

        return () => {
            observer.disconnect();
            // Cleanup splits and remove classes
            const elementsToClean = gsap.utils.toArray("[data-ys-reveal].ys-ready", containerRef.current);
            elementsToClean.forEach(el => {
                if (el._gsapSplit) {
                    el._gsapSplit.revert();
                    delete el._gsapSplit; // Clean up the stored instance
                }
                el.classList.remove('ys-ready', 'ys-revealed');
            });
            // Kill all ScrollTriggers associated with this scope
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger && containerRef.current.contains(st.trigger)) {
                    st.kill();
                }
            });
        };

    }, { scope: containerRef, dependencies: [path, isAnimating, isPendingReveal, appReady] });
};
