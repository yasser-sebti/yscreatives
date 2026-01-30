import { useRef, useState, useEffect, memo, lazy } from 'react';
import { useTransition } from '../context/TransitionContext';
import TransitionLink from '../components/TransitionLink/TransitionLink';
import { gsap, useGSAP, SplitText } from '../gsap';
import SimpleImage from '../components/Image/SimpleImage';
import LazySection from '../components/LazySection/LazySection';
import SEO from '../components/SEO/SEO';
import '../styles/About.css';

import { useMagnetic } from '../hooks/useMagnetic';

const CTA = lazy(() => import('../components/CTA/CTA'));
const Testimonials = lazy(() => import('../components/Testimonials/Testimonials'));

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

const faqData = [
    { q: "How do you start a project?", a: "Every project begins with a discovery session where we dive deep into your brand's vision, goals, and market landscape." },
    { q: "What is your typical timeline?", a: "Standard brand identity and web design projects usually span 6 to 10 weeks for meticulous execution." },
    { q: "Do you handle development as well?", a: "Yes. I build high-performance, GSAP-animated React applications that bring the static vision to life." },
    { q: "Why focus on 'Human' design?", a: "In an era of AI automation, the human touch creates the true emotional connection necessary for premium brands." }
];

/**
 * ABOUT PAGE
 * A refined, editorial architectural design celebrating the human touch in digital craft.
 */
const About = () => {
    const containerRef = useRef(null);
    const imageWrapperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const { revealPage } = useTransition();

    useEffect(() => {
        revealPage();
    }, []);

    // 1. PERFORMANCE OPTIMIZED SPOTLIGHT (Focused Listener)
    useGSAP(() => {
        const wrapper = imageWrapperRef.current;
        if (!wrapper) return;

        const handleMove = (e) => {
            const rect = wrapper.getBoundingClientRect();
            wrapper.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            wrapper.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        };

        wrapper.addEventListener('mousemove', handleMove);
        return () => wrapper.removeEventListener('mousemove', handleMove);
    }, { scope: containerRef });

    useMagnetic(containerRef, ".ys-magnetic", 0.4);

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
                yPercent: 120,
                duration: 0.8,
                stagger: 0.02,
                ease: "power3.out",
                delay: 0.2
            });

            setActiveIndex(index);
        }
    };


    return (
        <div ref={containerRef} className="ys-about-page">
            <SEO title="About" />
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
                        <div className="ys-about-intro__image-wrapper" ref={imageWrapperRef} data-ys-reveal="fade">
                            <div className="ys-corner-decoration ys-corner-tl" data-ys-reveal="fade" data-ys-delay="0.9"></div>
                            <div className="ys-corner-decoration ys-corner-br" data-ys-reveal="fade" data-ys-delay="1.0"></div>
                            <div className="ys-about-intro__image-container" data-ys-reveal="image">
                                <img src={`${import.meta.env.BASE_URL}assets/images/Yasser.webp`} alt="Yasser Sebti" loading="lazy" />
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
                                <TransitionLink to="/#portfolio" className="ys-button ys-button--outline ys-magnetic">Selected Work</TransitionLink>
                            </div>
                        </div>
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

            {/* --- TESTIMONIALS SECTION --- */}
            <LazySection height="500px">
                <Testimonials />
            </LazySection>

            {/* --- FAQ SECTION --- */}
            <LazySection height="400px">
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
            </LazySection>

            <LazySection height="600px">
                <CTA />
            </LazySection>
        </div>
    );
};

export default memo(About);
