/**
 * AssetLoader Utility
 * Manages preloading of Fonts, Images, and Videos with a fail-safe timeout.
 */
export const preloadAssets = (assets = {}) => {
    const { images = [], videos = [], fonts = [] } = assets;
    const total = images.length + videos.length + fonts.length;
    let loaded = 0;

    if (total === 0) return Promise.resolve();

    return new Promise((resolve) => {
        // Fail-safe timeout: 3 seconds
        const timeout = setTimeout(() => {
            console.warn("Asset preloading timed out. Proceeding with partially loaded assets.");
            resolve();
        }, 3000);

        const checkDone = () => {
            loaded++;
            if (loaded === total) {
                clearTimeout(timeout);
                resolve();
            }
        };

        // 1. Preload Fonts
        if (fonts.length > 0) {
            if (document.fonts) {
                fonts.forEach(font => {
                    document.fonts.load(`1em "${font}"`)
                        .then(checkDone)
                        .catch(err => {
                            console.error(`Font load failed: ${font}`, err);
                            checkDone();
                        });
                });
            } else {
                // Fallback for browsers without document.fonts
                fonts.forEach(() => checkDone());
            }
        }

        // 2. Preload Images
        images.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = checkDone;
            img.onerror = () => {
                console.error(`Image load failed: ${src}`);
                checkDone();
            };
        });

        // 3. Preload Videos (Critical for Hero)
        videos.forEach(src => {
            const video = document.createElement('video');
            video.src = src;
            video.preload = 'auto';

            // We wait for 'canplaythrough' which indicates enough data is loaded to play without buffering
            const onCanPlay = () => {
                video.removeEventListener('canplaythrough', onCanPlay);
                video.removeEventListener('error', onError);
                checkDone();
            };

            const onError = (e) => {
                video.removeEventListener('canplaythrough', onCanPlay);
                video.removeEventListener('error', onError);
                console.error(`Video load failed: ${src}`, e);
                checkDone();
            };

            video.addEventListener('canplaythrough', onCanPlay);
            video.addEventListener('error', onError);
            video.load();
        });
    });
};
