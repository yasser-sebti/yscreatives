import { useRef, memo } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '../../gsap';

const LOGOS = [
    'Eli_Network.svg', 'Pandaify.svg', 'Order.svg', 'Tech Trendy.svg', 'Oldy.svg',
    'Turbo Reprog.svg', 'Crochoco.svg', 'Aqua Health.svg', 'Farmazone.svg', 'Iliya.svg',
    'Mercy.svg', 'Sinjar.svg', 'Tawazun.svg', 'Algerian Salon.svg', 'Yahia Boussadi.svg'
];

const Brands = () => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);

    useGSAP(() => {
        const track = containerRef.current.querySelector(".ys-brands__track");
        const slider = containerRef.current.querySelector(".ys-brands__slider");

        if (!track || !slider) return;

        // Calculate width of one slider for precise duration
        const totalWidth = slider.scrollWidth;

        // Move at a rate of 80px per second for a stately, premium feel
        const speed = 80;
        const duration = totalWidth / speed;

        // Create seamless infinite animation by animating the track
        // We move it exactly half its width (which is one slider) then loop
        const marquee = gsap.to(track, {
            xPercent: -50,
            duration: duration,
            ease: "none",
            repeat: -1,
            force3D: true
        });

        // Add hover pause effect
        const marqueeContainer = trackRef.current;
        if (marqueeContainer) {
            marqueeContainer.addEventListener("mouseenter", () => {
                gsap.to(marquee, {
                    timeScale: 0.2, // Slow down to 20% speed on hover for readability
                    duration: 0.8,
                    ease: "power2.out"
                });
            });

            marqueeContainer.addEventListener("mouseleave", () => {
                gsap.to(marquee, {
                    timeScale: 1, // Resume normal speed
                    duration: 1.2,
                    ease: "power3.out"
                });
            });
        }

        // Pause when off-screen for performance
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            onToggle: self => self.isActive ? marquee.play() : marquee.pause()
        });
    }, { scope: containerRef });

    return (
        <section className="ys-brands" ref={containerRef}>
            <div className="ys-brands__container">
                <header className="ys-brands__header">
                    <h2 className="ys-brands__title" data-ys-reveal="text">Brands We Build</h2>
                </header>

                <div className="ys-brands__marquee" ref={trackRef}>
                    <div className="ys-brands__vignette"></div>
                    <div className="ys-brands__track">
                        {/* Double the logos for a seamless loop */}
                        <div className="ys-brands__slider">
                            {LOGOS.map((logo, i) => (
                                <div key={i} className="ys-brands__item">
                                    <img
                                        src={`${import.meta.env.BASE_URL}assets/logos/${logo}`}
                                        alt={logo.split('.')[0]}
                                        className="ys-brands__logo"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="ys-brands__slider">
                            {LOGOS.map((logo, i) => (
                                <div key={`dup-${i}`} className="ys-brands__item">
                                    <img
                                        src={`${import.meta.env.BASE_URL}assets/logos/${logo}`}
                                        alt={logo.split('.')[0]}
                                        className="ys-brands__logo"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default memo(Brands);
