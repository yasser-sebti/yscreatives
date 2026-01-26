import { useRef, memo } from 'react';
import TransitionLink from '../TransitionLink/TransitionLink';
import { useMagnetic } from '../../hooks/useMagnetic';
import SoundWave from './SoundWave';

const Header = ({ isSoundOn, setIsSoundOn, inverted }) => {
    const headerRef = useRef(null);

    useMagnetic(headerRef, ".ys-magnetic", 0.7);

    return (
        <header className={`ys-header ${inverted ? 'is-inverted' : ''}`} ref={headerRef}>
            <div className="ys-header__logo">
                <TransitionLink to="/" className="ys-magnetic">YC</TransitionLink>
            </div>
            <nav className="ys-header__nav">
                <div className="ys-header__nav-left">
                    <TransitionLink to="#courses" className="ys-header__link ys-header__link--special ys-magnetic">Courses</TransitionLink>
                </div>

                <div className="ys-header__nav-main">
                    <TransitionLink to="/" className="ys-header__link">Home</TransitionLink>
                    <TransitionLink to="/about" className="ys-header__link">About</TransitionLink>
                    <TransitionLink to="#work" className="ys-header__link">Selected work</TransitionLink>
                    <TransitionLink to="#resources" className="ys-header__link">Resources</TransitionLink>
                    <TransitionLink to="#pricing" className="ys-header__link">Pricing</TransitionLink>
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
        </header>
    );
};

export default memo(Header);
