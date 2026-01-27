import { useRef, memo } from 'react';
import { gsap, useGSAP, ScrollTrigger, Draggable } from '../../gsap';

const testimonialsData = [
    { name: "Alpha Programming", role: "Tech Company", img: "Alpha Programing.webp", text: "Yasser delivered exceptional results that exceeded our expectations. His attention to detail is unmatched." },
    { name: "Corochoco", role: "Brand", img: "Corochoco.webp", text: "Working with Yasser was an absolute pleasure. He understood our vision and translated it into a stunning presence." },
    { name: "Islem Bennebes", role: "Entrepreneur", img: "Islem Bennebes.webp", text: "The level of professionalism Yasser brings to every project is unmatched. Highly recommend for premium work." },
    { name: "Madjid Lounes", role: "Business Owner", img: "Madjid Lounes.webp", text: "Yasser's work speaks for itself. The website has significantly improved our online presence and engagement." },
    { name: "Pandaify", role: "SaaS Platform", img: "Pandaify.webp", text: "Incredible design work that captures our brand essence. The animations and UX are absolutely top-tier." },
    { name: "Rahim Kichene", role: "Creative Director", img: "Rahim Kichene.webp", text: "As a fellow creative, I appreciate Yasser's meticulous approach. Every pixel is intentional and purposeful." }
];

const Testimonials = () => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);

    // 2. SEAMLESS MARQUEE & INTERACTION (Draggable - UI UX Pro Max Robust)
    useGSAP(() => {
        const track = trackRef.current;
        if (!track) return;

        const slider = track.querySelector(".ys-testimonials__slider");
        if (!slider) return;

        let loop;
        let draggable;
        let proxyEl;

        // Function to build/rebuild the animation
        const initMarquee = () => {
            // Cleanup previous instances
            if (loop) loop.kill();
            if (draggable && draggable[0]) draggable[0].kill();

            const totalWidth = slider.scrollWidth;
            if (totalWidth === 0) return; // Still not ready

            // Account for the gap between sliders (defined in CSS as 3rem)
            // We need to parse it to get exact pixel value for perfect loops
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.gap) || 0;
            const cycleDistance = totalWidth + gap;

            // Reset track width to accommodate 2 sets + gaps
            // Actually, we don't need to force width on track if flex works, 
            // but setting x correctly is key.

            // 1. Core loop
            // We move by 'cycleDistance' (width of one set + one gap)
            // Speed: 60px/s
            const duration = cycleDistance / 60;

            loop = gsap.to(track, {
                x: -cycleDistance,
                duration: duration,
                ease: "none",
                repeat: -1,
                paused: false
            });

            // 2. Draggable Proxy
            proxyEl = document.createElement("div");
            let lastX = 0;

            const updateMarquee = (delta) => {
                // Invert delta (dragging left = negative delta = advance time)
                // 0.8 multiplier for "heavy" feel
                const timeChange = -(delta / cycleDistance) * duration * 0.8;
                loop.totalTime(loop.totalTime() + timeChange);
            };

            draggable = Draggable.create(proxyEl, {
                trigger: track,
                type: "x",
                inertia: true,
                onPress() {
                    loop.pause();
                    lastX = this.x;
                },
                onDrag() {
                    const delta = this.x - lastX;
                    updateMarquee(delta);
                    lastX = this.x;
                },
                onThrowUpdate() {
                    const delta = this.x - lastX;
                    updateMarquee(delta);
                    lastX = this.x;
                },
                onRelease() {
                    // If not throwing (very slow drag release), resume immediately
                    if (!this.tween || !this.tween.isActive()) {
                        loop.play();
                        gsap.to(loop, { timeScale: 1, duration: 1.5, ease: "power2.inOut" });
                    }
                },
                onThrowComplete() {
                    loop.play();
                    gsap.fromTo(loop, { timeScale: 0 }, { timeScale: 1, duration: 1.5, ease: "power2.inOut" });
                }
            });

            ScrollTrigger.create({
                trigger: containerRef.current, // Use container as trigger
                start: "top bottom",
                end: "bottom top",
                onToggle: self => self.isActive ? loop.play() : loop.pause()
            });
        };

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                if (entry.contentRect.width > 0) {
                    initMarquee();
                    resizeObserver.disconnect();
                    break;
                }
            }
        });

        resizeObserver.observe(slider);

        return () => {
            resizeObserver.disconnect();
            if (loop) loop.kill();
            if (draggable && draggable[0]) draggable[0].kill();
        };

    }, { scope: containerRef });

    return (
        <section className="ys-testimonials" ref={containerRef}>
            <header className="ys-testimonials__header">
                <h2 className="ys-testimonials__title" data-ys-reveal="text">What Clients Say</h2>
            </header>
            <div className="ys-testimonials__marquee" data-ys-reveal="fade" data-ys-delay="0.2">
                <div className="ys-testimonials__vignette"></div>
                <div className="ys-testimonials__track" ref={trackRef}>
                    <div className="ys-testimonials__slider">
                        {testimonialsData.map((item, i) => (
                            <article className="ys-testimonial-card" key={i}>
                                <div className="ys-testimonial-card__bubble">
                                    <p className="ys-testimonial-card__text">{item.text}</p>
                                    <div className="ys-testimonial-card__pointer"></div>
                                </div>
                                <div className="ys-testimonial-card__author">
                                    <img src={`${import.meta.env.BASE_URL}assets/images/${item.img}`} alt={item.name} className="ys-testimonial-card__avatar" />
                                    <div className="ys-testimonial-card__info">
                                        <span className="ys-testimonial-card__name">{item.name}</span>
                                        <span className="ys-testimonial-card__role">{item.role}</span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                    {/* Duplicate for seamless infinite feel */}
                    <div className="ys-testimonials__slider">
                        {testimonialsData.map((item, i) => (
                            <article className="ys-testimonial-card" key={`dup-${i}`}>
                                <div className="ys-testimonial-card__bubble">
                                    <p className="ys-testimonial-card__text">{item.text}</p>
                                    <div className="ys-testimonial-card__pointer"></div>
                                </div>
                                <div className="ys-testimonial-card__author">
                                    <img src={`${import.meta.env.BASE_URL}assets/images/${item.img}`} alt={item.name} className="ys-testimonial-card__avatar" />
                                    <div className="ys-testimonial-card__info">
                                        <span className="ys-testimonial-card__name">{item.name}</span>
                                        <span className="ys-testimonial-card__role">{item.role}</span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default memo(Testimonials);
