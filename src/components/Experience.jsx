import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InteractiveText from './InteractiveText';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_EXP_FRAMES = 144;

export default function Experience({ preloadedFrames = [] }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const expSeqState = useRef({ frame: 0 });
  const fallbackCache = useRef({});
  const lastDrawnIdxRef = useRef(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;

    const drawExpToCanvas = (img) => {
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

    const getExpFrameImage = (idx) => {
      if (preloadedFrames[idx] && preloadedFrames[idx].complete && preloadedFrames[idx].naturalWidth > 0) {
        return preloadedFrames[idx];
      }
      if (fallbackCache.current[idx]) {
        return fallbackCache.current[idx];
      }
      const img = new Image();
      const numStr = String(idx).padStart(6, '0');
      img.src = `/Achievements%20Frame/frame_${numStr}.jpg`;
      fallbackCache.current[idx] = img;
      img.onload = () => {
        if (Math.round(expSeqState.current.frame) === idx) {
          drawExpToCanvas(img);
          lastDrawnIdxRef.current = idx;
        }
      };
      return img;
    };

    const renderExpFrame = (force = false) => {
      const currentIdx = Math.max(0, Math.min(TOTAL_EXP_FRAMES - 1, Math.round(expSeqState.current.frame)));
      if (!force && currentIdx === lastDrawnIdxRef.current) return;

      const img = getExpFrameImage(currentIdx);

      if (img && img.complete && img.naturalWidth > 0) {
        lastDrawnIdxRef.current = currentIdx;
        drawExpToCanvas(img);
        return;
      }

      for (let offset = 1; offset < 30; offset++) {
        const prevIdx = currentIdx - offset;
        if (prevIdx >= 0) {
          const prev = preloadedFrames[prevIdx] || fallbackCache.current[prevIdx];
          if (prev && prev.complete && prev.naturalWidth > 0) {
            lastDrawnIdxRef.current = currentIdx;
            drawExpToCanvas(prev);
            return;
          }
        }
        const nextIdx = currentIdx + offset;
        if (nextIdx < TOTAL_EXP_FRAMES) {
          const next = preloadedFrames[nextIdx] || fallbackCache.current[nextIdx];
          if (next && next.complete && next.naturalWidth > 0) {
            lastDrawnIdxRef.current = currentIdx;
            drawExpToCanvas(next);
            return;
          }
        }
      }
    };

    let rAFId = null;
    const requestExpFrameDraw = (force = false) => {
      if (rAFId) return;
      rAFId = requestAnimationFrame(() => {
        rAFId = null;
        renderExpFrame(force);
      });
    };

    const resizeCanvas = () => {
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      requestExpFrameDraw(true);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    requestExpFrameDraw(true);

    const triggerCtx = gsap.context(() => {
      const expTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: isMobile ? '+=160%' : '+=2400',
          pin: '.experience-sticky-container',
          pinSpacing: true,
          scrub: isMobile ? 0.05 : 0.25,
          anticipatePin: 1,
          fastScrollEnd: true,
        },
      });

      // 1. Scrub Canvas Frames from 0 to 143
      expTl.to(expSeqState.current, {
        frame: TOTAL_EXP_FRAMES - 1,
        ease: 'none',
        duration: 10,
        onUpdate: () => requestExpFrameDraw(false),
      }, 0);

      // 2. Slide 1 (Overview & Stats): Visible from start, exits at ~28%
      expTl.fromTo('#exp-slide-1',
        { autoAlpha: 1, x: 0, pointerEvents: 'auto' },
        { autoAlpha: 0, x: isMobile ? 30 : 60, pointerEvents: 'none', duration: 1.2, ease: 'power2.in' },
        2.4
      );

      // 3. Slide 2 (Competitions & Awards): Enters at 32%, stays until 60%, exits at 64%
      expTl.fromTo('#exp-slide-2',
        { autoAlpha: 0, x: isMobile ? 30 : 60, pointerEvents: 'none' },
        { autoAlpha: 1, x: 0, pointerEvents: 'auto', duration: 1.2, ease: 'power2.out' },
        3.2
      );

      expTl.to('#exp-slide-2', {
        autoAlpha: 0,
        x: isMobile ? 30 : 60,
        pointerEvents: 'none',
        duration: 1.2,
        ease: 'power2.in',
      }, 5.8);

      // 4. Slide 3 (Industry & Production Work): Enters at 66%, stays until 95%
      expTl.fromTo('#exp-slide-3',
        { autoAlpha: 0, x: isMobile ? 30 : 60, pointerEvents: 'none' },
        { autoAlpha: 1, x: 0, pointerEvents: 'auto', duration: 1.2, ease: 'power2.out' },
        6.6
      );

      expTl.to('#exp-slide-3', {
        autoAlpha: 0,
        y: -20,
        pointerEvents: 'none',
        duration: 0.8,
        ease: 'power1.in',
      }, 9.4);
    }, sectionRef);

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      triggerCtx.revert();
    };
  }, [preloadedFrames]);

  return (
    <section className="experience-section" id="experience" ref={sectionRef}>
      <div className="experience-sticky-container">
        {/* 144-Frame Canvas Player */}
        <canvas ref={canvasRef} id="experience-canvas" className="experience-canvas"></canvas>

        {/* Atmospheric Smoke Layer */}
        <canvas id="experience-smoke-canvas" className="experience-smoke-canvas"></canvas>

        {/* Slide 1: Overview & Impact */}
        <div className="exp-slide exp-slide-1" id="exp-slide-1">
          <div className="editorial-slide-content">
            <div className="editorial-category">
              <span className="category-index">01</span>
              <span className="category-divider">/</span>
              <span className="category-name">MILESTONES &amp; IMPACT</span>
            </div>
            <h2 className="editorial-main-title">
              <span className="exp-headline-1 title-white">
                <InteractiveText text="PROVEN TRACK RECORD." smokeType="exp" />
              </span>
              <span className="exp-headline-2 title-crimson">
                <InteractiveText text="ENGINEERING IMPACT." isRed={true} smokeType="exp" />
              </span>
            </h2>
            <p className="editorial-lead exp-lead-1">
              <InteractiveText
                text="Competitive AI hackathon victories combined with international production deployments and commercial software engineering."
                smokeType="exp"
              />
            </p>
          </div>
        </div>

        {/* Slide 2: Competitions & Awards */}
        <div className="exp-slide exp-slide-2" id="exp-slide-2">
          <div className="editorial-slide-content">
            <div className="editorial-category">
              <span className="category-index gold-text">02</span>
              <span className="category-divider">/</span>
              <span className="category-name">COMPETITIONS &amp; AWARDS</span>
            </div>
            <h3 className="editorial-hero-title">
              <span className="exp-headline-3 title-white">
                <InteractiveText text="AI CHATBOT" smokeType="exp" />
              </span>
              <span className="exp-headline-4 title-gold">
                <InteractiveText text="HACKATHON." isRed={true} smokeType="exp" />
              </span>
            </h3>
            <p className="editorial-lead exp-lead-2">
              <InteractiveText
                text="Won 1st prize with a ₹5,000 cash award in AI chatbot development by engineering an autonomous contextual RAG platform. Recognized as a 2× Hackathon Finalist competing against 50+ engineering teams."
                smokeType="exp"
              />
            </p>
          </div>
        </div>

        {/* Slide 3: Industry & Production Work */}
        <div className="exp-slide exp-slide-3" id="exp-slide-3">
          <div className="editorial-slide-content">
            <div className="editorial-category">
              <span className="category-index emerald-text">03</span>
              <span className="category-divider">/</span>
              <span className="category-name">PRODUCTION &amp; WORK</span>
            </div>
            <h3 className="editorial-hero-title">
              <span className="exp-headline-5 title-white">
                <InteractiveText text="SINGAPORE" smokeType="exp" />
              </span>
              <span className="exp-headline-6 title-emerald">
                <InteractiveText text="CARGO PLATFORM." isRed={true} smokeType="exp" />
              </span>
            </h3>
            <div className="editorial-client-sub">TKS Courier &amp; Cargo &middot; Singapore Client Engagement</div>
            <p className="editorial-lead exp-lead-3">
              <InteractiveText
                text="Engineered and deployed the live corporate courier & cargo platform with real-time tracking for Singapore international logistics. Completed an intensive 1-month software engineering internship on live commercial applications."
                smokeType="exp"
              />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
