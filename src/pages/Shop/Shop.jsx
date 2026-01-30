import { useRef, useState, useEffect } from 'react';
import SEO from '../../components/SEO/SEO';
import { useTransition } from '../../context/TransitionContext';
import { products } from '../../data/shopData';
import ShopItem from '../../components/ShopItem/ShopItem';
import './Shop.css';
import { gsap, ScrollTrigger } from '../../gsap';

const Shop = () => {
    const containerRef = useRef(null);
    const { revealPage } = useTransition();
    const [currency, setCurrency] = useState('USD');

    useEffect(() => {
        revealPage();
    }, []);

    const handleAddToCart = (item) => {
        alert(`Added ${item.title} to cart! (Cart system coming soon)`);
    };

    return (
        <main className="ys-shop" ref={containerRef}>
            <SEO title="Shop" />

            <div className="ys-shop__container">
                <header className="ys-shop__header">
                    <h1 className="ys-shop__title" data-ys-reveal="text">The Shop</h1>

                    <div className="ys-shop__controls" data-ys-reveal="fade-up" data-ys-delay="0.2">
                        {['USD', 'EUR', 'DZD'].map((cur) => (
                            <button
                                key={cur}
                                className={`ys-shop__currency-btn ${currency === cur ? 'is-active' : ''}`}
                                onClick={() => setCurrency(cur)}
                            >
                                {cur}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="ys-shop__grid">
                    {products.map((item) => (
                        <ShopItem
                            key={item.id}
                            item={item}
                            currency={currency}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Shop;
