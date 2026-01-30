import { useRef, useEffect, useState, memo, lazy, Suspense } from 'react';
import { gsap, useGSAP, SplitText, ScrollTrigger } from '../gsap';
import { useTransition } from '../context/TransitionContext';
import TransitionLink from '../components/TransitionLink/TransitionLink';
import LazySection from '../components/LazySection/LazySection';
import InstagramFeed from '../components/InstagramFeed/InstagramFeed';
import { useMagnetic } from '../hooks/useMagnetic';

// Lazy load non-critical sections
const Brands = lazy(() => import('../components/Brands/Brands'));
const Portfolio = lazy(() => import('../components/Portfolio/Portfolio'));
const CTA = lazy(() => import('../components/CTA/CTA'));
import SEO from '../components/SEO/SEO';

/**
 * HOME PAGE
 * Features a seamless looping video background with a cinematic entrance.
 */
const Home = ({ appReady = true, isSoundOn }) => {
    const containerRef = useRef(null);
    const videoPrimaryRef = useRef(null);
    const videoSecondaryRef = useRef(null);
    const swooshRef = useRef(null);
    const [videoReady, setVideoReady] = useState(false);
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
            gsap.to(audio, { volume: 0.6, duration: 0.5 });
        } else {
            gsap.to(audio, { volume: 0, duration: 0.5 });
        }
    }, [isSoundOn]);

    const isSoundOnRef = useRef(isSoundOn);
    useEffect(() => { isSoundOnRef.current = isSoundOn; }, [isSoundOn]);

    const triggerSwooshSafe = () => {
        const audio = swooshRef.current;
        if (!audio) return;

        audio.currentTime = 0;
        audio.play().catch(() => { });

        const targetVol = isSoundOnRef.current ? 0.6 : 0;
        gsap.fromTo(audio, { volume: 0 }, { volume: targetVol, duration: 0.3 });
    };

    const safePlay = async (video) => {
        if (!video) return;
        try {
            if (video.readyState < 2) video.load();
            await video.play();
        } catch (err) {
            console.warn("Video play blocked or failed:", err);
            setTimeout(() => {
                if (video) video.play().catch(() => { });
            }, 500);
        }
    };

    // --- 1. SEAMLESS DUAL-VIDEO CROSSFADE ---
    useEffect(() => {
        if (!appReady) return;
        const v1 = videoPrimaryRef.current;
        const v2 = videoSecondaryRef.current;
        if (!v1 || !v2) return;

        v1.load();
        v2.load();

        let activeVideo = v1;
        let inactiveVideo = v2;
        let isFading = false;

        const checkCrossfade = () => {
            if (isFading || !activeVideo.duration || isNaN(activeVideo.duration)) return;

            const fadePoint = activeVideo.duration - 0.6;
            if (activeVideo.currentTime >= fadePoint) {
                isFading = true;
                inactiveVideo.currentTime = 0;
                inactiveVideo.play().catch(() => { });

                // Loop Swoosh with Video (after 1s)
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
    }, [appReady]);

    useGSAP(() => {
        if (!appReady || isPendingReveal) return;

        if (hasIntroPlayed) {
            if (videoReady) {
                gsap.to(".ys-hero__cover", { opacity: 0, duration: 0.5, ease: "power2.inOut" });
            }

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
            safePlay(videoPrimaryRef.current);
        } else {
            const tl = gsap.timeline({
                onComplete: () => setHasIntroPlayed(true)
            });

            gsap.set(".ys-hero__cover", { opacity: 1 });
            gsap.set(".ys-hero__bg", { scale: 1.1 });
            gsap.set(".ys-hero__title", { y: 60, opacity: 0 });
            gsap.set(".ys-hero__name", { y: 20, opacity: 0 });
            gsap.set(".ys-hero__slogan-title", { opacity: 0, y: 15 });
            gsap.set(".ys-hero__slogan-sub", { opacity: 0 });
            gsap.set(".ys-hero__cta", { opacity: 0, y: 10 });
            gsap.set(".ys-hero__scroll-indicator", { opacity: 0 });

            setTimeout(triggerSwooshSafe, 1000);

            tl.to(".ys-hero__cover", {
                opacity: 0,
                duration: 1.2,
                ease: "power2.inOut",
                delay: 0.2
            })
                .call(() => {
                    safePlay(videoPrimaryRef.current);
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

        gsap.fromTo(".ys-hero__scroll-pulse",
            { y: "-100%" },
            {
                y: "100%",
                duration: 1.5,
                repeat: -1,
                ease: "power1.inOut"
            }
        );

    }, { scope: containerRef, dependencies: [appReady, isPendingReveal, videoReady] });

    return (
        <main ref={containerRef} className="ys-home-v2">
            <SEO title="Home" />
            <section className={`ys-hero ${appReady ? 'is-loaded' : ''}`}>
                <div className="ys-hero__bg">
                    <video
                        ref={videoPrimaryRef}
                        src={`${import.meta.env.BASE_URL}assets/videos/yasser-animated.mp4`}
                        className="ys-hero__video"
                        muted
                        playsInline
                        preload="auto"
                        onCanPlay={() => setVideoReady(true)}
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

            <InstagramFeed />

            <LazySection height="300px">
                <Brands />
            </LazySection>

            <div id="portfolio">
                <LazySection height="800px">
                    <Portfolio />
                </LazySection>
            </div>

            <LazySection height="600px">
                <CTA />
            </LazySection>
        </main>
    );
};

export default memo(Home);
