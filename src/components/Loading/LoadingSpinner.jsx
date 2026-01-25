import React, { useEffect, useRef } from 'react';
import { gsap } from '../../gsap';

const LoadingSpinner = ({ onFinished }) => {
    const loaderRef = useRef(null);

    useEffect(() => {
        // Simulate a small delay for page settling if needed, 
        // or just fire when mount is confirmed.
        const timer = setTimeout(() => {
            if (loaderRef.current) {
                gsap.to(loaderRef.current, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => {
                        if (onFinished) onFinished();
                    }
                });
            }
        }, 1200); // 1.2s minimum visibility for brand impact

        return () => clearTimeout(timer);
    }, [onFinished]);

    return (
        <div className="ys-loader" ref={loaderRef}>
            <div className="ys-loader__content">
                <svg className="ys-loader__svg" viewBox="0 0 50 50">
                    <circle
                        className="ys-loader__circle"
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        strokeWidth="2"
                    ></circle>
                </svg>
            </div>
            <style>{`
                .ys-loader {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    width: 100vw;
                    background-color: var(--void-black, #000000);
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 9999999;
                }
                .ys-loader__content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }
                .ys-loader__svg {
                    width: 40px;
                    height: 40px;
                    animation: ys-rotate 2s linear infinite;
                }
                .ys-loader__circle {
                    stroke: #ffffff;
                    stroke-linecap: round;
                    animation: ys-dash 1.5s ease-in-out infinite;
                }
                @keyframes ys-rotate {
                    100% { transform: rotate(360deg); }
                }
                @keyframes ys-dash {
                    0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
                    50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
                    100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
                }
            `}</style>
        </div>
    );
};

export default LoadingSpinner;
