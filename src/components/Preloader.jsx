import React, { useEffect, useState, useRef } from 'react';

const TOTAL_ABOUT_FRAMES = 144;
const TOTAL_EXP_FRAMES = 144;
const TOTAL_ASSETS = TOTAL_ABOUT_FRAMES + TOTAL_EXP_FRAMES + 1; // 289 assets

// Controlled batch size to avoid flooding the network
const BATCH_SIZE = typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 15;

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

    const updateProgress = () => {
      const targetPercent = Math.min(100, Math.floor((loadedCountRef.current / TOTAL_ASSETS) * 100));
      if (displayedPercentRef.current < targetPercent) {
        const diff = targetPercent - displayedPercentRef.current;
        displayedPercentRef.current += Math.max(1, Math.ceil(diff * 0.35));
        if (displayedPercentRef.current > targetPercent) {
          displayedPercentRef.current = targetPercent;
        }
        setPercent(displayedPercentRef.current);
      }

      if (displayedPercentRef.current >= 100 && loadedCountRef.current >= TOTAL_ASSETS && !completedRef.current) {
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

    // Batched image loader: loads images in controlled concurrent chunks
    const loadImageBatch = (urls, storeArray, startIdx) => {
      let queue = [...urls.map((url, i) => ({ url, index: startIdx + i }))];
      let active = 0;

      const loadNext = () => {
        while (active < BATCH_SIZE && queue.length > 0) {
          active++;
          const item = queue.shift();
          const img = new Image();

          const finish = (loadedImg) => {
            if (loadedImg) storeArray[item.index] = loadedImg;
            markLoaded();
            active--;
            loadNext();
          };

          img.onload = () => finish(img);
          img.onerror = () => {
            const fb = new Image();
            fb.onload = () => finish(fb);
            fb.onerror = () => finish(null);
            fb.src = item.url.startsWith('/') ? item.url.slice(1) : `/${item.url}`;
          };
          img.src = item.url;
        }
      };

      loadNext();
    };

    // 1. Load ALL 144 About frames in controlled batches
    const aboutUrls = [];
    for (let i = 0; i < TOTAL_ABOUT_FRAMES; i++) {
      const numStr = String(i).padStart(6, '0');
      aboutUrls.push(`/About%20frames/frame_${numStr}.jpg`);
    }
    loadImageBatch(aboutUrls, aboutFramesRef.current, 0);

    // 2. Load ALL 144 Experience frames in controlled batches
    const expUrls = [];
    for (let i = 0; i < TOTAL_EXP_FRAMES; i++) {
      const numStr = String(i).padStart(6, '0');
      expUrls.push(`/Achievements%20Frame/frame_${numStr}.jpg`);
    }
    loadImageBatch(expUrls, expFramesRef.current, 0);

    // 3. Preload Hero Video (counts as 1 asset)
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

    const videoSafetyTimeout = setTimeout(onVideoReady, 3000);

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
