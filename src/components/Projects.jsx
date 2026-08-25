import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const PROJECTS = [
  {
    id: 1,
    num: '01',
    category: 'INTELLIGENT COLLEGE MANAGEMENT SYSTEM',
    title: 'MIET ERP',
    desc: 'A comprehensive role-based ERP platform designed to streamline academic and examination management, including student records, attendance, internal and external marks, hall allocation, GPA/CGPA, and institutional workflows.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Prisma', 'JWT'],
    repo: 'https://github.com/Mohamedkassim786/MIETERP',
  },
  {
    id: 2,
    num: '02',
    category: 'INTELLIGENT GPS-BASED SPEED LIMITER',
    title: 'SAFERIDE',
    desc: 'A location-aware vehicle safety system that combines a Flutter mobile application with ESP32 hardware to detect restricted zones and automatically enforce speed limits using real-time GPS, dynamic geofencing, and Bluetooth communication.',
    tags: ['Flutter', 'Dart', 'ESP32', 'GPS', 'OpenStreetMap', 'SQLite', 'Bluetooth'],
    repo: 'https://github.com/Mohamedkassim786/GPSTRACKING-MOBILEAPP',
  },
  {
    id: 3,
    num: '03',
    category: 'SMART DINING & IOT MANAGEMENT PLATFORM',
    title: 'SCAN & DINE',
    desc: 'A full-stack, real-time QR-based restaurant platform featuring ESP32 smart table displays, live kitchen workflows, digital payments, order management, and a comprehensive admin control center.',
    tags: ['React', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'Socket.IO', 'ESP32'],
    repo: 'https://github.com/Mohamedkassim786/Scan-Dine',
  },
  {
    id: 4,
    num: '04',
    category: 'AI-POWERED KNOWLEDGE ASSISTANT',
    title: 'KNOWSURE AI',
    desc: 'An evidence-driven RAG assistant that answers questions strictly from uploaded documents, reduces hallucinations, understands natural-language queries and typos, and provides source-backed responses.',
    tags: ['React', 'FastAPI', 'Python', 'FAISS', 'NVIDIA AI', 'RAG'],
    repo: 'https://github.com/Mohamedkassim786/Academia-AI',
  },
  {
    id: 5,
    num: '05',
    category: 'AI-POWERED LEARNING & PLACEMENT PLATFORM',
    title: 'SKILLBRIDGE',
    desc: 'An enterprise learning platform that combines multi-language coding sandboxes, AI-powered career tools, resume analysis, mock interviews, skill assessments, and live masterclasses.',
    tags: ['Laravel', 'PHP', 'Livewire', 'Tailwind CSS', 'NVIDIA AI', 'MySQL'],
    repo: 'https://github.com/Mohamedkassim786/SkillBridge-Laravel',
  },
  {
    id: 6,
    num: '06',
    category: 'GARMENT MANUFACTURING ERP SYSTEM',
    title: 'SHIRTERP',
    desc: 'An end-to-end enterprise resource planning system for garment manufacturing, managing inventory, production, sales, accounting, HR, payroll, and the complete product lifecycle.',
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma'],
    repo: 'https://github.com/Mohamedkassim786/SHIRTERP',
  },
  {
    id: 7,
    num: '07',
    category: 'COURIER TRACKING & MANAGEMENT PLATFORM',
    title: 'TKS COURIER & CARGO',
    desc: 'A full-stack courier tracking platform built with a React frontend and Express backend, using Google Sheets for data management and deployment-ready cloud infrastructure.',
    tags: ['React', 'Node.js', 'Express', 'Google Sheets'],
    repo: 'https://github.com/Mohamedkassim786/courier-website',
  },
  {
    id: 8,
    num: '08',
    category: 'AUTONOMOUS ENTREPRENEURSHIP INTELLIGENCE',
    title: 'SHELEADS AI',
    desc: 'An autonomous multi-agent AI platform designed to support inclusive entrepreneurship by transforming business ideas into structured business plans, financial projections, bias-free pitch evaluations, and verified investor or grant opportunities.',
    tags: ['React', 'FastAPI', 'Python', 'LangChain', 'FAISS', 'OpenAI', 'RAG', 'Multi-Agent AI'],
    repo: 'https://github.com/Mohamedkassim786/agenticAI',
  },
];

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const totalCards = PROJECTS.length;
  const autoplayTimerRef = useRef(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimerRef.current = setInterval(() => {
      if (isVisibleRef.current) {
        setActiveIndex((prev) => (prev + 1) % totalCards);
      }
    }, 2000);
  };

  const stopAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  };

  const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  useEffect(() => {
    const section = document.getElementById('work');
    if (!section) {
      startAutoplay();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          isVisibleRef.current = true;
          startAutoplay();
        } else {
          isVisibleRef.current = false;
          stopAutoplay();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);

    const handleVisibility = () => {
      if (document.hidden) stopAutoplay();
      else if (isVisibleRef.current) startAutoplay();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopAutoplay();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [totalCards]);

  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.changedTouches[0].screenX;
    touchStartYRef.current = e.changedTouches[0].screenY;
  };

  const handleTouchEnd = (e) => {
    const diffX = e.changedTouches[0].screenX - touchStartXRef.current;
    const diffY = Math.abs(e.changedTouches[0].screenY - touchStartYRef.current);

    if (Math.abs(diffX) > 35 && Math.abs(diffX) > diffY * 1.2) {
      if (diffX < 0) {
        setActiveIndex((prev) => (prev + 1) % totalCards);
      } else {
        setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
      }
      resetAutoplay();
    }
  };

  return (
    <section className="work-section" id="work">
      <div className="work-container">
        {/* Section Header */}
        <div className="work-header">
          <div className="work-badge">
            <span className="badge-dot"></span>
            <span className="badge-text">FEATURED WORK</span>
          </div>
          <h2 className="work-title">
            <span>ENGINEERED FOR IMPACT.</span><br />
            <span className="highlight-text">BUILT WITH PRECISION.</span>
          </h2>
          <p className="work-subtitle">
            Real-world systems, autonomous AI agents, and enterprise architectures extracted directly from GitHub.
          </p>
        </div>

        {/* 3D Coverflow Container */}
        <div
          className="coverflow-root"
          id="coverflow-root"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="coverflow-stage" id="coverflow-stage">
            {PROJECTS.map((proj, i) => {
              let rel = i - activeIndex;
              if (rel > totalCards / 2) rel -= totalCards;
              if (rel < -totalCards / 2) rel += totalCards;

              const ax = Math.abs(rel);
              const visible = ax <= (isMobile ? 1 : 2);
              const isActive = rel === 0;

              const sc = Math.max(isMobile ? 0.72 : 0.55, 1 - ax * (isMobile ? 0.18 : 0.15));
              const tx = rel * (isMobile ? 65 : 180);
              const tz = -ax * (isMobile ? 100 : 220);
              const ry = -rel * (isMobile ? 8 : 14);
              const rz = rel * (isMobile ? 2 : 5);
              const zIndex = 50 - Math.round(ax * 10);

              return (
                <div
                  key={proj.id}
                  className={`coverflow-card ${isActive ? 'active' : ''}`}
                  style={{
                    transform: `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`,
                    opacity: visible ? 1 : 0,
                    pointerEvents: visible ? 'auto' : 'none',
                    cursor: isActive ? 'default' : 'pointer',
                    zIndex: zIndex,
                  }}
                  onClick={() => {
                    if (!isActive) {
                      setActiveIndex(i);
                      resetAutoplay();
                    }
                  }}
                >
                  <div className="card-inner">
                    <div className="card-top">
                      <div className="card-category">
                        <span className="card-cat-dot"></span>
                        <span>{proj.category}</span>
                      </div>
                      <span className="card-num">{proj.num}</span>
                    </div>

                    <div className="card-body">
                      <h3 className="card-title">{proj.title}</h3>
                      <p className="card-desc">{proj.desc}</p>
                      <div className="card-tags">
                        {proj.tags.map((tag) => (
                          <span key={tag} className="tag-chip">{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="card-footer">
                      <a
                        href={proj.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-cta-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>VIEW REPOSITORY</span>
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                  <div className="card-dim" style={{ opacity: isActive ? 0 : 0.65 }}></div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="coverflow-controls">
            <button
              className="coverflow-btn coverflow-prev"
              id="coverflow-prev"
              aria-label="Previous project"
              onClick={() => {
                setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
                resetAutoplay();
              }}
            >
              <ChevronLeft size={20} />
            </button>

            <div className="coverflow-dots" id="coverflow-dots">
              {PROJECTS.map((_, i) => (
                <div
                  key={i}
                  className={`coverflow-dot ${i === activeIndex ? 'active' : ''}`}
                  onClick={() => {
                    setActiveIndex(i);
                    resetAutoplay();
                  }}
                  aria-label={`Go to project ${i + 1}`}
                ></div>
              ))}
            </div>

            <button
              className="coverflow-btn coverflow-next"
              id="coverflow-next"
              aria-label="Next project"
              onClick={() => {
                setActiveIndex((prev) => (prev + 1) % totalCards);
                resetAutoplay();
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
