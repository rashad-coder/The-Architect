'use client';

export default function AgencyHero() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#0A0A0A]">
      {/* Background Animation / Grid */}
      <div className="absolute inset-0 w-full h-full hidden lg:block dither-pattern opacity-20 pointer-events-none"></div>

      {/* Mobile stars background */}
      <div className="absolute inset-0 w-full h-full lg:hidden stars-bg pointer-events-none"></div>

      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 z-20 border-b border-[#B87333]/20">
        <div className="container mx-auto px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="font-mono text-[#B87333] text-xl lg:text-2xl font-bold tracking-widest italic transform -skew-x-12">
              THE ASSET AGENCY
            </div>
            <div className="h-3 lg:h-4 w-px bg-[#B87333]/40"></div>
            <span className="text-[#B87333]/60 text-[8px] lg:text-[10px] font-mono">SYS.DEPLOYED</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono text-[#B87333]/60">
            <span>LAT: 37.7749°</span>
            <div className="w-1 h-1 bg-[#B87333]/40 rounded-full"></div>
            <span>LONG: 122.4194°</span>
          </div>
        </div>
      </div>

      {/* Corner Frame Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-l-2 border-[#B87333]/40 z-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-r-2 border-[#B87333]/40 z-20 pointer-events-none"></div>
      <div className="absolute left-0 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-l-2 border-[#B87333]/40 z-20 bottom-0 pointer-events-none"></div>
      <div className="absolute right-0 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-r-2 border-[#B87333]/40 z-20 bottom-0 pointer-events-none"></div>

      {/* Main Layout Container */}
      <div className="relative z-10 flex flex-col lg:flex-row h-full w-full pt-16 lg:pt-0">
        
        {/* Left Side: 3D Core Canvas Container */}
        <div id="core-canvas-container" className="w-full lg:w-1/2 h-full flex items-center justify-center relative">
          {/* 3D Model will be injected here */}
        </div>

        {/* Right Side: Text & CTA */}
        <div className="w-full lg:w-1/2 flex items-center px-6 lg:px-16 lg:pr-[10%]">
          <div className="max-w-lg relative w-full lg:ml-auto">
            {/* Top decorative line */}
            <div className="flex items-center gap-2 mb-3 opacity-60">
              <div className="w-8 h-px bg-[#B87333]"></div>
              <span className="text-[#B87333] text-[10px] font-mono tracking-wider">∞</span>
              <div className="flex-1 h-px bg-[#B87333]"></div>
            </div>

            {/* Title with dithered accent */}
            <div className="relative">
              <div className="hidden lg:block absolute -right-3 top-0 bottom-0 w-1 dither-pattern opacity-40"></div>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-[#F5F5F5] mb-3 lg:mb-4 leading-tight font-mono tracking-wider" style={{ letterSpacing: '0.1em' }}>
                APEX<br/>INFRASTRUCTURE.
              </h1>
            </div>

            {/* Decorative dots pattern - desktop only */}
            <div className="hidden lg:flex gap-1 mb-3 opacity-40">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-0.5 h-0.5 bg-[#B87333] rounded-full"></div>
              ))}
            </div>

            {/* Description with subtle grid pattern */}
            <div className="relative">
              <p className="text-xs lg:text-base text-gray-300 mb-5 lg:mb-6 leading-relaxed font-mono opacity-80">
                We engineer high-ticket conversion systems and automated portals. Our infrastructure operates with algorithmic precision, turning operational chaos into scalable dominance.
              </p>
              
              {/* Technical corner accent - desktop only */}
              <div className="hidden lg:block absolute -left-4 top-1/2 w-3 h-3 border border-[#B87333] opacity-30" style={{ transform: 'translateY(-50%)' }}>
                <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-[#B87333]" style={{ transform: 'translate(-50%, -50%)' }}></div>
              </div>
            </div>

            {/* Buttons with technical accents */}
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
              <button className="relative px-5 lg:px-6 py-2 lg:py-2.5 bg-transparent text-[#B87333] font-mono text-xs lg:text-sm font-bold tracking-widest border border-[#B87333] hover:bg-[#B87333] hover:text-[#0A0A0A] transition-all duration-300 group">
                <span className="hidden lg:block absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#B87333] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="hidden lg:block absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-[#B87333] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                INITIATE_BUILD
              </button>
              
              <button className="relative px-5 lg:px-6 py-2 lg:py-2.5 bg-transparent border border-[#F5F5F5]/20 text-[#F5F5F5] font-mono text-xs lg:text-sm font-bold tracking-widest hover:border-[#F5F5F5] transition-all duration-300">
                VIEW_SYSTEMS
              </button>
            </div>

            {/* Bottom technical notation - desktop only */}
            <div className="hidden lg:flex items-center gap-2 mt-6 opacity-40">
              <span className="text-[#B87333] text-[9px] font-mono">∞</span>
              <div className="flex-1 h-px bg-[#B87333]"></div>
              <span className="text-[#B87333] text-[9px] font-mono">SISYPHUS.PROTOCOL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="absolute left-0 right-0 z-20 border-t border-[#B87333]/20 bg-[#0A0A0A]/40 backdrop-blur-sm bottom-0">
        <div className="container mx-auto px-4 lg:px-8 py-2 lg:py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-6 text-[8px] lg:text-[9px] font-mono text-[#B87333]/50">
            <span className="hidden lg:inline">SYSTEM.ACTIVE</span>
            <span className="lg:hidden">SYS.ACT</span>
            <div className="hidden lg:flex gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-1 h-3 bg-[#8A2BE2]/50 animate-pulse" style={{ height: `${Math.random() * 12 + 4}px`, animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
            <span>V1.0.0</span>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4 text-[8px] lg:text-[9px] font-mono text-[#B87333]/50">
            <span className="hidden lg:inline">◐ RENDERING</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-[#8A2BE2] rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-[#8A2BE2]/70 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 bg-[#8A2BE2]/40 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="hidden lg:inline">FRAME: ∞</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dither-pattern {
          background-image: 
            repeating-linear-gradient(0deg, transparent 0px, transparent 1px, #B87333 1px, #B87333 2px),
            repeating-linear-gradient(90deg, transparent 0px, transparent 1px, #B87333 1px, #B87333 2px);
          background-size: 3px 3px;
        }
        
        .stars-bg {
          background-image: 
            radial-gradient(1px 1px at 20% 30%, #B87333, transparent),
            radial-gradient(1px 1px at 60% 70%, #B87333, transparent),
            radial-gradient(1px 1px at 50% 50%, #B87333, transparent),
            radial-gradient(1px 1px at 80% 10%, #B87333, transparent),
            radial-gradient(1px 1px at 90% 60%, #B87333, transparent),
            radial-gradient(1px 1px at 33% 80%, #B87333, transparent),
            radial-gradient(1px 1px at 15% 60%, #B87333, transparent),
            radial-gradient(1px 1px at 70% 40%, #B87333, transparent);
          background-size: 200% 200%, 180% 180%, 250% 250%, 220% 220%, 190% 190%, 240% 240%, 210% 210%, 230% 230%;
          background-position: 0% 0%, 40% 40%, 60% 60%, 20% 20%, 80% 80%, 30% 30%, 70% 70%, 50% 50%;
          opacity: 0.3;
        }
      `}</style>
    </main>
  );
}
