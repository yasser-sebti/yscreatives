import { useRef, memo } from 'react';
import TransitionLink from '../TransitionLink/TransitionLink';
import { gsap, useGSAP } from '../../gsap';
import SoundWave from './SoundWave';

const Header = ({ isSoundOn, setIsSoundOn, inverted }) => {
    const headerRef = useRef(null);

    useGSAP((context, contextSafe) => {
        // ... existing magnetic logic ...
        const magneticElements = gsap.utils.toArray(".ys-magnetic");

        const handlers = magneticElements.map((el) => {
            const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
            const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

            const onMove = contextSafe((e) => {
                const { clientX, clientY } = e;
                const { height, width, left, top } = el.getBoundingClientRect();
                const x = clientX - (left + width / 2);
                const y = clientY - (top + height / 2);
                xTo(x * 0.7);
                yTo(y * 0.7);
            });

            const onLeave = contextSafe(() => {
                xTo(0);
                yTo(0);
            });

            el.addEventListener("mousemove", onMove);
            el.addEventListener("mouseleave", onLeave);

            return { el, onMove, onLeave };
        });

        return () => {
            handlers.forEach(({ el, onMove, onLeave }) => {
                el.removeEventListener("mousemove", onMove);
                el.removeEventListener("mouseleave", onLeave);
            });
        };
    }, { scope: headerRef, dependencies: [] });

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
