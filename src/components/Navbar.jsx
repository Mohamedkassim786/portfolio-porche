import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { X, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToSection = (targetId) => {
    setIsMobileMenuOpen(false);

    if (targetId === 'hero') {
      gsap.to(window, {
        scrollTo: { y: 0, autoKill: false },
        duration: 0.45,
        ease: 'power3.out',
      });
      return;
    }

    const targetElem = document.getElementById(targetId);
    if (!targetElem) return;

    gsap.to(window, {
      scrollTo: {
        y: targetElem,
        offsetY: targetId === 'work' || targetId === 'skills' ? 20 : 0,
        autoKill: false,
      },
      duration: 0.45,
      ease: 'power3.out',
    });
  };

  const navLinks = [
    { name: 'Home', id: 'hero' },
    { name: 'About', id: 'about' },
    { name: 'Work', id: 'work' },
    { name: 'Skills', id: 'skills' },
    { name: 'Experience', id: 'experience' },
    { name: 'Contact', id: 'contact', isBtn: true },
  ];

  return (
    <>
      <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
        <a
          href="#hero"
          className="header-logo"
          onClick={(e) => {
            e.preventDefault();
            navigateToSection('hero');
          }}
        >
          <span className="logo-text">MK</span>
          <span className="logo-dot"></span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="header-nav desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`nav-link ${link.isBtn ? 'nav-btn' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                navigateToSection(link.id);
              }}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className={`hamburger-btn ${isMobileMenuOpen ? 'active' : ''}`}
          aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <span className="hamburger-line line-1"></span>
          <span className="hamburger-line line-2"></span>
          <span className="hamburger-line line-3"></span>
        </button>
      </header>

      {/* Mobile Glassmorphism Menu Drawer */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div
          className="mobile-menu-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        <div className="mobile-menu-drawer">
          <div className="mobile-menu-header">
            <div className="header-logo">
              <span className="logo-text">MK</span>
              <span className="logo-dot"></span>
            </div>
            <button
              className="mobile-close-btn"
              aria-label="Close menu"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          <nav className="mobile-menu-nav">
            {navLinks.map((link, idx) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="mobile-nav-link"
                style={{ transitionDelay: `${0.05 + idx * 0.04}s` }}
                onClick={(e) => {
                  e.preventDefault();
                  navigateToSection(link.id);
                }}
              >
                <span className="mobile-link-index">0{idx + 1}</span>
                <span className="mobile-link-text">{link.name}</span>
                <ArrowRight className="mobile-link-arrow" size={16} />
              </a>
            ))}
          </nav>

          <div className="mobile-menu-footer">
            <span className="mobile-footer-text">Mohamed Kassim M &middot; Portfolio</span>
          </div>
        </div>
      </div>
    </>
  );
}
