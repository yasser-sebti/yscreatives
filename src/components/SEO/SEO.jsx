import { useEffect } from 'react';

/**
 * SEO Component
 * Dynamically updates the document title and meta tags for each page.
 * @param {string} title - The page-specific title (e.g. "About" -> "About | Yasser Creatives")
 */
const SEO = ({ title }) => {
    useEffect(() => {
        // Store previous title to restore on unmount (optional, but good practice)
        const prevTitle = document.title;

        // Update Title
        document.title = `${title} | Yasser Creatives`;

        return () => {
            // Restore? No, usually we just let the next page overwrite it.
            // But if we unmount to a state without SEO, it keeps the last one.
        };
    }, [title]);

    return null; // Logic only, no UI
};

export default SEO;
