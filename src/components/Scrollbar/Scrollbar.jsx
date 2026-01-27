import { useRef, memo } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '../../gsap';
import './Scrollbar.css';

const Scrollbar = () => {
    const trackRef = useRef(null);
    const thumbRef = useRef(null);

    useGSAP(() => {
        const thumb = thumbRef.current;
        const track = trackRef.current;
        if (!thumb || !track) return;

        // UI UX PRO MAX: ScrollTrigger-based High-Performance Tracking
        // This is significantly more efficient than ticker polling for low-end PCs
        // as it only calculates values when the scroll position actually changes.
        ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: (self) => {
                const trackHeight = track.offsetHeight;
                const thumbHeight = thumb.offsetHeight;
                const maxRange = trackHeight - thumbHeight;

                // Pure smooth mapping
                gsap.set(thumb, {
                    y: self.progress * maxRange,
                    force3D: true,
                    overwrite: "auto"
                });
            }
        });

        // Hover response
        const onEnter = () => gsap.to(thumb, { width: 4, opacity: 0.8, duration: 0.3, ease: "power2.out" });
        const onLeave = () => gsap.to(thumb, { width: 2, opacity: 0.4, duration: 0.3, ease: "power2.out" });

        track.addEventListener('mouseenter', onEnter);
        track.addEventListener('mouseleave', onLeave);

        return () => {
            track.removeEventListener('mouseenter', onEnter);
            track.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    return (
        <div className="ys-scrollbar-track" ref={trackRef}>
            <div className="ys-scrollbar-thumb" ref={thumbRef}></div>
        </div>
    );
};

export default memo(Scrollbar);
