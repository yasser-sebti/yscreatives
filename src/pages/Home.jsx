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
const Home = ({ appReady = true }) => {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const { isAnimating } = useTransition();

    // Video Sync state
    const [hasVideoPlayed, setHasVideoPlayed] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handlePlaying = () => setHasVideoPlayed(true);

        // We already have autoPlay on the tag, but we force it here too for reliability
        video.play().catch(err => {
            console.log("Video auto-play failed, usually waiting for user interaction:", err);
            // If it fails, we still want to show the content eventually
            setHasVideoPlayed(true);
        });

        video.addEventListener('playing', handlePlaying);
        return () => {
            video.removeEventListener('playing', handlePlaying);
        };
    }, []);

    // 1. CINEMATIC INTRO: Fade in the entire Hero from Black
    const playIntro = () => {
        const tl = gsap.timeline();

        // Ensure we start from absolute black for the background only
        gsap.set(".ys-hero__cover", { opacity: 1 });
        gsap.set(".ys-hero__video", { opacity: 1 });
        // Main header stays visible but we can still do a subtle slide up if needed, 
        // but the user wants it "not affected", so let's keep it clean.
        gsap.set(".ys-hero__main-header", { y: 20, opacity: 1 });
        gsap.set(".ys-hero__slogan", { opacity: 0 });
        gsap.set(".ys-hero__cta", { opacity: 0 });

        tl.to(".ys-hero__cover", {
            opacity: 0,
            duration: 2,
            ease: "power2.inOut",
            delay: 0.3
        })
            .to(".ys-hero__main-header", {
                y: 0,
                duration: 1.5,
                ease: "power3.out"
            }, "-=1.5")
            .to(".ys-hero__slogan", {
                opacity: 1,
                duration: 1,
                ease: "power2.out"
            }, "-=0.8")
            .to(".ys-hero__cta", {
                opacity: 1,
                duration: 1,
                ease: "power2.out"
            }, "-=0.8")
            .fromTo(".ys-hero__bg",
                { scale: 1.15 },
                { scale: 1, duration: 3, ease: "power3.out" },
                0
            );
    };

    useMagnetic(containerRef, ".ys-magnetic", 0.4);

    useGSAP(() => {
        // App Ready is only true after fonts, video (hero), and critical images are loaded
        if (!appReady) return;

        playIntro();

        // 4. PARALLAX: Video subtle movement on scroll
        gsap.to(".ys-hero__bg", {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
                trigger: ".ys-hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // 5. SCROLL INDICATOR: Looping pulse
        gsap.fromTo(".ys-hero__scroll-pulse",
            { y: "-100%" },
            { y: "100%", duration: 2, repeat: -1, ease: "power1.inOut" }
        );

    }, { scope: containerRef, dependencies: [isAnimating, appReady] });

    return (
        <main ref={containerRef} className="ys-home-v2">
            {/* --- HERO SECTION --- */}
            <section className={`ys-hero ${appReady && hasVideoPlayed ? 'is-loaded' : ''}`}>
                <div className="ys-hero__bg">
                    <video
                        ref={videoRef}
                        src={`${import.meta.env.BASE_URL}assets/videos/yasser-animated.mp4`}
                        className="ys-hero__video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                    />
                    <div className="ys-hero__dark-overlay"></div>
                    {/* Cinematic "Curtain" - Now inside BG to stay UNDER text */}
                    <div className="ys-hero__cover"></div>
                </div>

                <div className="ys-hero__container">
                    <div className="ys-hero__main-header">
                        <h1 className="ys-hero__title" data-ys-reveal="text" data-ys-delay="0.1">Yasser Creatives</h1>
                        <p className="ys-hero__name" data-ys-reveal="text" data-ys-delay="0.3">By Yasser Abdelmotaleb Sebti</p>
                    </div>

                    <div className="ys-hero__slogan">
                        <h2 className="ys-hero__slogan-title" data-ys-reveal="text" data-ys-delay="0.4">100% Human-Designed Work</h2>
                        <p className="ys-hero__slogan-sub" data-ys-reveal="text" data-ys-delay="0.5">No AI, just pure vision.</p>
                    </div>

                    <div className="ys-hero__cta" data-ys-reveal="fade-up" data-ys-delay="0.7">
                        <TransitionLink to="/about" className="ys-hero__button ys-magnetic">
                            About me
                        </TransitionLink>
                    </div>
                </div>

                <div className="ys-hero__scroll-indicator" data-ys-reveal="fade-up" data-ys-delay="0.9">
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
