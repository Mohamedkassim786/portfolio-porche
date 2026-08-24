/* ==========================================================================
   LUXURY AUTOMOTIVE PORTFOLIO - FULL GSAP ANIMATION & SCROLL SEQUENCE ENGINE
   Developer: Mohamed Kassim M
   ========================================================================== */

function initPortfolio() {
  // Register GSAP Plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ========================================================================
     0. COMPREHENSIVE 100% ASSET PRELOADER (HERO VIDEO + 288 3D FRAMES)
     ======================================================================== */
  const sitePreloader = document.getElementById('site-preloader');
  const preloaderBar = document.getElementById('preloader-bar');
  const preloaderPercent = document.getElementById('preloader-percent');

  const TOTAL_ABOUT_FRAMES = 144;
  const TOTAL_EXP_FRAMES = 144;
  const TOTAL_ASSETS = TOTAL_ABOUT_FRAMES + TOTAL_EXP_FRAMES + 1; // 289 total assets (144 About + 144 Exp + 1 Hero Video)

  const aboutFrameImages = new Array(TOTAL_ABOUT_FRAMES).fill(null);
  const expFrameImages = new Array(TOTAL_EXP_FRAMES).fill(null);

  let totalAssetsLoaded = 0;
  let displayedProgress = 0;
  let isPreloaderFinished = false;
  let preloaderProgressAnimId = null;

  // Placeholder hooks for section resize triggers
  let resizeAboutCanvas = null;
  let resizeExpCanvas = null;
  let renderAboutFrame = null;
  let renderExpFrame = null;

  function onAssetLoaded() {
    totalAssetsLoaded++;
    const targetPercent = Math.min(100, Math.floor((totalAssetsLoaded / TOTAL_ASSETS) * 100));
    scheduleProgressUpdate(targetPercent);
  }

  function scheduleProgressUpdate(targetPercent) {
    if (isPreloaderFinished) return;
    if (!preloaderProgressAnimId) {
      preloaderProgressAnimId = requestAnimationFrame(animateProgressBar);
    }
  }

  function animateProgressBar() {
    if (isPreloaderFinished) return;
    const targetPercent = Math.min(100, Math.floor((totalAssetsLoaded / TOTAL_ASSETS) * 100));

    if (displayedProgress < targetPercent) {
      const diff = targetPercent - displayedProgress;
      displayedProgress += Math.max(1, Math.ceil(diff * 0.35));
      if (displayedProgress > targetPercent) displayedProgress = targetPercent;
    }

    if (preloaderBar) preloaderBar.style.width = `${displayedProgress}%`;
    if (preloaderPercent) preloaderPercent.textContent = `${displayedProgress}%`;

    if (displayedProgress >= 100 && totalAssetsLoaded >= TOTAL_ASSETS) {
      preloaderProgressAnimId = null;
      setTimeout(finishPreloader, 150);
      return;
    }

    if (displayedProgress < targetPercent) {
      preloaderProgressAnimId = requestAnimationFrame(animateProgressBar);
    } else {
      preloaderProgressAnimId = null;
    }
  }

  function finishPreloader() {
    if (isPreloaderFinished) return;
    isPreloaderFinished = true;

    if (preloaderProgressAnimId) {
      cancelAnimationFrame(preloaderProgressAnimId);
      preloaderProgressAnimId = null;
    }

    if (preloaderBar) preloaderBar.style.width = '100%';
    if (preloaderPercent) preloaderPercent.textContent = '100%';

    // Hide inner section spinners
    const aboutLoader = document.getElementById('about-loader');
    if (aboutLoader) aboutLoader.classList.add('hidden');
    const expLoader = document.getElementById('exp-loader');
    if (expLoader) expLoader.classList.add('hidden');

    // Immediate canvas draw for both sections on reveal
    if (typeof resizeAboutCanvas === 'function') resizeAboutCanvas();
    if (typeof resizeExpCanvas === 'function') resizeExpCanvas();

    if (sitePreloader) {
      sitePreloader.classList.add('fade-out');
      setTimeout(() => {
        sitePreloader.style.display = 'none';
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }, 500);
    }

    // Start Hero Video & GSAP Hero Animation
    startHeroAnimation();
  }

  function preloadImage(url, onSuccess, onError) {
    const img = new Image();
    img.onload = () => onSuccess(img);
    img.onerror = () => {
      // Automatic fallback check
      if (!url.includes('assets/')) {
        const fallbackImg = new Image();
        fallbackImg.onload = () => onSuccess(fallbackImg);
        fallbackImg.onerror = () => onError();
        fallbackImg.src = `assets/${url}`;
      } else {
        onError();
      }
    };
    img.src = url;
  }

  // Preload all 144 About Frames into RAM
  for (let i = 0; i < TOTAL_ABOUT_FRAMES; i++) {
    const padded = String(i).padStart(6, '0');
    const path = `About%20frames/frame_${padded}.jpg`;
    preloadImage(
      path,
      (img) => {
        aboutFrameImages[i] = img;
        onAssetLoaded();
      },
      () => {
        onAssetLoaded();
      }
    );
  }

  // Preload all 144 Experience Frames into RAM
  for (let i = 0; i < TOTAL_EXP_FRAMES; i++) {
    const padded = String(i).padStart(6, '0');
    const path = `Achievements%20Frame/frame_${padded}.jpg`;
    preloadImage(
      path,
      (img) => {
        expFrameImages[i] = img;
        onAssetLoaded();
      },
      () => {
        onAssetLoaded();
      }
    );
  }

  // Safety fallback: maximum 10s on weak connections
  setTimeout(() => {
    if (!isPreloaderFinished) {
      displayedProgress = 100;
      if (preloaderBar) preloaderBar.style.width = '100%';
      if (preloaderPercent) preloaderPercent.textContent = '100%';
      finishPreloader();
    }
  }, 10000);


  /* ========================================================================
     1. HELPER & REUSABLE SPLIT-TEXT UTILITY
     ======================================================================== */
  function splitTextIntoWordsAndChars(element) {
    if (!element) return [];
    const originalText = element.textContent.trim();
    if (!originalText) return [];
    element.innerHTML = '';
    const words = originalText.split(/\s+/);
    const charsList = [];

    words.forEach((wordText, wordIdx) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';

      [...wordText].forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.className = 'char';

        if (char === '·') {
          charSpan.classList.add('accent-bullet');
        }

        charSpan.textContent = char;
        wordSpan.appendChild(charSpan);
        charsList.push(charSpan);
      });

      element.appendChild(wordSpan);

      if (wordIdx < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.className = 'space';
        spaceSpan.innerHTML = '&nbsp;';
        element.appendChild(spaceSpan);
      }
    });

    return charsList;
  }

  // Generic Touch/Hover Letter Interaction Binder
  function bindInteractiveTouchToChars(chars, smokeBurstCallback) {
    if (!chars || chars.length === 0) return;
    chars.forEach(char => {
      const isRedAccent = char.closest('.hero-name-last') !== null || 
                          char.closest('.about-headline-last') !== null || 
                          char.closest('.title-crimson') !== null || 
                          char.closest('.title-gold') !== null || 
                          char.closest('.title-emerald') !== null;

      function onTouchOrHover(e) {
        if (typeof gsap !== 'undefined') {
          gsap.to(char, {
            y: -10,
            scale: 1.25,
            rotateX: 18,
            rotateY: (Math.random() - 0.5) * 16,
            duration: 0.18,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }

        if (smokeBurstCallback) {
          const rect = char.getBoundingClientRect();
          const touchX = e.touches ? e.touches[0].clientX : rect.left + rect.width / 2;
          const touchY = e.touches ? e.touches[0].clientY : rect.top + rect.height / 2;
          smokeBurstCallback(touchX, touchY, isRedAccent);
        }
      }

      function onTouchOrLeave() {
        if (typeof gsap !== 'undefined') {
          gsap.to(char, {
            y: 0,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            duration: 0.55,
            ease: 'elastic.out(1, 0.4)',
            overwrite: 'auto'
          });
        }
      }

      char.addEventListener('mouseenter', onTouchOrHover);
      char.addEventListener('mouseleave', onTouchOrLeave);

      char.addEventListener('touchstart', (e) => {
        onTouchOrHover(e);
        char.classList.add('touch-active');
      }, { passive: true });

      char.addEventListener('touchend', () => {
        onTouchOrLeave();
        setTimeout(() => char.classList.remove('touch-active'), 350);
      });
    });
  }


  /* ========================================================================
     2. HERO SECTION - ATMOSPHERIC SMOKE & TEXT REVEAL TIMELINE
     ======================================================================== */
  const heroVideo = document.getElementById('hero-video');
  let heroVideoLoaded = false;
  function markHeroVideoReady() {
    if (heroVideoLoaded) return;
    heroVideoLoaded = true;
    onAssetLoaded();
  }

  if (heroVideo) {
    if (heroVideo.readyState >= 2) {
      markHeroVideoReady();
    } else {
      heroVideo.addEventListener('loadeddata', markHeroVideoReady, { once: true });
      heroVideo.addEventListener('canplay', markHeroVideoReady, { once: true });
      heroVideo.addEventListener('canplaythrough', markHeroVideoReady, { once: true });
      heroVideo.addEventListener('error', markHeroVideoReady, { once: true });
    }
  } else {
    markHeroVideoReady();
  }

  const smokeCanvas = document.getElementById('smoke-canvas');
  const smokeCtx = smokeCanvas ? smokeCanvas.getContext('2d') : null;
  let smokeParticles = [];
  let smokeAnimFrameId = null;

  function resizeSmokeCanvas() {
    if (!smokeCanvas) return;
    smokeCanvas.width = window.innerWidth;
    smokeCanvas.height = window.innerHeight;
  }
  resizeSmokeCanvas();
  window.addEventListener('resize', resizeSmokeCanvas);

  class SmokeParticle {
    constructor(x, y, isRed = false, isTouch = false) {
      const isMobile = window.innerWidth < 768;

      if (isTouch) {
        this.x = x + (Math.random() - 0.5) * 40;
        this.y = y + (Math.random() - 0.5) * 20;
        this.radius = Math.random() * 15 + 10;
        this.maxRadius = this.radius + Math.random() * 45 + 25;
        this.vx = (Math.random() - 0.5) * 1.8;
        this.vy = (Math.random() - 0.7) * 1.5;
        this.alpha = Math.random() * 0.55 + 0.25;
        this.decay = Math.random() * 0.012 + 0.007;
      } else {
        this.x = x + (Math.random() - 0.5) * (isMobile ? 80 : 140);
        this.y = y + (Math.random() - 0.5) * (isMobile ? 30 : 50);
        this.radius = Math.random() * (isMobile ? 20 : 25) + 15;
        this.maxRadius = this.radius + Math.random() * (isMobile ? 60 : 100) + 40;
        this.vx = Math.random() * 1.2 + 0.3;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.alpha = Math.random() * 0.4 + 0.18;
        this.decay = Math.random() * 0.006 + 0.0035;
      }

      this.isRed = isRed;
      this.rotation = Math.random() * Math.PI * 2;
      this.vr = (Math.random() - 0.5) * 0.02;
    }

    isDead() {
      return this.alpha <= 0;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.radius += (this.maxRadius - this.radius) * 0.03;
      this.alpha -= this.decay;
      this.rotation += this.vr;
    }

    draw(context) {
      if (this.alpha <= 0) return;
      context.save();
      context.globalAlpha = Math.max(0, this.alpha);
      context.translate(this.x, this.y);
      context.rotate(this.rotation);

      const grad = context.createRadialGradient(0, 0, 0, 0, 0, this.radius);
      if (this.isRed) {
        grad.addColorStop(0, 'rgba(255, 46, 76, 0.6)');
        grad.addColorStop(0.35, 'rgba(229, 9, 20, 0.25)');
        grad.addColorStop(1, 'rgba(8, 9, 12, 0)');
      } else {
        grad.addColorStop(0, 'rgba(240, 245, 255, 0.45)');
        grad.addColorStop(0.4, 'rgba(160, 175, 200, 0.2)');
        grad.addColorStop(1, 'rgba(8, 9, 12, 0)');
      }

      context.fillStyle = grad;
      context.beginPath();
      context.arc(0, 0, this.radius, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
  }

  function renderSmokeLoop() {
    if (!smokeCtx) return;
    smokeCtx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);

    for (let i = smokeParticles.length - 1; i >= 0; i--) {
      const p = smokeParticles[i];
      p.update();
      p.draw(smokeCtx);
      if (p.alpha <= 0) {
        smokeParticles.splice(i, 1);
      }
    }

    if (smokeParticles.length > 0) {
      smokeAnimFrameId = requestAnimationFrame(renderSmokeLoop);
    } else {
      smokeAnimFrameId = null;
    }
  }

  function triggerSmokeBurst(isRed = false) {
    if (!smokeCanvas) return;
    const nameElem = document.querySelector('.hero-name');
    if (!nameElem) return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 22 : 45;

    const rect = nameElem.getBoundingClientRect();
    const startX = rect.left + rect.width * (isMobile ? 0.05 : 0.15);
    const startY = rect.top + rect.height * (isMobile ? 0.35 : 0.45);

    for (let i = 0; i < count; i++) {
      smokeParticles.push(new SmokeParticle(startX + (i * (isMobile ? 4 : 6)), startY, isRed, false));
    }

    if (!smokeAnimFrameId) {
      smokeAnimFrameId = requestAnimationFrame(renderSmokeLoop);
    }
  }

  function triggerTouchSmoke(x, y, isRed = false) {
    if (!smokeCanvas) return;
    const particleCount = 10;
    for (let i = 0; i < particleCount; i++) {
      smokeParticles.push(new SmokeParticle(x, y, isRed, true));
    }
    if (!smokeAnimFrameId) {
      smokeAnimFrameId = requestAnimationFrame(renderSmokeLoop);
    }
  }

  const firstNameChars = splitTextIntoWordsAndChars(document.querySelector('.hero-name-first'));
  const lastNameChars = splitTextIntoWordsAndChars(document.querySelector('.hero-name-last'));
  const roleChars = splitTextIntoWordsAndChars(document.querySelector('.hero-role'));
  const descChars = splitTextIntoWordsAndChars(document.querySelector('.hero-description'));

  // Hero Master Timeline
  let heroTl = null;
  if (typeof gsap !== 'undefined') {
    heroTl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' }
    });

    heroTl.call(() => triggerSmokeBurst(false), null, 0.1);

    if (firstNameChars.length > 0) {
      heroTl.fromTo(firstNameChars,
        { opacity: 0, y: 35, rotateX: -85, scale: 1.2, filter: 'blur(10px)' },
        { opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)', duration: 0.55, stagger: 0.04, ease: 'power3.out' },
        0.1
      );
    }

    heroTl.call(() => triggerSmokeBurst(true), null, 0.28);

    if (lastNameChars.length > 0) {
      heroTl.fromTo(lastNameChars,
        { opacity: 0, y: 35, rotateY: 50, filter: 'blur(10px)' },
        { opacity: 1, y: 0, rotateY: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.04, ease: 'power3.out' },
        0.28
      );
    }

    if (roleChars.length > 0) {
      heroTl.fromTo(roleChars,
        { opacity: 0, x: -16, scale: 0.9, filter: 'blur(5px)' },
        { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)', duration: 0.45, stagger: 0.012, ease: 'power2.out' },
        0.55
      );
    }

    if (descChars.length > 0) {
      heroTl.fromTo(descChars,
        { opacity: 0, y: 14, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, stagger: 0.006, ease: 'power2.out' },
        0.75
      );
    }

    heroTl.fromTo('.btn-cta',
      { opacity: 0, y: 18, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.1, ease: 'back.out(1.5)' },
      0.95
    );

    heroTl.call(() => {
      bindInteractiveTouchToChars(document.querySelectorAll('#hero .char'), triggerTouchSmoke);
    }, null, 1.2);
  }

  let hasStartedHero = false;
  function startHeroAnimation() {
    if (hasStartedHero) return;
    hasStartedHero = true;

    if (heroVideo) {
      heroVideo.play().catch(() => {});
    }
    if (heroTl) {
      heroTl.play();
    }
  }


  /* ========================================================================
     3. ABOUT SECTION - SCROLL-DRIVEN 144-FRAME SEQUENCE & CINEMATIC REVEAL
     ======================================================================== */
  const aboutCanvas = document.getElementById('about-canvas');
  const aboutSmokeCanvas = document.getElementById('about-smoke-canvas');
  const aboutSmokeCtx = aboutSmokeCanvas ? aboutSmokeCanvas.getContext('2d') : null;
  const aboutLoader = document.getElementById('about-loader');

  let aboutSmokeParticles = [];
  let aboutSmokeAnimFrameId = null;

  function resizeAboutSmokeCanvas() {
    if (!aboutSmokeCanvas) return;
    aboutSmokeCanvas.width = window.innerWidth;
    aboutSmokeCanvas.height = window.innerHeight;
  }
  resizeAboutSmokeCanvas();
  window.addEventListener('resize', resizeAboutSmokeCanvas);

  function renderAboutSmokeLoop() {
    if (!aboutSmokeCtx) return;
    aboutSmokeCtx.clearRect(0, 0, aboutSmokeCanvas.width, aboutSmokeCanvas.height);

    for (let i = aboutSmokeParticles.length - 1; i >= 0; i--) {
      const p = aboutSmokeParticles[i];
      p.update();
      p.draw(aboutSmokeCtx);
      if (p.alpha <= 0) {
        aboutSmokeParticles.splice(i, 1);
      }
    }

    if (aboutSmokeParticles.length > 0) {
      aboutSmokeAnimFrameId = requestAnimationFrame(renderAboutSmokeLoop);
    } else {
      aboutSmokeAnimFrameId = null;
    }
  }

  function triggerAboutSmokeBurst(isRed = false) {
    if (!aboutSmokeCanvas) return;
    const titleElem = document.querySelector('.about-headline');
    if (!titleElem) return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 22 : 45;

    const rect = titleElem.getBoundingClientRect();
    const startX = rect.left + rect.width * (isMobile ? 0.05 : 0.15);
    const startY = rect.top + rect.height * (isMobile ? 0.35 : 0.45);

    for (let i = 0; i < count; i++) {
      aboutSmokeParticles.push(new SmokeParticle(startX + (i * (isMobile ? 4 : 6)), startY, isRed, false));
    }

    if (!aboutSmokeAnimFrameId) {
      aboutSmokeAnimFrameId = requestAnimationFrame(renderAboutSmokeLoop);
    }
  }

  function triggerAboutTouchSmoke(x, y, isRed = false) {
    if (!aboutSmokeCanvas) return;
    const particleCount = 10;
    for (let i = 0; i < particleCount; i++) {
      aboutSmokeParticles.push(new SmokeParticle(x, y, isRed, true));
    }
    if (!aboutSmokeAnimFrameId) {
      aboutSmokeAnimFrameId = requestAnimationFrame(renderAboutSmokeLoop);
    }
  }

  if (aboutCanvas) {
    const aboutCtx = aboutCanvas.getContext('2d');
    const TOTAL_FRAMES = TOTAL_ABOUT_FRAMES;
    const sequenceState = { frame: 0 };

    renderAboutFrame = function() {
      const currentIdx = Math.min(Math.max(Math.round(sequenceState.frame), 0), TOTAL_FRAMES - 1);
      const img = aboutFrameImages[currentIdx];

      if (img && img.complete && img.naturalWidth > 0) {
        drawToCanvas(img);
        return;
      }

      // Bidirectional fallback search up to 30 frames
      for (let offset = 1; offset < 30; offset++) {
        const prevImg = aboutFrameImages[currentIdx - offset];
        if (prevImg && prevImg.complete && prevImg.naturalWidth > 0) {
          drawToCanvas(prevImg);
          return;
        }
        const nextImg = aboutFrameImages[currentIdx + offset];
        if (nextImg && nextImg.complete && nextImg.naturalWidth > 0) {
          drawToCanvas(nextImg);
          return;
        }
      }
    };

    resizeAboutCanvas = function() {
      const isMobile = window.innerWidth < 768;
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      aboutCanvas.width = window.innerWidth * dpr;
      aboutCanvas.height = window.innerHeight * dpr;
      renderAboutFrame();
    };

    function drawToCanvas(img) {
      if (!img || img.naturalWidth === 0) return;
      const cw = aboutCanvas.width;
      const ch = aboutCanvas.height;
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

      aboutCtx.clearRect(0, 0, cw, ch);
      aboutCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    window.addEventListener('resize', resizeAboutCanvas);

    // Split About Section Text into Characters
    const aboutHeadlineFirstChars = splitTextIntoWordsAndChars(document.querySelector('.about-headline-first'));
    const aboutHeadlineLastChars = splitTextIntoWordsAndChars(document.querySelector('.about-headline-last'));
    const aboutPFirstChars = splitTextIntoWordsAndChars(document.querySelector('.about-p-first'));
    const aboutPSecondChars = splitTextIntoWordsAndChars(document.querySelector('.about-p-second'));

    if (typeof gsap !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#about',
          start: 'top top',
          end: isMobile ? '+=180%' : '+=380%',
          pin: '.about-pin-container',
          pinSpacing: true,
          scrub: isMobile ? 0.25 : 0.6,
          anticipatePin: 1,
          fastScrollEnd: true,
          onUpdate: () => {
            renderAboutFrame();
          }
        }
      });

      // 1. Scrub through all 144 image frames across scroll (0.0 to 0.78 progress)
      aboutTl.to(sequenceState, {
        frame: TOTAL_FRAMES - 1,
        snap: 'frame',
        ease: 'none',
        duration: 0.78,
        onUpdate: renderAboutFrame
      }, 0);

      // 2. Left Vignette Contrast Gradient deepening (0.50 to 0.75)
      aboutTl.to('.about-overlay', {
        opacity: 1,
        ease: 'power1.inOut',
        duration: 0.25
      }, 0.50);

      // 3. Trigger About Smoke Bursts on desktop only to save mobile main-thread
      if (!isMobile) {
        aboutTl.call(() => triggerAboutSmokeBurst(false), null, 0.62);
        aboutTl.call(() => triggerAboutSmokeBurst(true), null, 0.66);
      }

      // 4. Section Badge Reveal (0.60 to 0.66)
      aboutTl.fromTo('#about-badge',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' },
        0.60
      );

      // 5. Headline Line 1 (DRIVEN BY CURIOSITY.)
      if (aboutHeadlineFirstChars.length > 0) {
        aboutTl.fromTo(aboutHeadlineFirstChars,
          { opacity: 0, y: isMobile ? 14 : 28, rotateX: isMobile ? 0 : -85, scale: isMobile ? 1 : 1.15 },
          { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.18, stagger: isMobile ? 0.005 : 0.012, ease: 'power2.out' },
          0.63
        );
      }

      // 6. Headline Line 2 (BUILT WITH CODE.)
      if (aboutHeadlineLastChars.length > 0) {
        aboutTl.fromTo(aboutHeadlineLastChars,
          { opacity: 0, y: isMobile ? 14 : 28, rotateY: isMobile ? 0 : 60 },
          { opacity: 1, y: 0, rotateY: 0, duration: 0.18, stagger: isMobile ? 0.005 : 0.014, ease: 'power2.out' },
          0.66
        );
      }

      // 7. Bio Paragraph 1
      if (aboutPFirstChars.length > 0) {
        aboutTl.fromTo(aboutPFirstChars,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.14, stagger: isMobile ? 0.001 : 0.003, ease: 'power2.out' },
          0.72
        );
      }

      // 8. Bio Paragraph 2
      if (aboutPSecondChars.length > 0) {
        aboutTl.fromTo(aboutPSecondChars,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.14, stagger: isMobile ? 0.001 : 0.003, ease: 'power2.out' },
          0.76
        );
      }

      // 9. CTA Buttons Reveal (0.82 to 0.92)
      aboutTl.fromTo('.about-btn-cta',
        { opacity: 0, y: 14, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.16, stagger: 0.06, ease: 'power2.out' },
        0.82
      );

      // Enable Touch & Hover interaction on About section letters
      aboutTl.call(() => {
        bindInteractiveTouchToChars(document.querySelectorAll('#about .char'), triggerAboutTouchSmoke);
      }, null, 0.92);
    }
  }


  /* ========================================================================
     4. PROJECTS SECTION - ORIGINKIT 3D COVERFLOW GALLERY ENGINE
     ======================================================================== */
  const coverflowRoot = document.getElementById('coverflow-root');
  const coverflowCards = Array.from(document.querySelectorAll('.coverflow-card'));
  const coverflowPrev = document.getElementById('coverflow-prev');
  const coverflowNext = document.getElementById('coverflow-next');
  const coverflowDotsContainer = document.getElementById('coverflow-dots');

  if (coverflowRoot && coverflowCards.length > 0) {
    const totalCards = coverflowCards.length;
    let activeIndex = 0;

    // Fixed 3D Presets matching Originkit component
    const MAX_VISIBLE = 2;
    const DEPTH = 220;
    const SCALE_STEP = 0.15;
    const TILT = 14;
    const SIDE_TILT = 5;
    const GAP = 8;

    // Create pagination dots
    if (coverflowDotsContainer) {
      coverflowDotsContainer.innerHTML = '';
      coverflowCards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `coverflow-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('data-dot-index', i);
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          setActiveIndex(i);
          resetAutoplay();
        });
        coverflowDotsContainer.appendChild(dot);
      });
    }

    function updateCoverflow() {
      const isMobile = window.innerWidth < 768;
      const effectiveGap = isMobile ? 5.5 : GAP;

      coverflowCards.forEach((card, i) => {
        let rel = i - activeIndex;

        // Wrap around relative positioning
        if (rel > totalCards / 2) rel -= totalCards;
        if (rel < -totalCards / 2) rel += totalCards;

        const ax = Math.abs(rel);
        const visible = ax <= MAX_VISIBLE;
        const isActive = rel === 0;

        const sc = Math.max(0.55, 1 - ax * SCALE_STEP);
        const tx = rel * (effectiveGap * 32);
        const tz = -ax * DEPTH;
        const ry = -rel * TILT;
        const rz = rel * SIDE_TILT;

        card.style.transform = `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`;
        card.style.opacity = visible ? '1' : '0';
        card.style.pointerEvents = visible ? 'auto' : 'none';
        card.style.cursor = isActive ? 'default' : 'pointer';

        if (isActive) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }

        const dimOverlay = card.querySelector('.card-dim');
        if (dimOverlay) {
          dimOverlay.style.opacity = isActive ? '0' : '0.65';
        }
      });

      // Update dots
      if (coverflowDotsContainer) {
        const dots = coverflowDotsContainer.querySelectorAll('.coverflow-dot');
        dots.forEach((dot, i) => {
          if (i === activeIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    }

    // 2-Second Continuous Autoplay Engine
    let autoplayTimer = null;
    const AUTOPLAY_DELAY = 2000; // 2 seconds auto move

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        setActiveIndex(activeIndex + 1);
      }, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    function setActiveIndex(newIndex) {
      activeIndex = ((newIndex % totalCards) + totalCards) % totalCards;
      updateCoverflow();
    }

    // Card click handlers
    coverflowCards.forEach((card, i) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-cta-btn')) return;
        setActiveIndex(i);
        resetAutoplay();
      });
    });

    // Prev / Next button click handlers
    if (coverflowPrev) {
      coverflowPrev.addEventListener('click', () => {
        setActiveIndex(activeIndex - 1);
        resetAutoplay();
      });
    }

    if (coverflowNext) {
      coverflowNext.addEventListener('click', () => {
        setActiveIndex(activeIndex + 1);
        resetAutoplay();
      });
    }

    // Keyboard navigation
    coverflowRoot.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIndex(activeIndex - 1);
        resetAutoplay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIndex(activeIndex + 1);
        resetAutoplay();
      }
    });

    // Touch Interaction & Gestures (Horizontal swipes only, vertical swipes scroll page freely)
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    coverflowRoot.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    coverflowRoot.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = Math.abs(touchEndY - touchStartY);

      // Only cycle cards if horizontal swipe is intentional and exceeds vertical scroll
      if (Math.abs(diffX) > 35 && Math.abs(diffX) > diffY * 1.2) {
        if (diffX < 0) {
          setActiveIndex(activeIndex + 1);
        } else {
          setActiveIndex(activeIndex - 1);
        }
      }
      resetAutoplay();
    }, { passive: true });

    // Tab visibility handling
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    window.addEventListener('resize', updateCoverflow);

    // Initial render & immediate start of auto movement
    updateCoverflow();
    startAutoplay();
  }


  /* ========================================================================
     5. ORIGINKIT FULL-SCREEN GRAVITY GALLERY - 2D MATTER.JS PHYSICS
     ======================================================================== */
  const gravityContainer = document.getElementById('gravity-gallery-root');
  const gravityEls = Array.from(document.querySelectorAll('.gravity-body'));

  if (gravityContainer && gravityEls.length > 0) {
    if (typeof Matter !== 'undefined') {
      const { Engine, Bodies, Composite, Mouse, MouseConstraint, Body, Events } = Matter;

      const engine = Engine.create({
        enableSleeping: false,
        gravity: { x: 0, y: 1.15 }
      });

      function getDimensions() {
        const parent = gravityContainer.parentElement;
        return {
          w: gravityContainer.offsetWidth || (parent ? parent.offsetWidth : window.innerWidth),
          h: gravityContainer.offsetHeight || (parent ? parent.offsetHeight : window.innerHeight)
        };
      }

      let { w: width, h: height } = getDimensions();

      // Boundary Walls (floor at bottom of section, left wall, right wall, ceiling)
      const t = 140;
      let walls = [
        Bodies.rectangle(width / 2, -400, width * 3, t, { isStatic: true }), // High ceiling
        Bodies.rectangle(width / 2, height + t / 2, width * 3, t, { isStatic: true }), // Floor at bottom of section
        Bodies.rectangle(-t / 2, height / 2, t, height * 3, { isStatic: true }), // Left wall
        Bodies.rectangle(width + t / 2, height / 2, t, height * 3, { isStatic: true }) // Right wall
      ];
      Composite.add(engine.world, walls);

      // Mouse & Touch Dragging Constraint
      const mouse = Mouse.create(gravityContainer);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.92,
          angularStiffness: 0.15,
          render: { visible: false }
        }
      });
      Composite.add(engine.world, mouseConstraint);

      // Prevent wheel scroll hijacking (allow normal page scroll on wheel)
      if (mouse.element) {
        mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
        mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
      }

      // Wake up physics immediately on click/mousedown
      gravityContainer.addEventListener('mousedown', () => {
        clearTimeout(settleTimeout);
        startPhysics();
      });

      // Add grabbing class and wake physics on active drag
      Events.on(mouseConstraint, 'startdrag', (evt) => {
        clearTimeout(settleTimeout);
        startPhysics();
        const body = evt.body;
        const idx = physicsBodies.indexOf(body);
        if (idx !== -1 && gravityEls[idx]) {
          gravityEls[idx].classList.add('grabbing');
        }
      });

      Events.on(mouseConstraint, 'enddrag', (evt) => {
        const body = evt.body;
        const idx = physicsBodies.indexOf(body);
        if (idx !== -1 && gravityEls[idx]) {
          gravityEls[idx].classList.remove('grabbing');
        }
        // Keep physics running so the tossed cube falls and bounces naturally
        clearTimeout(settleTimeout);
        settleTimeout = setTimeout(() => {
          stopPhysics();
        }, 4000);
      });

      // Physics Bodies (Sleek Cubes - Responsive Sizing)
      const physicsBodies = [];

      function spawnBodies() {
        // Remove previous bodies
        physicsBodies.forEach(b => Composite.remove(engine.world, b));
        physicsBodies.length = 0;

        const screenW = window.innerWidth;
        const isMobile = screenW < 768;
        const isSmallMobile = screenW < 380;

        const dims = getDimensions();
        width = dims.w;
        height = Math.max(dims.h, isMobile ? 820 : 700);

        // Update wall boundaries
        Body.setPosition(walls[0], { x: width / 2, y: -400 });
        Body.setPosition(walls[1], { x: width / 2, y: height + t / 2 });
        Body.setPosition(walls[2], { x: -t / 2, y: height / 2 });
        Body.setPosition(walls[3], { x: width + t / 2, y: height / 2 });

        const cubeSize = isSmallMobile ? 66 : (isMobile ? 72 : 116);
        const radius = isSmallMobile ? 12 : (isMobile ? 14 : 24);

        const n = gravityEls.length;
        const cols = isMobile ? 4 : 6;
        const sideMargin = isMobile ? 14 : 60;
        const availableW = width - (sideMargin * 2);
        const headerOffset = isMobile ? 220 : 160;

        for (let i = 0; i < n; i++) {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const startX = sideMargin + ((col + 0.5) / cols) * availableW + (Math.random() - 0.5) * 8;
          const startY = headerOffset + row * (cubeSize + (isMobile ? 10 : 20)) + (Math.random() - 0.5) * 8;

          const body = Bodies.rectangle(startX, startY, cubeSize, cubeSize, {
            chamfer: { radius: radius },
            friction: 0.6,
            restitution: 0.62,
            frictionAir: 0.015,
            density: 0.001
          });

          // Subtle initial tumble & downward velocity
          Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.06);
          Body.setVelocity(body, {
            x: (Math.random() - 0.5) * (isMobile ? 1.5 : 3),
            y: 2 + Math.random() * (isMobile ? 2.5 : 4)
          });

          physicsBodies.push(body);
        }

        Composite.add(engine.world, physicsBodies);

        // Immediate position sync
        for (let i = 0; i < physicsBodies.length; i++) {
          const el = gravityEls[i];
          const body = physicsBodies[i];
          if (el && body) {
            el.style.left = `${body.position.x}px`;
            el.style.top = `${body.position.y}px`;
            el.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
          }
        }
      }

      // Tap / Click impulse interaction on cards
      gravityEls.forEach((el, idx) => {
        el.addEventListener('click', () => {
          const body = physicsBodies[idx];
          if (body) {
            Body.setVelocity(body, {
              x: (Math.random() - 0.5) * 14,
              y: -10 - Math.random() * 8
            });
            Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.25);
            startPhysics();
          }
        });
      });

      let isPhysicsRunning = false;
      let physicsFrameId = null;
      let settleTimeout = null;

      function startPhysics() {
        if (isPhysicsRunning) {
          if (!mouseConstraint.body) {
            clearTimeout(settleTimeout);
            settleTimeout = setTimeout(() => {
              stopPhysics();
            }, 3500);
          }
          return;
        }
        isPhysicsRunning = true;

        function step() {
          if (!isPhysicsRunning) return;
          Engine.update(engine, 1000 / 60);

          for (let i = 0; i < physicsBodies.length; i++) {
            const el = gravityEls[i];
            const body = physicsBodies[i];
            if (el && body) {
              el.style.left = `${body.position.x}px`;
              el.style.top = `${body.position.y}px`;
              el.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
            }
          }
          physicsFrameId = requestAnimationFrame(step);
        }
        physicsFrameId = requestAnimationFrame(step);

        if (!mouseConstraint.body) {
          clearTimeout(settleTimeout);
          settleTimeout = setTimeout(() => {
            stopPhysics();
          }, 3500);
        }
      }

      function stopPhysics() {
        if (mouseConstraint.body) return; // Never stop while user is holding a body
        isPhysicsRunning = false;
        if (physicsFrameId) {
          cancelAnimationFrame(physicsFrameId);
          physicsFrameId = null;
        }
      }

      // Initial spawn and run
      spawnBodies();
      startPhysics();

      // Re-Drop Gravity Button Handler
      const resetGravityBtn = document.getElementById('reset-gravity-btn');
      if (resetGravityBtn) {
        resetGravityBtn.addEventListener('click', () => {
          spawnBodies();
          startPhysics();
        });
      }

      // GSAP ScrollTrigger to only run physics when Skills section is in viewport
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: '#skills',
          start: 'top 85%',
          end: 'bottom top',
          onEnter: () => {
            spawnBodies();
            startPhysics();
          },
          onEnterBack: () => {
            startPhysics();
          },
          onLeave: () => {
            stopPhysics();
          },
          onLeaveBack: () => {
            stopPhysics();
          }
        });
      }

      // Resize Handler with Safe Debouncing
      let gravityResizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(gravityResizeTimeout);
        gravityResizeTimeout = setTimeout(() => {
          const dims = getDimensions();
          width = dims.w;
          height = dims.h;
          Body.setPosition(walls[0], { x: width / 2, y: -400 });
          Body.setPosition(walls[1], { x: width / 2, y: height + t / 2 });
          Body.setPosition(walls[2], { x: -t / 2, y: height / 2 });
          Body.setPosition(walls[3], { x: width + t / 2, y: height / 2 });
        }, 120);
      });
    } else {
      // Fallback layout if Matter.js script is blocked
      gravityEls.forEach((el) => {
        el.style.position = 'relative';
        el.style.display = 'inline-block';
        el.style.margin = '0.5rem';
        el.style.transform = 'none';
        el.style.left = 'auto';
        el.style.top = 'auto';
      });
    }
  }

  /* ========================================================================
     6. EXPERIENCE & ACHIEVEMENTS - SCROLL-DRIVEN 144-FRAME SEQUENCE & PINNED TIMELINE
     ======================================================================== */
  const expCanvas = document.getElementById('experience-canvas');
  const expLoader = document.getElementById('experience-loader');
  const expSmokeCanvas = document.getElementById('experience-smoke-canvas');
  const expSmokeCtx = expSmokeCanvas ? expSmokeCanvas.getContext('2d') : null;
  let expSmokeParticles = [];
  let expSmokeAnimFrameId = null;

  function resizeExpSmokeCanvas() {
    if (!expSmokeCanvas) return;
    expSmokeCanvas.width = window.innerWidth;
    expSmokeCanvas.height = window.innerHeight;
  }
  resizeExpSmokeCanvas();
  window.addEventListener('resize', resizeExpSmokeCanvas);

  function renderExpSmokeLoop() {
    if (!expSmokeCtx || !expSmokeCanvas) return;
    expSmokeCtx.clearRect(0, 0, expSmokeCanvas.width, expSmokeCanvas.height);

    for (let i = expSmokeParticles.length - 1; i >= 0; i--) {
      const p = expSmokeParticles[i];
      p.update();
      p.draw(expSmokeCtx);
      if (p.alpha <= 0 || (typeof p.isDead === 'function' && p.isDead())) {
        expSmokeParticles.splice(i, 1);
      }
    }

    if (expSmokeParticles.length > 0) {
      expSmokeAnimFrameId = requestAnimationFrame(renderExpSmokeLoop);
    } else {
      expSmokeAnimFrameId = null;
    }
  }

  function triggerExpTouchSmoke(x, y, isRed = false) {
    if (!expSmokeCanvas) return;
    const particleCount = 10;
    for (let i = 0; i < particleCount; i++) {
      expSmokeParticles.push(new SmokeParticle(x, y, isRed, true));
    }
    if (!expSmokeAnimFrameId) {
      expSmokeAnimFrameId = requestAnimationFrame(renderExpSmokeLoop);
    }
  }

  // Interactive Split Text for all Experience Headlines & Descriptions
  const expTextElements = document.querySelectorAll(
    '.exp-headline-1, .exp-headline-2, .exp-lead-1, .exp-headline-3, .exp-headline-4, .exp-lead-2, .exp-headline-5, .exp-headline-6, .exp-lead-3, .editorial-sub-text'
  );
  expTextElements.forEach(elem => {
    const chars = splitTextIntoWordsAndChars(elem);
    bindInteractiveTouchToChars(chars, triggerExpTouchSmoke);
  });

  // Interactive Split Text & Touch Animation for Contact Title
  const contactTextElements = document.querySelectorAll('.contact-line-1, .contact-line-2');
  contactTextElements.forEach(elem => {
    const chars = splitTextIntoWordsAndChars(elem);
    bindInteractiveTouchToChars(chars, null);
  });

  if (expCanvas) {
    const expCtx = expCanvas.getContext('2d');
    const TOTAL_EXP_FRAMES_LOCAL = TOTAL_EXP_FRAMES;
    const expSeqState = { frame: 0 };

    renderExpFrame = function() {
      const currentIdx = Math.min(Math.max(Math.round(expSeqState.frame), 0), TOTAL_EXP_FRAMES_LOCAL - 1);
      const img = expFrameImages[currentIdx];

      if (img && img.complete && img.naturalWidth > 0) {
        drawExpToCanvas(img);
        return;
      }

      // Bidirectional fallback search up to 30 frames
      for (let offset = 1; offset < 30; offset++) {
        const prevImg = expFrameImages[currentIdx - offset];
        if (prevImg && prevImg.complete && prevImg.naturalWidth > 0) {
          drawExpToCanvas(prevImg);
          return;
        }
        const nextImg = expFrameImages[currentIdx + offset];
        if (nextImg && nextImg.complete && nextImg.naturalWidth > 0) {
          drawExpToCanvas(nextImg);
          return;
        }
      }
    };

    resizeExpCanvas = function() {
      const isMobile = window.innerWidth < 768;
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      expCanvas.width = window.innerWidth * dpr;
      expCanvas.height = window.innerHeight * dpr;
      renderExpFrame();
    };

    function drawExpToCanvas(img) {
      if (!img || img.naturalWidth === 0) return;
      const cw = expCanvas.width;
      const ch = expCanvas.height;
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

      expCtx.clearRect(0, 0, cw, ch);
      expCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    window.addEventListener('resize', resizeExpCanvas);

    // Master ScrollTrigger Timeline for Experience Section
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      const expTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#experience',
          start: 'top top',
          end: isMobile ? '+=180%' : '+=3000',
          pin: '.experience-sticky-container',
          pinSpacing: true,
          scrub: isMobile ? 0.25 : 1,
          anticipatePin: 1,
          fastScrollEnd: true,
          onUpdate: () => {
            renderExpFrame();
          }
        }
      });

      // 1. Scrub Canvas Frames from 0 to 143
      expTl.to(expSeqState, {
        frame: TOTAL_EXP_FRAMES - 1,
        ease: 'none',
        duration: 10,
        onUpdate: renderExpFrame
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
        ease: 'power2.in'
      }, 5.8);

      // 4. Slide 3 (Industry & Client Engagements): Enters at 66%, stays until 95%
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
        ease: 'power1.in'
      }, 9.4);
    }
  }
}

// Bulletproof execution trigger for both http:// and file:/// protocols
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
  initPortfolio();
}

