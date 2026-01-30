import { memo } from 'react';
import { useTransition } from '../../context/TransitionContext';

// Drop-in replacement for <Link> or <a href>
const TransitionLink = ({ to, children, className, ...props }) => {
    const { navigateWithTransition } = useTransition();

    const handleClick = (e) => {
        // Allow external onClick to fire first (e.g., closing menus)
        if (props.onClick) props.onClick(e);

        // Handle anchor links (hashes) properly via ScrollSmoother
        if (to.startsWith('#')) {
            e.preventDefault();
            const smoother = ScrollSmoother.get();
            if (smoother) {
                smoother.scrollTo(to, true, "top top");
            } else {
                const element = document.querySelector(to);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }

        // Handle external links (let browser handle standard behavior)
        if (to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:')) {
            return;
        }

        e.preventDefault();
        navigateWithTransition(to);
    };

    return (
        <a href={to} className={className} {...props} onClick={handleClick}>
            {children}
        </a>
    );
};

export default memo(TransitionLink);
