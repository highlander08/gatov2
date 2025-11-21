import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, CatState } from '../types';

interface QuantumBoxProps {
  appState: AppState;
  catState: CatState;
}

const AliveCatImage: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Gato vivo">
      <defs>
          <radialGradient id="aliveCatGradient" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#f3f4f6" />
              <stop offset="100%" stopColor="#d1d5db" />
          </radialGradient>
      </defs>
      <path d="M 150 140 C 180 140, 180 100, 160 90" stroke="url(#aliveCatGradient)" fill="none" strokeWidth="20" strokeLinecap="round" />
      <path d="M 50 160 C 50 130, 70 110, 100 110 C 130 110, 150 130, 150 160 Z" fill="url(#aliveCatGradient)" />
      <circle cx="100" cy="80" r="50" fill="url(#aliveCatGradient)" />
      <path d="M 60,40 L 40,10 L 90,50 Z" fill="url(#aliveCatGradient)" />
      <path d="M 140,40 L 160,10 L 110,50 Z" fill="url(#aliveCatGradient)" />
      <path d="M 65,45 L 50,25 L 90,55 Z" fill="#9ca3af" />
      <path d="M 135,45 L 150,25 L 110,55 Z" fill="#9ca3af" />
      <circle cx="80" cy="80" r="8" fill="#10b981" />
      <circle cx="120" cy="80" r="8" fill="#10b981" />
      <circle cx="82" cy="78" r="3" fill="black" />
      <circle cx="122" cy="78" r="3" fill="black" />
      <path d="M 95 95 C 98 100, 102 100, 105 95 Z" fill="#f87171" />
      <path d="M 90,102 C 95,108 100,108 100,102" stroke="black" fill="none" strokeWidth="2" strokeLinecap="round"/>
      <path d="M 100,102 C 100,108 105,108 110,102" stroke="black" fill="none" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);
  
const DeadCatImage: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={`${className} opacity-80`} aria-label="Gato morto">
        <defs>
            <radialGradient id="deadCatGradient" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#a7f3d0" />
                <stop offset="100%" stopColor="#34d399" />
            </radialGradient>
        </defs>
        <ellipse cx="100" cy="20" rx="30" ry="8" fill="none" stroke="#fef08a" strokeWidth="4" />
        <path d="M 50 180 C 40 100, 80 30, 100 30 C 120 30, 160 100, 150 180 Q 125 170 100 180 Q 75 170 50 180 Z" fill="url(#deadCatGradient)"/>
        <path d="M75,85 L95,105 M95,85 L75,105" stroke="black" strokeWidth="5" strokeLinecap="round" />
        <path d="M125,85 L105,105 M105,85 L125,105" stroke="black" strokeWidth="5" strokeLinecap="round" />
        <path d="M90,120 Q100,130 110,120" stroke="black" fill="none" strokeWidth="3" strokeLinecap="round"/>
    </svg>
);

const HammerImage: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} aria-label="Martelo">
    <g transform="rotate(-30 50 50)">
      <rect x="25" y="10" width="50" height="25" fill="#d1d5db" stroke="#6b7280" strokeWidth="2" rx="2" />
      <rect x="42" y="35" width="16" height="55" fill="#a16207" stroke="#422006" strokeWidth="2" rx="2" />
    </g>
  </svg>
);

const VialImage: React.FC<{ isBroken: boolean, className?: string }> = ({ isBroken, className }) => {
  if (isBroken) {
    return (
      <svg viewBox="0 0 100 100" className={className} aria-label="Frasco de veneno quebrado">
        <path d="M 10 95 C 30 90, 70 100, 90 95 Q 50 105 10 95 Z" fill="#16a34a" opacity="0.8" />
        <path d="M 30 85 L 40 50 L 25 40" fill="none" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" />
        <path d="M 70 85 L 60 50 L 75 40" fill="none" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" />
        <path d="M 45 80 L 55 85" fill="none" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" />
        <path d="M 40 10 L 60 10 L 55 25 L 45 25 Z" fill="#a16207" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" className={className} aria-label="Frasco de veneno intacto">
      <path d="M 30 90 L 30 40 Q 30 25 45 25 L 55 25 Q 70 25 70 40 L 70 90 Z" fill="#67e8f9" fillOpacity="0.5" stroke="#0891b2" strokeWidth="2" />
      <rect x="32" y="50" width="36" height="38" fill="#16a34a" rx="1" />
      <path d="M 40 10 L 60 10 L 55 25 L 45 25 Z" fill="#a16207" />
    </svg>
  );
};


export const QuantumBox: React.FC<QuantumBoxProps> = ({ appState, catState }) => {
    const isPreSimulation = appState === AppState.PRE_SIMULATION;
    const isSuperposition = appState === AppState.SUPERPOSITION;
    const isRevealing = appState === AppState.REVEALING;
  
    const getLockText = () => {
      if (isRevealing && catState === CatState.ALIVE) return '🔓';
      return '🔒';
    };

    // 3D Box constants
    const BOX_SIZE_REM = 14; // Corresponds to w-56, h-56
    const HALF_SIZE_REM = BOX_SIZE_REM / 2;
    const faceBaseClass = `absolute w-full h-full border-4 border-cyan-500/50 rounded-lg`;

    const isOpen = isPreSimulation || isRevealing;
  
    return (
      <div className="relative w-full h-96 flex items-center justify-center mt-24" style={{ perspective: '1000px' }}>
        
        {/* External items */}
        <AnimatePresence>
          {isPreSimulation && (
            <motion.div
              key="initial-elements"
              className="absolute flex items-center justify-center gap-4"
              initial={{ y: -256, opacity: 1 }}
              exit={{ y: 0, opacity: 0, scale: 0.5 }}
              transition={{ duration: 1, ease: "easeIn" }}
            >
              <HammerImage className="w-16 h-16" />
              <AliveCatImage className="w-28 h-28" />
              <VialImage isBroken={false} className="w-16 h-16" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Box container */}
        <motion.div className="relative w-56 h-56" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-30deg) rotateX(15deg)' }} animate={isSuperposition ? "superposition" : "default"}>
            {/* Top (Lid) */}
            <motion.div
              className={`${faceBaseClass} bg-slate-800 transform-origin-bottom`}
              style={{ translateY: `-${HALF_SIZE_REM}rem` }}
              initial={false}
              animate={{ rotateX: isOpen ? 170 : 90 }}
              transition={{ duration: 1, ease: "easeInOut", delay: isPreSimulation ? 0 : 1 }}
            />

            {/* Bottom */}
            <div
              className={`${faceBaseClass} bg-slate-950`}
              style={{ transform: `translateY(${HALF_SIZE_REM}rem) rotateX(-90deg)` }}
            />
            
            {/* Back */}
            <div
              className={`${faceBaseClass} bg-slate-900`}
              style={{ transform: `translateZ(-${HALF_SIZE_REM}rem) rotateY(180deg)` }}
            />
            
            {/* Left */}
            <div
              className={`${faceBaseClass} bg-slate-800`}
              style={{ transform: `translateX(-${HALF_SIZE_REM}rem) rotateY(-90deg)` }}
            />

            {/* Right */}
            <div
              className={`${faceBaseClass} bg-slate-800`}
              style={{ transform: `translateX(${HALF_SIZE_REM}rem) rotateY(90deg)` }}
            />
            
            {/* Front */}
            <div 
              className={`${faceBaseClass} bg-slate-900 flex items-center justify-center shadow-2xl relative
              ${isSuperposition ? 'animate-pulse-glow' : ''}
              ${(isRevealing && catState === CatState.DEAD) ? 'shadow-red-500/80' : ''}`}
              style={{ transform: `translateZ(${HALF_SIZE_REM}rem)` }}>

              {(isPreSimulation || isSuperposition) && (
                <p className="text-2xl text-flicker text-white text-center">
                  <span className="text-red-500 animate-pulse">💓</span> Salve o gato!
                </p>
              )}
    
              <AnimatePresence>
                {isRevealing && (
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    {catState === CatState.ALIVE && <AliveCatImage className="w-28 h-28" />}
                    {catState === CatState.DEAD && <DeadCatImage className="w-28 h-28" />}
                    <div className="absolute -bottom-2 flex items-end gap-2">
                      <HammerImage className="w-16 h-16" />
                      <VialImage isBroken={catState === CatState.DEAD} className="w-16 h-16" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {(isSuperposition || (isRevealing && catState === CatState.ALIVE)) && (
                  <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl z-10"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 1.2 } }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    {getLockText()}
                  </motion.div>
                )}
              </AnimatePresence>
      
              {isRevealing && catState === CatState.DEAD && (
                  <div className="absolute inset-0 bg-red-900/50 rounded-lg animate-pulse" style={{ animationDuration: '0.5s' }} />
              )}
            </div>
        </motion.div>
      </div>
    );
  };