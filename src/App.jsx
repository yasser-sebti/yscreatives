import { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { gsap, useGSAP, ScrollTrigger, ScrollSmoother } from './gsap';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import LoadingSpinner from './components/Loading/LoadingSpinner';
import Scrollbar from './components/Scrollbar/Scrollbar';
import { TransitionProvider } from './context/TransitionContext';
import { useTransition } from './context/TransitionContext';
import { SoundProvider, useSound } from './context/SoundContext';
import { useGlobalReveal } from './hooks/useReveal';
import { useClickSound } from './hooks/useClickSound';
import { useBackgroundAudio } from './hooks/useBackgroundAudio';
import { preloadAssets } from './utils/AssetLoader';
import './styles/main.css';

// Lazy load pages for performance
import SkipLink from './components/Accessibility/SkipLink';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function InnerApp() {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const smootherRef = useRef(null);
  const location = useLocation();
  const { isAnimating, isPendingReveal } = useTransition();

  // --- Audio Logic State ---
  const { isSoundOn, setIsSoundOn } = useSound();

  // --- Audio Effect Logic ---
  // Advanced hook handles Crossfade Loop + Snappy Transitions
  useBackgroundAudio(isSoundOn);



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
  const [showLoader, setShowLoader] = useState(true);

  // --- Asset Preloading Logic ---
  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const assetsToLoad = {
      images: [
        `${baseUrl}assets/images/Yasser.webp`,
        `${baseUrl}assets/logos/Pandaify.svg`,
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

    preloadAssets(assetsToLoad)
      .then(() => {
        // Small buffer for rendering engine to settle
        setTimeout(() => {
          setHasMounted(true); // Triggers Fade Out

          // Remove from DOM after transition completes
          setTimeout(() => setShowLoader(false), 800);

          // Refresh ScrollTrigger after mounting to prevent "footer stuck" issues
          ScrollTrigger.refresh();
        }, 600);
      })
      .catch((err) => {
        console.error("Asset preloading failed:", err);
        // Fallback: Show app anyway
        setHasMounted(true);
      });
  }, []);

  // Activate Surgical Global Reveal System
  useGlobalReveal(wrapperRef, location.pathname, isAnimating, isPendingReveal, hasMounted);

  // 404 is a dark page, so it should NOT use the inverted (white) header/footer.
  const is404 = !['/', '/about', '/contact'].includes(location.pathname);
  const isInvertedPage = location.pathname === '/contact';

  // Global Click Sound Effect (Exceptions: Allow clicks on 404 even if sound is off)
  useClickSound(isSoundOn || is404);


  // Global refresh on window load
  useEffect(() => {
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  return (
    <>
      <SkipLink />
      {/* Initial Application Preloader - Fades out smoothly */}
      {showLoader && <LoadingSpinner isExiting={hasMounted} />}

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
          <div id="main-content" style={{ position: 'absolute', top: 0, left: 0 }} />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home appReady={hasMounted} isSoundOn={isSoundOn} />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              {/* Force redirect to home if route not found */}
              <Route path="*" element={<NotFound />} />
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
      <SoundProvider>
        <TransitionProvider>
          <Scrollbar />
          <InnerApp />
        </TransitionProvider>
      </SoundProvider>
    </Router>
  );
}
