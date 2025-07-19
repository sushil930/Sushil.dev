import React, { useRef, useEffect, useState, useCallback } from 'react';

interface TetrisPiece {
  shape: number[][];
  x: number;
  y: number;
  color: string;
}

const TETRIS_PIECES = [
  // I-piece
  { shape: [[1, 1, 1, 1]], color: '#00ffff' },
  // O-piece
  { shape: [[1, 1], [1, 1]], color: '#ffff00' },
  // T-piece
  { shape: [[0, 1, 0], [1, 1, 1]], color: '#800080' },
  // S-piece
  { shape: [[0, 1, 1], [1, 1, 0]], color: '#00ff00' },
  // Z-piece
  { shape: [[1, 1, 0], [0, 1, 1]], color: '#ff0000' },
  // J-piece
  { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000ff' },
  // L-piece
  { shape: [[0, 0, 1], [1, 1, 1]], color: '#ffa500' }
];

const BOARD_WIDTH = 30;
const BOARD_HEIGHT = 20;

export default function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number>();
  const [isActive, setIsActive] = useState(false);
  const [cellSize, setCellSize] = useState(22);
  const [gameState, setGameState] = useState({
    board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)),
    currentPiece: null as TetrisPiece | null,
    score: 0,
    level: 1,
    lines: 0,
    gameOver: false
  });

  const createNewPiece = useCallback((): TetrisPiece => {
    const pieceTemplate = TETRIS_PIECES[Math.floor(Math.random() * TETRIS_PIECES.length)];
    return {
      shape: pieceTemplate.shape,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(pieceTemplate.shape[0].length / 2),
      y: 0,
      color: pieceTemplate.color
    };
  }, []);

  const isValidMove = useCallback((piece: TetrisPiece, board: number[][]): boolean => {
    if (!piece || !piece.shape) {
      return false;
    }
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x;
          const newY = piece.y + y;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  const placePiece = useCallback((piece: TetrisPiece, board: number[][]): number[][] => {
    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = 1;
          }
        }
      }
    }
    
    return newBoard;
  }, []);

  const clearLines = useCallback((board: number[][]): { newBoard: number[][], linesCleared: number } => {
    const newBoard = board.filter(row => row.some(cell => cell === 0));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }
    
    return { newBoard, linesCleared };
  }, []);

  const rotatePiece = useCallback((piece: TetrisPiece): TetrisPiece => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    
    return { ...piece, shape: rotated };
  }, []);

  const movePiece = useCallback((direction: 'left' | 'right' | 'down' | 'rotate') => {
    if (!isActive || gameState.gameOver || !gameState.currentPiece) return;

    setGameState(prevState => {
      let newPiece = { ...prevState.currentPiece! };
      
      switch (direction) {
        case 'left':
          newPiece.x -= 1;
          break;
        case 'right':
          newPiece.x += 1;
          break;
        case 'down':
          newPiece.y += 1;
          break;
        case 'rotate':
          newPiece = rotatePiece(newPiece);
          break;
      }

      if (isValidMove(newPiece, prevState.board)) {
        return { ...prevState, currentPiece: newPiece };
      } else if (direction === 'down') {
        // Piece can't move down, place it
        const newBoard = placePiece(prevState.currentPiece!, prevState.board);
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
        
        const newPiece = createNewPiece();
        const gameOver = !isValidMove(newPiece, clearedBoard);
        
        return {
          ...prevState,
          board: clearedBoard,
          currentPiece: gameOver ? null : newPiece,
          score: prevState.score + (linesCleared * 100 * prevState.level),
          lines: prevState.lines + linesCleared,
          level: Math.floor((prevState.lines + linesCleared) / 10) + 1,
          gameOver
        };
      }
      
      return prevState;
    });
  }, [isActive, gameState.gameOver, gameState.currentPiece, isValidMove, placePiece, clearLines, createNewPiece, rotatePiece]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, BOARD_HEIGHT * cellSize);
      ctx.stroke();
    }
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(BOARD_WIDTH * cellSize, y * cellSize);
      ctx.stroke();
    }

    // Draw placed pieces
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (gameState.board[y][x]) {
          ctx.fillStyle = '#00ff41';
          ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
        }
      }
    }

    // Draw current piece
    if (gameState.currentPiece) {
      ctx.fillStyle = gameState.currentPiece.color;
      for (let y = 0; y < gameState.currentPiece.shape.length; y++) {
        for (let x = 0; x < gameState.currentPiece.shape[y].length; x++) {
          if (gameState.currentPiece.shape[y][x]) {
            const drawX = (gameState.currentPiece.x + x) * cellSize + 1;
            const drawY = (gameState.currentPiece.y + y) * cellSize + 1;
            ctx.fillRect(drawX, drawY, cellSize - 2, cellSize - 2);
          }
        }
      }
    }

    // Draw game over or pause message
    if (gameState.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ff0000';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
      ctx.fillText('Hover to restart', canvas.width / 2, canvas.height / 2 + 20);
    } else if (!isActive) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff41';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('TETRIS', canvas.width / 2, canvas.height / 2 - 10);
      ctx.fillText('Hover to play', canvas.width / 2, canvas.height / 2 + 10);
    }
  }, [gameState, isActive, cellSize]);

  const gameLoop = useCallback(() => {
    draw();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [draw]);

  const resetGame = useCallback(() => {
    setGameState({
      board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)),
      currentPiece: createNewPiece(),
      score: 0,
      level: 1,
      lines: 0,
      gameOver: false
    });
  }, [createNewPiece]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isActive) return;
    
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        movePiece('left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        movePiece('right');
        break;
      case 'ArrowDown':
        event.preventDefault();
        movePiece('down');
        break;
      case 'ArrowUp':
      case ' ':
        event.preventDefault();
        movePiece('rotate');
        break;
    }
  }, [isActive, movePiece]);

  useEffect(() => {
    if (isActive && !gameState.currentPiece && !gameState.gameOver) {
      setGameState(prev => ({ ...prev, currentPiece: createNewPiece() }));
    }
  }, [isActive, gameState.currentPiece, gameState.gameOver, createNewPiece]);

  useEffect(() => {
    if (isActive) {
      window.addEventListener('keydown', handleKeyPress);
      const interval = setInterval(() => {
        if (!gameState.gameOver) {
          movePiece('down');
        }
      }, 1000);

      return () => {
        window.removeEventListener('keydown', handleKeyPress);
        clearInterval(interval);
      };
    }
  }, [isActive, handleKeyPress, movePiece, gameState.gameOver, gameState.level]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newCellSize = Math.max(8, Math.floor(containerWidth / BOARD_WIDTH));
        setCellSize(newCellSize);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop]);

  const handleMouseEnter = () => {
    setIsActive(true);
    if (gameState.gameOver) {
      resetGame();
    }
  };

  const handleMouseLeave = () => {
    setIsActive(false);
  };

  return (
    <div ref={containerRef} className="relative ml-auto w-full">
      <canvas
        ref={canvasRef}
        width={BOARD_WIDTH * cellSize}
        height={BOARD_HEIGHT * cellSize}
        className="border-4 border-[var(--neon-green)] rounded-lg shadow-lg cursor-pointer pixel-perfect"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ imageRendering: 'pixelated' }}
      />
      {/* Game info overlay */}
      <div className="absolute top-2 left-2 text-[var(--neon-green)] font-pixel text-xs">
        <div>SCORE: {gameState.score}</div>
        <div>LEVEL: {gameState.level}</div>
        <div>LINES: {gameState.lines}</div>
      </div>
      
      {/* Controls hint */}
      {isActive && !gameState.gameOver && (
        <div className="absolute bottom-2 right-2 text-[var(--light-grey)] font-pixel text-xs opacity-70">
          <div>↑ ROTATE</div>
          <div>← → MOVE</div>
          <div>↓ DROP</div>
        </div>
      )}
    </div>
  );
}
