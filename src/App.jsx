import { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { gsap, useGSAP, ScrollTrigger, ScrollSmoother } from './gsap';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import LoadingSpinner from './components/Loading/LoadingSpinner';
import Scrollbar from './components/Scrollbar/Scrollbar';
import { TransitionProvider } from './context/TransitionContext';
import { useTransition } from './context/TransitionContext';
import { useGlobalReveal } from './hooks/useReveal';
import { preloadAssets } from './utils/AssetLoader';
import './styles/main.css';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function InnerApp() {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const smootherRef = useRef(null);
  const location = useLocation();
  const { isAnimating, isPendingReveal } = useTransition();

  // --- Audio Logic State ---
  const [audio, setAudio] = useState(null);
  const [isSoundOn, setIsSoundOn] = useState(false);

  // Initialize audio only when requested or after a delay to improve LCP
  useEffect(() => {
    const timer = setTimeout(() => {
      const a = new Audio('assets/sounds/background-ost.mp3');
      a.loop = true;
      setAudio(a);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // --- Audio Effect Logic ---
  useEffect(() => {
    if (!audio) return;

    if (isSoundOn) {
      audio.play().then(() => {
        gsap.to(audio, { volume: 0.4, duration: 1.5, ease: "sine.inOut" });
      }).catch(err => {
        console.warn("Audio playback blocked or failed:", err);
      });
    } else {
      gsap.to(audio, {
        volume: 0,
        duration: 1,
        ease: "sine.inOut",
        onComplete: () => {
          if (!isSoundOn) audio.pause();
        }
      });
    }
  }, [isSoundOn, audio]);

  // 1. Initialize ScrollSmoother ONCE to prevent "blank" frames or crashes during re-creation
  useGSAP(() => {
    smootherRef.current = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 0.8,
      effects: true,
      normalizeScroll: false,
      smoothTouch: 0.1,
    });

    return () => {
      if (smootherRef.current) smootherRef.current.kill();
    };
  }, { scope: wrapperRef }); // No dependencies - stay alive

  // 2. Handle Global Scroll Reset on Navigation
  useEffect(() => {
    // Disable browser scroll restoration to prevent conflicts with GSAP
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Force an absolute reset to the top (y:0)
    if (smootherRef.current) {
      // scrollTop(0) is an immediate jump, unlike scrollTo which can be smooth
      smootherRef.current.scrollTop(0);
    } else {
      window.scrollTo(0, 0);
    }

    // Refresh ScrollTrigger and Smoother after the new route renders
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
      if (smootherRef.current) {
        smootherRef.current.refresh();
        // Final safety jump to absolute zero
        smootherRef.current.scrollTop(0);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const [hasMounted, setHasMounted] = useState(false);

  // --- Asset Preloading Logic ---
  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const assetsToLoad = {
      images: [
        `${baseUrl}assets/images/hero-poster.webp`,
        `${baseUrl}assets/images/Yasser.webp`,
        `${baseUrl}assets/logos/Pandaify.svg`,
        `${baseUrl}assets/logos/Eli Network.svg`,
        `${baseUrl}assets/images/Project1.webp`,
        `${baseUrl}assets/images/Project2.webp`,
      ],
      videos: [
        `${baseUrl}assets/videos/yasser-animated.mp4`
      ],
      fonts: [
        'PP Editorial New',
        'DM Mono'
      ]
    };

    preloadAssets(assetsToLoad).then(() => {
      // Small buffer for rendering engine to settle
      setTimeout(() => {
        setHasMounted(true);
        // Refresh ScrollTrigger after mounting to prevent "footer stuck" issues
        ScrollTrigger.refresh();
      }, 600);
    });
  }, []);

  // Activate Surgical Global Reveal System
  useGlobalReveal(wrapperRef, location.pathname, isAnimating, isPendingReveal, hasMounted);

  // Global refresh on window load
  useEffect(() => {
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  const isInvertedPage = location.pathname === '/contact';

  return (
    <>
      {/* Initial Application Preloader - Only on refresh/first visit */}
      {!hasMounted && <LoadingSpinner />}

      {/* Header must be OUTSIDE of smooth-content if it is position: fixed */}
      {hasMounted && (
        <Header
          isSoundOn={isSoundOn}
          setIsSoundOn={setIsSoundOn}
          inverted={isInvertedPage}
        />
      )}

      <div id="smooth-wrapper" ref={wrapperRef} style={{ visibility: hasMounted ? 'visible' : 'hidden' }}>
        <div id="smooth-content" ref={contentRef}>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home appReady={hasMounted} />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              {/* Force redirect to home if route not found */}
              <Route path="*" element={<Home appReady={hasMounted} />} />
            </Routes>
          </Suspense>

          <Footer inverted={isInvertedPage} />
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <TransitionProvider>

        <Scrollbar />
        <InnerApp />
      </TransitionProvider>
    </Router>
  );
}
