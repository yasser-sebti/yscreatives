import { useRef, useState, useEffect } from 'react';
import { gsap, useGSAP } from '../../gsap';
import './Cursor.css';

const Cursor = () => {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    const labelRef = useRef(null);

    const [cursorState, setCursorState] = useState('idle');
    const [labelText, setLabelText] = useState('');

    // Primary Movement Logic - High Precision Tracking
    useGSAP((context, contextSafe) => {
        const dot = cursorRef.current;
        const follower = followerRef.current;
        if (!dot || !follower) return;

        gsap.set([dot, follower], {
            xPercent: -50,
            yPercent: -50,
            force3D: true,
            opacity: 0
        });

        const xFollower = gsap.quickTo(follower, "x", { duration: 0.45, ease: "power3.out" });
        const yFollower = gsap.quickTo(follower, "y", { duration: 0.45, ease: "power3.out" });

        const handleMouseMove = contextSafe((e) => {
            const { clientX, clientY } = e;
            gsap.set(dot, { x: clientX, y: clientY, opacity: 1 });
            xFollower(clientX);
            yFollower(clientY);
            gsap.set(follower, { opacity: 1 });
        });

        window.addEventListener('mousemove', handleMouseMove);
        document.body.classList.add('custom-cursor-active');

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.classList.remove('custom-cursor-active');
        };
    }, []);

    // State Transitions Logic
    useGSAP(() => {
        const follower = followerRef.current;
        const label = labelRef.current;
        const dot = cursorRef.current;
        if (!follower || !label || !dot) return;

        const tl = gsap.timeline({
            defaults: { duration: 0.6, ease: "expo.out" },
            overwrite: "auto"
        });

        switch (cursorState) {
            case 'idle':
                tl.to(follower, {
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    backgroundColor: "transparent",
                    borderColor: "rgba(255, 255, 255, 0.4)",
                    backdropFilter: "blur(0px)",
                    scale: 1
                });
                tl.to(dot, {
                    backgroundColor: "#ffffff",
                    scale: 1,
                    opacity: 1
                }, 0);
                tl.to(label, { opacity: 0, y: 5 }, 0);
                break;

            case 'hover-active':
                tl.to(follower, {
                    width: 80,
                    height: 32,
                    borderRadius: "16px",
                    backgroundColor: "#ffffff",
                    borderColor: "#ffffff",
                    backdropFilter: "blur(0px)",
                    scale: 1
                });
                tl.to(dot, { backgroundColor: "#ffffff", scale: 0.5, opacity: 1 }, 0);
                tl.to(label, { opacity: 1, y: 0, color: "#000000", duration: 0.4 }, 0.1);
                break;

            case 'hover-small':
                tl.to(follower, {
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    borderColor: "#ffffff",
                    scale: 1
                });
                tl.to(dot, { opacity: 0, scale: 0.5 }, 0);
                tl.to(label, { opacity: 0 }, 0);
                break;
        }
    }, [cursorState]);

    // Efficient Interaction Observers
    useEffect(() => {
        const handleInteraction = (e) => {
            const target = e.target;

            const isPortfolio = target.closest('.ys-portfolio-item, .ys-portfolio-item__figure, .ys-methodology__image-container');
            if (isPortfolio) {
                setCursorState('hover-active');
                setLabelText('VIEW');
                return;
            }

            const isInteractive = target.closest('a, button, .ys-magnetic') ||
                window.getComputedStyle(target).cursor === 'pointer';
            if (isInteractive) {
                setCursorState('hover-small');
                setLabelText('');
                return;
            }

            setCursorState('idle');
            setLabelText('');
        };

        const handleMouseDown = () => {
            gsap.to(followerRef.current, { scale: 0.8, duration: 0.2, ease: "power2.out" });
        };

        const handleMouseUp = () => {
            gsap.to(followerRef.current, { scale: 1, duration: 0.2, ease: "back.out(1.7)" });
        };

        window.addEventListener('mouseover', handleInteraction);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mouseover', handleInteraction);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div className="ys-cursor-wrapper">
            <div ref={cursorRef} className="ys-cursor-dot" />
            <div ref={followerRef} className="ys-cursor-follower">
                <div ref={labelRef} className="ys-cursor-label">{labelText}</div>
            </div>
        </div>
    );
};

export default Cursor;
