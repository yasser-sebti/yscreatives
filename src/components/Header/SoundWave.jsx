import { useRef } from 'react';
import { gsap, useGSAP } from '../../gsap';

/**
 * Advanced SoundWave Indicator v2
 * 
 * DESIGN PRINCIPLE:
 * Human-designed work feels reactive. This component uses independent 
 * bar oscillation to visualize sound state with surgical precision.
 */
const SoundWave = ({ isSoundOn }) => {
    const containerRef = useRef(null);
    const barsRef = useRef([]);

    useGSAP(() => {
        const bars = barsRef.current;
        if (!bars.length) return;

        // --- PHASE 1: TRANSITION ---
        if (isSoundOn) {
            // Wake up the bars
            bars.forEach((bar, i) => {
                gsap.to(bar, {
                    scaleY: "random(0.3, 1.3)",
                    duration: `random(0.4, 0.8)`,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: i * 0.1,
                    transformOrigin: "bottom center"
                });
            });
        } else {
            // Flatten the bars
            bars.forEach((bar) => {
                gsap.killTweensOf(bar);
                gsap.to(bar, {
                    scaleY: 0.15,
                    duration: 0.6,
                    ease: "power2.out",
                    transformOrigin: "bottom center"
                });
            });
        }

    }, { scope: containerRef, dependencies: [isSoundOn] });

    return (
        <div className="ys-soundwave-v2" ref={containerRef} aria-hidden="true">
            {[...Array(4)].map((_, i) => (
                <span
                    key={i}
                    ref={(el) => (barsRef.current[i] = el)}
                    className="ys-soundwave-v2__bar"
                />
            ))}
            <style>{`
                .ys-soundwave-v2 {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    width: 14px;
                    height: 12px;
                    gap: 2px;
                }
                .ys-soundwave-v2__bar {
                    flex: 1;
                    height: 100%;
                    background-color: currentColor;
                    will-change: transform;
                    /* Hardware acceleration */
                    transform: scaleY(0.15);
                }
            `}</style>
        </div>
    );
};

export default SoundWave;
