import { useRef, useEffect, useState, memo } from 'react';
import { gsap, useGSAP, SplitText, ScrollTrigger } from '../gsap';
import { useTransition } from '../context/TransitionContext';
import TransitionLink from '../components/TransitionLink/TransitionLink';
import Brands from '../components/Brands/Brands';
import Portfolio from '../components/Portfolio/Portfolio';
import CTA from '../components/CTA/CTA';
import SimpleImage from '../components/Image/SimpleImage';

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

        // Intersection Observer to trigger play only when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(err => console.log("Video play blocked until interaction:", err));
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.1 });

        observer.observe(video);

        video.addEventListener('playing', handlePlaying);
        return () => {
            observer.disconnect();
            video.removeEventListener('playing', handlePlaying);
        };
    }, []);

    // 1. CINEMATIC INTRO: Fade in the entire Hero from Black
    const playIntro = () => {
        const tl = gsap.timeline();

        // Ensure we start from absolute black
        gsap.set(".ys-hero__cover", { opacity: 1 });
        gsap.set(".ys-hero__video", { opacity: 1 }); // Ensure video is also visible

        tl.to(".ys-hero__cover", {
            opacity: 0,
            duration: 1.8,
            ease: "power2.inOut",
            delay: 0.2 // Small buffer for GPU to stabilize
        }).fromTo(".ys-hero__bg",
            { scale: 1.15 },
            { scale: 1, duration: 2.5, ease: "power3.out" },
            "<"
        );
    };

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

        // 6. MAGNETIC INTERACTION: Applied to buttons
        const magneticElements = gsap.utils.toArray(".ys-magnetic");
        magneticElements.forEach((el) => {
            const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
            const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

            const onMove = (e) => {
                const { clientX, clientY } = e;
                const { height, width, left, top } = el.getBoundingClientRect();
                const x = clientX - (left + width / 2);
                const y = clientY - (top + height / 2);
                xTo(x * 0.4);
                yTo(y * 0.4);
            };

            const onLeave = () => {
                xTo(0);
                yTo(0);
            };

            el.addEventListener("mousemove", onMove);
            el.addEventListener("mouseleave", onLeave);
        });

    }, { scope: containerRef, dependencies: [isAnimating, appReady] });

    return (
        <main ref={containerRef} className="ys-home-v2">
            {/* --- HERO SECTION --- */}
            <section className={`ys-hero ${appReady && hasVideoPlayed ? 'is-loaded' : ''}`}>
                <div className="ys-hero__bg">
                    <video
                        ref={videoRef}
                        src="assets/videos/yasser-animated.mp4"
                        poster="assets/images/hero-poster.webp"
                        className="ys-hero__video"
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
                    {[
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
                    ].map((phase, i) => (
                        <article key={i} className="ys-methodology__phase">
                            <div className="ys-methodology__image-container ys-image-mask" data-ys-reveal="image">
                                <SimpleImage
                                    src={`assets/images/${phase.img}`}
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

            <Brands />
            <Portfolio />
            <CTA />
        </main>
    );
};

export default memo(Home);
