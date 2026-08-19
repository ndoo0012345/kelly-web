import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Gamepad2, 
  RotateCcw, 
  Trophy, 
  Zap, 
  Brain, 
  Flame, 
  Keyboard, 
  Timer, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Award,
  ChevronRight
} from 'lucide-react';

type GameMode = 'snake' | 'memory' | 'reaction' | 'tictactoe' | 'typing' | '2048';

export const GamesView: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameMode>('snake');

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-500 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide text-white border border-white/30">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>STUDENT BREAK & ARCADE HUB</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading">
              Arcade & Mini Games 🕹️
            </h1>
            <p className="text-white/80 text-sm sm:text-base max-w-xl">
              Istirahat sejenak dari tugas dan jadwal pelajaran! Asah refleks, memori, dan ketangkasan dengan koleksi game interaktif.
            </p>
          </div>

          {/* Quick Stat Badges */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-300" />
              <div>
                <div className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">Total Games</div>
                <div className="text-base font-bold">6 Mode Aktif</div>
              </div>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-3">
              <Zap className="w-5 h-5 text-emerald-300" />
              <div>
                <div className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">Status</div>
                <div className="text-base font-bold">Instan & Offline</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/3 w-40 h-40 rounded-full bg-pink-400/20 blur-xl pointer-events-none" />
      </div>

      {/* Game Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'snake', label: 'Neon Snake', icon: Gamepad2, color: 'hover:border-emerald-400 hover:text-emerald-600', active: 'bg-emerald-500 text-white shadow-emerald-500/25' },
          { id: '2048', label: '2048 Crunch', icon: Flame, color: 'hover:border-amber-400 hover:text-amber-600', active: 'bg-amber-500 text-white shadow-amber-500/25' },
          { id: 'memory', label: 'Memory Flip', icon: Brain, color: 'hover:border-purple-400 hover:text-purple-600', active: 'bg-purple-500 text-white shadow-purple-500/25' },
          { id: 'reaction', label: 'Reflex Speed', icon: Zap, color: 'hover:border-pink-400 hover:text-pink-600', active: 'bg-pink-500 text-white shadow-pink-500/25' },
          { id: 'tictactoe', label: 'Tic-Tac-Toe AI', icon: Award, color: 'hover:border-blue-400 hover:text-blue-600', active: 'bg-blue-500 text-white shadow-blue-500/25' },
          { id: 'typing', label: 'Speed Typing', icon: Keyboard, color: 'hover:border-teal-400 hover:text-teal-600', active: 'bg-teal-500 text-white shadow-teal-500/25' },
        ].map((g) => {
          const Icon = g.icon;
          const isCurrent = activeGame === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setActiveGame(g.id as GameMode)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 whitespace-nowrap shadow-sm ${
                isCurrent 
                  ? `${g.active} shadow-lg scale-102` 
                  : `bg-white text-slate-700 border border-slate-200/80 ${g.color}`
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{g.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Game Container */}
      <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
        {activeGame === 'snake' && <SnakeGame />}
        {activeGame === '2048' && <Game2048 />}
        {activeGame === 'memory' && <MemoryGame />}
        {activeGame === 'reaction' && <ReactionGame />}
        {activeGame === 'tictactoe' && <TicTacToeGame />}
        {activeGame === 'typing' && <TypingGame />}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * 1. NEON SNAKE GAME
 * ------------------------------------------------------------- */
const GRID_SIZE = 20;
const CELL_COUNT = 20;

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 5, y: 5 });
  const [dir, setDir] = useState<{ x: number; y: number }>({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snake_highscore') || '0', 10);
  });
  const [isRunning, setIsRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const spawnFood = useCallback((currentSnake: { x: number; y: number }[]) => {
    let newFood: { x: number; y: number };
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * CELL_COUNT),
        y: Math.floor(Math.random() * CELL_COUNT),
      };
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    const initSnake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    setSnake(initSnake);
    setDir({ x: 0, y: -1 });
    setScore(0);
    setIsGameOver(false);
    setFood(spawnFood(initSnake));
    setIsRunning(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code) && dir.y === 0) {
        setDir({ x: 0, y: -1 });
      } else if (['ArrowDown', 'KeyS'].includes(e.code) && dir.y === 0) {
        setDir({ x: 0, y: 1 });
      } else if (['ArrowLeft', 'KeyA'].includes(e.code) && dir.x === 0) {
        setDir({ x: -1, y: 0 });
      } else if (['ArrowRight', 'KeyD'].includes(e.code) && dir.x === 0) {
        setDir({ x: 1, y: 0 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir]);

  useEffect(() => {
    if (!isRunning || isGameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { x: prevSnake[0].x + dir.x, y: prevSnake[0].y + dir.y };

        // Check wall collision
        if (head.x < 0 || head.x >= CELL_COUNT || head.y < 0 || head.y >= CELL_COUNT) {
          setIsGameOver(true);
          setIsRunning(false);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
          setIsGameOver(true);
          setIsRunning(false);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snake_highscore', newScore.toString());
          }
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [isRunning, isGameOver, dir, food, score, highScore, spawnFood]);

  // Draw on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CELL_COUNT; i++) {
      ctx.beginPath();
      ctx.moveTo(i * GRID_SIZE, 0);
      ctx.lineTo(i * GRID_SIZE, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * GRID_SIZE);
      ctx.lineTo(canvas.width, i * GRID_SIZE);
      ctx.stroke();
    }

    // Draw food (Neon Red / Pink Apple)
    ctx.fillStyle = '#ec4899';
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw snake (Neon Emerald gradient)
    snake.forEach((segment, idx) => {
      ctx.fillStyle = idx === 0 ? '#10b981' : '#34d399';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = idx === 0 ? 8 : 4;
      ctx.beginPath();
      ctx.roundRect(
        segment.x * GRID_SIZE + 1.5,
        segment.y * GRID_SIZE + 1.5,
        GRID_SIZE - 3,
        GRID_SIZE - 3,
        idx === 0 ? 6 : 4
      );
      ctx.fill();
    });

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-[400px]">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-700 font-bold px-3.5 py-1.5 rounded-xl border border-emerald-200">
            Skor: {score}
          </div>
          <div className="bg-amber-50 text-amber-700 font-bold px-3.5 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Rekor: {highScore}</span>
          </div>
        </div>
        <button
          onClick={resetGame}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/20 active:scale-95"
        >
          {isRunning ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isGameOver ? 'Main Lagi' : isRunning ? 'Reset' : 'Mulai'}</span>
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800">
        <canvas
          ref={canvasRef}
          width={CELL_COUNT * GRID_SIZE}
          height={CELL_COUNT * GRID_SIZE}
          className="block"
        />

        {(!isRunning || isGameOver) && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center text-white p-6 text-center animate-fade-in">
            {isGameOver ? (
              <>
                <div className="text-3xl font-extrabold text-rose-400 mb-1">Game Over! 💥</div>
                <p className="text-sm text-slate-300 mb-4">Skor Akhir Kamu: <strong className="text-white text-lg">{score}</strong></p>
                <button
                  onClick={resetGame}
                  className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
                >
                  Coba Lagi
                </button>
              </>
            ) : (
              <>
                <Gamepad2 className="w-12 h-12 text-emerald-400 mb-3 animate-bounce" />
                <h3 className="text-xl font-bold mb-1">Neon Cyber Snake</h3>
                <p className="text-xs text-slate-300 mb-5 max-w-xs">Gunakan tombol Panah / WASD pada keyboard atau tombol kontrol di bawah.</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
                >
                  Mulai Game
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Touch/Mobile directional controls */}
      <div className="grid grid-cols-3 gap-2 w-44 sm:hidden">
        <div />
        <button
          onClick={() => dir.y === 0 && setDir({ x: 0, y: -1 })}
          className="p-3 bg-slate-100 active:bg-slate-200 rounded-xl font-bold text-lg flex items-center justify-center"
        >
          ▲
        </button>
        <div />
        <button
          onClick={() => dir.x === 0 && setDir({ x: -1, y: 0 })}
          className="p-3 bg-slate-100 active:bg-slate-200 rounded-xl font-bold text-lg flex items-center justify-center"
        >
          ◀
        </button>
        <button
          onClick={() => dir.y === 0 && setDir({ x: 0, y: 1 })}
          className="p-3 bg-slate-100 active:bg-slate-200 rounded-xl font-bold text-lg flex items-center justify-center"
        >
          ▼
        </button>
        <button
          onClick={() => dir.x === 0 && setDir({ x: 1, y: 0 })}
          className="p-3 bg-slate-100 active:bg-slate-200 rounded-xl font-bold text-lg flex items-center justify-center"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * 2. 2048 CRUNCH GAME
 * ------------------------------------------------------------- */
const Game2048: React.FC = () => {
  const [board, setBoard] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('2048_best') || '0', 10);
  });
  const [won, setWon] = useState(false);

  const addRandomTile = useCallback((grid: number[][]): number[][] => {
    const emptyCells: { r: number; c: number }[] = [];
    grid.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val === 0) emptyCells.push({ r, c });
      });
    });

    if (emptyCells.length === 0) return grid;
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = grid.map((row) => [...row]);
    newGrid[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  }, []);

  const initGame = useCallback(() => {
    let newGrid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setBoard(newGrid);
    setScore(0);
    setWon(false);
  }, [addRandomTile]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const slideAndCombine = (row: number[]): { newRow: number[]; addedScore: number } => {
    let filtered = row.filter((v) => v !== 0);
    let addedScore = 0;
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        addedScore += filtered[i];
        filtered.splice(i + 1, 1);
        if (filtered[i] === 2048) setWon(true);
      }
    }
    while (filtered.length < 4) {
      filtered.push(0);
    }
    return { newRow: filtered, addedScore };
  };

  const move = useCallback(
    (direction: 'left' | 'right' | 'up' | 'down') => {
      let currentBoard = board.map((r) => [...r]);
      let totalAdded = 0;
      let moved = false;

      if (direction === 'left') {
        for (let r = 0; r < 4; r++) {
          const { newRow, addedScore } = slideAndCombine(currentBoard[r]);
          totalAdded += addedScore;
          if (JSON.stringify(currentBoard[r]) !== JSON.stringify(newRow)) moved = true;
          currentBoard[r] = newRow;
        }
      } else if (direction === 'right') {
        for (let r = 0; r < 4; r++) {
          const reversed = [...currentBoard[r]].reverse();
          const { newRow, addedScore } = slideAndCombine(reversed);
          const finalRow = newRow.reverse();
          totalAdded += addedScore;
          if (JSON.stringify(currentBoard[r]) !== JSON.stringify(finalRow)) moved = true;
          currentBoard[r] = finalRow;
        }
      } else if (direction === 'up') {
        for (let c = 0; c < 4; c++) {
          const col = [currentBoard[0][c], currentBoard[1][c], currentBoard[2][c], currentBoard[3][c]];
          const { newRow, addedScore } = slideAndCombine(col);
          totalAdded += addedScore;
          for (let r = 0; r < 4; r++) {
            if (currentBoard[r][c] !== newRow[r]) moved = true;
            currentBoard[r][c] = newRow[r];
          }
        }
      } else if (direction === 'down') {
        for (let c = 0; c < 4; c++) {
          const col = [currentBoard[3][c], currentBoard[2][c], currentBoard[1][c], currentBoard[0][c]];
          const { newRow, addedScore } = slideAndCombine(col);
          totalAdded += addedScore;
          for (let r = 0; r < 4; r++) {
            if (currentBoard[3 - r][c] !== newRow[r]) moved = true;
            currentBoard[3 - r][c] = newRow[r];
          }
        }
      }

      if (moved) {
        const nextBoard = addRandomTile(currentBoard);
        setBoard(nextBoard);
        const newTotalScore = score + totalAdded;
        setScore(newTotalScore);
        if (newTotalScore > bestScore) {
          setBestScore(newTotalScore);
          localStorage.setItem('2048_best', newTotalScore.toString());
        }
      }
    },
    [board, score, bestScore, addRandomTile]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        move('left');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        move('right');
      } else if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        move('up');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        move('down');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  const getTileColor = (val: number): string => {
    switch (val) {
      case 2: return 'bg-amber-100 text-amber-900 border-amber-200';
      case 4: return 'bg-orange-100 text-orange-900 border-orange-200';
      case 8: return 'bg-orange-500 text-white font-bold shadow-orange-500/20';
      case 16: return 'bg-amber-500 text-white font-bold shadow-amber-500/20';
      case 32: return 'bg-rose-500 text-white font-bold shadow-rose-500/20';
      case 64: return 'bg-red-500 text-white font-bold shadow-red-500/20';
      case 128: return 'bg-yellow-400 text-slate-900 font-extrabold shadow-yellow-400/30';
      case 256: return 'bg-emerald-500 text-white font-extrabold shadow-emerald-500/30';
      case 512: return 'bg-cyan-500 text-white font-extrabold shadow-cyan-500/30';
      case 1024: return 'bg-indigo-600 text-white font-extrabold shadow-indigo-600/30';
      case 2048: return 'bg-purple-600 text-white font-extrabold shadow-purple-600/30 animate-pulse';
      default: return 'bg-slate-200/60 text-transparent';
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-[360px]">
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 text-amber-700 font-bold px-3 py-1.5 rounded-xl border border-amber-200 text-sm">
            Skor: {score}
          </div>
          <div className="bg-purple-50 text-purple-700 font-bold px-3 py-1.5 rounded-xl border border-purple-200 text-sm flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-purple-500" />
            <span>Rekor: {bestScore}</span>
          </div>
        </div>
        <button
          onClick={initGame}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-all shadow-md shadow-amber-500/20 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Mulai Ulang</span>
        </button>
      </div>

      <div className="p-3 bg-slate-800 rounded-2xl shadow-2xl border-4 border-slate-700">
        <div className="grid grid-cols-4 gap-2.5 w-[320px] h-[320px]">
          {board.map((row, r) =>
            row.map((val, c) => (
              <div
                key={`${r}-${c}`}
                className={`w-full h-full rounded-xl flex items-center justify-center font-bold text-xl sm:text-2xl transition-all duration-150 border ${getTileColor(
                  val
                )}`}
              >
                {val > 0 ? val : ''}
              </div>
            ))
          )}
        </div>
      </div>

      {won && (
        <div className="bg-purple-50 border border-purple-200 text-purple-800 px-4 py-2 rounded-2xl font-bold text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Selamat! Kamu mencapai 2048 Master! 🎉</span>
        </div>
      )}

      {/* Swipe buttons for touch */}
      <div className="grid grid-cols-3 gap-2 w-44 sm:hidden">
        <div />
        <button onClick={() => move('up')} className="p-2.5 bg-slate-100 rounded-xl font-bold">▲</button>
        <div />
        <button onClick={() => move('left')} className="p-2.5 bg-slate-100 rounded-xl font-bold">◀</button>
        <button onClick={() => move('down')} className="p-2.5 bg-slate-100 rounded-xl font-bold">▼</button>
        <button onClick={() => move('right')} className="p-2.5 bg-slate-100 rounded-xl font-bold">▶</button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * 3. MEMORY CARD MATCH
 * ------------------------------------------------------------- */
const CARD_EMOJIS = ['🍰', '🥐', '🥖', '💻', '🎧', '🎨', '📚', '⚡'];

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<{ id: number; emoji: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initGame = () => {
    const deck = [...CARD_EMOJIS, ...CARD_EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    const newFlipped = [...flippedIndices, index];
    setCards(newCards);
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (newCards[first].emoji === newCards[second].emoji) {
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards([...newCards]);
        setFlippedIndices([]);
        if (newCards.every((c) => c.isMatched)) {
          setIsWon(true);
        }
      } else {
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-[360px]">
        <div className="bg-purple-50 text-purple-700 font-bold px-3.5 py-1.5 rounded-xl border border-purple-200 text-sm">
          Langkah: {moves}
        </div>
        <button
          onClick={initGame}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all shadow-md shadow-purple-600/20 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Kocok Ulang</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 w-full max-w-[360px]">
        {cards.map((card, index) => {
          const isRevealed = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`h-20 sm:h-22 rounded-2xl text-2xl sm:text-3xl flex items-center justify-center font-bold transition-all duration-300 shadow-sm border ${
                card.isMatched
                  ? 'bg-emerald-50 border-emerald-300 opacity-90 scale-95'
                  : isRevealed
                  ? 'bg-white border-purple-400 rotate-y-180 shadow-md'
                  : 'bg-gradient-to-br from-purple-500 to-indigo-600 border-indigo-700 hover:scale-105 text-white'
              }`}
            >
              {isRevealed ? card.emoji : '❓'}
            </button>
          );
        })}
      </div>

      {isWon && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-2xl font-bold text-center animate-bounce shadow-md">
          🎉 Luar biasa! Kamu mencocokkan semua kartu dalam {moves} langkah!
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------
 * 4. REACTION SPEED TEST
 * ------------------------------------------------------------- */
const ReactionGame: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'result' | 'early'>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState(() => {
    return parseInt(localStorage.getItem('reaction_best') || '9999', 10);
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startTest = () => {
    setGameState('waiting');
    const delay = Math.floor(Math.random() * 3000) + 1500; // 1.5s - 4.5s
    timerRef.current = setTimeout(() => {
      setGameState('ready');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'idle' || gameState === 'result' || gameState === 'early') {
      startTest();
    } else if (gameState === 'waiting') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setGameState('early');
    } else if (gameState === 'ready') {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setGameState('result');
      if (time < bestTime) {
        setBestTime(time);
        localStorage.setItem('reaction_best', time.toString());
      }
    }
  };

  const getRank = (ms: number) => {
    if (ms < 180) return { title: '⚡ Flash God / Dewa Refleks', color: 'text-amber-500' };
    if (ms < 250) return { title: '🔥 Super Fast (Pro Gamer)', color: 'text-emerald-500' };
    if (ms < 350) return { title: '✨ Hebat & Responsif', color: 'text-blue-500' };
    return { title: '☕ Butuh Kopi & Istirahat', color: 'text-slate-500' };
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-[400px]">
        <div className="bg-pink-50 text-pink-700 font-bold px-3.5 py-1.5 rounded-xl border border-pink-200 text-sm flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-pink-500" />
          <span>Tercepat: {bestTime < 9999 ? `${bestTime} ms` : '-'}</span>
        </div>
        <div className="text-xs text-slate-500 font-medium">Uji Kecepatan Refleks</div>
      </div>

      <div
        onClick={handleClick}
        className={`w-full max-w-[420px] h-64 rounded-3xl flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none transition-all duration-150 shadow-xl ${
          gameState === 'idle'
            ? 'bg-slate-800 text-white hover:bg-slate-700'
            : gameState === 'waiting'
            ? 'bg-rose-500 text-white'
            : gameState === 'ready'
            ? 'bg-emerald-500 text-white animate-pulse'
            : gameState === 'early'
            ? 'bg-amber-500 text-white'
            : 'bg-indigo-600 text-white'
        }`}
      >
        {gameState === 'idle' && (
          <>
            <Zap className="w-12 h-12 text-yellow-300 mb-2 animate-bounce" />
            <h3 className="text-xl font-bold mb-1">Klik Untuk Mulai</h3>
            <p className="text-xs text-white/70">Tunggu layar berubah menjadi HIJAU, lalu klik secepat mungkin!</p>
          </>
        )}

        {gameState === 'waiting' && (
          <>
            <div className="w-10 h-10 rounded-full border-4 border-white/30 border-t-white animate-spin mb-3" />
            <h3 className="text-2xl font-black">Tunggu Warna Hijau...</h3>
            <p className="text-xs text-white/80 mt-1">Jangan klik dulu!</p>
          </>
        )}

        {gameState === 'ready' && (
          <>
            <Zap className="w-16 h-16 text-white mb-1 animate-ping" />
            <h3 className="text-4xl font-black tracking-wider">KLIK SEKARANG!</h3>
          </>
        )}

        {gameState === 'early' && (
          <>
            <div className="text-3xl mb-2">⚠️</div>
            <h3 className="text-xl font-bold">Terlalu Cepat!</h3>
            <p className="text-xs text-white/80 mt-1 mb-3">Kamu mengklik sebelum layar berwarna hijau.</p>
            <span className="text-xs underline font-semibold">Klik untuk coba lagi</span>
          </>
        )}

        {gameState === 'result' && reactionTime && (
          <>
            <div className="text-5xl font-black mb-1">{reactionTime} ms</div>
            <div className={`text-base font-bold bg-white/20 px-4 py-1.5 rounded-full mb-3 ${getRank(reactionTime).color}`}>
              {getRank(reactionTime).title}
            </div>
            <span className="text-xs text-white/80 underline font-semibold">Klik untuk tes lagi</span>
          </>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * 5. TIC TAC TOE AI DUEL
 * ------------------------------------------------------------- */
const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [score, setScore] = useState({ player: 0, ai: 0, tie: 0 });

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every((sq) => sq !== null)) return 'tie';
    return null;
  };

  const handleCellClick = (idx: number) => {
    if (board[idx] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[idx] = 'X';
    setBoard(newBoard);

    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
      if (win === 'X') setScore((s) => ({ ...s, player: s.player + 1 }));
      else if (win === 'tie') setScore((s) => ({ ...s, tie: s.tie + 1 }));
      return;
    }

    setIsPlayerTurn(false);

    // AI Turn (Smart heuristic)
    setTimeout(() => {
      const emptyIndices = newBoard
        .map((val, i) => (val === null ? i : null))
        .filter((val): val is number => val !== null);

      if (emptyIndices.length === 0) return;

      // Check if AI can win
      let chosenMove = -1;
      for (const i of emptyIndices) {
        const testBoard = [...newBoard];
        testBoard[i] = 'O';
        if (checkWinner(testBoard) === 'O') {
          chosenMove = i;
          break;
        }
      }

      // Block player win
      if (chosenMove === -1) {
        for (const i of emptyIndices) {
          const testBoard = [...newBoard];
          testBoard[i] = 'X';
          if (checkWinner(testBoard) === 'X') {
            chosenMove = i;
            break;
          }
        }
      }

      // Take center
      if (chosenMove === -1 && emptyIndices.includes(4)) {
        chosenMove = 4;
      }

      // Random move
      if (chosenMove === -1) {
        chosenMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      }

      newBoard[chosenMove] = 'O';
      setBoard(newBoard);
      const aiWin = checkWinner(newBoard);
      if (aiWin) {
        setWinner(aiWin);
        if (aiWin === 'O') setScore((s) => ({ ...s, ai: s.ai + 1 }));
        else if (aiWin === 'tie') setScore((s) => ({ ...s, tie: s.tie + 1 }));
      }
      setIsPlayerTurn(true);
    }, 400);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-[320px]">
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200">Kamu (X): {score.player}</span>
          <span className="bg-rose-50 text-rose-700 px-2.5 py-1 rounded-lg border border-rose-200">Bot (O): {score.ai}</span>
        </div>
        <button
          onClick={resetGame}
          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2.5 w-[300px] h-[300px] bg-slate-100 p-2.5 rounded-2xl shadow-inner border border-slate-200">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleCellClick(idx)}
            disabled={!!cell || !!winner || !isPlayerTurn}
            className={`w-full h-full rounded-xl bg-white text-3xl sm:text-4xl font-extrabold flex items-center justify-center transition-all shadow-xs ${
              cell === 'X'
                ? 'text-blue-600 bg-blue-50/50'
                : cell === 'O'
                ? 'text-rose-600 bg-rose-50/50'
                : 'hover:bg-slate-50'
            }`}
          >
            {cell}
          </button>
        ))}
      </div>

      {winner && (
        <div className="text-center font-bold text-sm bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          {winner === 'X' && <span className="text-blue-600">🎉 Kamu Menang! Hebat!</span>}
          {winner === 'O' && <span className="text-rose-600">🤖 AI Menang! Coba lagi!</span>}
          {winner === 'tie' && <span className="text-slate-600">🤝 Hasil Seri! Pertandingan sengit!</span>}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------
 * 6. SPEED TYPING FLASH
 * ------------------------------------------------------------- */
const TYPING_SENTENCES = [
  'Informatika dan tata boga mengajarkan presisi, logika, dan kreativitas rasa.',
  'Vibe coding bersama kecerdasan buatan mempercepat prototype web aplikasi.',
  'Manajemen jadwal pelajaran yang terstruktur membuat waktu belajar lebih efektif.',
  'Pastry Prancis membutuhkan teknik laminasi adonan mentega yang sempurna dan teliti.',
  'Kriptografi menjaga kerahasiaan data transaksi elektronik di dunia digital.',
];

const TypingGame: React.FC = () => {
  const [targetText, setTargetText] = useState(TYPING_SENTENCES[0]);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);

  const resetTest = () => {
    const nextSentence = TYPING_SENTENCES[Math.floor(Math.random() * TYPING_SENTENCES.length)];
    setTargetText(nextSentence);
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!startTime) setStartTime(Date.now());
    setUserInput(val);

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === targetText[i]) correctChars++;
    }
    const acc = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100;
    setAccuracy(acc);

    // Calculate WPM
    if (startTime) {
      const timeMinutes = (Date.now() - startTime) / 60000;
      const words = val.trim().split(/\s+/).length;
      if (timeMinutes > 0) {
        setWpm(Math.round(words / timeMinutes));
      }
    }

    if (val === targetText) {
      setIsFinished(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="bg-teal-50 text-teal-700 font-bold px-3 py-1.5 rounded-xl border border-teal-200 text-sm">
            WPM: {wpm}
          </div>
          <div className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1.5 rounded-xl border border-emerald-200 text-sm">
            Akurasi: {accuracy}%
          </div>
        </div>
        <button
          onClick={resetTest}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-all shadow-md shadow-teal-600/20 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Teks Baru</span>
        </button>
      </div>

      {/* Target Box */}
      <div className="w-full p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 text-base sm:text-lg font-mono leading-relaxed select-none">
        {targetText.split('').map((char, idx) => {
          let color = 'text-slate-400';
          if (idx < userInput.length) {
            color = userInput[idx] === char ? 'text-emerald-600 bg-emerald-100 rounded-xs' : 'text-rose-600 bg-rose-100 rounded-xs';
          }
          return (
            <span key={idx} className={color}>
              {char}
            </span>
          );
        })}
      </div>

      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        disabled={isFinished}
        placeholder="Ketik kalimat di atas secepat dan seakurat mungkin..."
        className="w-full px-4 py-3.5 rounded-xl border border-teal-300 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-slate-800 font-mono text-sm sm:text-base bg-white shadow-sm"
        autoFocus
      />

      {isFinished && (
        <div className="w-full p-4 bg-teal-50 border border-teal-200 rounded-2xl text-teal-800 text-center animate-fade-in font-bold">
          🎉 Selesai! Kecepatan Kamu: <span className="text-teal-900 text-lg">{wpm} WPM</span> dengan Akurasi <span className="text-teal-900 text-lg">{accuracy}%</span>!
        </div>
      )}
    </div>
  );
};
