import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '../../gsap';
import './Scrollbar.css';

const Scrollbar = () => {
    const trackRef = useRef(null);
    const thumbRef = useRef(null);

    useGSAP(() => {
        const thumb = thumbRef.current;
        const track = trackRef.current;
        if (!thumb || !track) return;

        // Use the GSAP Ticker for high-performance, frame-perfect syncing
        // This bypasses standard event lag and calculates position right before repaint
        const syncScrollbar = () => {
            const trackHeight = track.offsetHeight;
            const thumbHeight = thumb.offsetHeight;
            const maxRange = trackHeight - thumbHeight;

            // Get the raw window scroll progress
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

            // Use gsap.set for zero-latency, hardware-accelerated movement
            gsap.set(thumb, {
                y: progress * maxRange,
                force3D: true // Ensure GPU acceleration
            });
        };

        // Add to GSAP Ticker for frame-synced updates
        gsap.ticker.add(syncScrollbar);

        // Hover effect for clean visual feedback
        const onEnter = () => gsap.to(thumb, { width: 4, opacity: 0.8, duration: 0.3, ease: "power2.out" });
        const onLeave = () => gsap.to(thumb, { width: 2, opacity: 0.4, duration: 0.3, ease: "power2.out" });

        track.addEventListener('mouseenter', onEnter);
        track.addEventListener('mouseleave', onLeave);

        return () => {
            gsap.ticker.remove(syncScrollbar);
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

export default Scrollbar;
