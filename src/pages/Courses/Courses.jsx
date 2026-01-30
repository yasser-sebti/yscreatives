import { useRef, useEffect } from 'react';
import TransitionLink from '../../components/TransitionLink/TransitionLink';
import SEO from '../../components/SEO/SEO';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useTransition } from '../../context/TransitionContext';
import './Courses.css';

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
        </main>
    );
};

export default Courses;
