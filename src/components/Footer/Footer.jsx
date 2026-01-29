import { useState, useEffect, memo } from 'react';
import TransitionLink from '../TransitionLink/TransitionLink';
import Newsletter from '../Newsletter/Newsletter';

const Footer = ({ inverted = false }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <footer className={`ys-footer ${inverted ? 'ys-footer--inverted' : ''}`} data-ys-skip="true">
            <div className="ys-footer__main">
                <div className="ys-footer__grid">
                    {/* Column 1: Wordmark */}
                    <div className="ys-footer__col ys-footer__col--wordmark">
                        <h2 className="ys-footer__wordmark">
                            <img
                                src={`${import.meta.env.BASE_URL}assets/images/${inverted ? 'Logo horizontal black.png' : 'Logo horizontal white.png'}`}
                                alt="Yasser Creatives"
                                className="ys-footer__wordmark-img"
                                width="300"
                                height="auto"
                            />
                        </h2>
                    </div>

                    {/* Column 2: Say Hello & Based In */}
                    <div className="ys-footer__col">
                        <div className="ys-footer__section">
                            <p className="ys-footer__label">Say hello</p>
                            <a href="mailto:contact@yasserscreatives.com" className="ys-footer__link">contact@yasserscreatives.com</a>
                            <p className="ys-footer__text">+213 660 899 113</p>
                        </div>
                        <div className="ys-footer__section">
                            <p className="ys-footer__label">Based in</p>
                            <p className="ys-footer__text">Cite souprim, Berrahal, Annaba, Algeria</p>
                        </div>
                    </div>

                    {/* Column 3: Directory */}
                    <div className="ys-footer__col">
                        <p className="ys-footer__label">Directory</p>
                        <div className="ys-footer__links-grid ys-footer__links-grid--two-col">
                            <TransitionLink to="/" className="ys-footer__link">Home</TransitionLink>
                            <TransitionLink to="/about" className="ys-footer__link">About</TransitionLink>
                            <TransitionLink to="#work" className="ys-footer__link">Selected work</TransitionLink>
                            <TransitionLink to="#resources" className="ys-footer__link">Resources</TransitionLink>
                            <TransitionLink to="#courses" className="ys-footer__link">Courses</TransitionLink>
                            <TransitionLink to="#pricing" className="ys-footer__link">Pricing</TransitionLink>
                            <TransitionLink to="#contact" className="ys-footer__link">Contact</TransitionLink>
                        </div>
                    </div>

                    {/* Column 4: Connect & Stay Updated */}
                    <div className="ys-footer__col">
                        <div className="ys-footer__section">
                            <p className="ys-footer__label">Connect</p>
                            <div className="ys-footer__links-grid ys-footer__links-grid--two-col">
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="ys-footer__link">Instagram</a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="ys-footer__link">LinkedIn</a>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="ys-footer__link">Facebook</a>
                                <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="ys-footer__link">Behance</a>
                            </div>
                        </div>

                        <div className="ys-footer__section">
                            <p className="ys-footer__label">Stay updated</p>
                            <div className="ys-footer__newsletter-wrapper">
                                <Newsletter inverted={inverted} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ys-footer__bottom">
                    <div className="ys-footer__info">
                        <div className="ys-footer__info-item">
                            <span className="ys-footer__info-label">Local Time / </span>
                            <span className="ys-footer__time">{formatTime(time)} (GMT+1)</span>
                        </div>
                    </div>

                    <div className="ys-footer__copy-wrap">
                        <div className="ys-footer__legal">
                            <TransitionLink to="/privacy" className="ys-footer__legal-link">Privacy & policy</TransitionLink>
                            <TransitionLink to="/cookies" className="ys-footer__legal-link">Cookies</TransitionLink>
                        </div>
                        <p className="ys-footer__copyright">© 2026 Yasser Creatives.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default memo(Footer);
