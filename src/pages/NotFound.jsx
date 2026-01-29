import { useRef, useEffect } from 'react';
import TransitionLink from '../components/TransitionLink/TransitionLink';
import SEO from '../components/SEO/SEO';
import { useMagnetic } from '../hooks/useMagnetic';
import { useTransition } from '../context/TransitionContext';
import { useSound } from '../context/SoundContext';

const NotFound = () => {
    const containerRef = useRef(null);
    const { revealPage } = useTransition();
    const { setIsSoundOn } = useSound();

    useMagnetic(containerRef, ".ys-magnetic", 0.4);

    useEffect(() => {
        setIsSoundOn(false); // Mute global sound (except clicks per special handling)
        revealPage(); // Trigger standard reveal
    }, []);

    return (
        <main className="ys-404" ref={containerRef}>
            <SEO title="Page Not Found" />
            <div className="ys-404__content">
                <h1 className="ys-404__code" data-ys-reveal="fade-up">404</h1>
                <p className="ys-404__text" data-ys-reveal="fade-up" data-ys-delay="0.1">
                    The page you are looking for has vanished into component void.
                </p>
                <div className="ys-404__cta" data-ys-reveal="fade-up" data-ys-delay="0.2">
                    <TransitionLink to="/" className="ys-button-special ys-magnetic">
                        Return Home
                    </TransitionLink>
                </div>
            </div>

            <style>{`
                .ys-404 {
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #050505;
                    color: #fff;
                    overflow: hidden;
                    position: relative;
                }
                .ys-404__content {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 24px;
                }
                .ys-404__code {
                    font-family: 'PP Editorial New', serif;
                    font-size: clamp(4rem, 12vw, 8rem);
                    line-height: 1.1; /* Increased to prevent cropping */
                    font-weight: 300;
                    margin: 0;
                    color: #ffffff;
                    letter-spacing: -0.03em;
                    padding-top: 0.1em; /* Safety padding */
                }
                .ys-404__text {
                    font-family: 'DM Mono', monospace;
                    font-size: clamp(0.8rem, 1.5vw, 0.9rem);
                    color: rgba(255, 255, 255, 0.5);
                    max-width: 380px;
                    line-height: 1.5;
                    margin-bottom: 8px;
                }
                .ys-404__cta {
                    display: inline-block;
                    width: fit-content;
                    white-space: nowrap; /* Prevent text wrapping */
                    overflow: visible;   /* Allows hover effects */
                }
                /* Replicate Header 'Courses' Button Style EXACTLY */
                .ys-button-special {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.6rem 1.5rem;
                    background: transparent;
                    color: #fff;
                    border: 1px solid #fff;
                    border-radius: 0; /* Sharp edges */
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

export default NotFound;
