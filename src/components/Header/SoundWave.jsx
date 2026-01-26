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
        const bars = barsRef.current.filter(Boolean);
        if (bars.length === 0) return;

        if (isSoundOn) {
            // Independent oscillation for a reactive feel
            bars.forEach((bar, i) => {
                gsap.to(bar, {
                    scaleY: "random(0.4, 1.2)",
                    duration: "random(0.5, 0.9)",
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: i * 0.1,
                    transformOrigin: "bottom center",
                    overwrite: "auto"
                });
            });
        } else {
            // Immediate kill and smooth flatten
            gsap.killTweensOf(bars);
            gsap.to(bars, {
                scaleY: 0.15,
                duration: 0.6,
                ease: "expo.out",
                transformOrigin: "bottom center",
                overwrite: true
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
                    width: 18px;
                    height: 14px;
                    gap: 3px;
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
