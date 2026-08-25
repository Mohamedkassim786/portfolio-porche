import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RotateCcw } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SKILLS_DATA = [
  {
    name: 'React.js',
    color: '#61DAFB',
    svg: (
      <svg viewBox="-11.5 -10.23174 23 20.46348" width="38" height="38" className="gravity-svg">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    name: 'Python',
    color: '#3776AB',
    svg: (
      <svg viewBox="0 0 24 24" width="38" height="38" className="gravity-svg">
        <path d="M11.9 2c-3.1 0-5.7 1.2-5.7 3.8v2.7h5.8v.8H3.8C1.7 9.3 0 11.2 0 14.1s1.5 4.9 3.6 4.9h2.3v-2.5c0-2.3 1.9-4.2 4.2-4.2h5.7c1.9 0 3.5-1.5 3.5-3.5V5.7C19.3 3.3 16.9 2 11.9 2zm-1.8 1.9c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1-1.1-.5-1.1-1.1.5-1.1 1.1-1.1z" fill="#387EB8" />
        <path d="M12.1 22c3.1 0 5.7-1.2 5.7-3.8v-2.7h-5.8v-.8h8.2c2.1 0 3.8-1.9 3.8-4.8s-1.5-4.9-3.6-4.9h-2.3v2.5c0 2.3-1.9 4.2-4.2 4.2H8.2c-1.9 0-3.5 1.5-3.5 3.5v3.1c0 2.4 2.4 3.8 7.4 3.8zm1.8-1.9c-.6 0-1.1-.5-1.1-1.1s.5-1.1 1.1-1.1 1.1.5 1.1 1.1-.5 1.1-1.1 1.1z" fill="#FFE052" />
      </svg>
    ),
  },
  {
    name: 'Agentic AI',
    color: '#E50914',
    svg: (
      <svg viewBox="0 0 24 24" width="38" height="38" className="gravity-svg">
        <path d="M12 2a4 4 0 014 4c0 1.5-.8 2.8-2 3.5V11a2 2 0 002 2h2.5c.7-1.2 2-2 3.5-2a4 4 0 11-4 4h-2a4 4 0 01-4-4v-1.5c-1.2-.7-2-2-2-3.5a4 4 0 014-4zm-4 13a4 4 0 100 8 4 4 0 000-8z" fill="#E50914" />
      </svg>
    ),
  },
  {
    name: 'Node.js',
    color: '#5FA04E',
    svg: (
      <svg viewBox="0 0 24 24" width="38" height="38" className="gravity-svg">
        <path d="M12 2l9 5.2v10.4l-9 5.2-9-5.2V7.2L12 2zm0 2.3L4.8 8.5v7l7.2 4.2 7.2-4.2v-7L12 4.3z" fill="#5FA04E" />
      </svg>
    ),
  },
  {
    name: 'TypeScript',
    color: '#3178C6',
    svg: (
      <svg viewBox="0 0 24 24" width="38" height="38" className="gravity-svg">
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path d="M14.5 13.5c.3 1.4 1.3 2.3 2.8 2.3 1.2 0 2.2-.6 2.2-1.7 0-1.1-.9-1.5-2.4-2.1-2.2-.8-3.6-1.7-3.6-3.7 0-2 1.6-3.5 3.9-3.5 2 0 3.4 1 3.8 2.6l-1.9.8c-.3-.9-.9-1.5-1.9-1.5-1.1 0-1.8.6-1.8 1.4 0 .9.8 1.3 2.2 1.9 2.5.9 3.8 1.9 3.8 3.9 0 2.2-1.7 3.7-4.3 3.7-2.6 0-4.2-1.3-4.6-3.3l1.9-.8zM7 6.8h7.2v1.9H11.7V19H9.5V8.7H7V6.8z" fill="#FFF" />
      </svg>
    ),
  },
  {
    name: 'Flutter',
    color: '#42A5F5',
    svg: (
      <svg viewBox="0 0 24 24" width="38" height="38" className="gravity-svg">
        <path d="M14.3 2L4 12.3l3.2 3.2L20.7 2h-6.4zm0 8.8L9.2 15.9l4.8 4.8 6.7-6.7h-6.4l-4.8 4.8z" fill="#42A5F5" />
        <path d="M14.3 10.8l4.8-4.8H20.7l-8 8-3.2-3.2 4.8-4.8z" fill="#01579B" />
      </svg>
    ),
  },
  {
    name: 'FastAPI',
    color: '#009688',
    svg: (
      <svg viewBox="0 0 24 24" width="38" height="38" className="gravity-svg">
        <circle cx="12" cy="12" r="10.5" fill="#009688" />
        <path d="M12 4l-4.5 7.5h3.5L9.5 19.5 16 11h-3.8L14 4z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: 'LangChain',
    color: '#00A67E',
    svg: (
      <svg viewBox="0 0 24 24" width="38" height="38" className="gravity-svg">
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.3l6.5 3.6-2.5 1.4-6.5-3.6 2.5-1.4zM5 8.6l6 3.3v6.7l-6-3.3V8.6zm14 6.7l-6 3.3v-6.7l6-3.3v6.7z" fill="#00A67E" />
      </svg>
    ),
  },
  {
    name: 'PostgreSQL',
    color: '#336791',
    svg: (
      <svg viewBox="0 0 24 24" width="38" height="38" className="gravity-svg">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2.5c-.83 0-1.5.67-1.5 1.5V12h4l-.5 3h-3.5v6.8c4.56-.93 8-4.96 8-9.8 0-5.52-4.48-10-10-10z" fill="#336791" />
      </svg>
    ),
  },
  {
    name: 'Laravel',
    color: '#FF2D20',
    svg: (
      <svg viewBox="0 0 24 24" width="38" height="38" className="gravity-svg">
        <path d="M12 2L2 7.5l10 5.5 10-5.5L12 2zm0 8.5L4.5 6 12 1.8 19.5 6 12 10.5zm-9 1v6L11 23v-6L3 11.5zm18 0l-8 5.5v6l8-5.5v-6z" fill="#FF2D20" />
      </svg>
    ),
  },
  {
    name: 'ESP32 IoT',
    color: '#E50914',
    svg: (
      <svg viewBox="0 0 24 24" width="38" height="38" className="gravity-svg">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="#1C1F2E" stroke="#E50914" strokeWidth="1.5" />
        <rect x="6" y="6" width="12" height="12" rx="1.5" fill="#E50914" fillOpacity="0.2" />
        <circle cx="9" cy="9" r="1.2" fill="#E50914" />
        <circle cx="15" cy="9" r="1.2" fill="#E50914" />
        <circle cx="9" cy="15" r="1.2" fill="#E50914" />
        <circle cx="15" cy="15" r="1.2" fill="#E50914" />
        <path d="M12 7v10M7 12h10" stroke="#E50914" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Prisma ORM',
    color: '#5A67D8',
    svg: (
      <svg viewBox="0 0 24 24" width="38" height="38" className="gravity-svg">
        <path d="M12.5 2.5L3.8 17.7c-.5.8.1 1.8 1 1.8h14.4c.9 0 1.5-1 1-1.8L12.5 2.5z" fill="#5A67D8" />
      </svg>
    ),
  },
  {
    name: 'Tailwind CSS',
    color: '#38BDF8',
    svg: (
      <svg viewBox="0 0 24 24" width="38" height="38" className="gravity-svg">
        <path d="M12 6c-3.3 0-5.5 1.7-6.5 5 1.3-1.7 2.8-2.3 4.5-1.8.9.3 1.6 1 2.4 1.7C13.6 12.1 15.3 13.7 19 13.7c3.3 0 5.5-1.7 6.5-5-1.3 1.7-2.8 2.3-4.5 1.8-.9-.3-1.6-1-2.4-1.7C17.4 7.6 15.7 6 12 6zM5 13.7c-3.3 0-5.5 1.7-6.5 5 1.3-1.7 2.8-2.3 4.5-1.8.9.3 1.6 1 2.4 1.7 1.2 1.2 2.9 2.8 6.6 2.8 3.3 0 5.5-1.7 6.5-5-1.3 1.7-2.8 2.3-4.5 1.8-.9-.3-1.6-1-2.4-1.7C10.4 15.3 8.7 13.7 5 13.7z" fill="#38BDF8" />
      </svg>
    ),
  },
  {
    name: 'Socket.IO',
    color: '#FFFFFF',
    svg: (
      <svg viewBox="0 0 24 24" width="38" height="38" className="gravity-svg">
        <circle cx="12" cy="12" r="10" fill="#181B26" stroke="#FFFFFF" strokeWidth="1" />
        <path d="M12 4a8 8 0 108 8 8 8 0 00-8-8zm1 12.5l-3.5-3.5 1.4-1.4 2.1 2.1 4.6-4.6 1.4 1.4z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: 'MySQL',
    color: '#00758F',
    svg: (
      <svg viewBox="0 0 24 24" width="38" height="38" className="gravity-svg">
        <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v6.5z" fill="#00758F" />
      </svg>
    ),
  },
  {
    name: 'Git & GitHub',
    color: '#F05032',
    svg: (
      <svg viewBox="0 0 24 24" width="38" height="38" className="gravity-svg">
        <path d="M21.6 10.7l-8.3-8.3c-.6-.6-1.5-.6-2.1 0L9.4 4.2l2.7 2.7c.6-.2 1.4 0 1.9.5.5.5.7 1.3.5 1.9l2.6 2.6c.6-.2 1.4 0 1.9.5.7.7.7 1.9 0 2.6-.7.7-1.9.7-2.6 0-.5-.5-.7-1.4-.5-2l-2.4-2.4v5.3c.2.2.3.5.3.8 0 1-.8 1.8-1.8 1.8s-1.8-.8-1.8-1.8c0-.6.3-1.1.7-1.4V8.4c-.4-.3-.7-.8-.7-1.4 0-.6.3-1.1.7-1.4L8.3 3 2.4 8.9c-.6.6-.6 1.5 0 2.1l8.3 8.3c.6.6 1.5.6 2.1 0l8.8-8.8c.6-.4.6-1.4 0-1.8z" fill="#F05032" />
      </svg>
    ),
  },
];

export default function Skills() {
  const containerRef = useRef(null);
  const elementsRef = useRef([]);
  const spawnBodiesFnRef = useRef(null);
  const startPhysicsFnRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { Engine, Bodies, Composite, Mouse, MouseConstraint, Body, Events } = Matter;

    const engine = Engine.create({
      enableSleeping: false,
      gravity: { x: 0, y: 1.25 },
    });

    const getDimensions = () => {
      const parent = container.parentElement;
      return {
        w: container.offsetWidth || (parent ? parent.offsetWidth : window.innerWidth),
        h: container.offsetHeight || (parent ? parent.offsetHeight : window.innerHeight),
      };
    };

    let { w: width, h: height } = getDimensions();
    const t = 140;

    // Walls setup: floor raised to ensure all cubes rest fully visible above bottom edge
    let walls = [
      Bodies.rectangle(width / 2, -1000, width * 3, t, { isStatic: true }), // High ceiling
      Bodies.rectangle(width / 2, height - 45 + t / 2, width * 3, t, { isStatic: true }), // Raised Floor
      Bodies.rectangle(-t / 2 + 15, height / 2, t, height * 3, { isStatic: true }), // Left Wall
      Bodies.rectangle(width + t / 2 - 15, height / 2, t, height * 3, { isStatic: true }), // Right Wall
    ];
    Composite.add(engine.world, walls);

    const mouse = Mouse.create(container);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.92,
        angularStiffness: 0.15,
        render: { visible: false },
      },
    });
    Composite.add(engine.world, mouseConstraint);

    if (mouse.element) {
      mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
    }

    const physicsBodies = [];
    let isPhysicsRunning = false;
    let physicsFrameId = null;
    let settleTimeout = null;

    const startPhysics = () => {
      if (isPhysicsRunning) {
        if (!mouseConstraint.body) {
          clearTimeout(settleTimeout);
          settleTimeout = setTimeout(() => stopPhysics(), 4000);
        }
        return;
      }
      isPhysicsRunning = true;

      const step = () => {
        if (!isPhysicsRunning) return;
        Engine.update(engine, 1000 / 60);

        for (let i = 0; i < physicsBodies.length; i++) {
          const el = elementsRef.current[i];
          const body = physicsBodies[i];
          if (el && body) {
            el.style.left = `${body.position.x}px`;
            el.style.top = `${body.position.y}px`;
            el.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
          }
        }
        physicsFrameId = requestAnimationFrame(step);
      };
      physicsFrameId = requestAnimationFrame(step);

      if (!mouseConstraint.body) {
        clearTimeout(settleTimeout);
        settleTimeout = setTimeout(() => stopPhysics(), 4000);
      }
    };

    const stopPhysics = () => {
      if (mouseConstraint.body) return;
      isPhysicsRunning = false;
      if (physicsFrameId) {
        cancelAnimationFrame(physicsFrameId);
        physicsFrameId = null;
      }
    };

    startPhysicsFnRef.current = startPhysics;

    const spawnBodies = () => {
      physicsBodies.forEach((b) => Composite.remove(engine.world, b));
      physicsBodies.length = 0;

      const screenW = window.innerWidth;
      const isMobile = screenW < 768;
      const isSmallMobile = screenW < 380;

      const dims = getDimensions();
      width = dims.w;
      height = Math.max(dims.h, isMobile ? 840 : 720);

      const floorPadding = isMobile ? 35 : 55;
      const floorY = height - floorPadding + t / 2;

      Body.setPosition(walls[0], { x: width / 2, y: -1000 });
      Body.setPosition(walls[1], { x: width / 2, y: floorY });
      Body.setPosition(walls[2], { x: -t / 2 + (isMobile ? 10 : 25), y: height / 2 });
      Body.setPosition(walls[3], { x: width + t / 2 - (isMobile ? 10 : 25), y: height / 2 });

      const cubeSize = isSmallMobile ? 66 : (isMobile ? 74 : 116);
      const radius = isSmallMobile ? 12 : (isMobile ? 14 : 24);

      const n = SKILLS_DATA.length;
      const cols = isMobile ? 4 : 6;
      const sideMargin = isMobile ? 18 : 60;
      const availableW = width - sideMargin * 2;

      // Spawn all cubes from above the ceiling so they drop from top to bottom
      for (let i = 0; i < n; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const startX = sideMargin + ((col + 0.5) / cols) * availableW + (Math.random() - 0.5) * 16;
        const startY = isMobile
          ? -60 - (row * (cubeSize + 25)) + (Math.random() - 0.5) * 10
          : -100 - (row * (cubeSize + 35)) + (Math.random() - 0.5) * 15;

        const body = Bodies.rectangle(startX, startY, cubeSize, cubeSize, {
          chamfer: { radius: radius },
          friction: 0.65,
          restitution: 0.58,
          frictionAir: 0.012,
          density: 0.001,
        });

        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);
        Body.setVelocity(body, {
          x: (Math.random() - 0.5) * (isMobile ? 1.8 : 3.2),
          y: 3 + Math.random() * (isMobile ? 3 : 5),
        });

        physicsBodies.push(body);
      }

      Composite.add(engine.world, physicsBodies);

      for (let i = 0; i < physicsBodies.length; i++) {
        const el = elementsRef.current[i];
        const body = physicsBodies[i];
        if (el && body) {
          el.style.left = `${body.position.x}px`;
          el.style.top = `${body.position.y}px`;
          el.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
        }
      }
    };

    spawnBodiesFnRef.current = spawnBodies;

    container.addEventListener('mousedown', () => {
      clearTimeout(settleTimeout);
      startPhysics();
    });

    Events.on(mouseConstraint, 'startdrag', (evt) => {
      clearTimeout(settleTimeout);
      startPhysics();
      const body = evt.body;
      const idx = physicsBodies.indexOf(body);
      if (idx !== -1 && elementsRef.current[idx]) {
        elementsRef.current[idx].classList.add('grabbing');
      }
    });

    Events.on(mouseConstraint, 'enddrag', (evt) => {
      const body = evt.body;
      const idx = physicsBodies.indexOf(body);
      if (idx !== -1 && elementsRef.current[idx]) {
        elementsRef.current[idx].classList.remove('grabbing');
      }
      clearTimeout(settleTimeout);
      settleTimeout = setTimeout(() => stopPhysics(), 4000);
    });

    spawnBodies();
    startPhysics();

    const trigger = ScrollTrigger.create({
      trigger: '#skills',
      start: 'top 75%',
      onEnter: () => {
        spawnBodies();
        startPhysics();
      },
      onEnterBack: () => {
        spawnBodies();
        startPhysics();
      },
    });

    return () => {
      trigger.kill();
      stopPhysics();
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  const handleCardClick = (index) => {
    if (startPhysicsFnRef.current) {
      startPhysicsFnRef.current();
    }
  };

  const handleResetGravity = () => {
    if (spawnBodiesFnRef.current && startPhysicsFnRef.current) {
      spawnBodiesFnRef.current();
      startPhysicsFnRef.current();
    }
  };

  return (
    <section className="skills-section" id="skills">
      {/* Header Overlay */}
      <div className="skills-fullscreen-header">
        <h2 className="skills-title">MASTERED TECHNOLOGIES</h2>
        <p className="skills-subtitle">
          Interactive physics-driven tech ecosystem. Click, drag, toss, and fling any skill across the screen.
        </p>
        <div className="gravity-action-bar">
          <button
            id="reset-gravity-btn"
            className="gravity-reset-btn"
            aria-label="Re-Drop Gravity"
            onClick={handleResetGravity}
          >
            <RotateCcw className="reset-icon" size={16} />
            <span>RE-DROP GRAVITY</span>
          </button>
        </div>
      </div>

      {/* Physics Stage */}
      <div className="gravity-gallery-root" id="gravity-gallery-root" ref={containerRef}>
        {SKILLS_DATA.map((skill, i) => (
          <div
            key={skill.name}
            ref={(el) => (elementsRef.current[i] = el)}
            className="gravity-body"
            data-name={skill.name}
            onClick={() => handleCardClick(i)}
          >
            <div className="gravity-card">
              {skill.svg}
              <div className="gravity-text">
                <span className="gravity-title">{skill.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
