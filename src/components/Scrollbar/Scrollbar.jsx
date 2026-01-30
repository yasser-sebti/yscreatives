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

        // UI UX PRO MAX: High-Performance Scrollbar
        // 1. Cache properties to avoid layout thrashing (reading offsetHeight triggers reflow)
        // 2. Use quickSetter for direct localized updates bypassing the parsing overhead

        let trackHeight = 0;
        let thumbHeight = 0;
        let maxRange = 0;

        // Optimized setter function
        const setY = gsap.quickSetter(thumb, "y", "px");

        function updateDimensions() {
            trackHeight = track.offsetHeight;
            thumbHeight = thumb.offsetHeight;
            maxRange = trackHeight - thumbHeight;
        }

        // Initial measurement
        updateDimensions();

        // Update on resize
        const resizeObserver = new ResizeObserver(() => updateDimensions());
        resizeObserver.observe(track);

        ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: (self) => {
                // Direct update without layout reads
                // self.progress is 0 to 1
                setY(self.progress * maxRange);
            },
        });

        // Hover response
        const onEnter = () => gsap.to(thumb, { width: 4, opacity: 0.8, duration: 0.3, ease: "power2.out" });
        const onLeave = () => gsap.to(thumb, { width: 2, opacity: 0.4, duration: 0.3, ease: "power2.out" });

        track.addEventListener('mouseenter', onEnter);
        track.addEventListener('mouseleave', onLeave);

        return () => {
            track.removeEventListener('mouseenter', onEnter);
            track.removeEventListener('mouseleave', onLeave);
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div className="ys-scrollbar-track" ref={trackRef}>
            <div className="ys-scrollbar-thumb" ref={thumbRef}></div>
        </div>
    );
};

export default memo(Scrollbar);
