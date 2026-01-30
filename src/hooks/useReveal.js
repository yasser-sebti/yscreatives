import { useEffect, useRef } from 'react';
import { useGSAP, gsap, ScrollTrigger, SplitText } from '../gsap';

/**
 * Global Reveal System v5 - UI/UX Pro Max
 * 
 * Features:
 * 1. Mask-Only Reveals: Zero opacity fades. All reveals use geometric clip-paths.
 * 2. Precision Viewport: Strict intersection triggers (top 85%).
 * 3. Max Performance: Off-screen rendering suppression via visibility toggling.
 * 4. Human Easing: Custom tuned bezier curves for cinematic motion.
 * 5. Robust State Management: Decoupled Setup (Path) vs Trigger (State) to prevent double-reveals.
 */
export const useGlobalReveal = (containerRef, path, isAnimating, isPendingReveal, appReady = true) => {

    // Refs to access latest state inside frozen closures (Observer/GSAP)
    const stateRef = useRef({ isPendingReveal, appReady });
    const animateTriggerRef = useRef(null);

    // Update refs whenever state changes
    useEffect(() => {
        stateRef.current = { isPendingReveal, appReady };
    }, [isPendingReveal, appReady]);

    // 1. SETUP & OBSERVER LOOP (Re-runs only on PATH change)
    useGSAP(() => {
        if (!containerRef.current) return;

        // --- HELPER: Prepare Elements ---
        const prepareElements = (scope) => {
            const ctx = gsap.context(() => {
                // Selectors
                const maskRevealElements = gsap.utils.toArray("[data-ys-reveal='fade-up']:not(.ys-ready), [data-ys-reveal='fade']:not(.ys-ready)", scope);
                const scaleXElements = gsap.utils.toArray("[data-ys-reveal='scale-x']:not(.ys-ready)", scope);
                const imageElements = gsap.utils.toArray("[data-ys-reveal='image']:not(.ys-ready)", scope);
                const textElements = gsap.utils.toArray("[data-ys-reveal='text']:not(.ys-ready)", scope);

                // 1. General Mask Reveal
                if (maskRevealElements.length > 0) {
                    gsap.set(maskRevealElements, {
                        clipPath: "inset(-20% -20% 100% -20%)",
                        y: 30,
                        opacity: 1,
                        visibility: "hidden"
                    });
                    maskRevealElements.forEach(el => el.classList.add('ys-ready'));
                }

                // 2. Scale X Reveal
                if (scaleXElements.length > 0) {
                    gsap.set(scaleXElements, {
                        clipPath: "inset(-20% 100% -20% -20%)",
                        opacity: 1,
                        visibility: "hidden"
                    });
                    scaleXElements.forEach(el => el.classList.add('ys-ready'));
                }

                // 3. Image Reveal
                if (imageElements.length > 0) {
                    gsap.set(imageElements, { clipPath: "inset(100% 0% 0% 0%)", opacity: 1, visibility: "hidden" });
                    imageElements.forEach(el => el.classList.add('ys-ready'));
                }

                // 4. Text Reveal
                textElements.forEach((el) => {
                    const outerSplit = new SplitText(el, { type: "lines", linesClass: "line-outer" });
                    gsap.set(outerSplit.lines, { padding: "0.15em 0", margin: "-0.15em 0", overflow: "hidden" });

                    const innerSplit = new SplitText(outerSplit.lines, { type: "lines", linesClass: "line-inner" });

                    el._gsapOuterSplit = outerSplit;
                    el._gsapSplit = innerSplit;

                    gsap.set(innerSplit.lines, { yPercent: 120, opacity: 1 });
                    gsap.set(el, { opacity: 1, visibility: "hidden" });
                    el.classList.add('ys-ready');
                });
            }, scope);
            return ctx;
        };

        // --- HELPER: Animate Elements ---
        const animateElements = (scope) => {
            const ctx = gsap.context(() => {
                const targets = gsap.utils.toArray("[data-ys-reveal].ys-ready:not(.ys-revealed)", scope);
                if (targets.length === 0) return;

                ScrollTrigger.refresh();

                targets.forEach(el => {
                    const type = el.getAttribute('data-ys-reveal');
                    const delay = parseFloat(el.getAttribute('data-ys-delay')) || 0;

                    const performanceConfig = {
                        onEnter: () => { el.style.visibility = 'visible'; },
                        onLeave: () => { el.style.visibility = 'hidden'; },
                        onEnterBack: () => { el.style.visibility = 'visible'; }
                    };

                    el.classList.add('ys-revealed');

                    if (type === 'text') {
                        if (el._gsapSplit) {
                            gsap.to(el._gsapSplit.lines, {
                                yPercent: 0,
                                duration: 1.2,
                                stagger: 0.1,
                                ease: "power4.out",
                                scrollTrigger: {
                                    trigger: el,
                                    start: "top 90%",
                                    toggleActions: "play none none reverse", // Better hygiene
                                    ...performanceConfig
                                },
                                delay: delay,
                                overwrite: 'auto'
                            });
                        }
                    } else if (type === 'image') {
                        const img = el.querySelector('img') || el.querySelector('.ys-simple-image');
                        const tl = gsap.timeline({
                            scrollTrigger: {
                                trigger: el,
                                start: "top 85%", // Slightly relaxed
                                ...performanceConfig
                            },
                            onComplete: () => {
                                // Optimized: Removed offsetHeight read to prevent layout thrashing
                                // Use CSS contain-intrinsic-size if needed via class instead
                                el.style.contentVisibility = 'visible';
                                el.style.willChange = 'auto'; // Release GPU memory
                                // removed ScrollTrigger.refresh() - expensive and rarely needed here
                            }
                        });

                        // Set hint before animation
                        el.style.willChange = 'clip-path, transform';

                        tl.to(el, {
                            clipPath: "inset(0% 0% 0% 0%)",
                            duration: 1.4,
                            ease: "expo.inOut",
                            delay: delay,
                            overwrite: 'auto'
                        });

                        if (img) {
                            // Independent transform, no layout impact
                            tl.fromTo(img,
                                { yPercent: 15, scale: 1.1 },
                                { yPercent: 0, scale: 1, duration: 1.6, ease: "power2.out" },
                                "<"
                            );
                        }
                    } else if (type === 'fade-up' || type === 'fade') {
                        gsap.to(el, {
                            clipPath: "inset(-20% -20% -20% -20%)",
                            y: 0,
                            duration: 1.2,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: el,
                                start: "top 92%",
                                ...performanceConfig
                            },
                            delay: delay,
                            overwrite: 'auto',
                            onComplete: () => {
                                gsap.set(el, { clearProps: "clipPath" });
                                el.style.visibility = 'visible';
                            }
                        });
                    } else if (type === 'scale-x') {
                        gsap.to(el, {
                            clipPath: "inset(-20% -20% -20% -20%)",
                            duration: 1.2,
                            ease: "expo.out",
                            scrollTrigger: {
                                trigger: el,
                                start: "top 92%",
                                ...performanceConfig
                            },
                            delay: delay,
                            overwrite: 'auto',
                            onComplete: () => {
                                gsap.set(el, { clearProps: "clipPath" });
                                el.style.visibility = 'visible';
                            }
                        });
                    }
                });
            }, scope);
            return ctx;
        };

        // --- HELPER: Expose Animate Trigger safely ---
        // This function will be called by useEffect
        animateTriggerRef.current = () => {
            animateElements(containerRef.current);
        };

        // --- HELPER: Sanitize Elements (Full Reset) ---
        const sanitizeElements = (scope) => {
            const elementsToClean = gsap.utils.toArray("[data-ys-reveal]", scope);
            elementsToClean.forEach(el => {
                gsap.killTweensOf(el);
                if (el._gsapSplit) {
                    gsap.killTweensOf(el._gsapSplit.lines);
                    el._gsapSplit.revert();
                    delete el._gsapSplit;
                }
                if (el._gsapOuterSplit) {
                    el._gsapOuterSplit.revert();
                    delete el._gsapOuterSplit;
                }
                const img = el.querySelector('img') || el.querySelector('.ys-simple-image');
                if (img) gsap.killTweensOf(img);
                el.classList.remove('ys-ready', 'ys-revealed');
                gsap.set(el, { clearProps: "all" });
            });
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger && scope.contains(st.trigger)) {
                    st.kill();
                }
            });
        };

        // 1. Initial Sanitize & Prepare
        sanitizeElements(containerRef.current);
        prepareElements(containerRef.current);

        // 2. Observer for Dynamic Content
        const observer = new MutationObserver((mutations) => {
            let hasNewContent = false;
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.matches("[data-ys-reveal]") || node.querySelector("[data-ys-reveal]")) {
                                hasNewContent = true;
                            }
                        }
                    });
                }
            });

            if (hasNewContent) {
                // Ignore observer if we are in the middle of a reset/nav
                prepareElements(containerRef.current);

                // Only auto-animate if app is strictly ready and idle
                const { isPendingReveal, appReady } = stateRef.current;
                if (!isPendingReveal && appReady) {
                    setTimeout(() => animateElements(containerRef.current), 150);
                }
            }
        });

        observer.observe(containerRef.current, { childList: true, subtree: true });

        // Cleanup on PATH change (Context Revert handles GSAP, but we need to disconnect observer)
        return () => {
            observer.disconnect();
            sanitizeElements(containerRef.current);
        };

    }, { scope: containerRef, dependencies: [path] }); // CRITICAL: Only reset when path changes

    // 2. TRIGGER LOOP (Watches State)
    useEffect(() => {
        if (!isPendingReveal && appReady && animateTriggerRef.current) {
            // UI UX Pro Max: Snappy timing. 
            // Trigger reveals shortly after the transition shutters start opening for a seamless flow.
            const timer = setTimeout(() => {
                animateTriggerRef.current();
                ScrollTrigger.refresh();
            }, 350); // Reduced from 1000ms to match the About page flow
            return () => clearTimeout(timer);
        }
    }, [isPendingReveal, appReady, path]); // Path included to ensure it runs on new page mount
};
