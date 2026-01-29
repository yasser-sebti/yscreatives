import React from 'react';

const SkipLink = () => {
    return (
        <>
            <a href="#main-content" className="ys-skip-link">
                Skip to content
            </a>
            <style>{`
                .ys-skip-link {
                    position: absolute;
                    top: -100px;
                    left: 20px; /* Aligned with grid margin ideally, or fixed */
                    background: #000;
                    color: #fff;
                    padding: 1rem 1.5rem;
                    z-index: 99999; /* Supreme z-index */
                    text-decoration: none;
                    font-family: 'DM Mono', monospace;
                    font-size: 0.9rem;
                    font-weight: 400;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    transform: translateY(0);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    pointer-events: none; /* Ignore when hidden */
                }
                .ys-skip-link:focus {
                    transform: translateY(120px); /* Slide down into view */
                    pointer-events: auto;
                    outline: 2px solid #fff;
                    outline-offset: 4px;
                }
            `}</style>
        </>
    );
};

export default SkipLink;
