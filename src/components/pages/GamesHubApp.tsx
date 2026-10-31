import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Award, Flame, Gamepad2, RotateCcw, Volume2, VolumeX, Zap } from 'lucide-react';

type GameType = '2048' | 'snake' | 'dino' | 'invaders';

export const GamesHubApp: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>('2048');

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 flex flex-col">
      {/* Games Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Nova Web Games Hub</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono">
                Arcade 60FPS
              </span>
            </h1>
            <p className="text-xs text-slate-400">Play directly inside the browser tabs with persistent high scores</p>
          </div>
        </div>

        {/* Game Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveGame('2048')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeGame === '2048' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            2048 Tiles
          </button>
          <button
            onClick={() => setActiveGame('snake')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeGame === 'snake' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Retro Snake
          </button>
          <button
            onClick={() => setActiveGame('dino')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeGame === 'dino' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dino Runner
          </button>
          <button
            onClick={() => setActiveGame('invaders')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeGame === 'invaders' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Space Blaster
          </button>
        </div>
      </div>

      {/* Game Canvas Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        {activeGame === '2048' && <Game2048 />}
        {activeGame === 'snake' && <GameSnake />}
        {activeGame === 'dino' && <GameDino />}
        {activeGame === 'invaders' && <GameSpaceInvaders />}
      </div>
    </div>
  );
};

// ==========================================
// GAME 1: 2048
// ==========================================
const Game2048: React.FC = () => {
  const [board, setBoard] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 2, 0, 0],
    [0, 0, 4, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem('nova_game_2048_best') || '1420', 10);
  });
  const [gameOver, setGameOver] = useState(false);

  const spawnRandomTile = (grid: number[][]) => {
    const emptyCells: [number, number][] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] === 0) emptyCells.push([r, c]);
      }
    }
    if (emptyCells.length === 0) return grid;
    const [randR, randC] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = grid.map((row) => [...row]);
    newGrid[randR][randC] = Math.random() < 0.85 ? 2 : 4;
    return newGrid;
  };

  const restart = () => {
    let fresh = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    fresh = spawnRandomTile(fresh);
    fresh = spawnRandomTile(fresh);
    setBoard(fresh);
    setScore(0);
    setGameOver(false);
  };

  const slideRow = (row: number[]) => {
    const nonZero = row.filter((n) => n !== 0);
    const result: number[] = [];
    let gained = 0;
    for (let i = 0; i < nonZero.length; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        const merged = nonZero[i] * 2;
        result.push(merged);
        gained += merged;
        i++;
      } else {
        result.push(nonZero[i]);
      }
    }
    while (result.length < 4) result.push(0);
    return { newRow: result, gained };
  };

  const moveLeft = useCallback(() => {
    let totalGained = 0;
    let changed = false;
    const newBoard = board.map((row) => {
      const { newRow, gained } = slideRow(row);
      totalGained += gained;
      if (newRow.some((val, idx) => val !== row[idx])) changed = true;
      return newRow;
    });

    if (changed) {
      const withSpawn = spawnRandomTile(newBoard);
      setBoard(withSpawn);
      const newScore = score + totalGained;
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('nova_game_2048_best', newScore.toString());
      }
    }
  }, [board, score, bestScore]);

  const moveRight = useCallback(() => {
    let totalGained = 0;
    let changed = false;
    const newBoard = board.map((row) => {
      const reversed = [...row].reverse();
      const { newRow, gained } = slideRow(reversed);
      totalGained += gained;
      const unreversed = newRow.reverse();
      if (unreversed.some((val, idx) => val !== row[idx])) changed = true;
      return unreversed;
    });

    if (changed) {
      const withSpawn = spawnRandomTile(newBoard);
      setBoard(withSpawn);
      const newScore = score + totalGained;
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('nova_game_2048_best', newScore.toString());
      }
    }
  }, [board, score, bestScore]);

  const moveUp = useCallback(() => {
    let totalGained = 0;
    let changed = false;
    const cols: number[][] = [[], [], [], []];
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 4; r++) {
        cols[c].push(board[r][c]);
      }
      const { newRow, gained } = slideRow(cols[c]);
      totalGained += gained;
      cols[c] = newRow;
    }

    const newBoard: number[][] = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        newBoard[r][c] = cols[c][r];
        if (newBoard[r][c] !== board[r][c]) changed = true;
      }
    }

    if (changed) {
      const withSpawn = spawnRandomTile(newBoard);
      setBoard(withSpawn);
      const newScore = score + totalGained;
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('nova_game_2048_best', newScore.toString());
      }
    }
  }, [board, score, bestScore]);

  const moveDown = useCallback(() => {
    let totalGained = 0;
    let changed = false;
    const cols: number[][] = [[], [], [], []];
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 4; r++) {
        cols[c].push(board[r][c]);
      }
      const reversed = cols[c].reverse();
      const { newRow, gained } = slideRow(reversed);
      totalGained += gained;
      cols[c] = newRow.reverse();
    }

    const newBoard: number[][] = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        newBoard[r][c] = cols[c][r];
        if (newBoard[r][c] !== board[r][c]) changed = true;
      }
    }

    if (changed) {
      const withSpawn = spawnRandomTile(newBoard);
      setBoard(withSpawn);
      const newScore = score + totalGained;
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('nova_game_2048_best', newScore.toString());
      }
    }
  }, [board, score, bestScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveLeft();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveRight();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        moveUp();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveDown();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveLeft, moveRight, moveUp, moveDown]);

  const getTileColor = (val: number) => {
    switch (val) {
      case 2:
        return 'bg-amber-100 text-slate-800';
      case 4:
        return 'bg-amber-200 text-slate-800';
      case 8:
        return 'bg-orange-400 text-white shadow-md';
      case 16:
        return 'bg-orange-500 text-white shadow-md';
      case 32:
        return 'bg-rose-500 text-white shadow-lg';
      case 64:
        return 'bg-red-600 text-white shadow-lg';
      case 128:
        return 'bg-yellow-400 text-slate-900 shadow-xl font-bold';
      case 256:
        return 'bg-yellow-300 text-slate-900 shadow-xl font-bold';
      case 512:
        return 'bg-yellow-200 text-slate-900 shadow-xl font-bold';
      case 1024:
        return 'bg-indigo-500 text-white shadow-xl font-bold';
      case 2048:
        return 'bg-purple-600 text-white shadow-2xl font-black animate-pulse';
      default:
        return 'bg-slate-800/60 text-transparent';
    }
  };

  return (
    <div className="flex flex-col items-center max-w-sm w-full space-y-4">
      {/* Score Header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-2xl font-extrabold text-amber-400">2048</h2>
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Score</span>
            <span className="text-sm font-bold text-white font-mono">{score}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Best</span>
            <span className="text-sm font-bold text-amber-400 font-mono">{bestScore}</span>
          </div>
          <button
            onClick={restart}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition"
            title="Restart Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="w-full aspect-square bg-slate-900 border border-slate-800 rounded-2xl p-3 grid grid-cols-4 gap-2.5 shadow-2xl">
        {board.flat().map((val, idx) => (
          <div
            key={idx}
            className={`w-full h-full rounded-xl flex items-center justify-center font-bold text-lg select-none transition-all duration-150 ${getTileColor(
              val
            )}`}
          >
            {val !== 0 && val}
          </div>
        ))}
      </div>

      {/* Touch / Onscreen Arrow Controls */}
      <div className="flex flex-col items-center gap-1.5 pt-1">
        <button
          onClick={moveUp}
          className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-200 shadow transition"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={moveLeft}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-200 shadow transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={moveDown}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-200 shadow transition"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            onClick={moveRight}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-200 shadow transition"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <span className="text-[11px] text-slate-500 font-mono mt-1">Use arrow keys on desktop or buttons</span>
      </div>
    </div>
  );
};

// ==========================================
// GAME 2: RETRO SNAKE
// ==========================================
const GameSnake: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('nova_game_snake_best') || '24', 10);
  });
  const [isAlive, setIsAlive] = useState(true);

  const gameState = useRef({
    snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
    food: { x: 15, y: 15 },
    dir: { x: 0, y: -1 },
    nextDir: { x: 0, y: -1 },
  });

  const resetGame = () => {
    gameState.current = {
      snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
      food: { x: 15, y: 15 },
      dir: { x: 0, y: -1 },
      nextDir: { x: 0, y: -1 },
    };
    setScore(0);
    setIsAlive(true);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const { dir } = gameState.current;
      if (e.key === 'ArrowUp' && dir.y === 0) gameState.current.nextDir = { x: 0, y: -1 };
      else if (e.key === 'ArrowDown' && dir.y === 0) gameState.current.nextDir = { x: 0, y: 1 };
      else if (e.key === 'ArrowLeft' && dir.x === 0) gameState.current.nextDir = { x: -1, y: 0 };
      else if (e.key === 'ArrowRight' && dir.x === 0) gameState.current.nextDir = { x: 1, y: 0 };
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const interval = setInterval(() => {
      if (!isAlive) return;

      const state = gameState.current;
      state.dir = state.nextDir;

      const head = { x: state.snake[0].x + state.dir.x, y: state.snake[0].y + state.dir.y };

      // Wall collision
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        setIsAlive(false);
        return;
      }

      // Self collision
      if (state.snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setIsAlive(false);
        return;
      }

      state.snake.unshift(head);

      // Check food
      if (head.x === state.food.x && head.y === state.food.y) {
        setScore((prev) => {
          const next = prev + 1;
          if (next > highScore) {
            setHighScore(next);
            localStorage.setItem('nova_game_snake_best', next.toString());
          }
          return next;
        });
        // spawn new food
        state.food = {
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20),
        };
      } else {
        state.snake.pop();
      }

      // Render
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 400, 400);

      // Draw grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 20; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 20, 0);
        ctx.lineTo(i * 20, 400);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * 20);
        ctx.lineTo(400, i * 20);
        ctx.stroke();
      }

      // Draw Food
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(state.food.x * 20 + 10, state.food.y * 20 + 10, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw Snake
      state.snake.forEach((s, idx) => {
        ctx.fillStyle = idx === 0 ? '#10b981' : '#34d399';
        ctx.fillRect(s.x * 20 + 2, s.y * 20 + 2, 16, 16);
      });
    }, 110);

    return () => clearInterval(interval);
  }, [isAlive, highScore]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center justify-between w-full max-w-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-emerald-400">Snake</span>
          <span className="text-xs text-slate-400">Score: <strong className="text-white">{score}</strong></span>
          <span className="text-xs text-slate-400">Hi: <strong className="text-amber-400">{highScore}</strong></span>
        </div>
        <button
          onClick={resetGame}
          className="px-3 py-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs rounded-lg text-slate-200 transition"
        >
          Reset
        </button>
      </div>

      <div className="relative border-2 border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} width={400} height={400} className="bg-slate-950 block max-w-full" />
        {!isAlive && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center space-y-2">
            <span className="text-rose-400 text-lg font-bold">GAME OVER</span>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => (gameState.current.nextDir = { x: -1, y: 0 })}
          className="p-2 bg-slate-900 rounded border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => (gameState.current.nextDir = { x: 0, y: -1 })}
          className="p-2 bg-slate-900 rounded border border-slate-800"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <button
          onClick={() => (gameState.current.nextDir = { x: 0, y: 1 })}
          className="p-2 bg-slate-900 rounded border border-slate-800"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
        <button
          onClick={() => (gameState.current.nextDir = { x: 1, y: 0 })}
          className="p-2 bg-slate-900 rounded border border-slate-800"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ==========================================
// GAME 3: CHROME DINO RUNNER
// ==========================================
const GameDino: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('nova_dino_best') || '280', 10));

  const dinoRef = useRef({
    y: 150,
    vy: 0,
    isJumping: false,
    obstacles: [{ x: 500, width: 20, height: 35 }],
  });

  const jump = useCallback(() => {
    if (!isPlaying) {
      setIsPlaying(true);
      setScore(0);
      dinoRef.current.obstacles = [{ x: 500, width: 20, height: 35 }];
      return;
    }
    if (!dinoRef.current.isJumping) {
      dinoRef.current.vy = -12;
      dinoRef.current.isJumping = true;
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [jump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const loop = () => {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, 500, 200);

      // Ground
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 175);
      ctx.lineTo(500, 175);
      ctx.stroke();

      if (isPlaying) {
        const d = dinoRef.current;
        // Gravity
        d.y += d.vy;
        d.vy += 0.7;
        if (d.y >= 145) {
          d.y = 145;
          d.vy = 0;
          d.isJumping = false;
        }

        // Move obstacles
        d.obstacles.forEach((obs) => {
          obs.x -= 6;
        });

        // Spawn new obstacle
        if (d.obstacles[d.obstacles.length - 1].x < 280) {
          d.obstacles.push({
            x: 520 + Math.random() * 150,
            width: 18 + Math.random() * 10,
            height: 30 + Math.random() * 15,
          });
        }

        // Remove offscreen
        if (d.obstacles[0].x < -30) {
          d.obstacles.shift();
          setScore((s) => {
            const next = s + 10;
            if (next > highScore) {
              setHighScore(next);
              localStorage.setItem('nova_dino_best', next.toString());
            }
            return next;
          });
        }

        // Collision check
        const dinoBox = { x: 50, y: d.y, w: 25, h: 30 };
        for (const obs of d.obstacles) {
          if (
            dinoBox.x < obs.x + obs.width &&
            dinoBox.x + dinoBox.w > obs.x &&
            dinoBox.y + dinoBox.h > 175 - obs.height
          ) {
            setIsPlaying(false);
          }
        }
      }

      // Draw Dino (Pixel style)
      ctx.fillStyle = '#38bdf8';
      const dy = dinoRef.current.y;
      ctx.fillRect(50, dy, 24, 28);
      // Eye
      ctx.fillStyle = '#090d16';
      ctx.fillRect(66, dy + 4, 4, 4);

      // Draw Obstacles (Cacti)
      ctx.fillStyle = '#34d399';
      dinoRef.current.obstacles.forEach((obs) => {
        ctx.fillRect(obs.x, 175 - obs.height, obs.width, obs.height);
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, highScore]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center justify-between w-full max-w-lg">
        <span className="text-sm font-bold text-sky-400">Offline Dino Runner</span>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span>Score: <strong className="text-white">{score}</strong></span>
          <span>HI: <strong className="text-amber-400">{highScore}</strong></span>
        </div>
      </div>

      <div
        onClick={jump}
        className="relative border-2 border-slate-800 rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
      >
        <canvas ref={canvasRef} width={500} height={200} className="bg-slate-950 block max-w-full" />
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center space-y-2">
            <span className="text-white font-bold text-sm">PRESS SPACE OR TAP TO JUMP</span>
            <span className="text-slate-400 text-xs">Jump over emerald cacti</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// GAME 4: RETRO SPACE INVADERS / BLASTER
// ==========================================
const GameSpaceInvaders: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(true);

  const state = useRef({
    playerX: 200,
    bullets: [] as { x: number; y: number }[],
    aliens: [] as { x: number; y: number; alive: boolean }[],
    alienDir: 1,
  });

  const initAliens = () => {
    const list = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        list.push({ x: 30 + c * 44, y: 30 + r * 30, alive: true });
      }
    }
    state.current.aliens = list;
    state.current.bullets = [];
    state.current.playerX = 200;
  };

  useEffect(() => {
    initAliens();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') state.current.playerX = Math.max(20, state.current.playerX - 18);
      if (e.key === 'ArrowRight') state.current.playerX = Math.min(380, state.current.playerX + 18);
      if (e.key === ' ' || e.key === 'ArrowUp') {
        state.current.bullets.push({ x: state.current.playerX, y: 350 });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let anim: number;

    const loop = () => {
      ctx.fillStyle = '#060814';
      ctx.fillRect(0, 0, 400, 400);

      const s = state.current;

      // Update bullets
      s.bullets.forEach((b) => (b.y -= 7));
      s.bullets = s.bullets.filter((b) => b.y > 0);

      // Move aliens
      let changeDir = false;
      s.aliens.forEach((a) => {
        if (!a.alive) return;
        a.x += s.alienDir * 0.8;
        if (a.x > 370 || a.x < 15) changeDir = true;
      });
      if (changeDir) {
        s.alienDir *= -1;
        s.aliens.forEach((a) => (a.y += 8));
      }

      // Check Bullet-Alien Collisions
      s.bullets.forEach((b) => {
        s.aliens.forEach((a) => {
          if (a.alive && Math.abs(b.x - a.x) < 16 && Math.abs(b.y - a.y) < 14) {
            a.alive = false;
            b.y = -100;
            setScore((sc) => sc + 50);
          }
        });
      });

      // Draw Player
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.moveTo(s.playerX, 360);
      ctx.lineTo(s.playerX - 14, 385);
      ctx.lineTo(s.playerX + 14, 385);
      ctx.closePath();
      ctx.fill();

      // Draw Bullets
      ctx.fillStyle = '#38bdf8';
      s.bullets.forEach((b) => {
        ctx.fillRect(b.x - 2, b.y, 4, 10);
      });

      // Draw Aliens
      s.aliens.forEach((a) => {
        if (!a.alive) return;
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(a.x - 10, a.y - 8, 20, 16);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(a.x - 5, a.y - 4, 3, 3);
        ctx.fillRect(a.x + 2, a.y - 4, 3, 3);
      });

      anim = requestAnimationFrame(loop);
    };

    anim = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(anim);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center justify-between w-full max-w-sm">
        <span className="text-sm font-bold text-purple-400">Space Invaders</span>
        <div className="text-xs font-mono text-slate-300">
          Score: <strong className="text-white">{score}</strong>
        </div>
      </div>

      <div className="relative border-2 border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} width={400} height={400} className="bg-slate-950 block max-w-full" />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => (state.current.playerX = Math.max(20, state.current.playerX - 25))}
          className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs"
        >
          Left
        </button>
        <button
          onClick={() => state.current.bullets.push({ x: state.current.playerX, y: 350 })}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-500 font-bold text-white rounded-lg text-xs"
        >
          FIRE
        </button>
        <button
          onClick={() => (state.current.playerX = Math.min(380, state.current.playerX + 25))}
          className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs"
        >
          Right
        </button>
      </div>
    </div>
  );
};
