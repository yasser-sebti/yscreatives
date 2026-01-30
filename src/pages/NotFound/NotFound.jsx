import { useRef, useEffect } from 'react';
import TransitionLink from '../../components/TransitionLink/TransitionLink';
import SEO from '../../components/SEO/SEO';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useTransition } from '../../context/TransitionContext';
import { useSound } from '../../context/SoundContext';
import './NotFound.css';

const NotFound = () => {
    const containerRef = useRef(null);
    const { revealPage } = useTransition();
    const { setIsSoundOn } = useSound();

    useMagnetic(containerRef, ".ys-magnetic", 0.4);

    useEffect(() => {
        setIsSoundOn(false); // Mute global sound
        revealPage();
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
        </main>
    );
};

export default NotFound;
