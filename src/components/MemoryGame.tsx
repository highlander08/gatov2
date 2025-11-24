// MemoryGame.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Color } from "../types";
import {
  COLORS,
  COLOR_MAP,
  KEY_MAP,
  COLOR_STYLES,
  ACTIVE_COLOR_STYLES,
  SEQUENCE_INTERVAL,
  HIGHLIGHT_DURATION,
  TOTAL_TIME, // Você pode remover esta importação se não for usada em outros lugares
} from "../constants";

interface MemoryGameProps {
  onSuccess: () => void;
  onDecay: () => void;
  decayTime: number;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({
  onSuccess,
  onDecay,
  decayTime,
}) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [message, setMessage] = useState(
    "Aguarde, preparando a superposição..."
  );
  const [timeLeft, setTimeLeft] = useState(decayTime * 1000);
  const [totalTime, setTotalTime] = useState(decayTime * 1000);
  const [isGameActive, setIsGameActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const generateSequence = useCallback(() => {
    const sequenceLength = Math.floor(Math.random() * 4) + 3; // 3 to 6 colors
    const newSequence: string[] = [];
    for (let i = 0; i < sequenceLength; i++) {
      const randomDigit = Math.floor(Math.random() * 4) + 1;
      newSequence.push(randomDigit.toString());
    }
    setSequence(newSequence);
  }, []);

  useEffect(() => {
    generateSequence();
  }, [generateSequence]);

  const playSequence = useCallback(() => {
    setIsPlayerTurn(false);
    setMessage("Observe a sequência...");

    sequence.forEach((digit, index) => {
      setTimeout(() => {
        setActiveColor(COLOR_MAP[digit]);
        setTimeout(() => {
          setActiveColor(null);
          if (index === sequence.length - 1) {
            setIsPlayerTurn(true);
            setMessage("Sua vez! Repita a sequência.");
            setPlayerSequence([]);
          }
        }, HIGHLIGHT_DURATION);
      }, (index + 1) * SEQUENCE_INTERVAL);
    });
  }, [sequence]);

  useEffect(() => {
    if (sequence.length > 0) {
      const timeoutId = setTimeout(() => {
        playSequence();
        setIsGameActive(true);
      }, 1500); // Wait for box animation
      return () => clearTimeout(timeoutId);
    }
  }, [sequence, playSequence]);

  useEffect(() => {
    if (!isGameActive || timeLeft <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 100);
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isGameActive, timeLeft]);

  useEffect(() => {
    if (isGameActive && timeLeft <= 0) {
      onDecay();
    }
  }, [timeLeft, isGameActive, onDecay]);

  const processPlayerInput = useCallback(
    (digit: string) => {
      if (!isPlayerTurn || !isGameActive) return;

      // Instant feedback
      setActiveColor(COLOR_MAP[digit]);
      setTimeout(() => setActiveColor(null), 200);

      const currentStep = playerSequence.length;
      if (digit === sequence[currentStep]) {
        const newPlayerSequence = [...playerSequence, digit];
        setPlayerSequence(newPlayerSequence);

        if (newPlayerSequence.length === sequence.length) {
          setIsGameActive(false);
          setIsPlayerTurn(false);
          setMessage("Sequência correta! Colapsando a função de onda...");
          setTimeout(onSuccess, 1000);
        }
      } else {
        setMessage("Erro! Observe a sequência novamente.");
        setPlayerSequence([]);
        setIsPlayerTurn(false);
        setTimeout(playSequence, 1500);
      }
    },
    [
      isPlayerTurn,
      isGameActive,
      playerSequence,
      sequence,
      onSuccess,
      playSequence,
    ]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const digit = KEY_MAP[event.code];
      if (digit) {
        processPlayerInput(digit);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [processPlayerInput]);

  const handleColorClick = (index: number) => {
    const digit = (index + 1).toString();
    processPlayerInput(digit);
  };

  const timerPercentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 animate-fade-in w-full max-w-2xl mx-auto p-4 mt-8">
      {/* Timer Section */}
      <div className="flex flex-col items-center gap-4 order-2">
        <div
          className="text-5xl font-bold text-cyan-300 tabular-nums text-center"
          style={{ textShadow: "0 0 8px #06b6d4" }}
        >
          {(timeLeft / 1000).toFixed(1)}s
        </div>
        <div className="w-8 h-80 bg-slate-800/80 rounded-full overflow-hidden border-2 border-cyan-900/50 flex flex-col-reverse">
          <div
            className="w-full bg-gradient-to-t from-emerald-400 via-yellow-400 to-red-500 rounded-full transition-all duration-100 ease-linear"
            style={{
              width: "100%", // A largura deve ser sempre 100% do contêiner
              height: `${timerPercentage}%`, // A altura é que deve diminuir
              filter: `hue-rotate(-${
                (100 - timerPercentage) * 0.9
              }deg) saturate(${1 + (100 - timerPercentage) / 100})`,
            }}
          />
        </div>
        <div className="text-lg text-cyan-400 font-semibold tracking-widest text-center">
          DECAIMENTO
        </div>
      </div>

      {/* Game Interface */}
      <div className="flex flex-col items-center order-1">
        <p className="text-lg md:text-xl h-20 mb-4 text-cyan-300 tracking-wider bg-black/30 w-full flex items-center justify-center rounded-md border border-cyan-500/30 max-w-md text-center px-2">
          {message}
        </p>
        <motion.div
          className="grid grid-cols-2 gap-4 w-36 md:w-44"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {COLORS.map((color, index) => (
            <motion.div
              key={color}
              className={`flex flex-col items-center gap-2 p-1 rounded-lg`}
              onClick={() => handleColorClick(index)}
              aria-label={`Cor ${color}, número ${index + 1}`}
              variants={itemVariants}
            >
              <motion.div
                className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl transition-all duration-200 
                  ${
                    activeColor === color
                      ? ACTIVE_COLOR_STYLES[color]
                      : COLOR_STYLES[color]
                  }
                  ${
                    isPlayerTurn
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-70"
                  }
                `}
                whileHover={
                  isPlayerTurn ? { scale: 1.1, filter: "brightness(1.2)" } : {}
                }
                whileTap={isPlayerTurn ? { scale: 0.9 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              />
              <span className="font-bold text-lg text-gray-400">
                {index + 1}
              </span>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-4 h-8 text-2xl tracking-[0.5em] flex items-center justify-center">
          {playerSequence.map((_, i) => "⚫").join("")}
        </div>
      </div>
    </div>
  );
};
