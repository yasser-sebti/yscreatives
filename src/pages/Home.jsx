import { useRef, useEffect, useState, memo, lazy, Suspense } from 'react';
import { gsap, useGSAP, SplitText, ScrollTrigger } from '../gsap';
import { useTransition } from '../context/TransitionContext';
import TransitionLink from '../components/TransitionLink/TransitionLink';
import SimpleImage from '../components/Image/SimpleImage';
import LazySection from '../components/LazySection/LazySection';
import { useMagnetic } from '../hooks/useMagnetic';

// Lazy load non-critical sections
const Brands = lazy(() => import('../components/Brands/Brands'));
const Portfolio = lazy(() => import('../components/Portfolio/Portfolio'));
const CTA = lazy(() => import('../components/CTA/CTA'));
import SEO from '../components/SEO/SEO';

const methodologyPhases = [
    {
        step: "Phase 01",
        name: "Investigation",
        desc: "Deep diving into the soul of your brand to uncover the core essence and strategic direction through meticulous research and intentional vision.",
        img: "Image1.webp"
    },
    {
        step: "Phase 02",
        name: "Design",
        desc: "Manually crafting every pixel and interaction to ensure a unique, human-centric visual language that creates true emotional resonance.",
        img: "Image2.webp"
    },
    {
        step: "Phase 03",
        name: "Delivery",
        desc: "Finalizing and launching a high-performance digital presence that elevates your brand and secures its position in the modern landscape.",
        img: "Image3.webp"
    }
];

/**
 * HOME PAGE
 * Features a seamless looping video background with a cinematic entrance.
 */
const Home = ({ appReady = true, isSoundOn }) => {
    const containerRef = useRef(null);
    const videoPrimaryRef = useRef(null);
    const videoSecondaryRef = useRef(null);
    const swooshRef = useRef(null);
    const { isAnimating, isPendingReveal, hasIntroPlayed, setHasIntroPlayed } = useTransition();

    useMagnetic(containerRef, ".ys-magnetic", 0.4);

    // --- AUDIO: Initialization & Cleanup ---
    useEffect(() => {
        const getAssetPath = (path) => {
            let base = import.meta.env.BASE_URL || '/';
            if (base === './' || base === '.') base = '/';
            const cleanBase = base.endsWith('/') ? base : `${base}/`;
            const cleanPath = path.startsWith('/') ? path.slice(1) : path;
            return `${cleanBase}${cleanPath}`;
        };

        const audio = new Audio(getAssetPath('assets/sounds/swoosh-audio.MP3'));
        audio.volume = 0;
        swooshRef.current = audio;

        return () => {
            // Fade out on unmount/navigate
            if (audio) {
                gsap.to(audio, {
                    volume: 0,
                    duration: 0.5,
                    onComplete: () => audio.pause()
                });
            }
        };
    }, []);

    // --- AUDIO: Handle Global Toggle ---
    useEffect(() => {
        const audio = swooshRef.current;
        if (!audio) return;

        if (isSoundOn) {
            // Fade IN if toggled ON (useful if mid-playback)
            gsap.to(audio, { volume: 0.6, duration: 0.5 });
        } else {
            // Fade OUT if toggled OFF
            gsap.to(audio, { volume: 0, duration: 0.5 });
        }
    }, [isSoundOn]);

    const playSwoosh = () => {
        const audio = swooshRef.current;
        if (!audio || !isSoundOn) return;

        audio.currentTime = 0;
        audio.play().catch(() => { }); // Catch autoplay blocks

        // Quick fade-in for smoothness vs harsh cut
        gsap.fromTo(audio, { volume: 0 }, { volume: 0.6, duration: 0.3 }); // 0.6 is a good relative mix
    };

    // --- 1. SEAMLESS DUAL-VIDEO CROSSFADE (UI UX Pro Max) ---
    useEffect(() => {
        if (!appReady) return;
        const v1 = videoPrimaryRef.current;
        const v2 = videoSecondaryRef.current;
        if (!v1 || !v2) return;

        let activeVideo = v1;
        let inactiveVideo = v2;
        let isFading = false;

        const checkCrossfade = () => {
            if (isFading || !activeVideo.duration) return;

            const fadePoint = activeVideo.duration - 0.6;
            if (activeVideo.currentTime >= fadePoint) {
                isFading = true;
                inactiveVideo.currentTime = 0;
                inactiveVideo.play();

                // TRIGGER: Play swoosh 1s after loop starts
                // Use safe trigger that reads latest ref
                setTimeout(triggerSwooshSafe, 1000);

                gsap.to(activeVideo, { opacity: 0, duration: 0.6, ease: "none" });
                gsap.to(inactiveVideo, {
                    opacity: 1,
                    duration: 0.6,
                    ease: "none",
                    onComplete: () => {
                        activeVideo.pause();
                        [activeVideo, inactiveVideo] = [inactiveVideo, activeVideo];
                        isFading = false;
                    }
                });
            }
        };

        gsap.ticker.add(checkCrossfade);
        return () => gsap.ticker.remove(checkCrossfade);
    }, [appReady]); // Re-bind if sound setting changes to ensure latest state in closure? No, playSwoosh uses ref/prop, but closure might be stale.
    // Actually playSwoosh is defined in render scope. useEffect closure captures it.
    // Best to use a ref for isSoundOn or add it to dependency. Adding isSoundOn to dependency might reset video logic which isn't ideal.
    // Better: Helper function inside useEffect or Ref for isSoundOn.

    // UI UX Pro Max Optimization: Use Ref for isSoundOn to avoid re-binding video logic
    const isSoundOnRef = useRef(isSoundOn);
    useEffect(() => { isSoundOnRef.current = isSoundOn; }, [isSoundOn]);

    // Internal play function - ALWAYS plays, just modulates volume
    const triggerSwooshSafe = () => {
        const audio = swooshRef.current;
        if (!audio) return;

        audio.currentTime = 0;
        audio.play().catch(() => { });

        // Only audible if sound is currently on
        const targetVol = isSoundOnRef.current ? 0.6 : 0;
        gsap.fromTo(audio, { volume: 0 }, { volume: targetVol, duration: 0.3 });
    };

    useGSAP(() => {
        if (!appReady || isPendingReveal) return;

        // 2. MANUAL CINEMATIC INTRO (Optimized Speed - UI UX Pro Max)
        if (hasIntroPlayed) {
            // --- INSTANT STATE (Return Visit) ---
            // (We don't play sound on instant revisit unless user specifically asks for it, 
            // but 'intro started playing' implies the animation sequence. 
            // Logic: Only play if we run the animation keyframes below)
            gsap.set(".ys-hero__cover", { opacity: 0 });
            gsap.set(".ys-hero__bg", { scale: 1 });
            gsap.set([
                ".ys-hero__title",
                ".ys-hero__name",
                ".ys-hero__slogan-title",
                ".ys-hero__slogan-sub",
                ".ys-hero__cta",
                ".ys-hero__scroll-indicator"
            ], {
                y: 0,
                opacity: 1
            });
            videoPrimaryRef.current?.play();
        } else {
            // --- ANIMATION SEQUENCE (First Visit) ---
            const tl = gsap.timeline({
                onComplete: () => setHasIntroPlayed(true)
            });

            // Initial States
            gsap.set(".ys-hero__cover", { opacity: 1 });
            gsap.set(".ys-hero__bg", { scale: 1.1 });
            gsap.set(".ys-hero__title", { y: 60, opacity: 0 });
            gsap.set(".ys-hero__name", { y: 20, opacity: 0 });
            gsap.set(".ys-hero__slogan-title", { opacity: 0, y: 15 });
            gsap.set(".ys-hero__slogan-sub", { opacity: 0 });
            gsap.set(".ys-hero__cta", { opacity: 0, y: 10 });
            gsap.set(".ys-hero__scroll-indicator", { opacity: 0 });

            // TRIGGER: Initial Swoosh (1s delay relative to start)
            // Since we have a delayed start (0.2s delay on first tween), we can just schedule it.
            setTimeout(triggerSwooshSafe, 1000);

            tl.to(".ys-hero__cover", {
                opacity: 0,
                duration: 1.2,
                ease: "power2.inOut",
                delay: 0.2
            })
                .call(() => {
                    videoPrimaryRef.current?.play();
                }, null, 0.2 + (1.2 * 0.5))
                .to(".ys-hero__bg", {
                    scale: 1,
                    duration: 2,
                    ease: "power3.out"
                }, 0.2)
                .to(".ys-hero__title", {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "expo.out"
                }, "-=1.0")
                .to(".ys-hero__name", {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "expo.out"
                }, "-=1.0")
                .to(".ys-hero__slogan-title", {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.8")
                .to(".ys-hero__slogan-sub", {
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.6")
                .to(".ys-hero__cta", {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.4")
                .to(".ys-hero__scroll-indicator", {
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.2");
        }

        // 3. PARALLAX
        gsap.to(".ys-hero__bg", {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
                trigger: ".ys-hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // 4. SCROLL PULSE LOOP
        gsap.fromTo(".ys-hero__scroll-pulse",
            { y: "-100%" },
            {
                y: "100%",
                duration: 1.5,
                repeat: -1,
                ease: "power1.inOut"
            }
        );

    }, { scope: containerRef, dependencies: [appReady, isPendingReveal] });

    return (
        <main ref={containerRef} className="ys-home-v2">
            <SEO title="Home" />
            {/* --- HERO SECTION --- */}
            <section className={`ys-hero ${appReady ? 'is-loaded' : ''}`}>
                <div className="ys-hero__bg">
                    <video
                        ref={videoPrimaryRef}
                        src={`${import.meta.env.BASE_URL}assets/videos/yasser-animated.mp4`}
                        className="ys-hero__video"
                        muted
                        playsInline
                        preload="auto"
                    />
                    <video
                        ref={videoSecondaryRef}
                        src={`${import.meta.env.BASE_URL}assets/videos/yasser-animated.mp4`}
                        className="ys-hero__video"
                        muted
                        playsInline
                        preload="auto"
                        style={{ opacity: 0 }}
                    />
                    <div className="ys-hero__dark-overlay"></div>
                    <div className="ys-hero__cover"></div>
                </div>

                <div className="ys-hero__container">
                    <div className="ys-hero__main-header">
                        <h1 className="ys-hero__title">Yasser Creatives</h1>
                        <p className="ys-hero__name">By Yasser Abdelmotaleb Sebti</p>
                    </div>

                    <div className="ys-hero__slogan">
                        <h2 className="ys-hero__slogan-title">100% Human-Designed Work</h2>
                        <p className="ys-hero__slogan-sub">No AI, just pure vision.</p>
                    </div>

                    <div className="ys-hero__cta">
                        <TransitionLink to="/about" className="ys-hero__button ys-magnetic">
                            About me
                        </TransitionLink>
                    </div>
                </div>

                <div className="ys-hero__scroll-indicator">
                    <span className="ys-hero__scroll-label">Scroll</span>
                    <div className="ys-hero__scroll-track">
                        <div className="ys-hero__scroll-pulse"></div>
                    </div>
                </div>
            </section>

            {/* --- METHODOLOGY SECTION --- */}
            <section className="ys-methodology">
                <header className="ys-methodology__header">
                    <h2 className="ys-methodology__title" data-ys-reveal="text">Our Methodology</h2>
                </header>

                <div className="ys-methodology__grid">
                    {methodologyPhases.map((phase, i) => (
                        <article key={i} className="ys-methodology__phase">
                            <div className="ys-methodology__image-container ys-image-mask" data-ys-reveal="image">
                                <SimpleImage
                                    src={`${import.meta.env.BASE_URL}assets/images/${phase.img}`}
                                    alt={phase.name}
                                    loading="lazy"
                                    width={800}
                                    height={500}
                                    className="ys-methodology__image"
                                />
                            </div>
                            <div className="ys-methodology__content">
                                <span className="ys-methodology__step" data-ys-reveal="text" data-ys-delay="0.2">{phase.step}</span>
                                <h3 className="ys-methodology__name" data-ys-reveal="text" data-ys-delay="0.3">{phase.name}</h3>
                                <p className="ys-methodology__description" data-ys-reveal="text" data-ys-delay="0.4">{phase.desc}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <LazySection height="300px">
                <Brands />
            </LazySection>

            <LazySection height="800px">
                <Portfolio />
            </LazySection>

            <LazySection height="600px">
                <CTA />
            </LazySection>
        </main>
    );
};

export default memo(Home);
