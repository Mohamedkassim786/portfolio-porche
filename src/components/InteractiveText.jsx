import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';

export default function InteractiveText({ text, className = '', isRed = false, smokeType = 'hero' }) {
  if (!text) return null;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    return <span className={`interactive-text-wrap ${className}`}>{text}</span>;
  }

  const words = text.split(' ');

  const animateUp = (target, clientX, clientY) => {
    if (!target) return;

    gsap.to(target, {
      y: -10,
      scale: 1.25,
      rotateX: 18,
      rotateY: (Math.random() - 0.5) * 16,
      duration: 0.18,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    const rect = target.getBoundingClientRect();
    const touchX = clientX !== undefined ? clientX : rect.left + rect.width / 2;
    const touchY = clientY !== undefined ? clientY : rect.top + rect.height / 2;

    if (smokeType === 'hero' && window.triggerTouchSmoke) {
      window.triggerTouchSmoke(touchX, touchY, isRed);
    } else if (smokeType === 'about' && window.triggerAboutTouchSmoke) {
      window.triggerAboutTouchSmoke(touchX, touchY, isRed);
    } else if (smokeType === 'exp' && window.triggerExpTouchSmoke) {
      window.triggerExpTouchSmoke(touchX, touchY, isRed);
    }

    if (target._returnTimer) clearTimeout(target._returnTimer);
    target._returnTimer = setTimeout(() => {
      animateDown(target);
    }, 1200);
  };

  const animateDown = (target) => {
    if (!target) return;
    if (target._returnTimer) clearTimeout(target._returnTimer);

    gsap.to(target, {
      y: 0,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      duration: 0.55,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });
  };

  return (
    <span className={`interactive-text-wrap ${className}`}>
      {words.map((word, wordIdx) => (
        <React.Fragment key={wordIdx}>
          <span className="word">
            {[...word].map((char, charIdx) => {
              const isBullet = char === '·' || char === '•';
              return (
                <span
                  key={charIdx}
                  className={`char ${isBullet ? 'accent-bullet' : ''}`}
                  onMouseEnter={(e) => animateUp(e.currentTarget, e.clientX, e.clientY)}
                  onMouseLeave={(e) => animateDown(e.currentTarget)}
                >
                  {char}
                </span>
              );
            })}
          </span>
          {wordIdx < words.length - 1 && <span className="space">&nbsp;</span>}
        </React.Fragment>
      ))}
    </span>
  );
}
