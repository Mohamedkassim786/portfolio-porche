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
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loadedAssets, setLoadedAssets] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const handlePreloaderComplete = ({ aboutFrames, expFrames }) => {
    setLoadedAssets({ aboutFrames, expFrames });
    setIsReady(true);
    // Refresh ScrollTrigger after DOM has settled
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  };

  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="portfolio-app">
      {/* 100% Asset Preloader */}
      <Preloader onComplete={handlePreloaderComplete} />

      {/* Global Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero ready={isReady} />

      {/* About Section (144-Frame Sequence) */}
      <About preloadedFrames={loadedAssets?.aboutFrames || []} />

      {/* Projects Section (3D Coverflow) */}
      <Projects />

      {/* Skills Section (Matter.js 2D Physics Gravity Gallery) */}
      <Skills />

      {/* Experience & Achievements Section (144-Frame Sequence + Slides) */}
      <Experience preloadedFrames={loadedAssets?.expFrames || []} />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </div>
  );
}
