import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '../../gsap';

const ScrollIndicator = () => {
    const indicatorRef = useRef(null);
    const trackRef = useRef(null);

    useGSAP(() => {
        // Create a ScrollTrigger that updates the indicator height based on page progress
        ScrollTrigger.create({
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                const progress = self.progress * 100;
                if (indicatorRef.current) {
                    gsap.to(indicatorRef.current, {
                        height: `${progress}%`,
                        duration: 0.1,
                        ease: "none",
                        overwrite: "auto"
                    });
                }
            }
        });
    }, []);

    return (
        <div className="ys-scroll-indicator">
            {/* Thin vertical track on the right side - full height */}
            <div
                ref={trackRef}
                className="ys-scroll-indicator__track"
                style={{
                    position: 'fixed',
                    right: '8px',
                    top: '0',
                    bottom: '0',
                    width: '1px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    zIndex: 9998,
                    pointerEvents: 'none'
                }}
            >
                {/* Progress indicator that grows from top to bottom */}
                <div
                    ref={indicatorRef}
                    className="ys-scroll-indicator__thumb"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '0%',
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        willChange: 'height'
                    }}
                />
            </div>
        </div>
    );
};

export default ScrollIndicator;