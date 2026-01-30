import { useRef, useState, useEffect, memo } from 'react';
import { gsap, useGSAP } from '../../gsap';
import './Newsletter.css';


const Newsletter = ({ inverted = false }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, error, success
    const [errMsg, setErrMsg] = useState('');
    const containerRef = useRef(null);
    const tooltipRef = useRef(null);
    const headerRef = useRef(null);
    const buttonRef = useRef(null);

    const validateEmail = (val) => {
        if (!val) return "Enter your email..";
        if (val.includes(' ')) return "No spaces allowed";

        const parts = val.split('@');
        if (parts.length === 1) return "Missing '@' symbol";
        if (parts.length > 2) return "Multiple '@' symbols detected";

        const local = parts[0];
        const domain = parts[1];
        if (!local) return "Missing local part before '@'";
        if (!domain) return "Missing email provider after '@'";

        if (val.startsWith('.') || val.endsWith('.')) return "Cannot start or end with a dot";
        if (val.includes('..')) return "Consecutive dots are not allowed";

        if (!domain.includes('.')) return "Missing domain (e.g. .com, .net)";

        const domainDots = domain.split('.');
        const tld = domainDots[domainDots.length - 1];
        if (!tld) return "Missing domain extension";
        if (tld.length < 2) return "Domain extension too short";
        if (/^\d+$/.test(tld)) return "Extension cannot be numeric";

        for (const label of domainDots) {
            if (!/^[a-zA-Z0-9-]+$/.test(label)) return "Invalid characters in domain";
            if (label.startsWith('-') || label.endsWith('-')) return "Domain labels cannot start/end with hyphens";
        }

        if (val.length > 254) return "Email exceeds length limit";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validateEmail(email);

        if (error) {
            setErrMsg(error);
            setStatus('error');

            // Auto-clear error after 3 seconds
            setTimeout(() => {
                setStatus(prev => prev === 'error' ? 'idle' : prev);
            }, 3000);
        } else {
            setStatus('loading');
            try {
                const scriptUrl = import.meta.env.VITE_NEWSLETTER_URL;

                if (!scriptUrl) {
                    throw new Error("Backend URL not configured");
                }

                const response = await fetch(scriptUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8',
                    },
                    body: JSON.stringify({ email }),
                });

                // With no-cors, we can't check response.ok, so we assume success if no error is thrown
                setStatus('success');

                // Success effect
                const tl = gsap.timeline();
                tl.to(headerRef.current, { color: '#4ade80', duration: 0.4 })
                    .to(buttonRef.current, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });

                setTimeout(() => {
                    setStatus('idle');
                    setEmail('');
                    gsap.to(headerRef.current, { color: 'rgba(255,255,255,0.7)', duration: 0.6 });
                }, 3000);

            } catch (err) {
                console.error("Newsletter submission error:", err);
                setErrMsg("Connection failed. Try again?");
                setStatus('error');

                setTimeout(() => {
                    setStatus('idle');
                }, 3000);
            }
        }
    };

    useGSAP(() => {
        if (status === 'error') {
            gsap.to(tooltipRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "back.out(1.7)",
                overwrite: "auto"
            });
            // Subtle shake on error
            gsap.to(containerRef.current, {
                x: 'random(-4, 4)',
                duration: 0.1,
                repeat: 5,
                yoyo: true,
                ease: "none",
                onComplete: () => gsap.set(containerRef.current, { x: 0 })
            });
        } else {
            gsap.to(tooltipRef.current, {
                opacity: 0,
                y: 10,
                duration: 0.3,
                ease: "power2.in",
                overwrite: "auto"
            });
        }
    }, { dependencies: [status, errMsg], scope: containerRef });

    return (
        <div className={`ys-newsletter-container ${inverted ? 'ys-newsletter-container--inverted' : ''}`} ref={containerRef} data-ys-skip="true">
            <p className={`ys-newsletter__header ${status === 'success' ? 'success' : ''}`} ref={headerRef}>
                {status === 'success' ? "Alright, you in." : "For news, discounts.."}
            </p>

            <form className="ys-newsletter" onSubmit={handleSubmit} noValidate>
                <div ref={tooltipRef} className="ys-newsletter__tooltip">{errMsg}</div>

                <div className="ys-newsletter__group">
                    <input
                        type="email"
                        id="newsletter-email"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (status === 'error') setStatus('idle');
                        }}
                        placeholder="Enter your email.."
                        className="ys-newsletter__input"
                        spellCheck="false"
                    />
                    <button
                        type="submit"
                        className={`ys-newsletter__button ${status === 'success' ? 'success' : ''}`}
                        ref={buttonRef}
                        aria-label="Subscribe"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default memo(Newsletter);
