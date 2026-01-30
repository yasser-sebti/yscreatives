import { useRef, useEffect } from 'react';
import { gsap, useGSAP } from '../../gsap';
import TransitionLink from '../TransitionLink/TransitionLink';
import './MobileMenu.css';

const MobileMenu = ({ isOpen, onClose }) => {
    const menuRef = useRef(null);
    const shuttersRef = useRef([]);
    const linksRef = useRef([]);
    const footerRef = useRef(null);
    const tlRef = useRef(null);

    // Initial setup
    useGSAP(() => {
        const tl = gsap.timeline({ paused: true });
        tlRef.current = tl;

        // 1. Shutter Animation (Faster)
        tl.to(shuttersRef.current, {
            height: '100%',
            duration: 0.5,
            stagger: 0.05,
            ease: 'power3.inOut'
        });

        // 2. Line Mask Reveal (Text rises up)
        tl.fromTo(linksRef.current,
            { y: '110%' }, // Start below
            {
                y: '0%',
                duration: 0.6,
                stagger: 0.08,
                ease: 'power3.out'
            },
            "-=0.2"
        );

        tl.fromTo(footerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.4 },
            "-=0.4"
        );

    }, { scope: menuRef });

    // Handle Open/Close Logic
    useEffect(() => {
        if (!tlRef.current) return;

        if (isOpen) {
            gsap.set(menuRef.current, { visibility: 'visible' });
            tlRef.current.timeScale(1.2).play(); // Speed up slightly on open
        } else {
            tlRef.current.timeScale(1.5).reverse().then(() => {
                gsap.set(menuRef.current, { visibility: 'hidden' });
            });
        }
    }, [isOpen]);

    // Handle body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden'; // Ensure lock on all browsers
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [isOpen]);

    const addToShutters = (el) => {
        if (el && !shuttersRef.current.includes(el)) {
            shuttersRef.current.push(el);
        }
    };

    const addToLinks = (el) => {
        if (el && !linksRef.current.includes(el)) {
            linksRef.current.push(el);
        }
    };

    return (
        <div className="ys-mobile-menu" ref={menuRef}>
            <div className="ys-mobile-menu__shutters">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="ys-mobile-menu__shutter" ref={addToShutters}></div>
                ))}
            </div>

            <div className="ys-mobile-menu__content">
                <nav className="ys-mobile-menu__nav">
                    {['Home', 'About', 'Courses', 'Shop', 'Contact'].map((item) => (
                        <TransitionLink
                            key={item}
                            to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                            className="ys-mobile-menu__link"
                            onClick={onClose}
                        >
                            <span className="ys-mobile-menu__mask">
                                <span className="ys-mobile-menu__link-text" ref={addToLinks}>{item}</span>
                            </span>
                        </TransitionLink>
                    ))}
                </nav>

                <div className="ys-mobile-menu__footer" ref={footerRef}>
                    <p>© 2026 YS Creatives</p>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
