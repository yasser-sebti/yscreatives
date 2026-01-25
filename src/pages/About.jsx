import { useRef, useState, useEffect } from 'react';
import { useTransition } from '../context/TransitionContext';
import TransitionLink from '../components/TransitionLink/TransitionLink';
import { gsap, useGSAP, SplitText, ScrollTrigger } from '../gsap';
import CTA from '../components/CTA/CTA';
import '../styles/About.css';

/**
 * ABOUT PAGE
 * A refined, editorial architectural design celebrating the human touch in digital craft.
 */
const About = () => {
    const containerRef = useRef(null);
    const testimonialsTrackRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const { isAnimating, revealPage } = useTransition();

    useEffect(() => {
        revealPage();
    }, []);

    // Handle Spotlight Tracking (for image effects in CSS)
    useEffect(() => {
        const handleMouseMove = (e) => {
            const target = document.querySelector('.ys-about-intro__image-wrapper');
            if (!target) return;
            const rect = target.getBoundingClientRect();
            target.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            target.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useGSAP(() => {
        if (isAnimating) return;

        // 1. Magnetic Elements Interaction
        const magneticElements = gsap.utils.toArray(".ys-magnetic");
        magneticElements.forEach((el) => {
            const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
            const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

            el.addEventListener("mousemove", (e) => {
                const { clientX, clientY } = e;
                const { height, width, left, top } = el.getBoundingClientRect();
                xTo((clientX - (left + width / 2)) * 0.4);
                yTo((clientY - (top + height / 2)) * 0.4);
            });

            el.addEventListener("mouseleave", () => {
                xTo(0);
                yTo(0);
            });
        });

        // 2. SEAMLESS MARQUEE LOGIC (Recoded from Scratch)
        // We use a high-performance virtualization technique for the marquee
        const track = testimonialsTrackRef.current;
        if (track) {
            const slider = track.querySelector(".ys-testimonials__slider");
            if (slider) {
                // Calculate actual loop width
                const loopWidth = slider.offsetWidth;

                // Set initial state
                gsap.set(track, { x: 0 });

                // Create the master loop timeline
                // We use xPercent: -50 for mathematically perfect sub-pixel rendering
                const loop = gsap.to(track, {
                    xPercent: -50,
                    duration: 40,
                    ease: "none",
                    repeat: -1,
                    force3D: true // Hardware acceleration
                });

                // HIGH-END HOVER LOGIC
                // Smooth deceleration to 15% speed for sub-pixel fluidity
                const handleEnter = () => {
                    gsap.to(loop, {
                        timeScale: 0.15,
                        duration: 1.5,
                        ease: "sine.out"
                    });
                };

                const handleLeave = () => {
                    gsap.to(loop, {
                        timeScale: 1,
                        duration: 2.0,
                        ease: "sine.inOut"
                    });
                };

                track.addEventListener("mouseenter", handleEnter);
                track.addEventListener("mouseleave", handleLeave);

                // PERFORMANCE: Pause when not in viewport
                ScrollTrigger.create({
                    trigger: ".ys-testimonials",
                    start: "top bottom",
                    end: "bottom top",
                    onToggle: self => self.isActive ? loop.play() : loop.pause()
                });
            }
        }

        ScrollTrigger.refresh();
    }, { scope: containerRef, dependencies: [isAnimating] });

    // FAQ Accordion Logic
    const toggleFAQ = (index) => {
        const wrappers = gsap.utils.toArray(".ys-faq-item__answer-wrap");
        const currentWrapper = wrappers[index];
        const currentAnswer = currentWrapper.querySelector(".ys-faq-item__answer");

        if (activeIndex === index) {
            gsap.to(currentWrapper, { height: 0, duration: 0.6, ease: "expo.inOut" });
            setActiveIndex(null);
        } else {
            if (activeIndex !== null) {
                gsap.to(wrappers[activeIndex], { height: 0, duration: 0.6, ease: "expo.inOut" });
            }
            gsap.set(currentWrapper, { height: "auto" });
            const autoHeight = currentWrapper.offsetHeight;
            gsap.fromTo(currentWrapper, { height: 0 }, { height: autoHeight, duration: 0.6, ease: "expo.inOut" });

            const split = new SplitText(currentAnswer, { type: "lines", linesClass: "ys-mask" });
            gsap.from(new SplitText(split.lines, { type: "lines" }).lines, {
                yPercent: 100,
                duration: 0.8,
                stagger: 0.02,
                ease: "power3.out",
                delay: 0.2
            });

            setActiveIndex(index);
        }
    };

    const faqData = [
        { q: "How do you start a project?", a: "Every project begins with a discovery session where we dive deep into your brand's vision, goals, and market landscape." },
        { q: "What is your typical timeline?", a: "Standard brand identity and web design projects usually span 6 to 10 weeks for meticulous execution." },
        { q: "Do you handle development as well?", a: "Yes. I build high-performance, GSAP-animated React applications that bring the static vision to life." },
        { q: "Why focus on 'Human' design?", a: "In an era of AI automation, the human touch creates the true emotional connection necessary for premium brands." }
    ];

    const testimonialsData = [
        { name: "Alpha Programming", role: "Tech Company", img: "Alpha Programing.webp", text: "Yasser delivered exceptional results that exceeded our expectations. His attention to detail is unmatched." },
        { name: "Corochoco", role: "Brand", img: "Corochoco.webp", text: "Working with Yasser was an absolute pleasure. He understood our vision and translated it into a stunning presence." },
        { name: "Islem Bennebes", role: "Entrepreneur", img: "Islem Bennebes.webp", text: "The level of professionalism Yasser brings to every project is unmatched. Highly recommend for premium work." },
        { name: "Madjid Lounes", role: "Business Owner", img: "Madjid Lounes.webp", text: "Yasser's work speaks for itself. The website has significantly improved our online presence and engagement." },
        { name: "Pandaify", role: "SaaS Platform", img: "Pandaify.webp", text: "Incredible design work that captures our brand essence. The animations and UX are absolutely top-tier." },
        { name: "Rahim Kichene", role: "Creative Director", img: "Rahim Kichene.webp", text: "As a fellow creative, I appreciate Yasser's meticulous approach. Every pixel is intentional and purposeful." }
    ];

    return (
        <div ref={containerRef} className="ys-about-page">
            {/* --- INTRO SECTION --- */}
            <section className="ys-about-intro">
                <div className="ys-grid-line" data-ys-reveal="scale-x"></div>
                <div className="ys-about-intro__container">
                    <header className="ys-about-intro__header">
                        <h2 className="ys-about-intro__title" data-ys-reveal="text">One behind it all</h2>
                        <div className="ys-meta-group">
                            <span className="ys-meta-item ys-meta-decoration" data-ys-reveal="fade-up" data-ys-delay="0.6">EST : 2023</span>
                            <span className="ys-meta-item ys-meta-decoration" data-ys-reveal="fade-up" data-ys-delay="0.7">GRAPHICS DESIGN AGENCY</span>
                            <span className="ys-meta-item ys-meta-decoration" data-ys-reveal="fade-up" data-ys-delay="0.8">6+ YEARS SPECIALIZATION</span>
                        </div>
                    </header>

                    <div className="ys-about-intro__layout">
                        <div className="ys-about-intro__image-wrapper" data-ys-reveal="fade">
                            <div className="ys-corner-decoration ys-corner-tl" data-ys-reveal="fade" data-ys-delay="0.9"></div>
                            <div className="ys-corner-decoration ys-corner-br" data-ys-reveal="fade" data-ys-delay="1.0"></div>
                            <div className="ys-about-intro__image-container" data-ys-reveal="image">
                                <img src="/assets/images/Yasser.webp" alt="Yasser Sebti" loading="lazy" />
                            </div>
                        </div>

                        <div className="ys-about-intro__content">
                            <h3 className="ys-about-intro__name" data-ys-reveal="text">Yasser Abdelmotaleb Sebti</h3>
                            <span className="ys-about-intro__tag" data-ys-reveal="fade-up" data-ys-delay="0.3">CEO & Founder</span>

                            <p className="ys-about-intro__description" data-ys-reveal="text">
                                Based in Algeria, I am the founder of Yasser's Creatives, a specialized Brand Identity Agency established in early 2023. With over six years of deep immersion in the visual arts, I transform complex business visions into iconic brand systems.
                                <br /><br />
                                My approach merges strategic design decisions with manual craftsmanship. Whether it's crafting timeless logos or immersive digital experiences, I believe the human touch is the ultimate competitive advantage.
                            </p>
                            <div className="ys-about-intro__cta">
                                <TransitionLink to="/contact" className="ys-button ys-magnetic">Let's Talk</TransitionLink>
                                <TransitionLink to="/work" className="ys-button ys-button--outline ys-magnetic">Selected Work</TransitionLink>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS SECTION --- */}
            <section className="ys-testimonials">
                <header className="ys-testimonials__header">
                    <h2 className="ys-testimonials__title" data-ys-reveal="text">What Clients Say</h2>
                </header>
                <div className="ys-testimonials__marquee">
                    <div className="ys-testimonials__vignette"></div>
                    <div className="ys-testimonials__track" ref={testimonialsTrackRef}>
                        <div className="ys-testimonials__slider">
                            {testimonialsData.map((item, i) => (
                                <article className="ys-testimonial-card" key={i}>
                                    <div className="ys-testimonial-card__bubble">
                                        <p className="ys-testimonial-card__text">{item.text}</p>
                                        <div className="ys-testimonial-card__pointer"></div>
                                    </div>
                                    <div className="ys-testimonial-card__author">
                                        <img src={`/assets/images/${item.img}`} alt={item.name} className="ys-testimonial-card__avatar" />
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
                                        <img src={`/assets/images/${item.img}`} alt={item.name} className="ys-testimonial-card__avatar" />
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

            {/* --- FAQ SECTION --- */}
            <section className="ys-faq">
                <div className="ys-faq__container">
                    <h2 className="ys-faq__title" data-ys-reveal="text">Frequently Asked Questions</h2>
                    <div className="ys-faq__list">
                        {faqData.map((item, i) => (
                            <div key={i} className={`ys-faq-item ${activeIndex === i ? 'is-active' : ''}`} onClick={() => toggleFAQ(i)}>
                                <div className="ys-faq-item__header">
                                    <h3 className="ys-faq-item__question" data-ys-reveal="text">{item.q}</h3>
                                    <div className="ys-faq-item__icon"></div>
                                </div>
                                <div className="ys-faq-item__answer-wrap">
                                    <div className="ys-faq-item__answer">{item.a}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <CTA />
        </div>
    );
};

export default About;
