import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, ShoppingCart, Box, ScanLine, Smartphone, 
  Layers, Check, ChevronRight, Settings, User, 
  Maximize, Heart, X as XIcon, RotateCw, Activity
} from 'lucide-react';

const CustomStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    .preserve-3d { transform-style: preserve-3d; }
    .perspective-1200 { perspective: 1200px; }
    .backface-hidden { backface-visibility: hidden; }
    
    @keyframes scanline {
      0% { top: 0%; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }
    .animate-scanline {
      animation: scanline 3s linear infinite;
    }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 15px rgba(52, 211, 153, 0.2); }
      50% { box-shadow: 0 0 30px rgba(52, 211, 153, 0.5); }
    }
    .animate-pulse-glow {
      animation: pulse-glow 2s ease-in-out infinite;
    }

    .glass-panel {
      background: rgba(20, 20, 20, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .gradient-text {
      background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  `}} />
);

const Logo = ({ className = "" }) => (
  <div className={`flex items-center font-bold tracking-tighter ${className}`}>
    <span className="text-gray-300 text-3xl mr-1">CD</span>
    <span className="text-gray-500 text-3xl font-light">[</span>
    <span className="gradient-text text-3xl">1</span>
    <span className="text-gray-500 text-3xl font-light">]</span>
  </div>
);

const AppIcon = ({ size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-xl",
    lg: "w-24 h-24 text-5xl", // Upsized lg for the new cart layout
    xl: "w-32 h-32 text-6xl"
  };
  return (
    <div className={`${sizes[size]} rounded-2xl bg-gradient-to-b from-neutral-800 to-neutral-900 border border-neutral-700 shadow-xl flex items-center justify-center font-bold relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-emerald-500/10 mix-blend-overlay"></div>
      <span className="text-gray-500 font-light">[</span>
      <span className="gradient-text z-10">1</span>
      <span className="text-gray-500 font-light">]</span>
    </div>
  );
};

// UI Components built specifically for the new mock-up layout
const RangeSlider = ({ label, value, setter, min, max, step, unit }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-medium text-neutral-200">{label}</label>
        <div className="flex items-center bg-[#222] border border-neutral-700 rounded-md px-2 py-1 shadow-inner">
          <input 
            type="number" 
            value={value.toFixed(2)}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if(!isNaN(val)) setter(val);
            }}
            step={step}
            className="w-14 bg-transparent text-right outline-none text-sm text-neutral-300 font-mono"
          />
          <span className="text-neutral-500 text-xs ml-1">{unit}</span>
        </div>
      </div>
      <div className="relative h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden flex items-center">
        {/* Custom filled track */}
        <div 
          className="absolute left-0 h-full bg-gradient-to-r from-emerald-400 to-cyan-500 pointer-events-none" 
          style={{ width: `${percentage}%` }}
        />
        <input 
          type="range" min={min} max={max} step={step} 
          value={value} 
          onChange={(e) => setter(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {/* Custom thumb indicator */}
        <div 
          className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)] pointer-events-none transform -translate-x-1/2"
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const CustomCheckbox = ({ label, sublabel, checked, onChange }) => (
  <label className="flex items-start gap-3 cursor-pointer group py-1">
    <div className={`mt-0.5 w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors flex-shrink-0 ${checked ? 'bg-blue-500 border-blue-500' : 'border-neutral-500 bg-transparent group-hover:border-neutral-400'}`}>
      {checked && <Check size={12} className="text-white" strokeWidth={3} />}
    </div>
    <div>
      <div className={`text-sm font-medium transition-colors ${checked ? 'text-white' : 'text-neutral-300'}`}>{label}</div>
      {sublabel && <div className="text-xs text-neutral-500 mt-0.5 leading-snug">{sublabel}</div>}
    </div>
  </label>
);

const InteractiveDoor3D = ({ width, height, depth = 0.75, style, isRotating = true, addons = {} }) => {
  const [rotation, setRotation] = useState({ x: 10, y: -25 }); // Start with slight 3D tilt affordance to see depth
  const [zoom, setZoom] = useState(1);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  // MDF Color Palette
  const mdfBase = "#d4b58e";
  const mdfShadow = "#b89770";
  const mdfHighlight = "#e6ceb3";
  const mdfEdge = "#c4a37a"; // Slightly darker for thickness edges

  // Handle continuous 360 rotation
  useEffect(() => {
    if (!isRotating) return;
    
    const handleUp = () => { isDragging.current = false; };
    const handleMove = (e) => {
      if (!isDragging.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - lastPos.current.x;
      const deltaY = clientY - lastPos.current.y;
      
      setRotation(prev => ({
        x: prev.x - deltaY * 0.5,
        y: prev.y + deltaX * 0.5
      }));
      
      lastPos.current = { x: clientX, y: clientY };
    };

    window.addEventListener('mouseup', handleUp);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchend', handleUp);
    window.addEventListener('touchmove', handleMove);
    
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchend', handleUp);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [isRotating]);

  // Handle Zoom Scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isRotating) return;
    
    const handleWheel = (e) => {
      e.preventDefault();
      setZoom(z => Math.min(Math.max(0.4, z - e.deltaY * 0.002), 3.5));
    };
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [isRotating]);

  const handleDown = (e) => {
    if (!isRotating) return;
    isDragging.current = true;
    lastPos.current = {
      x: e.touches ? e.touches[0].clientX : e.clientX,
      y: e.touches ? e.touches[0].clientY : e.clientY,
    };
  };

  // Convert real inches to pixel scale for display
  const scale = 12; // 1 inch = 12px visually
  const pxWidth = width * scale;
  const pxHeight = height * scale;
  const pxDepth = depth * scale;
  const frameWidth = 2.5 * scale; // Standard 2.5" frame

  // Hinge Calculation Details
  const holeSize = 1.378 * scale; // 35mm cup hole standard
  const hinges = height >= 42 ? [3.5, height/2, height - 3.5] : [3.5, height - 3.5];

  // Helper to accurately position faces of the 3D CSS Box
  const faceStyle = (w, h, transform, bg) => ({
    position: 'absolute',
    top: '50%', left: '50%',
    width: `${w}px`, height: `${h}px`,
    marginTop: `-${h / 2}px`, marginLeft: `-${w / 2}px`,
    backgroundColor: bg,
    transform,
    backfaceVisibility: 'hidden', // Prevents inside-out rendering
  });

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden touch-none"
      style={{ perspective: '1200px' }} // CRITICAL: Inlined to prevent previewers from stripping it
      onMouseDown={handleDown}
      onTouchStart={handleDown}
    >
      {/* Zoom Controls UI */}
      {isRotating && (
        <div className="absolute top-6 right-6 flex flex-col space-y-2 z-20">
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 3.5))} className="w-10 h-10 bg-neutral-900/80 rounded-lg flex items-center justify-center text-white border border-neutral-700 hover:bg-neutral-800 backdrop-blur shadow-lg">+</button>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.4))} className="w-10 h-10 bg-neutral-900/80 rounded-lg flex items-center justify-center text-white border border-neutral-700 hover:bg-neutral-800 backdrop-blur shadow-lg">-</button>
        </div>
      )}

      <div 
        className={`relative transition-transform ${isDragging.current ? 'duration-0' : 'duration-300'} ease-out cursor-grab active:cursor-grabbing`}
        style={{
          width: 0, height: 0, // Parent has no size, faces orbit the center
          transformStyle: 'preserve-3d', // CRITICAL: Inlined to guarantee 3D rendering
          transform: `scale(${zoom}) rotateX(${isRotating ? rotation.x : 5}deg) rotateY(${isRotating ? rotation.y : 15}deg)`,
        }}
      >
        
        {/* === 3D GRID AND DIMENSION LABELS === */}
        {isRotating && (
          <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
            {/* X-Axis (Width) */}
            <div className="absolute flex flex-col items-center justify-center transition-all duration-300" 
                  style={{ 
                    width: pxWidth, left: '50%', marginLeft: -pxWidth/2, 
                    top: '50%', marginTop: pxHeight/2 + 20, 
                    transform: `translateZ(0px)`
                  }}>
              <div className="w-full h-px border-b-2 border-dashed border-white/50 mb-1 shadow-[0_0_5px_rgba(255,255,255,0.3)]" />
              <span className="text-white font-mono text-xs bg-black/60 px-2 py-1 rounded backdrop-blur border border-white/20 shadow-lg">W: {width.toFixed(2)}"</span>
            </div>
            
            {/* Y-Axis (Height) */}
            <div className="absolute flex flex-row items-center justify-center transition-all duration-300" 
                  style={{ 
                    height: pxHeight, top: '50%', marginTop: -pxHeight/2, 
                    left: '50%', marginLeft: -(pxWidth/2 + 35),
                    transform: `translateZ(0px)`
                  }}>
              <span className="text-white font-mono text-xs bg-black/60 px-2 py-1 rounded backdrop-blur border border-white/20 shadow-lg -rotate-90 whitespace-nowrap">H: {height.toFixed(2)}"</span>
              <div className="w-px h-full border-r-2 border-dashed border-white/50 ml-1 shadow-[0_0_5px_rgba(255,255,255,0.3)]" />
            </div>

            {/* Z-Axis (Depth) */}
            <div className="absolute flex flex-row items-center transition-all duration-300" 
                  style={{ 
                    width: pxDepth, 
                    left: '50%', marginLeft: pxWidth/2 + 5,
                    top: '50%', marginTop: pxHeight/2,
                    transform: `rotateY(90deg) translateZ(0px)`,
                    transformOrigin: 'left center'
                  }}>
              <div className="w-full h-px border-b-2 border-dashed border-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-emerald-400 font-mono text-[10px] bg-black/80 px-1.5 py-0.5 rounded backdrop-blur border border-emerald-900/50 shadow-lg ml-1 whitespace-nowrap">D: {depth.toFixed(2)}"</span>
            </div>
          </div>
        )}

        {}
        {/* FRONT FACE (Shaker Details) */}
        <div style={faceStyle(pxWidth, pxHeight, `translateZ(${pxDepth/2}px)`, mdfBase)} className="shadow-2xl overflow-hidden rounded-[1px]">
          {/* Left Stile */}
          <div className="absolute top-0 bottom-0 left-0" style={{ width: `${frameWidth}px`, backgroundColor: mdfHighlight, borderRight: `1px solid ${mdfShadow}` }} />
          {/* Right Stile */}
          <div className="absolute top-0 bottom-0 right-0" style={{ width: `${frameWidth}px`, backgroundColor: mdfHighlight, borderLeft: `1px solid ${mdfShadow}` }} />
          {/* Top Rail */}
          <div className="absolute top-0 left-0 right-0" style={{ height: `${frameWidth}px`, backgroundColor: mdfBase, borderBottom: `1px solid ${mdfShadow}` }} />
          {/* Bottom Rail */}
          <div className="absolute bottom-0 left-0 right-0" style={{ height: `${frameWidth}px`, backgroundColor: mdfBase, borderTop: `1px solid ${mdfHighlight}` }} />
          
          {/* Center Panel */}
          <div className="absolute" style={{ top: `${frameWidth}px`, bottom: `${frameWidth}px`, left: `${frameWidth}px`, right: `${frameWidth}px`, backgroundColor: mdfShadow, boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2)' }}>
            {/* Raised Panel Logic */}
            {style === 'raised' && (
              <div 
                className="absolute inset-2"
                style={{
                  backgroundColor: mdfBase,
                  borderTop: `10px solid ${mdfHighlight}`, borderLeft: `10px solid ${mdfHighlight}`,
                  borderBottom: `10px solid ${mdfShadow}`, borderRight: `10px solid ${mdfShadow}`,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                }}
              />
            )}
          </div>
        </div>

        {}
        {/* BACK FACE WITH DYNAMIC BORING/HINGES */}
        <div style={faceStyle(pxWidth, pxHeight, `rotateY(180deg) translateZ(${pxDepth/2}px)`, mdfBase)} className="rounded-[1px]">
          <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2)' }} />
          
          {/* Render Hinge Holes & Hardware if selected */}
          {(addons.boring || addons.softClose) && hinges.map((hCenter, idx) => (
             <div key={idx} className="absolute rounded-full transition-all duration-300" style={{
                width: holeSize, height: holeSize,
                left: 0.88 * scale - holeSize/2, // 7/8" standard setback
                top: hCenter * scale - holeSize/2,
                backgroundColor: addons.boring ? '#161616' : 'transparent',
                boxShadow: addons.boring ? 'inset 0 4px 8px rgba(0,0,0,0.8), inset 0 1px 3px rgba(0,0,0,0.6)' : 'none',
                border: addons.boring ? '1px solid rgba(255,255,255,0.03)' : 'none'
             }}>
                {/* Blum Soft-Close Hinge Simulation */}
                {addons.softClose && (
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in duration-300">
                      {/* Metal Cup */}
                      <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-br from-neutral-300 to-neutral-600 shadow-[inset_0_-2px_6px_rgba(0,0,0,0.6),_0_2px_4px_rgba(0,0,0,0.5)] border border-neutral-400 flex items-center justify-center">
                         <div className="w-[65%] h-[65%] rounded-full bg-gradient-to-br from-neutral-500 to-neutral-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]" />
                      </div>
                      {/* Hinge Arm extending toward edge */}
                      <div className="absolute top-1/2 -mt-2.5 right-[50%] w-10 h-5 bg-gradient-to-b from-neutral-200 to-neutral-400 shadow-[0_5px_10px_rgba(0,0,0,0.5)] border border-neutral-400 rounded-l-sm rounded-r-none z-10 flex items-center pr-1">
                         {/* Hardware adjustment screw detail */}
                         <div className="w-2.5 h-2.5 rounded-full bg-neutral-500 shadow-inner ml-1.5 border border-neutral-400/50 flex items-center justify-center">
                            <div className="w-full h-[1px] bg-neutral-700 rotate-45" />
                         </div>
                      </div>
                   </div>
                )}
             </div>
          ))}
        </div>
        
        {/* RIGHT FACE */}
        <div style={faceStyle(pxDepth, pxHeight, `rotateY(90deg) translateZ(${pxWidth/2}px)`, mdfEdge)} />
        {/* LEFT FACE */}
        <div style={faceStyle(pxDepth, pxHeight, `rotateY(-90deg) translateZ(${pxWidth/2}px)`, mdfEdge)} />
        {/* TOP FACE */}
        <div style={faceStyle(pxWidth, pxDepth, `rotateX(90deg) translateZ(${pxHeight/2}px)`, mdfEdge)} />
        {/* BOTTOM FACE */}
        <div style={faceStyle(pxWidth, pxDepth, `rotateX(-90deg) translateZ(${pxHeight/2}px)`, mdfEdge)} />
      </div>
      
      {/* View Hint Controls (Updated to match mock-up bottom icons) */}
      {isRotating && (
        <div className="absolute bottom-8 flex items-center space-x-8 text-neutral-400 text-xs font-medium">
          <div className="flex flex-col items-center cursor-pointer hover:text-white transition-colors">
            <RotateCw size={18} className="mb-1" />
            <span>Rotating</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-white transition-colors text-blue-400">
            <Maximize size={18} className="mb-1" />
            <span>Zoom</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-white transition-colors">
            <Layers size={18} className="mb-1" />
            <span>Hardware</span>
          </div>
        </div>
      )}
    </div>
  );
};

const ConfiguratorView = ({ setView }) => {
  const [width, setWidth] = useState(18);
  const [height, setHeight] = useState(30);
  const [depth, setDepth] = useState(0.75);
  const [style, setStyle] = useState('shaker');
  
  // Granular Add-ons
  const [addons, setAddons] = useState({ 
    sanding: true, 
    softClose: true,
    boring: true // Soft close implies boring in the mock-up
  });

  // Custom sizes state (from mock-up)
  const [customSizes, setCustomSizes] = useState({
    size1: false, size2: false, size3: false, size4: false
  });

  // Pricing Logic
  const sqft = (width * height) / 144;
  let basePrice = sqft * 18.50; 
  if (style === 'raised') basePrice += (sqft * 5); 
  if (depth > 0.75) basePrice *= 1.2;
  
  const sandingPrice = addons.sanding ? 15 : 0;
  const hingesPrice = addons.softClose ? 25 : 0; // Merged boring & hinges price for "Installation Ready"
  const total = basePrice + sandingPrice + hingesPrice;

  return (
    <div className="flex-1 flex h-full bg-[#0a0a0a] overflow-hidden">
      
      {/* COLUMN 1: Dimensions & Style (Left) */}
      <div className="w-[320px] bg-[#161616] border-r border-neutral-800 flex flex-col shrink-0 shadow-[5px_0_15px_rgba(0,0,0,0.5)] z-20">
        <div className="p-6 border-b border-neutral-800/50">
          <h2 className="text-white font-bold text-lg mb-1 tracking-tight">Dynamic 3D Live Preview</h2>
          <p className="text-neutral-400 text-[11px] leading-relaxed">High quality MDF cabinet door candidate. Use interface to adjust dimensions and style model.</p>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Sliders */}
          <RangeSlider label="Width" value={width} setter={setWidth} min={6} max={48} step={0.125} unit='"' />
          <RangeSlider label="Height" value={height} setter={setHeight} min={6} max={96} step={0.125} unit='"' />
          <RangeSlider label="Thickness" value={depth} setter={setDepth} min={0.5} max={1.5} step={0.125} unit='"' />
          
          <div className="mt-10">
            <div className="flex bg-[#0f0f0f] border border-neutral-800 rounded-lg p-1">
              <button 
                onClick={() => setStyle('shaker')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${style === 'shaker' ? 'bg-[#252525] text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                Shaker
              </button>
              <button 
                onClick={() => setStyle('raised')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${style === 'raised' ? 'bg-[#252525] text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                Raised Panel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* COLUMN 2: Center 3D View */}
      <div className="flex-1 relative bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden">
        <InteractiveDoor3D width={width} height={height} depth={depth} style={style} addons={addons} />
      </div>

      {/* COLUMN 3: Options & Cart (Right) */}
      <div className="w-[360px] bg-[#161616] border-l border-neutral-800 flex flex-col shrink-0 shadow-[-5px_0_15px_rgba(0,0,0,0.5)] z-20">
        
        {/* Options Section */}
        <div className="p-6 border-b border-neutral-800/50">
          <h2 className="text-white font-bold text-lg mb-1 tracking-tight">Options</h2>
          <p className="text-neutral-400 text-[11px] leading-relaxed mb-6">Choose add ons or verify variations via selection and computation add ons.</p>
          
          <div className="space-y-5">
            <CustomCheckbox 
              label="Paint-Ready Package" 
              sublabel="(hand-sanding 220 grit)" 
              checked={addons.sanding} 
              onChange={() => setAddons(prev => ({...prev, sanding: !prev.sanding}))} 
            />
            <CustomCheckbox 
              label="Installation-Ready Package" 
              sublabel="(boring & soft-close hinges)" 
              checked={addons.softClose} 
              onChange={() => setAddons(prev => ({
                ...prev, 
                softClose: !prev.softClose,
                boring: !prev.softClose // Keep boring synced
              }))} 
            />
          </div>

          <div className="mt-8 border-t border-neutral-800/50 pt-6">
            <h3 className="text-neutral-200 text-sm font-medium mb-1">Custom Sizing</h3>
            <p className="text-neutral-500 text-xs mb-4">Or alternative-ready Packages, boring & solid base hinges list</p>
            <div className="space-y-3">
              <CustomCheckbox label="Custom Sizing > 4'x8'" checked={customSizes.size1} onChange={() => setCustomSizes(prev => ({...prev, size1: !prev.size1}))} />
              <CustomCheckbox label="Custom Sizing > 4'x6'" checked={customSizes.size2} onChange={() => setCustomSizes(prev => ({...prev, size2: !prev.size2}))} />
              <CustomCheckbox label="Custom Sizing > 4'x5'" sublabel="(Custom sizing up to ~1/4 inch)" checked={customSizes.size3} onChange={() => setCustomSizes(prev => ({...prev, size3: !prev.size3}))} />
              <CustomCheckbox label="Custom Sizing > 4'x2'" checked={customSizes.size4} onChange={() => setCustomSizes(prev => ({...prev, size4: !prev.size4}))} />
            </div>
          </div>
        </div>

        {/* Dynamic Cart Section */}
        <div className="p-6 flex-1 flex flex-col bg-[#111]">
          <h2 className="text-white font-bold text-lg mb-1 tracking-tight">Dynamic Cart</h2>
          <p className="text-neutral-400 text-[11px] leading-relaxed mb-4">Updates in real time. Your current single in real time.</p>
          
          {/* Cart Item Row */}
          <div className="flex items-center justify-between bg-[#1a1a1a] p-3 rounded-lg border border-neutral-800 mb-6 group hover:border-neutral-700 transition-colors">
            <div className="flex items-center">
              <div className="w-10 h-12 bg-[#c4a37a] rounded-[2px] shadow-inner border border-[#b89770] flex items-center justify-center mr-3 relative overflow-hidden">
                 {/* Mini shaker detail */}
                 {style === 'shaker' && <div className="absolute inset-1.5 border border-[#a6855b] bg-[#b89770]"></div>}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Cabinet Door</h4>
                <p className="text-xs text-neutral-500 capitalize">{style} Single</p>
              </div>
            </div>
            <div className="flex items-center">
               <span className="text-neutral-400 text-sm font-mono mr-3">x1</span>
               <button className="text-neutral-600 hover:text-red-400 transition-colors"><XIcon size={14} /></button>
            </div>
          </div>

          <div className="flex justify-between items-end mb-8">
            <span className="text-neutral-200 font-medium">Running Total</span>
            <span className="text-2xl font-bold text-white tracking-tight">${total.toFixed(2)}</span>
          </div>

          {/* Centered App Icon Display */}
          <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
             {/* Decorative glow behind icon */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/10 blur-[30px] rounded-full pointer-events-none"></div>
             <AppIcon size="lg" />
          </div>

          <button className="w-full mt-auto py-3.5 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-400 text-black font-bold text-sm tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
             Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const RenderSwipeView = ({ setView }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null);

  // Dummy catalog data for swiping
  const catalog = [
    { id: 1, name: "Classic Shaker", width: 18, height: 30, depth: 0.75, style: 'shaker', price: 45 },
    { id: 2, name: "Regal Raised", width: 24, height: 36, depth: 1.0, style: 'raised', price: 85 },
    { id: 3, name: "Modern Minimalist", width: 12, height: 42, depth: 0.75, style: 'shaker', price: 38 },
  ];

  const currentItem = catalog[currentIndex % catalog.length];

  const handleSwipe = (dir) => {
    setSwipeDir(dir);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDir(null);
    }, 300); // match transition duration
  };

  return (
    <div className="flex-1 bg-black flex flex-col items-center justify-center relative overflow-hidden pt-16">
      
      {/* Header */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
        <h2 className="text-white font-bold text-xl flex items-center">
          <AppIcon size="sm" /> <span className="ml-2">Render</span>
        </h2>
        <button onClick={() => setView('configurator')} className="text-neutral-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <div className="text-center mb-6 z-10">
        <p className="text-neutral-400 text-sm tracking-widest uppercase">Swipe to Curate</p>
      </div>

      {/* Card Stack */}
      <div className="relative w-full max-w-sm aspect-[3/4] perspective-1200">
        <div 
          className={`absolute inset-0 bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ${
            swipeDir === 'left' ? '-translate-x-full rotate-[-15deg] opacity-0' : 
            swipeDir === 'right' ? 'translate-x-full rotate-[15deg] opacity-0' : 'scale-100'
          }`}
        >
          <div className="flex-1 relative flex items-center justify-center bg-gradient-to-b from-neutral-800 to-black p-8 pointer-events-none">
            {/* Re-use 3D component but static for the card */}
            <InteractiveDoor3D width={currentItem.width} height={currentItem.height} depth={currentItem.depth} style={currentItem.style} isRotating={false} />
            
            {/* Visual feedback overlays */}
            {swipeDir === 'right' && <div className="absolute top-4 left-4 border-4 border-emerald-500 text-emerald-500 font-bold text-3xl px-4 py-1 rounded-lg rotate-[-15deg]">LIKE</div>}
            {swipeDir === 'left' && <div className="absolute top-4 right-4 border-4 border-red-500 text-red-500 font-bold text-3xl px-4 py-1 rounded-lg rotate-[15deg]">NOPE</div>}
          </div>
          
          <div className="p-6 bg-neutral-900">
            <h3 className="text-2xl font-bold text-white">{currentItem.name}</h3>
            <p className="text-neutral-400">{currentItem.width}" × {currentItem.height}" × {currentItem.depth}" MDF Core</p>
            <p className="text-emerald-400 font-bold mt-2">${currentItem.price.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Swipe Controls */}
      <div className="flex space-x-6 mt-8 z-10">
        <button 
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 text-red-500 flex items-center justify-center shadow-lg hover:bg-neutral-800 transition-colors"
        >
          <XIcon size={32} />
        </button>
        <button 
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 text-emerald-500 flex items-center justify-center shadow-lg hover:bg-neutral-800 transition-colors animate-pulse-glow"
        >
          <Heart size={32} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

const MemberPortalView = () => {
  return (
    <div className="flex-1 bg-[#0a0a0a] text-white p-4 md:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Portal Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Member Portal</h1>
            <p className="text-neutral-400">Manage orders, view LiDAR scans, and request custom quotes.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="text-right">
              <p className="font-semibold">Professional Account</p>
              <p className="text-sm text-blue-400">ID: CD1-9042</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center">
              <User size={24} className="text-neutral-400" />
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Workflows (LiDAR Simulation) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
                  <Activity size={12} className="mr-1 animate-pulse" /> LIVE SYNC
                </span>
              </div>
              
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <ScanLine className="mr-2 text-blue-400" /> Recent Room Scans
              </h2>
              
              {/* Scan Records Table */}
              <div className="bg-neutral-950/50 rounded-xl border border-neutral-800/50 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-900/80 text-neutral-400 border-b border-neutral-800">
                    <tr>
                      <th className="p-4 font-medium">Project Name</th>
                      <th className="p-4 font-medium">Dimensions</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50">
                    <tr className="hover:bg-neutral-800/30 transition-colors">
                      <td className="p-4 font-medium">Kitchen Remodel - Smith</td>
                      <td className="p-4 text-neutral-400">14' × 12' × 9'</td>
                      <td className="p-4"><span className="text-blue-400 bg-blue-400/10 px-2 py-1 rounded text-xs">Analyzing Data</span></td>
                      <td className="p-4 text-right"><button className="text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded transition-colors">View Details</button></td>
                    </tr>
                    <tr className="hover:bg-neutral-800/30 transition-colors">
                      <td className="p-4 font-medium">Master Bath Vanity</td>
                      <td className="p-4 text-neutral-400">72" × 24" × 34"</td>
                      <td className="p-4"><span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-xs">Quote Ready</span></td>
                      <td className="p-4 text-right"><button className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded transition-colors">View Quote</button></td>
                    </tr>
                    <tr className="hover:bg-neutral-800/30 transition-colors opacity-60">
                      <td className="p-4 font-medium">Apartment Complex - Unit A</td>
                      <td className="p-4 text-neutral-400">Standard Kit</td>
                      <td className="p-4"><span className="text-neutral-400 bg-neutral-800 px-2 py-1 rounded text-xs">Completed</span></td>
                      <td className="p-4 text-right"><button className="text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded transition-colors">Reorder</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual LiDAR Simulation UI */}
            <div className="glass-panel rounded-2xl p-1 overflow-hidden relative group cursor-pointer border border-blue-500/30 hover:border-blue-500 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent z-10 pointer-events-none"></div>
              {/* Fake Wireframe Room Grid */}
              <div className="h-48 w-full bg-[#050510] relative flex items-center justify-center overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:20px_20px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom opacity-50"></div>
                <div className="relative z-20 text-center">
                  <Smartphone size={32} className="mx-auto text-blue-400 mb-2 animate-bounce" />
                  <p className="text-sm font-medium text-blue-200">Open iOS App to start new LiDAR Scan</p>
                  <p className="text-xs text-blue-400/60 mt-1">Requires iPhone 12 Pro or newer</p>
                </div>
                {/* Scanning line animation */}
                <div className="absolute w-full h-1 bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,1)] z-30 animate-scanline"></div>
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700 transition-colors flex items-center">
                  <Layers className="mr-3 text-emerald-400" size={18} /> Order Single Door
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700 transition-colors flex items-center">
                  <Settings className="mr-3 text-blue-400" size={18} /> Request Custom CNC Work
                </button>
              </div>
            </div>
            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 flex items-center justify-center">
               <AppIcon size="lg" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('configurator'); // 'configurator', 'render', 'portal'

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex font-sans text-neutral-200 selection:bg-cyan-500/30 overflow-hidden">
      <CustomStyles />
      
      {/* Sleek App Sidebar Navigation */}
      <aside className="w-16 bg-[#111111] border-r border-neutral-800 flex flex-col items-center py-6 space-y-8 z-50 shrink-0 shadow-2xl">
        <div className="cursor-pointer mb-2" onClick={() => setView('configurator')} title="Cabinet Door Singles">
          <div className="flex items-center font-bold tracking-tighter transform -rotate-90 origin-center whitespace-nowrap mt-8">
            <span className="text-gray-300 text-xl mr-0.5">CD</span>
            <span className="text-gray-500 text-xl font-light">[</span>
            <span className="gradient-text text-xl">1</span>
            <span className="text-gray-500 text-xl font-light">]</span>
          </div>
        </div>

        <div className="flex flex-col space-y-4 w-full px-2 mt-12">
          <button 
            onClick={() => setView('configurator')} 
            className={`p-3 rounded-xl flex items-center justify-center transition-all group ${view === 'configurator' ? 'bg-blue-500/10 text-cyan-400 border border-blue-500/20' : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 border border-transparent'}`}
            title="3D Configurator"
          >
            <Box size={20} className={view === 'configurator' ? 'animate-pulse-glow rounded-full' : ''} />
          </button>
          
          <button 
            onClick={() => setView('render')} 
            className={`p-3 rounded-xl flex items-center justify-center transition-all group ${view === 'render' ? 'bg-blue-500/10 text-cyan-400 border border-blue-500/20' : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 border border-transparent'}`}
            title="Render App Mode"
          >
            <Smartphone size={20} />
          </button>
          
          <button 
            onClick={() => setView('portal')} 
            className={`p-3 rounded-xl flex items-center justify-center transition-all group ${view === 'portal' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 border border-transparent'}`}
            title="Member Portal"
          >
            <ScanLine size={20} />
          </button>
        </div>

        <div className="flex-1" />

        <div className="flex flex-col space-y-4 w-full px-2">
          <button className="p-3 rounded-xl text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-all border border-transparent flex items-center justify-center" title="Cart">
             <div className="relative">
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-[#111]"></span>
             </div>
          </button>
          <button className="p-3 rounded-xl text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-all border border-transparent flex items-center justify-center" title="Settings">
            <Settings size={20} />
          </button>
        </div>
      </aside>

      {/* Main App Content Area */}
      <main className="flex-1 flex flex-col relative h-full">
        {view === 'configurator' && <ConfiguratorView setView={setView} />}
        {view === 'render' && <RenderSwipeView setView={setView} />}
        {view === 'portal' && <MemberPortalView />}
      </main>
    </div>
  );
}