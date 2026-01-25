import { useState, useEffect } from 'react';

/**
 * Enhanced Image component with progressive loading for first-time visitors
 * Features:
 * - Low-quality placeholder (solid color with blur)
 * - Priority preloading for above-fold images
 * - Smooth crossfade transition
 * - Error handling with fallback
 * - WebP format optimization
 */
const SimpleImage = ({
    src,
    alt,
    className = '',
    loading = 'lazy',
    decoding = 'async',
    fetchPriority = 'auto',
    width,
    height,
    lowQualityPlaceholder = true,
    placeholderColor = '#1a1a1a',
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isPreloaded, setIsPreloaded] = useState(false);

    // Get dominant color based on image filename for better placeholder
    const getPlaceholderColor = () => {
        const fileName = src?.split('/').pop() || '';
        const colorMap = {
            'Image1.webp': '#2c3e50', // Dark blue-gray
            'Image2.webp': '#34495e', // Slate blue
            'Image3.webp': '#2c3e50', // Dark blue-gray
            'Yasser Background.webp': '#0a0a0a', // Very dark
        };
        return colorMap[fileName] || placeholderColor;
    };

    const placeholderBgColor = getPlaceholderColor();

    // Preload image when component mounts
    useEffect(() => {
        if (!src || hasError) return;

        // Create image element for preloading
        const img = new Image();
        img.src = src;
        img.decoding = decoding;
        img.fetchpriority = fetchPriority;

        // Set up load/error handlers
        img.onload = () => {
            setIsPreloaded(true);
        };
        img.onerror = () => {
            setHasError(true);
        };

        // Cleanup
        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src, decoding, fetchPriority, hasError]);

    const handleLoad = (e) => {
        setIsLoaded(true);
        if (props.onLoad) props.onLoad(e);
    };

    const handleError = (e) => {
        setHasError(true);
        if (props.onError) props.onError(e);
    };

    return (
        <div className={`ys-simple-image-wrapper ${className}`} style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Low-quality placeholder (shows immediately) */}
            {lowQualityPlaceholder && !hasError && (
                <div
                    className="ys-simple-image-placeholder"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: placeholderBgColor,
                        filter: 'blur(10px)',
                        opacity: isLoaded ? 0 : 0.8,
                        transition: 'opacity 0.4s ease-out',
                        zIndex: 1,
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Main image - using WebP format */}
            <img
                src={src}
                alt={alt}
                loading={loading}
                decoding={decoding}
                fetchPriority={fetchPriority}
                width={width}
                height={height}
                className={`ys-simple-image ${isLoaded ? 'ys-simple-image-loaded' : ''} ${hasError ? 'ys-simple-image-error' : ''}`}
                onLoad={handleLoad}
                onError={handleError}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.4s ease-in-out',
                    zIndex: 2,
                    // Will-change for GPU acceleration
                    willChange: 'opacity',
                }}
                {...props}
            />

            {/* Loading indicator (only shows if taking too long) */}
            {!isLoaded && !hasError && !isPreloaded && (
                <div
                    className="ys-simple-image-loading-indicator"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '40px',
                        height: '40px',
                        border: '2px solid rgba(255,255,255,0.1)',
                        borderTopColor: 'rgba(255,255,255,0.6)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        zIndex: 3,
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Error fallback */}
            {hasError && (
                <div
                    className="ys-simple-image-error-fallback"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#1a1a1a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#666',
                        fontSize: '14px',
                        zIndex: 3,
                    }}
                >
                    Image failed to load
                </div>
            )}
        </div>
    );
};

export default SimpleImage;