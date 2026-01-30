import { useRef } from 'react';
import { gsap, useGSAP } from '../../gsap';
import { instagramPosts } from '../../data/instagramData';
import './InstagramFeed.css';

const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // If invalid date (e.g. older format), try manual parse or fallback
    if (isNaN(date.getTime())) {
        const [day, month, year] = dateString.split('.').map(Number);
        date.setFullYear(year, month - 1, day);
    }
    const seconds = Math.floor((new Date() - date) / 1000);

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
        }
    }
    return 'Just now';
};

const InstagramFeed = () => {
    const containerRef = useRef(null);

    // Global reveal system handles animations now
    // We just pass index to children for staggering

    return (
        <section className="ys-insta" ref={containerRef}>
            <header className="ys-insta__header">
                <h2 className="ys-insta__title" data-ys-reveal="text">Latest Highlights</h2>
                <a
                    href="https://www.instagram.com/yasser.creatives"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ys-button"
                    data-ys-reveal="fade-up"
                    data-ys-delay="0.2"
                >
                    Instagram
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '10px', display: 'inline-block', verticalAlign: 'middle' }}>
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                </a>
            </header>

            <div className="ys-insta__grid">
                {instagramPosts.map((post, index) => (
                    <PostCard key={post.id} post={post} delay={index * 0.1} />
                ))}
            </div>
        </section>
    );
};

const PostCard = ({ post, delay }) => {
    const imageRef = useRef(null);

    return (
        <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="ys-insta-card"
            data-ys-reveal="image"
            data-ys-delay={delay}
            onMouseEnter={() => {
                gsap.to(imageRef.current, {
                    scale: 1.08,
                    duration: 0.8,
                    ease: "power3.out",
                    overwrite: "auto"
                });
            }}
            onMouseLeave={() => {
                gsap.to(imageRef.current, {
                    scale: 1,
                    duration: 0.6,
                    ease: "power3.out",
                    overwrite: "auto"
                });
            }}
        >            {/* Main Image */}
            <div className="ys-insta-card__image-wrapper">
                <img
                    ref={imageRef}
                    src={post.image}
                    alt="Instagram Post"
                    className="ys-insta-card__image"
                    loading="lazy"
                />
            </div>

            {/* Actions: Heart, Comment, Share ... Bookmark */}
            <div className="ys-insta-card__actions">
                <div className="ys-insta-card__icons-left">
                    <svg className="ys-insta-card__icon ys-insta-card__icon--heart" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    <svg className="ys-insta-card__icon" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    <svg className="ys-insta-card__icon" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </div>
                <div className="ys-insta-card__icons-right">
                    <svg className="ys-insta-card__icon" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                </div>
            </div>

            {/* Caption */}
            <div className="ys-insta-card__caption">
                {post.caption}
            </div>

            <div className="ys-insta-card__date">
                {formatTimeAgo(post.date)}
            </div>
        </a>
    );
};

export default InstagramFeed;
