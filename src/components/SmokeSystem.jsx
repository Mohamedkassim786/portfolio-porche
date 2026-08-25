import React, { useEffect } from 'react';

export default function SmokeSystem() {
  useEffect(() => {
    const heroCanvas = document.getElementById('smoke-canvas');
    const aboutCanvas = document.getElementById('about-smoke-canvas');
    const expCanvas = document.getElementById('experience-smoke-canvas');

    const heroCtx = heroCanvas ? heroCanvas.getContext('2d') : null;
    const aboutCtx = aboutCanvas ? aboutCanvas.getContext('2d') : null;
    const expCtx = expCanvas ? expCanvas.getContext('2d') : null;

    const resizeAll = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (heroCanvas) { heroCanvas.width = w; heroCanvas.height = h; }
      if (aboutCanvas) { aboutCanvas.width = w; aboutCanvas.height = h; }
      if (expCanvas) { expCanvas.width = w; expCanvas.height = h; }
    };

    resizeAll();
    window.addEventListener('resize', resizeAll, { passive: true });

    class SmokeParticle {
      constructor(x, y, isRed = false, isTouch = true) {
        const isMobile = window.innerWidth < 768;

        if (isTouch) {
          this.x = (x !== undefined ? x : window.innerWidth / 2) + (Math.random() - 0.5) * 30;
          this.y = (y !== undefined ? y : window.innerHeight / 2) + (Math.random() - 0.5) * 15;
          this.radius = Math.random() * 12 + 8;
          this.maxRadius = this.radius + Math.random() * 35 + 20;
          this.vx = (Math.random() - 0.5) * 1.5;
          this.vy = (Math.random() - 0.7) * 1.2;
          this.alpha = Math.random() * 0.5 + 0.2;
          this.decay = Math.random() * 0.016 + 0.01;
        } else {
          this.x = (x !== undefined ? x : Math.random() * window.innerWidth) + (Math.random() - 0.5) * (isMobile ? 60 : 100);
          this.y = (y !== undefined ? y : window.innerHeight * 0.8) + (Math.random() - 0.5) * (isMobile ? 25 : 40);
          this.radius = Math.random() * (isMobile ? 18 : 22) + 12;
          this.maxRadius = this.radius + Math.random() * (isMobile ? 50 : 80) + 30;
          this.vx = Math.random() * 1.0 + 0.2;
          this.vy = (Math.random() - 0.5) * 0.4;
          this.alpha = Math.random() * 0.35 + 0.15;
          this.decay = Math.random() * 0.008 + 0.004;
        }

        this.isRed = isRed;
        this.rotation = Math.random() * Math.PI * 2;
        this.vr = (Math.random() - 0.5) * 0.02;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.radius += (this.maxRadius - this.radius) * 0.035;
        this.alpha -= this.decay;
        this.rotation += this.vr;
      }

      draw(context) {
        if (this.alpha <= 0 || !context) return;
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

    const heroParticles = [];
    const aboutParticles = [];
    const expParticles = [];

    let animId = null;

    const renderLoop = () => {
      let hasActiveParticles = false;

      if (heroCtx && heroCanvas) {
        if (heroParticles.length > 0) {
          hasActiveParticles = true;
          heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
          for (let i = heroParticles.length - 1; i >= 0; i--) {
            const p = heroParticles[i];
            p.update();
            p.draw(heroCtx);
            if (p.alpha <= 0) {
              heroParticles.splice(i, 1);
            }
          }
        }
      }

      if (aboutCtx && aboutCanvas) {
        if (aboutParticles.length > 0) {
          hasActiveParticles = true;
          aboutCtx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
          for (let i = aboutParticles.length - 1; i >= 0; i--) {
            const p = aboutParticles[i];
            p.update();
            p.draw(aboutCtx);
            if (p.alpha <= 0) {
              aboutParticles.splice(i, 1);
            }
          }
        }
      }

      if (expCtx && expCanvas) {
        if (expParticles.length > 0) {
          hasActiveParticles = true;
          expCtx.clearRect(0, 0, expCanvas.width, expCanvas.height);
          for (let i = expParticles.length - 1; i >= 0; i--) {
            const p = expParticles[i];
            p.update();
            p.draw(expCtx);
            if (p.alpha <= 0) {
              expParticles.splice(i, 1);
            }
          }
        }
      }

      if (hasActiveParticles) {
        animId = requestAnimationFrame(renderLoop);
      } else {
        animId = null;
        if (heroCtx && heroCanvas) heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
        if (aboutCtx && aboutCanvas) aboutCtx.clearRect(0, 0, aboutCanvas.width, aboutCanvas.height);
        if (expCtx && expCanvas) expCtx.clearRect(0, 0, expCanvas.width, expCanvas.height);
      }
    };

    const wakeLoop = () => {
      if (!animId) {
        animId = requestAnimationFrame(renderLoop);
      }
    };

    // Global particle trigger functions (on-demand wake-up only)
    window.triggerTouchSmoke = (x, y, isRed = false) => {
      if (!heroCtx) return;
      const count = window.innerWidth < 768 ? 4 : 8;
      for (let i = 0; i < count; i++) {
        heroParticles.push(new SmokeParticle(x, y, isRed, true));
      }
      wakeLoop();
    };

    window.triggerAboutTouchSmoke = (x, y, isRed = false) => {
      if (!aboutCtx || window.innerWidth < 768) return;
      for (let i = 0; i < 6; i++) {
        aboutParticles.push(new SmokeParticle(x, y, isRed, true));
      }
      wakeLoop();
    };

    window.triggerExpTouchSmoke = (x, y, isRed = false) => {
      if (!expCtx || window.innerWidth < 768) return;
      for (let i = 0; i < 6; i++) {
        expParticles.push(new SmokeParticle(x, y, isRed, true));
      }
      wakeLoop();
    };

    return () => {
      window.removeEventListener('resize', resizeAll);
      if (animId) cancelAnimationFrame(animId);
      delete window.triggerTouchSmoke;
      delete window.triggerAboutTouchSmoke;
      delete window.triggerExpTouchSmoke;
    };
  }, []);

  return null;
}
