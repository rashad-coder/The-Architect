"use client";

import { useState, useEffect, useRef, ReactNode } from 'react';
import { Anton, Space_Mono } from 'next/font/google';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function MagneticBtn({ children }: { children: ReactNode }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.15, y: y * 0.15 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
      className="inline-block transition-transform duration-300 ease-out"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      {children}
    </div>
  );
}

function ScrambleLink({ href, text, className }: { href: string; text: string; className?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const chars = "01!@#$%^&*()_+<>?/[]{}";

  const handleMouseEnter = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) => 
        prev.split("")
          .map((letter, index) => {
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      
      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 30);
  };

  const handleMouseLeave = () => {
    setDisplayText(text);
  };

  return (
    <a 
      href={href} 
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </a>
  );
}

function Counter({ target, duration = 1500 }: { target: number, duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let startTime: number | null = null;
          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const current = Math.min(Math.floor((progress / duration) * target), target);
            setCount(current);
            if (progress < duration) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

function TiltWrapper({ children, className = "", onMouseEnter, onMouseLeave }: { children: React.ReactNode, className?: string, onMouseEnter?: () => void, onMouseLeave?: () => void }) {
  const [style, setStyle] = useState({});
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15; // Max 15 deg
    const rotateY = ((x - centerX) / centerX) * 15;
    
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'none'
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setStyle({
      transform: `perspective(1000px) rotateX(0deg) rotateY(0deg)`,
      transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    if (onMouseLeave) onMouseLeave();
  };

  return (
    <div 
      className={className} 
      onMouseMove={handleMouseMove} 
      onMouseEnter={onMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {children}
    </div>
  );
}

function VelocityMarquee({ children }: { children: React.ReactNode }) {
  const [offset, setOffset] = useState(0);
  const velocityRef = useRef(0);
  const prevScrollY = useRef(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    prevScrollY.current = window.scrollY;
    let animationFrameId: number;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - prevScrollY.current;
      velocityRef.current += Math.abs(delta) * 0.05; // Inject velocity on both up/down scrolls
      prevScrollY.current = currentScrollY;
    };

    const animate = () => {
      velocityRef.current *= 0.92; // Friction
      
      const speed = 0.05 + velocityRef.current;
      
      offsetRef.current -= speed;
      
      if (offsetRef.current <= -100) {
        offsetRef.current += 100;
      }
      
      setOffset(offsetRef.current);
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="flex w-[200vw] will-change-transform" style={{ transform: `translateX(${offset}vw)` }}>
      {children}
    </div>
  );
}

function HoldToExecuteBtn() {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    if (isSuccess) return;
    setIsHolding(true);
    setProgress(0);
    
    let currentProgress = 0;
    progressInterval.current = setInterval(() => {
      currentProgress += (100 / (1500 / 16));
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval.current as NodeJS.Timeout);
      }
      setProgress(currentProgress);
    }, 16);

    holdTimer.current = setTimeout(() => {
      setIsSuccess(true);
      setIsHolding(false);
      setProgress(100);
      clearInterval(progressInterval.current as NodeJS.Timeout);
    }, 1500);
  };

  const cancelHold = () => {
    if (isSuccess) return;
    setIsHolding(false);
    setProgress(0);
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (progressInterval.current) clearInterval(progressInterval.current);
  };

  return (
    <button 
      onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      className={`${anton.className} relative bg-transparent border-2 border-[#8A0303] hover:bg-[#8A0303]/10 text-white text-xl md:text-2xl uppercase tracking-widest px-10 py-5 transition-all duration-300 shadow-[0_0_30px_rgba(138,3,3,0.3)] cursor-none block w-full h-full overflow-hidden ${isHolding && !isSuccess ? 'animate-[shake_0.5s_infinite]' : ''}`}
    >
      <div 
        className="absolute top-0 left-0 h-full bg-[#8A0303] z-0 transition-none"
        style={{ width: `${progress}%` }}
      ></div>
      <span className="relative z-10 drop-shadow-md flex items-center justify-center gap-2">
        {isSuccess ? (
          <><span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> PROTOCOL INITIATED</>
        ) : isHolding ? (
          "HOLD TO EXECUTE"
        ) : (
          "ENTER THE TRENCHES"
        )}
      </span>
    </button>
  );
}

function TypewriterReveal({ text, className = "" }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState("");
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let i = 0;
          const speed = 600 / text.length;
          const interval = setInterval(() => {
            setDisplayText(text.substring(0, i + 1));
            i++;
            if (i >= text.length) clearInterval(interval);
          }, speed);
          
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [text]);

  return <span ref={ref} className={className}>{displayText}</span>;
}

function FaqItem({ question, answer, number, onHoverChange }: { question: string, answer: string, number: string, onHoverChange: (val: boolean) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div 
      onMouseEnter={() => onHoverChange(true)} 
      onMouseLeave={() => onHoverChange(false)} 
      className="border border-zinc-900/50 bg-[#050505]/90 p-6 md:p-8 group hover:border-[#8A0303] transition-colors cursor-none cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <h3 className={`${anton.className} text-xl md:text-2xl text-white uppercase tracking-wide flex justify-between items-center`}>
        <span>{number} // {question}</span>
        <span className={`text-[#8A0303] text-xl transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
      </h3>
      <div 
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4 pt-4' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <p className={`${spaceMono.className} text-zinc-400 text-xs md:text-sm uppercase tracking-wider leading-relaxed`}>
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function RedVelocityMarquee({ children }: { children: React.ReactNode }) {
  const [offset, setOffset] = useState(0);
  const velocityRef = useRef(0);
  const prevScrollY = useRef(0);
  const offsetRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentWidthRef = useRef(1000);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (containerRef.current) {
      contentWidthRef.current = containerRef.current.scrollWidth / 2; 
    }
    
    prevScrollY.current = window.scrollY;
    let animationFrameId: number;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - prevScrollY.current;
      velocityRef.current += Math.abs(delta) * 0.1;
      prevScrollY.current = currentScrollY;
    };

    const animate = () => {
      velocityRef.current *= 0.92;
      const speed = 1 + velocityRef.current;
      
      offsetRef.current -= speed;
      
      if (offsetRef.current <= -contentWidthRef.current) {
        offsetRef.current += contentWidthRef.current;
      }
      
      setOffset(offsetRef.current);
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="flex whitespace-nowrap will-change-transform" 
      style={{ transform: `translate3d(${offset}px, 0, 0)` }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isSiteLoaded, setIsSiteLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSiteLoaded(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Add scroll direction tracking state
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (currentScrollY / scrollHeight) * 100;
      
      setScrollProgress(progress);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false); // Hide on scroll down
      } else {
        setShowNavbar(true);  // Show on scroll up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#030000] text-white selection:bg-[#8A0303] selection:text-white overflow-x-hidden cursor-none">
      {/* CINEMATIC PRELOADER */}
      <div 
        className={`fixed inset-0 z-[9999] bg-[#030000] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
          isSiteLoaded ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        <div className={`${anton.className} text-4xl md:text-6xl text-white tracking-widest uppercase flex flex-col items-center gap-6 animate-pulse`}>
          <span className="w-4 h-4 rounded-full bg-[#8A0303]"></span>
          <span className="tracking-[0.2em]">THE ARCHITECT</span>
        </div>
      </div>

      {/* Background Watermark Typography */}
      <div 
        className={`${anton.className} fixed top-[20%] -left-[10%] text-[15vw] leading-none text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.03)] z-0 pointer-events-none select-none`}
        style={{ transform: `translateY(${lastScrollY * -0.1}px) rotate(-90deg)` }}
      >
        DISCIPLINE
      </div>
      <div 
        className={`${anton.className} fixed top-[60%] -right-[5%] text-[12vw] leading-none text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.02)] z-0 pointer-events-none select-none break-words w-[30vw] text-right`}
        style={{ transform: `translateY(${lastScrollY * -0.15}px)` }}
      >
        FORGE IRON.
      </div>

      {/* Custom Red Dot Cursor & Flashlight Glow */}
      <div 
        className="fixed top-0 left-0 w-[400px] h-[400px] bg-[#8A0303] opacity-[0.05] blur-[100px] rounded-full pointer-events-none z-0 hidden md:block transition-transform duration-150 ease-out"
        style={{
          transform: `translate(${cursorPos.x - 200}px, ${cursorPos.y - 200}px)`,
        }}
      ></div>
      <div 
        className={`fixed top-0 left-0 bg-[#8A0303] rounded-full pointer-events-none z-[100] hidden md:flex items-center justify-center transition-all duration-150 ease-out ${
          cursorText ? 'w-20 h-20 mix-blend-normal shadow-none' : 'w-4 h-4 shadow-[0_0_15px_#8A0303] mix-blend-screen'
        }`}
        style={{
          transform: `translate(${cursorPos.x - (cursorText ? 40 : 8)}px, ${cursorPos.y - (cursorText ? 40 : 8)}px) scale(${isHovered && !cursorText ? 2.5 : 1})`,
        }}
      >
        {cursorText && (
          <span className={`${spaceMono.className} text-white text-[10px] uppercase font-bold tracking-widest leading-none`}>
            {cursorText}
          </span>
        )}
      </div>

      {/* GLOBAL FILM GRAIN & SCANLINES */}
      <div className="fixed inset-0 z-[40] opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}></div>
      <div className="fixed inset-0 z-[41] opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)' }}></div>
      <div className="fixed inset-0 z-[45] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.9)_120%)]"></div>

      {/* Tactical Scroll Progress Line (Fixed Global) */}
      <div className="fixed top-0 left-0 h-[2px] bg-[#8A0303] z-[1000] transition-all duration-150 ease-out" style={{ width: `${scrollProgress}%` }}></div>

      {/* FIXED TOP NAVBAR */}
      <header className={`fixed top-0 left-0 w-full z-[999] bg-[#020202]/90 backdrop-blur-md border-b border-zinc-900/50 px-6 md:px-12 py-4 flex items-center justify-between transition-transform duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <a href="#" className={`${anton.className} text-xl tracking-wider text-white uppercase flex items-center gap-2`}>
          <span className="w-2.5 h-2.5 rounded-full bg-[#8A0303]"></span>
          THE ARCHITECT
        </a>
        <nav className="hidden md:flex items-center gap-10">
          <ScrambleLink href="#protocol" text="PROTOCOL" className={`${spaceMono.className} text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors`} />
          <ScrambleLink href="#results" text="RESULTS" className={`${spaceMono.className} text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors`} />
          <ScrambleLink href="#faq" text="FAQ" className={`${spaceMono.className} text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors`} />
        </nav>
        <MagneticBtn>
          <a href="#portal-login" className={`${spaceMono.className} text-xs font-bold uppercase tracking-widest bg-[#8A0303] hover:bg-[#a80404] text-white px-5 py-2.5 transition-all shadow-[0_0_20px_rgba(138,3,3,0.4)] block`}>
            LOG IN
          </a>
        </MagneticBtn>
      </header>

      {/* DYNAMIC MAIN CONTENT WRAPPER */}
      <div 
        className={`transition-all duration-1000 delay-300 ease-out origin-top ${
          isSiteLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        {/* 2. Full-Screen Image Background (Layer 1) */}
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale opacity-40 z-0"
          style={{ backgroundImage: 'url("/hero-bg.jpg")' }}
        ></div>

        {/* 3. Dark Overlay (Layer 2) */}
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

        {/* 5. Main Content (Layer 4) */}
        <div className="relative z-30 flex flex-col items-center text-center px-4 w-full">
          <Reveal>
            <h2 className={`text-[#8A0303] uppercase tracking-[0.4em] text-xs md:text-sm font-bold mb-6 ${spaceMono.className}`}>
              FORGET MOTIVATION. BUILD DISCIPLINE.
            </h2>
          </Reveal>
          
          <Reveal delay={200} className="flex flex-col items-center justify-center -space-y-4 md:-space-y-12">
            <span className={`text-7xl md:text-[9rem] text-white uppercase tracking-tighter leading-none z-20 relative ${anton.className}`}>
              BUILD
            </span>
            <span className={`text-8xl md:text-[12rem] text-zinc-600 uppercase tracking-tighter leading-[0.8] z-10 relative ${anton.className}`}>
              THE MONSTER
            </span>
          </Reveal>

          <Reveal delay={400}>
            <p className={`text-zinc-400 mt-6 mb-10 max-w-2xl mx-auto text-xs md:text-sm uppercase tracking-[0.2em] px-4 leading-relaxed ${spaceMono.className}`}>
              CUSTOM PROTOCOLS. IRONCLAD ACCOUNTABILITY. RAW RESULTS. THE ASSET AGENCY PROTOCOL IS NOT FOR THE WEAK.
            </p>
          </Reveal>

          <Reveal delay={600}>
            <MagneticBtn>
              <button onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className={`bg-white text-black text-2xl md:text-3xl uppercase px-10 py-5 hover:bg-[#8A0303] hover:text-white transition-colors duration-300 cursor-none block w-full h-full ${anton.className}`}>
                ENTER THE TRENCHES
              </button>
            </MagneticBtn>
          </Reveal>
        </div>

        {/* 6. Tactical Overlays (Layer 5) */}
        <div className={`absolute top-6 left-6 text-zinc-500 text-xs z-30 ${spaceMono.className}`}>
          REC &bull; 00:00:00
        </div>
        <div className={`absolute bottom-6 right-6 text-zinc-500 text-xs z-30 ${spaceMono.className}`}>
          VOL. 01 [SYS_READY]
        </div>

        {/* TACTICAL SCROLL INDICATOR */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center opacity-60 animate-bounce pointer-events-none">
          <span className={`${spaceMono.className} text-[10px] text-zinc-400 tracking-[0.3em] uppercase mb-2`}>Descend</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-zinc-400 to-transparent"></div>
        </div>

        {/* SLANTED TACTICAL MARQUEE */}
        <div className="absolute bottom-10 left-0 w-full z-40 flex items-center overflow-hidden -rotate-2 scale-110 bg-[#8A0303] py-3 border-y-4 border-black shadow-2xl pointer-events-none">
          <RedVelocityMarquee>
            {/* We repeat the block 12 times to guarantee a seamless infinite loop on any screen size */}
            {[...Array(12)].map((_, i) => (
              <span key={i} className={`${anton.className} text-black text-2xl md:text-3xl uppercase tracking-widest mx-4 flex-shrink-0`}>
                NO EXCUSES ✦ BRUTAL EXECUTION ✦ ZERO BS ✦ HEAVY IRON ✦ RAW STRENGTH ✦ DISCIPLINE ✦ 
              </span>
            ))}
          </RedVelocityMarquee>
        </div>
      </section>

      {/* MEET THE COACH SECTION */}
      <section className="relative w-full min-h-screen flex items-center justify-center py-32 px-6 overflow-hidden z-30">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#8A0303] blur-[150px] opacity-[0.03] pointer-events-none rounded-full"></div>

        {/* Background Giant Number */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -rotate-90 pointer-events-none opacity-20">
          <span className={`${anton.className} text-[15vw] text-zinc-900 leading-none`}>01</span>
        </div>

        <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Coach Image Container */}
          <Reveal>
            <div className="relative group w-full max-w-md mx-auto lg:mx-0">
              {/* Tactical Offset Border */}
              <div className="absolute -inset-4 border-2 border-zinc-800 translate-x-4 translate-y-4 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"></div>
              
              {/* Image Wrapper */}
              <div className="relative w-full aspect-[4/5] bg-zinc-900 overflow-hidden grayscale contrast-125 border border-zinc-800">
                {/* Tactical Corner */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#8A0303] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                {/* Subtle Scanline Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-10 pointer-events-none"></div>
                <img src="/coach.jpg" alt="The Architect" className="w-full h-full object-cover mix-blend-luminosity opacity-90 transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0 glitch-target" />
              </div>
              
              {/* Tactical Label */}
              <div className="absolute top-6 -left-6 bg-[#8A0303] text-black font-mono text-xs py-1 px-4 -rotate-90 origin-bottom-left tracking-widest font-bold">
                THE ARCHITECT
              </div>
            </div>
          </Reveal>

          {/* Right: Coach Bio & Stats */}
          <div className="flex flex-col items-start text-left">
            <Reveal delay={200}>
              <span className={`${spaceMono.className} text-[#8A0303] uppercase tracking-[0.3em] text-xs font-bold flex items-center gap-3 mb-8`}>
                <span className="w-2 h-2 rounded-full bg-[#8A0303] animate-pulse"></span>
                <TypewriterReveal text="// OPERATIVE PROFILE" />
              </span>
            </Reveal>
            
            <Reveal delay={300} className="relative flex flex-col mb-10">
              <h2 className={`${anton.className} text-5xl md:text-7xl text-white uppercase tracking-tighter leading-none z-20`}>
                I DON'T SELL
              </h2>
              <h2 className={`${anton.className} text-6xl md:text-8xl text-zinc-700 uppercase tracking-tighter leading-[0.75] -mt-2 md:-mt-4 z-10 relative`}>
                MOTIVATION.
              </h2>
              {/* Small Accent Line */}
              <div className="w-12 h-1 bg-[#8A0303] absolute -bottom-6 left-1"></div>
            </Reveal>
            
            <Reveal delay={400}>
              <p className={`${spaceMono.className} text-zinc-400 text-sm md:text-base uppercase tracking-widest leading-relaxed mb-12`}>
                Motivation is a fleeting emotion for the weak. I build systems, enforce brutal discipline, and forge iron. When you join this protocol, you aren't hiring a cheerleader. You are enlisting a dictator for your physical potential. Do the work, or don't even apply.
              </p>
            </Reveal>
            
            {/* Enhanced Stats Grid */}
            <Reveal delay={500} className="flex flex-col md:flex-row gap-6 w-full mt-4">
              {/* Stat Card 1 */}
              <div className="relative flex-1 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-6 overflow-hidden group hover:border-[#8A0303] transition-all duration-300">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#8A0303]"></div>
                <span className={`${anton.className} text-5xl text-white mb-1 block group-hover:scale-105 transition-transform duration-300 origin-left`}><Counter target={10} />+</span>
                <span className={`${spaceMono.className} text-xs text-[#8A0303] uppercase tracking-widest font-bold`}>/// Years in Trenches</span>
              </div>
              
              {/* Stat Card 2 */}
              <div className="relative flex-1 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-6 overflow-hidden group hover:border-[#8A0303] transition-all duration-300">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#8A0303]"></div>
                <span className={`${anton.className} text-5xl text-white mb-1 block group-hover:scale-105 transition-transform duration-300 origin-left`}><Counter target={500} />+</span>
                <span className={`${spaceMono.className} text-xs text-[#8A0303] uppercase tracking-widest font-bold`}>/// Lives Forged</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* THE PROTOCOL SECTION */}
      <section id="protocol" className="relative w-full flex flex-col items-center justify-center py-32 px-6 z-30 overflow-hidden">
        
        {/* Intensified Ambient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-[#8A0303] opacity-[0.15] blur-[200px] pointer-events-none rounded-full mix-blend-screen"></div>

        <div className="relative z-10 max-w-7xl w-full flex flex-col items-start">
          
          {/* Section Header */}
          <Reveal className="flex flex-col items-start mb-20 relative">
            <span className={`${spaceMono.className} text-[#8A0303] uppercase tracking-[0.3em] text-xs font-bold flex items-center gap-3 mb-4`}>
              <span className="w-2 h-2 rounded-full bg-[#8A0303] animate-pulse"></span>
              <TypewriterReveal text="// SYSTEM BLUEPRINT" />
            </span>
            <div className="relative flex flex-col">
              <h2 className={`${anton.className} text-5xl md:text-7xl uppercase text-white tracking-tighter leading-none z-20`}>
                THE
              </h2>
              <h2 className={`${anton.className} text-6xl md:text-8xl uppercase text-zinc-800 tracking-tighter leading-[0.75] -mt-2 md:-mt-4 z-10 relative`}>
                PROTOCOL.
              </h2>
            </div>
          </Reveal>

          {/* 3-Step Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            
            {/* Step 01 */}
            <Reveal delay={200}>
              <TiltWrapper onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="relative h-full bg-[#050505]/90 backdrop-blur-sm border border-zinc-900/50 p-8 flex flex-col justify-between group hover:border-[#8A0303] hover:-translate-y-3 transition-all duration-500 hover:shadow-[0_0_40px_rgba(138,3,3,0.3)] cursor-none">
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-zinc-800 group-hover:border-[#8A0303] transition-colors"></div>
                <div>
                  <span className={`${anton.className} text-6xl text-zinc-800 group-hover:text-[#8A0303] transition-colors duration-300 block mb-6`}>01</span>
                  <h3 className={`${anton.className} text-2xl uppercase text-white tracking-wide mb-4`}>BIOMETRIC AUDIT</h3>
                  <p className={`${spaceMono.className} text-zinc-400 text-xs uppercase tracking-wider leading-relaxed`}>
                    We strip away the guesswork. Complete structural analysis, strength baseline testing, and nutritional calibration to identify your exact bottlenecks.
                  </p>
                </div>
                <div className="mt-8 pt-4 flex items-center justify-between">
                  <span className={`${spaceMono.className} text-[10px] text-zinc-600 uppercase tracking-widest`}>PHASE_ONE</span>
                  <span className={`${spaceMono.className} text-xs text-[#8A0303] font-bold`}>[INITIATE]</span>
                </div>
              </TiltWrapper>
            </Reveal>

            {/* Step 02 */}
            <Reveal delay={400}>
              <TiltWrapper onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="relative h-full bg-[#050505]/90 backdrop-blur-sm border border-zinc-900/50 p-8 flex flex-col justify-between group hover:border-[#8A0303] hover:-translate-y-3 transition-all duration-500 hover:shadow-[0_0_40px_rgba(138,3,3,0.3)] cursor-none">
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-zinc-800 group-hover:border-[#8A0303] transition-colors"></div>
                <div>
                  <span className={`${anton.className} text-6xl text-zinc-800 group-hover:text-[#8A0303] transition-colors duration-300 block mb-6`}>02</span>
                  <h3 className={`${anton.className} text-2xl uppercase text-white tracking-wide mb-4`}>CUSTOM EXECUTION</h3>
                  <p className={`${spaceMono.className} text-zinc-400 text-xs uppercase tracking-wider leading-relaxed`}>
                    No generic templates. Your hyper-focused hypertrophy protocol, progressive overload blueprint, and exact caloric targets are engineered from scratch.
                  </p>
                </div>
                <div className="mt-8 pt-4 flex items-center justify-between">
                  <span className={`${spaceMono.className} text-[10px] text-zinc-600 uppercase tracking-widest`}>PHASE_TWO</span>
                  <span className={`${spaceMono.className} text-xs text-[#8A0303] font-bold`}>[DEPLOY]</span>
                </div>
              </TiltWrapper>
            </Reveal>

            {/* Step 03 */}
            <Reveal delay={600}>
              <TiltWrapper onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="relative h-full bg-[#050505]/90 backdrop-blur-sm border border-zinc-900/50 p-8 flex flex-col justify-between group hover:border-[#8A0303] hover:-translate-y-3 transition-all duration-500 hover:shadow-[0_0_40px_rgba(138,3,3,0.3)] cursor-none">
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-zinc-800 group-hover:border-[#8A0303] transition-colors"></div>
                <div>
                  <span className={`${anton.className} text-6xl text-zinc-800 group-hover:text-[#8A0303] transition-colors duration-300 block mb-6`}>03</span>
                  <h3 className={`${anton.className} text-2xl uppercase text-white tracking-wide mb-4`}>IRONCLAD ACCOUNTABILITY</h3>
                  <p className={`${spaceMono.className} text-zinc-400 text-xs uppercase tracking-wider leading-relaxed`}>
                    Daily check-ins, form audits, and strict metric tracking. You execute the parameters; I enforce the discipline. Zero excuses tolerated.
                  </p>
                </div>
                <div className="mt-8 pt-4 flex items-center justify-between">
                  <span className={`${spaceMono.className} text-[10px] text-zinc-600 uppercase tracking-widest`}>PHASE_THREE</span>
                  <span className={`${spaceMono.className} text-xs text-[#8A0303] font-bold`}>[DOMINATE]</span>
                </div>
              </TiltWrapper>
            </Reveal>

          </div>
        </div>
      </section>

      {/* INFINITE TRANSFORMATIONS MARQUEE SECTION */}
      <section id="results" className="relative w-full flex flex-col py-32 z-30 overflow-hidden">
        
        {/* 1. Tactical Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>
        
        {/* 2. Film Grain / Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none"></div>

        {/* 3. Balanced Ambient Glows (Top, Middle, Bottom) */}
        {/* Top Right Glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-[#8A0303] opacity-[0.12] blur-[200px] pointer-events-none rounded-full mix-blend-screen translate-x-1/4"></div>
        {/* Bottom Left Glow */}
        <div className="absolute bottom-0 left-0 w-[800px] h-[600px] bg-[#8A0303] opacity-[0.12] blur-[200px] pointer-events-none rounded-full mix-blend-screen -translate-x-1/4"></div>

        {/* 4. Brutalist UI Accents */}
        <div className="absolute top-12 left-6 md:left-12 hidden md:flex flex-col gap-2 opacity-30 pointer-events-none z-0">
           <span className={`${spaceMono.className} text-[#8A0303] text-[10px] tracking-[0.3em]`}>SYS.ACTIVE // 02</span>
           <div className="w-16 h-px bg-[#8A0303]"></div>
        </div>
        <div className="absolute top-32 right-6 md:right-12 hidden md:flex flex-col items-end gap-2 opacity-30 pointer-events-none z-0">
           <div className="w-px h-16 bg-[#8A0303]"></div>
           <span className={`${spaceMono.className} text-[#8A0303] text-[10px] tracking-[0.3em] [writing-mode:vertical-rl]`}>VOL.02</span>
        </div>

        <div className="relative z-10 w-full flex flex-col">
          
          {/* Section Header */}
          <Reveal className="px-6 md:px-12 mb-16 flex flex-col items-center text-center max-w-7xl mx-auto w-full">
            <span className={`${spaceMono.className} text-[#8A0303] uppercase tracking-[0.3em] text-xs font-bold flex items-center gap-3 mb-4`}>
              <span className="w-2 h-2 rounded-full bg-[#8A0303] animate-pulse"></span>
              <TypewriterReveal text="// THE ASSET AGENCY FILES" />
            </span>
            <h2 className={`${anton.className} text-5xl md:text-7xl uppercase text-white tracking-tighter leading-none`}>
              CLIENT <span className="text-zinc-600">TRANSFORMATIONS.</span>
            </h2>
          </Reveal>

          {/* Marquee Row 1 (Moving Left) */}
          <div className="w-full overflow-hidden mb-8">
            <div className="animate-marquee-left flex">
              {/* Row 1 Data: Cases 1 and 2, repeated to ensure infinite scrolling */}
              {[...Array(4)].flatMap((_, iteration) => 
                [
                  { id: `r1-c1-${iteration}`, name: "THE SHRED", time: "16 WEEKS", result: "-14% BODY FAT", before: "/before1.jpg", after: "/after1.jpg" },
                  { id: `r1-c2-${iteration}`, name: "HEAVY BULK", time: "24 WEEKS", result: "+15KG MASS", before: "/before2.jpg", after: "/after2.jpg" }
                ].map((item) => (
                  <div key={item.id} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="w-[85vw] md:w-[45vw] lg:w-[35vw] flex-shrink-0 flex flex-col border-r border-zinc-900 group cursor-none">
                    <div className="flex flex-row w-full h-[300px] md:h-[400px]">
                      {/* Before Side */}
                      <div className="relative w-1/2 h-full border-r border-zinc-900 overflow-hidden">
                        <div className="absolute top-4 left-4 z-10 bg-black/80 px-2 py-1 border border-zinc-800">
                          <span className={`${spaceMono.className} text-zinc-500 text-[10px] uppercase tracking-widest`}>BEFORE</span>
                        </div>
                        <img src={item.before} alt="Before" className="w-full h-full object-cover grayscale opacity-70 glitch-target" />
                      </div>
                      {/* After Side */}
                      <div className="relative w-1/2 h-full overflow-hidden bg-zinc-950">
                        <div className="absolute top-4 right-4 z-10 bg-[#8A0303] px-2 py-1 shadow-[0_0_10px_rgba(138,3,3,0.5)]">
                          <span className={`${spaceMono.className} text-white text-[10px] uppercase tracking-widest font-bold`}>AFTER</span>
                        </div>
                        <img src={item.after} alt="After" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 glitch-target" />
                      </div>
                    </div>
                    {/* Data Bar */}
                    <div className="p-4 md:p-6 flex justify-between items-end bg-[#050505]">
                      <div>
                        <span className={`${spaceMono.className} text-[#8A0303] text-[10px] uppercase tracking-widest block mb-1`}>// PROTOCOL</span>
                        <h3 className={`${anton.className} text-2xl md:text-3xl text-white uppercase tracking-wide leading-none`}>{item.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className={`${spaceMono.className} text-zinc-500 text-[10px] uppercase tracking-widest block mb-1`}>{item.time}</span>
                        <span className={`${anton.className} text-xl md:text-2xl text-[#8A0303] uppercase leading-none`}>{item.result}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Marquee Row 2 (Moving Right) */}
          <div className="w-full overflow-hidden">
            <div className="animate-marquee-right flex">
              {/* Row 2 Data: Cases 3 and 4, repeated */}
              {[...Array(4)].flatMap((_, iteration) => 
                [
                  { id: `r2-c3-${iteration}`, name: "THE RECOMP", time: "12 WEEKS", result: "V-TAPER FORGED", before: "/before3.jpg", after: "/after3.jpg" },
                  { id: `r2-c4-${iteration}`, name: "SILVERBACK", time: "20 WEEKS", result: "RAW POWER", before: "/before4.jpg", after: "/after4.jpg" }
                ].map((item) => (
                  <div key={item.id} className="w-[85vw] md:w-[45vw] lg:w-[35vw] flex-shrink-0 flex flex-col border-r border-zinc-900 group">
                    <div className="flex flex-row w-full h-[300px] md:h-[400px]">
                      {/* Before Side */}
                      <div className="relative w-1/2 h-full border-r border-zinc-900 overflow-hidden">
                        <div className="absolute top-4 left-4 z-10 bg-black/80 px-2 py-1 border border-zinc-800">
                          <span className={`${spaceMono.className} text-zinc-500 text-[10px] uppercase tracking-widest`}>BEFORE</span>
                        </div>
                        <img src={item.before} alt="Before" className="w-full h-full object-cover grayscale opacity-70 glitch-target" />
                      </div>
                      {/* After Side */}
                      <div className="relative w-1/2 h-full overflow-hidden bg-zinc-950">
                        <div className="absolute top-4 right-4 z-10 bg-[#8A0303] px-2 py-1 shadow-[0_0_10px_rgba(138,3,3,0.5)]">
                          <span className={`${spaceMono.className} text-white text-[10px] uppercase tracking-widest font-bold`}>AFTER</span>
                        </div>
                        <img src={item.after} alt="After" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 glitch-target" />
                      </div>
                    </div>
                    {/* Data Bar */}
                    <div className="p-4 md:p-6 flex justify-between items-end bg-[#050505]">
                      <div>
                        <span className={`${spaceMono.className} text-[#8A0303] text-[10px] uppercase tracking-widest block mb-1`}>// PROTOCOL</span>
                        <h3 className={`${anton.className} text-2xl md:text-3xl text-white uppercase tracking-wide leading-none`}>{item.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className={`${spaceMono.className} text-zinc-500 text-[10px] uppercase tracking-widest block mb-1`}>{item.time}</span>
                        <span className={`${anton.className} text-xl md:text-2xl text-[#8A0303] uppercase leading-none`}>{item.result}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </section>

      {/* FAQ & FINAL CTA & FOOTER SECTION */}
      <section id="faq" className="relative w-full flex flex-col items-center justify-center pt-32 px-6 z-30 overflow-hidden">
        
        {/* Background Glow & Noise */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-[#8A0303] opacity-[0.12] blur-[200px] pointer-events-none rounded-full mix-blend-screen"></div>

        <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">
          
          {/* Section Header - Fixed Overlap */}
          <Reveal className="flex flex-col items-center text-center mb-20">
            <span className={`${spaceMono.className} text-[#8A0303] uppercase tracking-[0.3em] text-xs font-bold flex items-center gap-3 mb-4`}>
              <span className="w-2 h-2 rounded-full bg-[#8A0303] animate-pulse"></span>
              <TypewriterReveal text="// CRITICAL INTEL" />
            </span>
            <div className="flex flex-col items-center">
              <h2 className={`${anton.className} text-4xl md:text-6xl uppercase text-white tracking-tighter leading-none`}>
                FREQUENTLY ASKED
              </h2>
              <h2 className={`${anton.className} text-5xl md:text-7xl uppercase text-zinc-700 tracking-tighter leading-none mt-2`}>
                QUESTIONS.
              </h2>
            </div>
          </Reveal>

          {/* FAQ List */}
          <div className="w-full flex flex-col gap-4 mb-24">
            <Reveal delay={100}>
              <FaqItem 
                number="01" 
                question="WHAT DO I GET WHEN I ENLIST?" 
                answer="A complete biometric structural audit, fully custom hypertrophy and nutritional execution protocols engineered from scratch, and direct accountability checkpoints. No generic PDFs."
                onHoverChange={setIsHovered}
              />
            </Reveal>
            <Reveal delay={200}>
              <FaqItem 
                number="02" 
                question="IS THIS SUITABLE FOR BEGINNERS?" 
                answer="It is suitable for anyone willing to obey strict parameters. Whether you are an unconditioned slate or an advanced lifter stalled at a plateau, the protocol scales to your exact structural bottleneck."
                onHoverChange={setIsHovered}
              />
            </Reveal>
            <Reveal delay={300}>
              <FaqItem 
                number="03" 
                question="WHAT IS THE LEVEL OF COMMITMENT REQUIRED?" 
                answer="Absolute compliance. Daily metric tracking, strict dietary execution, and zero tolerance for excuses. If you want a cheerleader, look elsewhere."
                onHoverChange={setIsHovered}
              />
            </Reveal>
          </div>

          {/* FINAL CTA BOX */}
          <Reveal className="w-full">
            <div id="cta" className="relative w-full border-2 border-[#8A0303] p-8 md:p-16 flex flex-col items-center text-center overflow-hidden group shadow-[0_0_50px_rgba(138,3,3,0.2)] mb-32">
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#8A0303]/20 via-transparent to-transparent pointer-events-none"></div>

              <span className={`${spaceMono.className} text-[#8A0303] uppercase tracking-[0.3em] text-xs font-bold mb-4`}>
                <TypewriterReveal text="// ENLISTMENT IS OPEN" />
              </span>
              <h3 className={`${anton.className} text-4xl md:text-6xl text-white uppercase tracking-tighter mb-6`}>
                READY TO FORGE <br/>YOUR <span className="text-[#8A0303]">POTENTIAL?</span>
              </h3>
              <p className={`${spaceMono.className} text-zinc-400 text-xs md:text-sm uppercase tracking-wider max-w-xl mb-10`}>
                Slots are strictly limited to maintain absolute oversight and brutal execution parameters.
              </p>

              <MagneticBtn>
                <div className="w-full h-full" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                  <HoldToExecuteBtn />
                </div>
              </MagneticBtn>
            </div>
          </Reveal>

        </div>

        {/* FOOTER */}
        <footer className="w-full py-12 px-6 flex flex-col items-center justify-center z-20">
          <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            
            {/* Brand / Coach Name */}
            <div>
              <h4 className={`${anton.className} text-2xl text-white uppercase tracking-wider`}>THE ARCHITECT</h4>
              <p className={`${spaceMono.className} text-zinc-500 text-[10px] uppercase tracking-widest mt-1`}>
                BRUTAL DISCIPLINE // ELITE HYPERTROPHY PROTOCOLS.
              </p>
            </div>

            {/* Social Media Links / Icons */}
            <div className="flex items-center gap-6">
              <a onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} href="#instagram" aria-label="Instagram" className="w-10 h-10 border border-zinc-800 bg-[#050505] flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#8A0303] hover:bg-[#8A0303]/10 transition-all duration-300 cursor-none">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} href="#tiktok" aria-label="TikTok" className="w-10 h-10 border border-zinc-800 bg-[#050505] flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#8A0303] hover:bg-[#8A0303]/10 transition-all duration-300 cursor-none">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </a>
              <a onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} href="#youtube" aria-label="YouTube" className="w-10 h-10 border border-zinc-800 bg-[#050505] flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#8A0303] hover:bg-[#8A0303]/10 transition-all duration-300 cursor-none">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} href="#facebook" aria-label="Facebook" className="w-10 h-10 border border-zinc-800 bg-[#050505] flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#8A0303] hover:bg-[#8A0303]/10 transition-all duration-300 cursor-none">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.37 14.5 5 15.5 5H18V0h-3.808C10.59 0 9 1.581 9 4.615V8z"/></svg>
              </a>
            </div>

            {/* Copyright / Protocol */}
            <div className="flex flex-col md:items-end gap-1">
              <span className={`${spaceMono.className} text-zinc-500 text-[10px] uppercase tracking-widest`}>
                <TypewriterReveal text="// SECURE PROTOCOL" />
              </span>
              <span className={`${spaceMono.className} text-zinc-600 text-[10px] uppercase tracking-widest`}>
                © {new Date().getFullYear()} THE ARCHITECT. ALL RIGHTS RESERVED.
              </span>
            </div>

          </div>
        </footer>

      </section>
      </div>
    </main>
  );
}
