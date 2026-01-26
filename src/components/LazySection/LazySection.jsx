import { useState, useEffect, useRef, Suspense } from 'react';
import '../../styles/LazySection.css';

/**
 * LazySection Component
 * IntersectionObserver based wrapper for high-performance section-level lazy loading.
 * Features a "Pro Max" minimal aesthetic skeleton loader.
 */
const LazySection = ({ children, height = "400px", offset = "600px" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: `${offset} 0px`, // Pre-trigger loading before it hits the viewport
                threshold: 0.01
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [offset]);

    return (
        <div
            ref={sectionRef}
            className={`ys-lazy-section ${isVisible ? 'is-visible' : 'is-loading'}`}
            style={{ minHeight: !isVisible ? height : 'auto' }}
        >
            {isVisible ? (
                <Suspense fallback={<SectionSkeleton height={height} />}>
                    {children}
                </Suspense>
            ) : (
                <SectionSkeleton height={height} />
            )}
        </div>
    );
};

const SectionSkeleton = ({ height }) => (
    <div className="ys-section-skeleton" style={{ height }}>
        <div className="ys-section-skeleton__shimmer"></div>
        <div className="ys-section-skeleton__content">
            <div className="ys-section-skeleton__line ys-section-skeleton__line--lg"></div>
            <div className="ys-section-skeleton__line ys-section-skeleton__line--md"></div>
            <div className="ys-section-skeleton__line ys-section-skeleton__line--lg" style={{ width: '80%' }}></div>
            <div className="ys-section-skeleton__line ys-section-skeleton__line--sm" style={{ width: '30%', height: '10px' }}></div>
        </div>
    </div>
);

export default LazySection;
