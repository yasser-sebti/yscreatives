import { useRef, memo } from 'react';
import { createPortal } from 'react-dom';
import { gsap, useGSAP, SplitText } from '../../gsap';
import './MessageSentOverlay.css';

/**
 * MessageSentOverlay Component
 * Optimized with the "Double-Reset" technique for perfectly repeatable animations.
 */
const MessageSentOverlay = ({ isVisible, onClose }) => {
    const overlayRef = useRef(null);
    const shuttersRef = useRef([]);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const buttonRef = useRef(null);

    // Use stable refs for SplitText instances
    const titleSplit = useRef(null);
    const subtitleSplit = useRef(null);

    useGSAP(() => {
        if (!isVisible) return;

        const overlay = overlayRef.current;
        const shutters = shuttersRef.current;

        // --- PHASE 0: THE CLEAN SLATE (Reset Function) ---
        // We revert any previous SplitText to ensure a fresh DOM structure
        if (titleSplit.current) titleSplit.current.revert();
        if (subtitleSplit.current) subtitleSplit.current.revert();

        // Reset properties to initial "pre-animation" states
        gsap.set(overlay, { display: 'flex' });
        gsap.set(shutters, { height: '0%', top: 0, bottom: 'auto' });
        gsap.set([titleRef.current, subtitleRef.current, buttonRef.current], {
            opacity: 0,
            clearProps: "transform"
        });

        // --- PHASE 1: ENTER SEQUENCE ---
        const tl = gsap.timeline();

        // 1. Shutter Entrance
        tl.to(shutters, {
            height: '100%',
            duration: 0.6,
            stagger: 0.05,
            ease: 'expo.inOut'
        });

        // 2. Text Preparation & Reveal
        tl.add(() => {
            // Re-initialize SplitText on fresh DOM
            titleSplit.current = new SplitText(titleRef.current, { type: 'lines', mask: 'lines' });
            subtitleSplit.current = new SplitText(subtitleRef.current, { type: 'lines', mask: 'lines' });

            gsap.set([titleRef.current, subtitleRef.current], { opacity: 1 });

            // Animate Lines
            gsap.from(titleSplit.current.lines, {
                yPercent: 110,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power4.out'
            });

            gsap.from(subtitleSplit.current.lines, {
                yPercent: 110,
                duration: 0.6,
                stagger: 0.06,
                ease: 'power3.out',
                delay: 0.2
            });

            // Button Entrance
            gsap.to(buttonRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power3.out',
                delay: 0.4
            });
        });

        return () => {
            if (titleSplit.current) titleSplit.current.revert();
            if (subtitleSplit.current) subtitleSplit.current.revert();
        };
    }, { dependencies: [isVisible], scope: overlayRef });

    const handleClose = () => {
        const shutters = shuttersRef.current;

        // --- PHASE 2: EXIT SEQUENCE ---
        // We trigger onClose at the START of the uncovering process
        // while the shutters are still 100% height. This allows the 
        // parent to refresh layout while the view is covered.
        onClose();

        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(overlayRef.current, { display: 'none' });
                // Clean up SplitText
                if (titleSplit.current) titleSplit.current.revert();
                if (subtitleSplit.current) subtitleSplit.current.revert();
            }
        });

        // Hide content immediately as shutters start to move
        tl.to([buttonRef.current, titleRef.current, subtitleRef.current], {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in'
        });

        tl.set(shutters, { top: 'auto', bottom: 0 });
        tl.to(shutters, {
            height: '0%',
            duration: 0.5,
            stagger: 0.04,
            ease: 'expo.inOut'
        });
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div ref={overlayRef} className="message-sent-overlay">
            <div className="message-sent-overlay__shutters">
                {[0, 1, 2, 3, 4].map(i => (
                    <div
                        key={i}
                        ref={el => shuttersRef.current[i] = el}
                        className="message-sent-overlay__shutter"
                    />
                ))}
            </div>

            <div className="message-sent-overlay__content">
                <h1 ref={titleRef} className="message-sent-overlay__title">
                    Message Sent!
                </h1>
                <p ref={subtitleRef} className="message-sent-overlay__subtitle">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                    ref={buttonRef}
                    className="message-sent-overlay__button"
                    onClick={handleClose}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Go Back</span>
                </button>
            </div>
        </div>,
        document.body
    );
};

export default memo(MessageSentOverlay);
