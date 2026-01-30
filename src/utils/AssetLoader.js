/**
 * PRELOAD ASSETS UTILITY
 * Ensures critical assets are loaded before the app rendered.
 * @param {Object} assets - Object containing arrays of URLs { images: [], videos: [], fonts: [] }
 * @returns {Promise} - Resolves when all assets are handled (success or failure)
 */
export const preloadAssets = (assets) => {
    const promises = [];

    // Preload Images
    if (assets.images) {
        assets.images.forEach((src) => {
            const p = new Promise((resolve) => {
                const img = new Image();
                img.src = src;
                img.onload = resolve;
                img.onerror = resolve; // Continue even if error
            });
            promises.push(p);
        });
    }

    // Preload Videos (Basic blob fetch to cache)
    if (assets.videos) {
        assets.videos.forEach((src) => {
            const p = fetch(src)
                .then(response => response.blob())
                .then(() => Promise.resolve())
                .catch(() => Promise.resolve()); // Fail silent
            promises.push(p);
        });
    }

    // Preload Fonts (if document.fonts API exists)
    if (assets.fonts && document.fonts) {
        assets.fonts.forEach((font) => {
            const p = document.fonts.load(`1em "${font}"`).catch(() => { });
            promises.push(p);
        });
    }

    // Timeout (safety net) - Force resolve after 3 seconds
    const timeout = new Promise((resolve) => setTimeout(resolve, 3000));

    return Promise.race([Promise.all(promises), timeout]);
};
