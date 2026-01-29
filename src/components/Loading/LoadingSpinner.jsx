import React, { useEffect, useRef, memo } from 'react';
import { gsap } from '../../gsap';

const LoadingSpinner = ({ isExiting }) => {
    return (
        <div className={`ys-loader ${isExiting ? 'is-exiting' : ''}`}>
            <div className="ys-loader__content">
                <div className="ys-loader__logo">
                    <img
                        src={`${import.meta.env.BASE_URL}assets/images/Logo White.png`}
                        alt="YS"
                        width="80"
                        height="32"
                    />
                </div>
                <svg className="ys-loader__svg" viewBox="0 0 50 50">
                    <circle
                        className="ys-loader__circle"
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        strokeWidth="1.5"
                    ></circle>
                </svg>
                <div className="ys-loader__text">Loading Experience</div>
            </div>
            <style>{`
                .ys-loader {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    width: 100vw;
                    background-color: #000000;
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 9999999;
                    transition: opacity 0.8s cubic-bezier(0.7, 0, 0.3, 1);
                    opacity: 1;
                }
                .ys-loader.is-exiting {
                    opacity: 0;
                    pointer-events: none;
                }
                .ys-loader__content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 24px;
                }
                .ys-loader__logo {
                    /* Typography styles removed for Image */
                    width: 90px;
                    display: flex;
                    justify-content: center;
                }
                .ys-loader__logo img {
                    width: 100%;
                    height: auto;
                    object-fit: contain;
                }
                .ys-loader__svg {
                    width: 32px;
                    height: 32px;
                    animation: ys-rotate 2s linear infinite;
                }
                .ys-loader__circle {
                    stroke: #ffffff;
                    stroke-opacity: 0.2;
                    stroke-linecap: round;
                    stroke-dasharray: 90, 150;
                    stroke-dashoffset: -35;
                }
                .ys-loader__text {
                    font-family: 'DM Mono', monospace;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.3em;
                    color: rgba(255,255,255,0.4);
                    animation: ys-pulse 2s ease-in-out infinite;
                }
                @keyframes ys-rotate {
                    100% { transform: rotate(360deg); }
                }
                @keyframes ys-pulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.7; }
                }
            `}</style>
        </div>
    );
};

export default memo(LoadingSpinner);
