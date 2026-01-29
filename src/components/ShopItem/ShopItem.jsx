import { useRef } from 'react';
import { gsap, useGSAP } from '../../gsap';
import { useMagnetic } from '../../hooks/useMagnetic';

const ShopItem = ({ item, currency, onAddToCart }) => {
    // Determine price based on currency
    const price = item.price[currency] || item.price.USD;
    const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'DZD ';

    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const tl = useRef(null);

    useGSAP(() => {
        // Create a paused timeline for the hover effect
        // Faster and snappier as requested
        tl.current = gsap.timeline({ paused: true, defaults: { ease: "power3.out", duration: 0.6 } })
            .to(imageRef.current, {
                scale: 1.05,
                rotation: 0.01, // Hack to prevent sub-pixel jitter
                transformOrigin: "center center",
                force3D: true, // Forces GPU acceleration to prevent stutter
                overwrite: "auto"
            });
    }, { scope: containerRef });

    const handleMouseEnter = () => {
        if (tl.current) tl.current.play();
    };

    const handleMouseLeave = () => {
        if (tl.current) tl.current.reverse();
    };

    return (
        <div
            ref={containerRef}
            className="ys-shop-item"
            data-ys-reveal="fade-up"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="ys-shop-item__image-wrapper">
                <img
                    ref={imageRef}
                    src={item.image}
                    alt={item.title}
                    className="ys-shop-item__image"
                    loading="lazy"
                />
            </div>

            <div className="ys-shop-item__details">
                <h3 className="ys-shop-item__title">{item.title}</h3>
                <div className="ys-shop-item__meta">
                    <span className="ys-shop-item__category">{item.category}</span>
                    <span className="ys-shop-item__price">{currency === 'DZD' ? `${price} DZD` : `${currencySymbol}${price}`}</span>
                </div>
                <button
                    className="ys-shop-item__cart-btn"
                    onClick={() => onAddToCart(item)}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ShopItem;
