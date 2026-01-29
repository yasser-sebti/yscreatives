import { useGSAP, gsap, ScrollTrigger, SplitText } from '../gsap';

/**
 * Global Reveal System v4 - UI/UX Pro Max
 * 
 * Features:
 * 1. Mask-Only Reveals: Zero opacity fades. All reveals use geometric clip-paths.
 * 2. Precision Viewport: Strict intersection triggers (top 85%).
 * 3. Max Performance: Off-screen rendering suppression via visibility toggling.
 * 4. Human Easing: Custom tuned bezier curves for cinematic motion.
 */
export const useGlobalReveal = (containerRef, path, isAnimating, isPendingReveal, appReady = true) => {

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
                        clipPath: "inset(0% 0% 100% 0%)",
                        y: 30,
                        opacity: 1
                    });
                    maskRevealElements.forEach(el => el.classList.add('ys-ready'));
                }

                // 2. Scale X Reveal
                if (scaleXElements.length > 0) {
                    gsap.set(scaleXElements, {
                        clipPath: "inset(0% 100% 0% 0%)",
                        opacity: 1
                    });
                    scaleXElements.forEach(el => el.classList.add('ys-ready'));
                }

                // 3. Image Reveal
                if (imageElements.length > 0) {
                    gsap.set(imageElements, { clipPath: "inset(100% 0% 0% 0%)", opacity: 1 });
                    imageElements.forEach(el => el.classList.add('ys-ready'));
                }

                // 4. Text Reveal (UI UX Pro Max Nested Masking)
                textElements.forEach((el) => {
                    // First split creates the "mask" containers (overflow: hidden)
                    const outerSplit = new SplitText(el, { type: "lines", linesClass: "line-outer" });
                    // Second split creates the actual animatable content
                    const innerSplit = new SplitText(outerSplit.lines, { type: "lines", linesClass: "line-inner" });

                    el._gsapOuterSplit = outerSplit;
                    el._gsapSplit = innerSplit; // Store for shorthand access

                    gsap.set(innerSplit.lines, { yPercent: 120, opacity: 1 });
                    gsap.set(el, { opacity: 1 });
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

                // Crucial refresh before mounting triggers
                ScrollTrigger.refresh();

                targets.forEach(el => {
                    const type = el.getAttribute('data-ys-reveal');
                    const delay = parseFloat(el.getAttribute('data-ys-delay')) || 0;

                    const performanceConfig = {
                        onLeave: () => { el.style.visibility = 'hidden'; },
                        onEnterBack: () => { el.style.visibility = 'visible'; }
                    };

                    // We add ys-revealed immediately to prevent double-triggering
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
                                    ...performanceConfig
                                },
                                delay: delay,
                                overwrite: 'auto',
                                onComplete: () => {
                                    // Optional: Clear transforms if needed, but for text usually fine.
                                }
                            });
                        }
                    } else if (type === 'image') {
                        const img = el.querySelector('img') || el.querySelector('.ys-simple-image');
                        const tl = gsap.timeline({
                            scrollTrigger: {
                                trigger: el,
                                start: "top 88%",
                                ...performanceConfig
                            },
                            onComplete: () => {
                                el.style.contentVisibility = 'auto';
                                el.style.containIntrinsicSize = `auto ${el.offsetHeight}px`;
                                ScrollTrigger.refresh();
                            }
                        });

                        tl.to(el, {
                            clipPath: "inset(0% 0% 0% 0%)",
                            duration: 1.4,
                            ease: "expo.inOut",
                            delay: delay,
                            overwrite: 'auto'
                        });

                        if (img) {
                            tl.fromTo(img,
                                { yPercent: 15, scale: 1.1 },
                                { yPercent: 0, scale: 1, duration: 1.6, ease: "power2.out" },
                                "<"
                            );
                        }
                    } else if (type === 'fade-up' || type === 'fade') {
                        gsap.to(el, {
                            clipPath: "inset(0% 0% 0% 0%)",
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
                                // CRITICAL: Remove clip-path so magnetic elements aren't cropped
                                el.style.clipPath = '';
                                el.style.visibility = 'visible';
                            }
                        });
                    } else if (type === 'scale-x') {
                        gsap.to(el, {
                            clipPath: "inset(0% 0% 0% 0%)",
                            duration: 1.2,
                            ease: "expo.out",
                            scrollTrigger: {
                                trigger: el,
                                start: "top 92%",
                                ...performanceConfig
                            },
                            delay: delay,
                            overwrite: 'auto'
                        });
                    }
                });
            }, scope);
            return ctx;
        };


        // 1. Initial Prep
        prepareElements(containerRef.current);

        // 2. Observer
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
                prepareElements(containerRef.current);
                if (!isPendingReveal && appReady) {
                    setTimeout(() => animateElements(containerRef.current), 150);
                }
            }
        });

        observer.observe(containerRef.current, { childList: true, subtree: true });

        // 3. Activation Gate with SNAPPY Navigation Timing
        if (!isPendingReveal && appReady) {
            // Wait for transition to clear the view but don't stall
            const timer = setTimeout(() => {
                animateElements(containerRef.current);
                ScrollTrigger.refresh();
            }, 350);

            return () => {
                clearTimeout(timer);
                observer.disconnect();
            };
        }

        return () => {
            observer.disconnect();
            const elementsToClean = gsap.utils.toArray("[data-ys-reveal].ys-ready", containerRef.current);
            elementsToClean.forEach(el => {
                if (el._gsapSplit) {
                    el._gsapSplit.revert();
                    delete el._gsapSplit;
                }
                if (el._gsapOuterSplit) {
                    el._gsapOuterSplit.revert();
                    delete el._gsapOuterSplit;
                }
                el.classList.remove('ys-ready', 'ys-revealed');
                el.style.visibility = '';
                el.style.contentVisibility = '';
                el.style.opacity = '';
            });
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger && containerRef.current.contains(st.trigger)) {
                    st.kill();
                }
            });
        };

    }, { scope: containerRef, dependencies: [path, isAnimating, isPendingReveal, appReady] });
};
