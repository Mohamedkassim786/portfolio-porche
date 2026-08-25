import React, { useEffect, useState, useRef } from 'react';

const TOTAL_ABOUT_FRAMES = 144;
const TOTAL_EXP_FRAMES = 144;
const TOTAL_ASSETS = TOTAL_ABOUT_FRAMES + TOTAL_EXP_FRAMES + 1; // 289 assets

export default function Preloader({ onComplete }) {
  const [percent, setPercent] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const loadedCountRef = useRef(0);
  const displayedPercentRef = useRef(0);
  const aboutFramesRef = useRef([]);
  const expFramesRef = useRef([]);
  const animFrameIdRef = useRef(null);

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

      if (displayedPercentRef.current >= 100 && loadedCountRef.current >= TOTAL_ASSETS) {
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
          }, 500);
        }, 150);
        return;
      }

      animFrameIdRef.current = requestAnimationFrame(updateProgress);
    };

    animFrameIdRef.current = requestAnimationFrame(updateProgress);

    const markLoaded = () => {
      loadedCountRef.current += 1;
    };

    const preloadImage = (url, storeArray, index) => {
      const img = new Image();
      img.onload = () => {
        storeArray[index] = img;
        markLoaded();
      };
      img.onerror = () => {
        // Fallback without leading slash or with assets/
        const fb = new Image();
        fb.onload = () => {
          storeArray[index] = fb;
          markLoaded();
        };
        fb.onerror = () => {
          markLoaded();
        };
        fb.src = url.startsWith('/') ? url.slice(1) : `/${url}`;
      };
      img.src = url;
    };

    // 1. Preload 144 About 3D Frames (frame_000000.jpg to frame_000143.jpg)
    for (let i = 0; i < TOTAL_ABOUT_FRAMES; i++) {
      const numStr = String(i).padStart(6, '0');
      preloadImage(`/About%20frames/frame_${numStr}.jpg`, aboutFramesRef.current, i);
    }

    // 2. Preload 144 Achievements 3D Frames (frame_000000.jpg to frame_000143.jpg)
    for (let i = 0; i < TOTAL_EXP_FRAMES; i++) {
      const numStr = String(i).padStart(6, '0');
      preloadImage(`/Achievements%20Frame/frame_${numStr}.jpg`, expFramesRef.current, i);
    }

    // 3. Preload Hero Video
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

    const videoSafetyTimeout = setTimeout(() => {
      onVideoReady();
    }, 2000);

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
