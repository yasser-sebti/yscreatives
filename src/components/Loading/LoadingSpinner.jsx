import React, { useEffect, useRef, memo } from 'react';
import { gsap } from '../../gsap';
import './Loading.css';

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
        </div>
    );
};

export default memo(LoadingSpinner);
