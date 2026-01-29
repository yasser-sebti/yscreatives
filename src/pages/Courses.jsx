import { useRef, useEffect } from 'react';
import TransitionLink from '../components/TransitionLink/TransitionLink';
import SEO from '../components/SEO/SEO';
import { useMagnetic } from '../hooks/useMagnetic';
import { useTransition } from '../context/TransitionContext';

const Courses = () => {
    const containerRef = useRef(null);
    const { revealPage } = useTransition();

    useMagnetic(containerRef, ".ys-magnetic", 0.4);

    useEffect(() => {
        revealPage();
    }, []);

    return (
        <main className="ys-courses-coming" ref={containerRef}>
            <SEO title="Courses - Coming Soon" />

            <div className="ys-courses-coming__content">
                <h1 className="ys-courses-coming__title" data-ys-reveal="fade-up">Coming Soon</h1>
                <p className="ys-courses-coming__text" data-ys-reveal="fade-up" data-ys-delay="0.1">
                    We are currently working on crafting educational experiences that will elevate your design journey. Stay tuned.
                </p>
                <div className="ys-courses-coming__cta" data-ys-reveal="fade-up" data-ys-delay="0.2">
                    <TransitionLink to="/" className="ys-button-special ys-magnetic">
                        Return Home
                    </TransitionLink>
                </div>
            </div>

            <style>{`
                .ys-courses-coming {
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #000000;
                    color: #fff;
                    overflow: hidden;
                    position: relative;
                }
                
                .ys-courses-coming__content {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 32px;
                    position: relative;
                    z-index: 10;
                    padding: 0 var(--grid-margin);
                }

                .ys-courses-coming__title {
                    font-family: 'PP Editorial New', serif;
                    font-size: clamp(3rem, 12vw, 8rem);
                    line-height: 0.8; 
                    font-weight: 200;
                    margin: 0;
                    color: #ffffff;
                    letter-spacing: -0.04em;
                    padding-bottom: 2rem;
                    text-transform: capitalize;
                }

                .ys-courses-coming__text {
                    font-family: 'DM Mono', monospace;
                    font-size: 1.25rem;
                    color: rgba(255, 255, 255, 0.6);
                    max-width: 580px;
                    line-height: 1.6;
                    margin-bottom: 12px;
                }

                .ys-courses-coming__cta {
                    display: inline-block;
                    width: fit-content;
                }

                .ys-button-special {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.6rem 1.5rem;
                    background: transparent;
                    color: #fff;
                    border: 1px solid #fff;
                    border-radius: 0;
                    font-family: 'DM Mono', monospace;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    text-decoration: none;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    cursor: pointer;
                }

                .ys-button-special:hover {
                    background: #fff;
                    color: #000;
                }
            `}</style>
        </main>
    );
};

export default Courses;
