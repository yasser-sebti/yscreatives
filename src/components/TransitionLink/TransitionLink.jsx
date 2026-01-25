import { useTransition } from '../../context/TransitionContext';

// Drop-in replacement for <Link> or <a href>
const TransitionLink = ({ to, children, className, ...props }) => {
    const { navigateWithTransition } = useTransition();

    const handleClick = (e) => {
        e.preventDefault();

        // Handle anchor links (hashes) properly
        if (to.startsWith('#')) {
            const element = document.querySelector(to);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }

        // Handle external links
        if (to.startsWith('http')) {
            window.open(to, '_blank');
            return;
        }

        navigateWithTransition(to);
    };

    return (
        <a href={to} className={className} onClick={handleClick} {...props}>
            {children}
        </a>
    );
};

export default TransitionLink;
