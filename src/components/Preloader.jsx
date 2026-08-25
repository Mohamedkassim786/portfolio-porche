import React, { useEffect, useState, useRef } from 'react';

const TOTAL_ABOUT_FRAMES = 144;
const TOTAL_EXP_FRAMES = 144;

// On mobile, load fewer frames initially for faster startup
const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
const BATCH_SIZE = isMobileDevice ? 6 : 12; // Concurrent image downloads
const ABOUT_PRIORITY_FRAMES = isMobileDevice ? 48 : 144; // Load first N About frames before proceeding

export default function Preloader({ onComplete }) {
  const [percent, setPercent] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const loadedCountRef = useRef(0);
  const displayedPercentRef = useRef(0);
  const aboutFramesRef = useRef([]);
  const expFramesRef = useRef([]);
  const animFrameIdRef = useRef(null);
  const completedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    // Total assets for the progress bar: priority About frames + 1 video
    // Experience frames load lazily after site is interactive
    const TOTAL_PRIORITY = ABOUT_PRIORITY_FRAMES + 1;

    const updateProgress = () => {
      const targetPercent = Math.min(100, Math.floor((loadedCountRef.current / TOTAL_PRIORITY) * 100));
      if (displayedPercentRef.current < targetPercent) {
        const diff = targetPercent - displayedPercentRef.current;
        displayedPercentRef.current += Math.max(1, Math.ceil(diff * 0.4));
        if (displayedPercentRef.current > targetPercent) {
          displayedPercentRef.current = targetPercent;
        }
        setPercent(displayedPercentRef.current);
      }

      if (displayedPercentRef.current >= 100 && loadedCountRef.current >= TOTAL_PRIORITY && !completedRef.current) {
        completedRef.current = true;
        setTimeout(() => {
          if (!isMounted) return;
          setIsFading(true);
          setTimeout(() => {
            if (!isMounted) return;
            setIsDone(true);
            onComplete({
              aboutFrames: aboutFramesRef.current,
              expFrames: expFramesRef.current,
            });

            // After site is interactive, lazily load remaining frames in background
            requestIdleCallback(() => {
              loadRemainingAboutFrames();
              loadExperienceFramesLazily();
            });
          }, 400);
        }, 100);
        return;
      }

      animFrameIdRef.current = requestAnimationFrame(updateProgress);
    };

    animFrameIdRef.current = requestAnimationFrame(updateProgress);

    const markLoaded = () => {
      loadedCountRef.current += 1;
    };

    // Batched image loader: loads images in controlled chunks to avoid network flooding
    const loadImageBatch = (urls, storeArray, startIdx, onEachLoad) => {
      return new Promise((resolve) => {
        let completed = 0;
        const total = urls.length;
        if (total === 0) { resolve(); return; }

        let queue = [...urls.map((url, i) => ({ url, index: startIdx + i }))];
        let active = 0;

        const loadNext = () => {
          if (queue.length === 0 && active === 0) {
            resolve();
            return;
          }

          while (active < BATCH_SIZE && queue.length > 0) {
            active++;
            const item = queue.shift();
            const img = new Image();
            img.decoding = 'async';

            const finish = (loadedImg) => {
              if (loadedImg) storeArray[item.index] = loadedImg;
              active--;
              completed++;
              if (onEachLoad) onEachLoad();
              loadNext();
            };

            img.onload = () => finish(img);
            img.onerror = () => {
              // Try fallback path
              const fb = new Image();
              fb.decoding = 'async';
              fb.onload = () => finish(fb);
              fb.onerror = () => finish(null);
              fb.src = item.url.startsWith('/') ? item.url.slice(1) : `/${item.url}`;
            };
            img.src = item.url;
          }
        };

        loadNext();
      });
    };

    // 1. Load priority About frames (first N) in batches
    const aboutUrls = [];
    for (let i = 0; i < ABOUT_PRIORITY_FRAMES; i++) {
      const numStr = String(i).padStart(6, '0');
      aboutUrls.push(`/About%20frames/frame_${numStr}.jpg`);
    }
    loadImageBatch(aboutUrls, aboutFramesRef.current, 0, markLoaded);

    // 2. Preload Hero Video (counts as 1 asset)
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    let videoMarked = false;

    const onVideoReady = () => {
      if (!videoMarked) {
        videoMarked = true;
        markLoaded();
      }
    };

    video.oncanplay = onVideoReady;
    video.onloadeddata = onVideoReady;
    video.src = '/assets/Hero.mp4';
    video.load();

    // Safety timeout for video
    const videoSafetyTimeout = setTimeout(onVideoReady, 3000);

    // 3. Load remaining About frames in background (if mobile loaded only 48)
    const loadRemainingAboutFrames = () => {
      if (ABOUT_PRIORITY_FRAMES >= TOTAL_ABOUT_FRAMES) return;
      const remainingUrls = [];
      for (let i = ABOUT_PRIORITY_FRAMES; i < TOTAL_ABOUT_FRAMES; i++) {
        const numStr = String(i).padStart(6, '0');
        remainingUrls.push(`/About%20frames/frame_${numStr}.jpg`);
      }
      loadImageBatch(remainingUrls, aboutFramesRef.current, ABOUT_PRIORITY_FRAMES, null);
    };

    // 4. Lazily load Experience frames AFTER site is interactive
    const loadExperienceFramesLazily = () => {
      const expUrls = [];
      for (let i = 0; i < TOTAL_EXP_FRAMES; i++) {
        const numStr = String(i).padStart(6, '0');
        expUrls.push(`/Achievements%20Frame/frame_${numStr}.jpg`);
      }
      loadImageBatch(expUrls, expFramesRef.current, 0, null);
    };

    // requestIdleCallback polyfill
    if (typeof window.requestIdleCallback === 'undefined') {
      window.requestIdleCallback = (cb) => setTimeout(cb, 50);
    }

    return () => {
      isMounted = false;
      clearTimeout(videoSafetyTimeout);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div className={`site-preloader ${isFading ? 'fade-out' : ''}`} id="site-preloader">
      <div className="preloader-content">
        <div className="preloader-logo">
          <span>MK</span>
          <div className="logo-pulse"></div>
        </div>
        <div className="preloader-progress-track">
          <div className="preloader-progress-bar" style={{ width: `${percent}%` }}></div>
        </div>
        <div className="preloader-meta">
          <span className="preloader-label">INITIALIZING DIGITAL ENGINE</span>
          <span className="preloader-percent">{percent}%</span>
        </div>
      </div>
    </div>
  );
}
