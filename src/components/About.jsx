import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ArrowRight } from 'lucide-react';
import InteractiveText from './InteractiveText';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const TOTAL_FRAMES = 144;

export default function About({ preloadedFrames = [] }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const sequenceState = useRef({ frame: 0 });
  const fallbackCache = useRef({});
  const lastDrawnIdxRef = useRef(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;

    const drawFrameToCanvas = (img) => {
      if (!img || img.naturalWidth === 0) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const canvasAspect = cw / ch;
      const imgAspect = iw / ih;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (canvasAspect > imgAspect) {
        drawWidth = cw;
        drawHeight = cw / imgAspect;
        offsetX = 0;
        offsetY = (ch - drawHeight) / 2;
      } else {
        drawWidth = ch * imgAspect;
        drawHeight = ch;
        offsetX = (cw - drawWidth) / 2;
        offsetY = 0;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const getFrameImage = (idx) => {
      if (preloadedFrames[idx] && preloadedFrames[idx].complete && preloadedFrames[idx].naturalWidth > 0) {
        return preloadedFrames[idx];
      }
      if (fallbackCache.current[idx]) {
        return fallbackCache.current[idx];
      }
      const img = new Image();
      const numStr = String(idx).padStart(6, '0');
      img.src = `/About%20frames/frame_${numStr}.jpg`;
      fallbackCache.current[idx] = img;
      img.onload = () => {
        if (Math.round(sequenceState.current.frame) === idx) {
          drawFrameToCanvas(img);
          lastDrawnIdxRef.current = idx;
        }
      };
      return img;
    };

    const renderFrame = (force = false) => {
      const currentIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(sequenceState.current.frame)));
      if (!force && currentIdx === lastDrawnIdxRef.current) return;

      const img = getFrameImage(currentIdx);

      if (img && img.complete && img.naturalWidth > 0) {
        lastDrawnIdxRef.current = currentIdx;
        drawFrameToCanvas(img);
        return;
      }

      for (let offset = 1; offset < 30; offset++) {
        const prevIdx = currentIdx - offset;
        if (prevIdx >= 0) {
          const prev = preloadedFrames[prevIdx] || fallbackCache.current[prevIdx];
          if (prev && prev.complete && prev.naturalWidth > 0) {
            lastDrawnIdxRef.current = currentIdx;
            drawFrameToCanvas(prev);
            return;
          }
        }
        const nextIdx = currentIdx + offset;
        if (nextIdx < TOTAL_FRAMES) {
          const next = preloadedFrames[nextIdx] || fallbackCache.current[nextIdx];
          if (next && next.complete && next.naturalWidth > 0) {
            lastDrawnIdxRef.current = currentIdx;
            drawFrameToCanvas(next);
            return;
          }
        }
      }
    };

    const resizeCanvas = () => {
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      renderFrame(true);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    renderFrame(true);

    const triggerCtx = gsap.context(() => {
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: isMobile ? '+=160%' : '+=320%',
          pin: '.about-pin-container',
          pinSpacing: true,
          scrub: isMobile ? 0.05 : 0.25,
          anticipatePin: 1,
          fastScrollEnd: true,
        },
      });

      // 1. Scrub Frame Sequence
      aboutTl.to(sequenceState.current, {
        frame: TOTAL_FRAMES - 1,
        ease: 'none',
        duration: 0.78,
        onUpdate: () => renderFrame(false),
      }, 0);

      // 2. Contrast Overlay Deepening
      aboutTl.to('.about-overlay', {
        opacity: 1,
        ease: 'power1.inOut',
        duration: 0.25,
      }, 0.50);

      // 3. Badge Reveal
      aboutTl.fromTo('#about-badge',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' },
        0.58
      );

      // 4. Headline 1
      const line1Chars = document.querySelectorAll('.about-headline-first .char');
      if (line1Chars.length > 0) {
        aboutTl.fromTo(line1Chars,
          { opacity: 0, y: isMobile ? 14 : 28, rotateX: isMobile ? 0 : -85, scale: isMobile ? 1 : 1.15 },
          { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.18, stagger: isMobile ? 0.005 : 0.012, ease: 'power2.out' },
          0.60
        );
      }

      // 5. Headline 2
      const line2Chars = document.querySelectorAll('.about-headline-last .char');
      if (line2Chars.length > 0) {
        aboutTl.fromTo(line2Chars,
          { opacity: 0, y: isMobile ? 14 : 28, rotateY: isMobile ? 0 : 60 },
          { opacity: 1, y: 0, rotateY: 0, duration: 0.18, stagger: isMobile ? 0.005 : 0.014, ease: 'power2.out' },
          0.63
        );
      }

      // 6. Bio Paragraph 1
      const p1Chars = document.querySelectorAll('.about-p-first .char');
      if (p1Chars.length > 0) {
        aboutTl.fromTo(p1Chars,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.14, stagger: isMobile ? 0.001 : 0.003, ease: 'power2.out' },
          0.68
        );
      }

      // 7. Bio Paragraph 2
      const p2Chars = document.querySelectorAll('.about-p-second .char');
      if (p2Chars.length > 0) {
        aboutTl.fromTo(p2Chars,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.14, stagger: isMobile ? 0.001 : 0.003, ease: 'power2.out' },
          0.71
        );
      }

      // 8. CTA Buttons Reveal (Early and completely stable)
      aboutTl.fromTo('.about-btn-cta',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.08, stagger: 0.04, ease: 'power2.out' },
        0.73
      );
    }, sectionRef);

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      triggerCtx.revert();
    };
  }, [preloadedFrames]);

  const scrollTo = (id) => {
    if (id === 'work') {
      const allTriggers = ScrollTrigger.getAll();
      const aboutTrigger = allTriggers.find(
        (st) => st.trigger && (st.trigger.id === 'about' || st.trigger.classList?.contains('about-section'))
      );
      const targetY = aboutTrigger ? aboutTrigger.end + 20 : (document.getElementById('work')?.offsetTop || 0);

      gsap.to(window, {
        scrollTo: { y: targetY, autoKill: false },
        duration: 0.35,
        ease: 'power2.out',
      });
      return;
    }

    if (id === 'contact') {
      const allTriggers = ScrollTrigger.getAll();
      const expTrigger = allTriggers.find(
        (st) => st.trigger && (st.trigger.id === 'experience' || st.trigger.classList?.contains('experience-section'))
      );
      const targetY = expTrigger ? expTrigger.end + 20 : (document.getElementById('contact')?.offsetTop || 0);

      gsap.to(window, {
        scrollTo: { y: targetY, autoKill: false },
        duration: 0.45,
        ease: 'power2.out',
      });
      return;
    }

    const targetElem = document.getElementById(id);
    if (!targetElem) return;

    gsap.to(window, {
      scrollTo: {
        y: targetElem,
        autoKill: false,
      },
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  return (
    <section className="about-section" id="about" ref={sectionRef}>
      <div className="about-pin-container">
        {/* 144-Frame Canvas Sequence */}
        <canvas ref={canvasRef} id="about-canvas"></canvas>

        {/* Atmospheric Smoke Layer */}
        <canvas id="about-smoke-canvas"></canvas>

        {/* Left Contrast Vignette Overlay */}
        <div className="about-overlay"></div>

        {/* About Content Overlay */}
        <div className="about-content">
          <div className="about-text-block">
            <div className="about-badge" id="about-badge">
              <span className="badge-dot"></span>
              <span className="badge-text">ABOUT ME</span>
            </div>

            <h2 className="about-headline">
              <span className="about-headline-line about-headline-first">
                <InteractiveText text="DRIVEN BY CURIOSITY." smokeType="about" />
              </span>
              <span className="about-headline-line about-headline-last highlight-text">
                <InteractiveText text="BUILT WITH CODE." isRed={true} smokeType="about" />
              </span>
            </h2>

            <div className="about-paragraphs">
              <p className="about-p about-p-first">
                <InteractiveText
                  text="I'm Mohamed Kassim M, a Computer Science Engineering student, Full-Stack Developer, and AI Enthusiast passionate about building scalable digital solutions that solve real-world problems."
                  smokeType="about"
                />
              </p>
              <p className="about-p about-p-second">
                <InteractiveText
                  text="From modern web applications and enterprise management systems to AI-powered experiences, I enjoy transforming ideas into practical, impactful products through clean code, thoughtful design, and intelligent technology."
                  smokeType="about"
                />
              </p>
            </div>

            <div className="about-buttons">
              <a
                href="#contact"
                className="btn btn-primary about-btn-cta"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('contact');
                }}
              >
                <span>GET IN TOUCH</span>
                <ArrowRight className="btn-icon" size={18} />
              </a>
              <a
                href="#work"
                className="btn btn-secondary about-btn-cta"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('work');
                }}
              >
                <span>EXPLORE MY WORK</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
