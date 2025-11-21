// App.tsx
"use client";
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MemoryGame } from '../components/MemoryGame';
import { QuantumBox } from '../components/QuantumBox';
import { AppState, CatState } from '../types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.PRE_SIMULATION);
  const [catState, setCatState] = useState<CatState>(CatState.SUPERPOSITION);
  const [gameKey, setGameKey] = useState<number>(0);
  const [decayTime, setDecayTime] = useState(30);
  const [showMemoryGame, setShowMemoryGame] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Efeito para limpar o áudio quando o componente for desmontado
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, []);

  const handleStart = () => {
    setAppState(AppState.SUPERPOSITION);
    audioRef.current = new Audio('/sounds/cat-meow.mp3');
    audioRef.current.loop = true;
    audioRef.current.play();
    // Gera um tempo de decaimento aleatório entre 3 e 30 segundos
    setDecayTime(Math.floor(Math.random() * (30 - 3 + 1)) + 3);
    setTimeout(() => {
      setShowMemoryGame(true);
    }, 1500);
  };

  const handleSuccess = useCallback(() => {
    setCatState(CatState.ALIVE);
    setAppState(AppState.REVEALING);
    setShowMemoryGame(false);
  }, []);

  const handleDecay = useCallback(() => {
    setCatState(CatState.DEAD);
    audioRef.current?.pause();
    setAppState(AppState.REVEALING);
    setShowMemoryGame(false);
  }, []);

  const handleReset = () => {
    setCatState(CatState.SUPERPOSITION);
    setAppState(AppState.PRE_SIMULATION);
    audioRef.current?.pause();
    setShowMemoryGame(false);
    setGameKey((prevKey) => prevKey + 1);
  };

  const resultData = useMemo(() => {
    if (appState === AppState.REVEALING) {
      if (catState === CatState.ALIVE) {
        return {
          title: "Você salvou o gato!",
          titleClass: "text-green-400",
          text: "A função de onda colapsou em um estado feliz 🐾.",
          buttonText: "Simular Novamente",
        };
      } else if (catState === CatState.DEAD) {
        return {
          title: "O Átomo Decaiu!",
          titleClass: "text-red-500",
          text: "O tempo se esgotou. O destino do gato foi selado pelo decaimento.",
          buttonText: "Tentar Salvar Outro Gato",
        };
      }
    }
    return null;
  }, [catState, appState]);

  const getHeaderText = () => {
    switch (appState) {
      case AppState.PRE_SIMULATION:
        return "Um Gato e seu Destino Quântico";
      case AppState.SUPERPOSITION:
        return "Observando a Superposição...";
      case AppState.REVEALING:
        return catState === CatState.ALIVE
          ? "Observação Bem-sucedida!"
          : "Função de Onda Colapsou!";
      case AppState.DECAYED:
        return "Decaimento Atômico Ocorreu!";
      default:
        return "Gato de Schrödinger";
    }
  };

  return (
    <div className="bg-quantum-dark text-gray-100 min-h-screen flex items-center justify-center p-4 font-mono select-none relative z-10 overflow-hidden">
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-stretch rounded-lg bg-slate-900/40 shadow-2xl shadow-cyan-500/10 border border-cyan-500/20 min-h-[600px]">
        {/* Left Column: Information */}
        <aside className="w-full md:w-1/3 p-6 md:p-8 border-b-2 md:border-b-0 md:border-r-2 border-cyan-500/20 text-center md:text-left flex flex-col">
          <div className="flex-1">
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-cyan-400 mb-2 tracking-wider text-center md:text-left"
              style={{ textShadow: "0 0 10px #06b6d4, 0 0 5px #06b6d4" }}
            >
              Gato de Schrödinger
            </h1>
            <h2 className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 opacity-80 text-center md:text-left">
              {getHeaderText()}
            </h2>

            <div className="text-gray-400 space-y-4 md:space-y-6">
              <div>
                <h3 className="font-bold text-cyan-300 text-lg mb-2">
                  O Conceito
                </h3>
                <p className="text-sm leading-relaxed">
                  Um gato é colocado em uma caixa selada com um mecanismo que
                  pode matá-lo, baseado no decaimento de um átomo radioativo.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-cyan-300 text-lg mb-2">
                  Superposição
                </h3>
                <p className="text-sm leading-relaxed">
                  Enquanto a caixa está fechada, o gato existe em uma
                  "superposição" de estados — ele é considerado simultaneamente{" "}
                  <strong>vivo E morto</strong>.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-cyan-300 text-lg mb-2">
                  O Observador
                </h3>
                <p className="text-sm leading-relaxed">
                  Somente ao abrir a caixa (observar) o destino do gato é
                  selado. Sua observação força o universo a "escolher" um
                  estado. Você será o observador.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Simulation */}
        <div className="w-full md:w-2/3 p-4 md:p-6 flex flex-col items-center justify-center">
          <main className="w-full max-w-2xl flex flex-col items-center justify-center space-y-6">
            <div className="w-full flex justify-center">
              <QuantumBox appState={appState} catState={catState} />
            </div>

            {/* Game States */}
            <div className="w-full flex flex-col items-center justify-center min-h-[200px]">
              <AnimatePresence mode="wait">
                {appState === AppState.PRE_SIMULATION && (
                  <motion.div
                    key="start-button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.button
                      onClick={handleStart}
                      className="px-8 py-4 bg-cyan-500 text-gray-900 font-bold rounded-lg shadow-lg shadow-cyan-500/50 text-lg"
                      whileHover={{ scale: 1.05, backgroundColor: "#22d3ee" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Iniciar Simulação
                    </motion.button>
                  </motion.div>
                )}

                {appState === AppState.SUPERPOSITION && showMemoryGame && (
                  <motion.div
                    key="memory-game"
                    className="w-full flex justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <MemoryGame
                      key={gameKey}
                      onSuccess={handleSuccess}
                      onDecay={handleDecay}
                      decayTime={decayTime}
                    />
                  </motion.div>
                )}

                {appState === AppState.REVEALING && resultData && (
                  <motion.div
                    key="result-screen"
                    className="text-center w-full"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3
                      className={`text-2xl md:text-3xl font-bold ${resultData.titleClass} mb-4`}
                    >
                      {resultData.title}
                    </h3>
                    <p className="text-gray-400 mb-6">{resultData.text}</p>
                    <motion.button
                      onClick={handleReset}
                      className="px-8 py-3 bg-cyan-500 text-gray-900 font-bold rounded-lg shadow-lg shadow-cyan-500/50"
                      whileHover={{ scale: 1.05, backgroundColor: "#22d3ee" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {resultData.buttonText}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
