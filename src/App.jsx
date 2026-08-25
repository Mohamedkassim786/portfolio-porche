import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Contact from './components/Contact';
import SmokeSystem from './components/SmokeSystem';

gsap.registerPlugin(ScrollTrigger);

// Optimize ScrollTrigger for high-DPI Android/OnePlus 90Hz screens (ignore address-bar resize jumps)
ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
});

export default function App() {
  const [loadedAssets, setLoadedAssets] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const handlePreloaderComplete = ({ aboutFrames, expFrames }) => {
    setLoadedAssets({ aboutFrames, expFrames });
    setIsReady(true);

    // Refresh ScrollTrigger cleanly once DOM is settled
    [50, 150, 400, 800].forEach((delay) => {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, delay);
    });
  };

  useEffect(() => {
    let resizeTimer = null;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="portfolio-app">
      {/* 100% Asset Preloader Screen */}
      <Preloader onComplete={handlePreloaderComplete} />

      {/* Atmospheric Smoke & Touch/Cursor Trail Engine */}
      <SmokeSystem />

      {/* Luxury Navigation Header */}
      <Navbar />

      {/* Hero Section */}
      <Hero ready={isReady} />

      {/* About Section (144-Frame Canvas Sequence Scrubbed by ScrollTrigger) */}
      <About preloadedFrames={loadedAssets?.aboutFrames || []} />

      {/* Featured Projects (3D Perspective Coverflow Gallery) */}
      <Projects />

      {/* Skills Section (Matter.js 2D Physics Gravity Gallery) */}
      <Skills />

      {/* Experience & Achievements (144-Frame Canvas Sequence + Pinned Slides) */}
      <Experience preloadedFrames={loadedAssets?.expFrames || []} />

      {/* Contact Section & Footer */}
      <Contact />
    </div>
  );
}
