import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const PROJECTS = [
  {
    num: '01',
    category: 'ENTERPRISE ACADEMIC PLATFORM',
    title: 'MIET ERP',
    desc: 'An enterprise-grade Academic Resource Planning system built to automate campus operations, track real-time student attendance, orchestrate dynamic class timetables, process multi-tier faculty workflows, and deliver auditable analytics across academic departments.',
    tags: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma ORM', 'Tailwind CSS', 'Docker', 'JWT'],
    repo: 'https://github.com/Mohamedkassim786/MIET_ERP',
  },
  {
    num: '02',
    category: 'IOT HARDWARE & CLOUD ECOSYSTEM',
    title: 'SAFERIDE',
    desc: 'An intelligent safety and accident response ecosystem leveraging ESP32 IoT hardware with real-time multi-axis impact telemetry, GPS coordinate tracking, algorithmic fall detection, and automatic emergency SMS alerts synchronized with a cloud portal.',
    tags: ['ESP32', 'C++', 'IoT Sensor Mesh', 'Node.js', 'Express.js', 'MySQL', 'Twilio API', 'Socket.IO'],
    repo: 'https://github.com/Mohamedkassim786/saferide-fullstack',
  },
  {
    num: '03',
    category: 'REAL-TIME RESTAURANT COMMERCE',
    title: 'SCAN & DINE',
    desc: 'A full-stack digital dining platform featuring contactless dynamic QR-based table ordering, real-time live kitchen dispatch (KDS) via WebSockets, multi-channel payment processing, and comprehensive restaurant revenue analytics.',
    tags: ['Flutter', 'Dart', 'FastAPI', 'Python', 'PostgreSQL', 'Socket.IO', 'Redis', 'Razorpay API'],
    repo: 'https://github.com/Mohamedkassim786/scan-and-dine',
  },
  {
    num: '04',
    category: 'AGENTIC AI INSURANCE SUITE',
    title: 'KNOWSURE AI',
    desc: 'An intelligent insurance automation engine utilizing LangChain, autonomous LLM agents, and semantic vector retrieval (RAG) to instantly parse multi-page policy clauses, detect coverage overlaps, and generate accurate risk profiles.',
    tags: ['Next.js', 'TypeScript', 'FastAPI', 'Python', 'LangChain', 'OpenAI', 'FAISS', 'Pinecone'],
    repo: 'https://github.com/Mohamedkassim786/Knowsure-ai',
  },
  {
    num: '05',
    category: 'TALENT BENCHMARKING ENGINE',
    title: 'SKILLBRIDGE',
    desc: 'A skill verification and candidate benchmarking web application that delivers adaptive real-time technical coding assessments, automated multi-language code evaluation, anti-cheat monitoring, and recruiter candidate analytics.',
    tags: ['React.js', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'Judge0 API', 'Tailwind CSS'],
    repo: 'https://github.com/Mohamedkassim786/Skillbridge',
  },
  {
    num: '06',
    category: 'COMMERCE & APPAREL ERP',
    title: 'SHIRTERP',
    desc: 'A specialized manufacturing and multi-outlet supply-chain ERP designed for custom apparel operations, managing high-throughput raw material inventory, batch billing, pattern production pipelines, and automated financial records.',
    tags: ['Laravel', 'PHP', 'Livewire', 'MySQL', 'Tailwind CSS', 'Alpine.js', 'Chart.js'],
    repo: 'https://github.com/Mohamedkassim786/shirterp',
  },
  {
    num: '07',
    category: 'INTERNATIONAL LOGISTICS SUITE',
    title: 'TKS COURIER & CARGO',
    desc: 'An enterprise logistics and freight tracking portal built for active international courier routes between Singapore and India, featuring barcode-scanned parcel tracking, automated airway bill generation, and multi-currency billing.',
    tags: ['Laravel', 'PHP', 'MySQL', 'REST APIs', 'Bootstrap 5', 'DomPDF', 'cURL'],
    repo: 'https://github.com/Mohamedkassim786/tks-courier-cargo',
  },
  {
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
      setActiveIndex((prev) => (prev + 1) % totalCards);
    }, 2800);
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
    startAutoplay();
    const handleVisibility = () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      stopAutoplay();
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

    if (Math.abs(diffX) > 30 && Math.abs(diffX) > diffY * 1.1) {
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
                  key={proj.id || proj.title}
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
                        <span>VIEW ON GITHUB</span>
                        <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="coverflow-controls">
            <button
              className="coverflow-btn prev-btn"
              aria-label="Previous Project"
              onClick={() => {
                setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
                resetAutoplay();
              }}
            >
              <ChevronLeft size={22} />
            </button>

            <div className="coverflow-dots">
              {PROJECTS.map((_, i) => (
                <span
                  key={i}
                  className={`coverflow-dot ${i === activeIndex ? 'active' : ''}`}
                  onClick={() => {
                    setActiveIndex(i);
                    resetAutoplay();
                  }}
                ></span>
              ))}
            </div>

            <button
              className="coverflow-btn next-btn"
              aria-label="Next Project"
              onClick={() => {
                setActiveIndex((prev) => (prev + 1) % totalCards);
                resetAutoplay();
              }}
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
