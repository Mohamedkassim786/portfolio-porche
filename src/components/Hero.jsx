import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ArrowRight } from 'lucide-react';
import InteractiveText from './InteractiveText';

gsap.registerPlugin(ScrollToPlugin);

export default function Hero({ ready }) {
  const videoRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    if (!ready) return;

    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      const nameChars = document.querySelectorAll('.hero-name .char');
      const roleChars = document.querySelectorAll('.hero-role .char');
      const descChars = document.querySelectorAll('.hero-description .char');

      if (nameChars.length > 0) {
        tl.fromTo(
          nameChars,
          { opacity: 0, y: 35, rotateX: -85, scale: 1.2, filter: 'blur(10px)' },
          { opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)', duration: 0.55, stagger: 0.03, ease: 'power3.out' },
          0.1
        );
      }

      if (roleChars.length > 0) {
        tl.fromTo(
          roleChars,
          { opacity: 0, x: -16, scale: 0.9, filter: 'blur(5px)' },
          { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)', duration: 0.45, stagger: 0.01, ease: 'power2.out' },
          0.45
        );
      }

      if (descChars.length > 0) {
        tl.fromTo(
          descChars,
          { opacity: 0, y: 14, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, stagger: 0.005, ease: 'power2.out' },
          0.65
        );
      }

      tl.fromTo(
        '.btn-cta',
        { opacity: 0, y: 18, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.1, ease: 'back.out(1.5)' },
        0.85
      ).fromTo(
        '.scroll-indicator',
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        1.0
      );
    }, heroRef);

    return () => ctx.revert();
  }, [ready]);

  const scrollTo = (id) => {
    const targetElem = document.getElementById(id);
    if (!targetElem) return;

    gsap.to(window, {
      scrollTo: {
        y: targetElem,
        autoKill: false,
      },
      duration: 0.45,
      ease: 'power3.out',
    });
  };

  return (
    <section className="hero" id="hero" ref={heroRef}>
      {/* Background Video Container */}
      <div className="video-container">
        <video
          ref={videoRef}
          id="hero-video"
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
        >
          <source src="/assets/Hero.mp4" type="video/mp4" />
          <source src="/Hero.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* Atmospheric Smoke Layer */}
      <canvas id="smoke-canvas"></canvas>

      {/* Hero Content */}
      <div className="hero-content">
        <div className="hero-text-block">
          <h1 className="hero-name">
            <span className="hero-name-first">
              <InteractiveText text="MOHAMED" smokeType="hero" />
            </span>
            <span className="hero-name-last">
              <InteractiveText text="KASSIM M" isRed={true} smokeType="hero" />
            </span>
          </h1>

          <p className="hero-role">
            <InteractiveText text="FULL-STACK DEVELOPER · AI ENTHUSIAST" smokeType="hero" />
          </p>

          <p className="hero-description">
            <InteractiveText
              text="Building real-world digital experiences with code and AI."
              smokeType="hero"
            />
          </p>

          <div className="hero-buttons">
            <a
              href="#about"
              className="btn btn-primary btn-cta"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('about');
              }}
            >
              <span>ABOUT ME</span>
              <ArrowRight className="btn-icon" size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Down Hint */}
      <div className="scroll-indicator">
        <span className="scroll-text">SCROLL DOWN</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
