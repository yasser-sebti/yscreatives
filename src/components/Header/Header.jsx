import { useRef, useState, memo } from 'react';
import TransitionLink from '../TransitionLink/TransitionLink';
import { useMagnetic } from '../../hooks/useMagnetic';
import SoundWave from './SoundWave';
import MobileMenu from './MobileMenu';
import './Header.css';

const Header = ({ isSoundOn, setIsSoundOn, inverted }) => {
    const headerRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useMagnetic(headerRef, ".ys-magnetic", 0.7);

    return (
        <>
            <header className={`ys-header ${inverted ? 'is-inverted' : ''} ${isMobileMenuOpen ? 'is-menu-open' : ''}`} ref={headerRef}>
                <div className="ys-header__logo">
                    <TransitionLink to="/" className="ys-magnetic">
                        <img
                            src={`${import.meta.env.BASE_URL}assets/images/${(inverted && !isMobileMenuOpen) ? 'Logo Black.png' : 'Logo White.png'}`}
                            alt="Yasser Creatives"
                            className="ys-header__logo-img"
                            width="100"
                            height="40"
                        />
                    </TransitionLink>
                </div>

                {/* Desktop Nav */}
                <nav className="ys-header__nav">
                    <div className="ys-header__nav-left">
                        <TransitionLink to="/courses" className="ys-header__link ys-header__link--special ys-magnetic">Courses</TransitionLink>
                    </div>

                    <div className="ys-header__nav-main">
                        <TransitionLink to="/" className="ys-header__link">Home</TransitionLink>
                        <TransitionLink to="/about" className="ys-header__link">About</TransitionLink>
                        <TransitionLink to="/shop" className="ys-header__link">Shop</TransitionLink>
                        <TransitionLink to="/contact" className="ys-header__link">Contact</TransitionLink>
                    </div>

                    <div className="ys-header__nav-right">
                        <button
                            className="ys-header__sound-toggle ys-magnetic"
                            onClick={() => setIsSoundOn(!isSoundOn)}
                        >
                            <span>Sound {isSoundOn ? 'on' : 'off'}</span>
                            <SoundWave isSoundOn={isSoundOn} />
                        </button>
                    </div>
                </nav>

                {/* Mobile Hamburger */}
                <button
                    className={`ys-header__hamburger ys-magnetic ${isMobileMenuOpen ? 'is-active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="ys-hamburger__line"></span>
                    <span className="ys-hamburger__line"></span>
                </button>
            </header>

            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        </>
    );
};

export default memo(Header);
