import { useEffect, useState, useRef } from 'react';

interface SnakeSegment {
  x: number;
  y: number;
}

interface Coin {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

export default function MouseFollowingSnake() {
  const [snake, setSnake] = useState<SnakeSegment[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [coins, setCoins] = useState<Coin[]>([]);
  const [score, setScore] = useState(0);
  const coinIdRef = useRef(0);

  const segmentSize = 12; // Increased height
  const snakeLength = 25; // Longer snake
  const speed = 3;
  const coinSize = 16;

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Spawn coins randomly
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const spawnCoin = () => {
      const margin = 50;
      const newCoin: Coin = {
        id: coinIdRef.current++,
        x: margin + Math.random() * (dimensions.width - 2 * margin),
        y: margin + Math.random() * (dimensions.height - 2 * margin),
        collected: false
      };
      
      setCoins(prev => [...prev, newCoin]);
    };

    // Initial coins
    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnCoin(), i * 1000);
    }

    // Spawn new coins every 3-5 seconds
    const interval = setInterval(() => {
      if (Math.random() < 0.7) { // 70% chance to spawn
        spawnCoin();
      }
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [dimensions]);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    // Initialize snake in the center
    const initialSnake: SnakeSegment[] = [];
    const startX = dimensions.width / 2;
    const startY = dimensions.height / 2;

    for (let i = 0; i < snakeLength; i++) {
      initialSnake.push({
        x: startX - i * segmentSize,
        y: startY
      });
    }

    setSnake(initialSnake);
    
    // Set initial mouse position to center
    setMousePosition({ x: startX, y: startY });
  }, [dimensions]);

  useEffect(() => {
    if (snake.length === 0 || dimensions.width === 0) return;

    const moveSnake = () => {
      setSnake(currentSnake => {
        if (currentSnake.length === 0) return currentSnake;

        const newSnake = [...currentSnake];
        const head = newSnake[0];
        
        // Calculate direction towards mouse cursor
        const dx = mousePosition.x - head.x;
        const dy = mousePosition.y - head.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let newX = head.x;
        let newY = head.y;
        
        if (distance > 5) { // Only move if mouse is far enough away
          // Normalize direction vector
          const normalizedX = dx / distance;
          const normalizedY = dy / distance;
          
          // Calculate new position based on mouse direction
          newX = head.x + normalizedX * speed;
          newY = head.y + normalizedY * speed;
        }

        // Keep snake within screen boundaries
        newX = Math.max(segmentSize, Math.min(dimensions.width - segmentSize, newX));
        newY = Math.max(segmentSize, Math.min(dimensions.height - segmentSize, newY));

        // Add new head
        newSnake.unshift({ x: newX, y: newY });
        
        // Remove tail to maintain length
        if (newSnake.length > snakeLength) {
          newSnake.pop();
        }

        // Check for coin collisions
        const snakeHead = newSnake[0];
        setCoins(prevCoins => {
          const newCoins = [...prevCoins];
          let scoreIncrease = 0;
          
          for (let i = newCoins.length - 1; i >= 0; i--) {
            const coin = newCoins[i];
            if (!coin.collected) {
              const distance = Math.sqrt(
                Math.pow(snakeHead.x - coin.x, 2) + Math.pow(snakeHead.y - coin.y, 2)
              );
              
              if (distance < (segmentSize + coinSize) / 2) {
                newCoins.splice(i, 1); // Remove collected coin
                scoreIncrease += 10;
              }
            }
          }
          
          if (scoreIncrease > 0) {
            setScore(prev => prev + scoreIncrease);
          }
          
          return newCoins;
        });

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 60); // Smoother movement
    return () => clearInterval(interval);
  }, [mousePosition, dimensions]);

  const getSegmentColor = (index: number) => {
    if (index === 0) return '#00FF41'; // Head - neon green
    if (index < 4) return '#FF6B35'; // Neck - orange
    if (index < 8) return '#FF0080'; // Upper body - hot pink
    if (index < 15) return '#EAEAEA'; // Middle body - light grey
    return '#16213E'; // Tail - darker blue
  };

  const getSegmentOpacity = (index: number) => {
    return Math.max(0.6, 1 - (index / snakeLength) * 0.4);
  };

  const getSegmentGlow = (index: number) => {
    if (index === 0) return '8px'; // Head glows more
    if (index < 4) return '6px';
    if (index < 8) return '4px';
    return '2px';
  };

  return (
    <>
      {/* Score Box */}
      <div className="fixed top-4 right-4 z-50 bg-[var(--dark-navy)] border-2 border-[var(--neon-green)] p-4 font-retro text-sm">
        <div className="text-[var(--neon-green)] text-xs mb-1">SCORE</div>
        <div className="text-[var(--pixel-orange)] text-lg font-bold">{score.toString().padStart(4, '0')}</div>
        <div className="text-[var(--light-grey)] text-xs mt-1">COINS: {coins.length}</div>
      </div>

      {/* Game Area */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        {/* Render Coins */}
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="absolute"
            style={{
              left: `${coin.x - coinSize/2}px`,
              top: `${coin.y - coinSize/2}px`,
              width: `${coinSize}px`,
              height: `${coinSize}px`,
              backgroundColor: '#FFD700',
              border: '2px solid #FFA500',
              borderRadius: '50%',
              boxShadow: '0 0 10px #FFD700, inset 0 0 5px #FFA500',
              animation: 'pulse 1.5s ease-in-out infinite',
              zIndex: 40,
              imageRendering: 'pixelated'
            }}
          />
        ))}
        
        {/* Render Snake */}
        {snake.map((segment, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${segment.x - segmentSize/2}px`,
            top: `${segment.y - segmentSize/2}px`,
            width: `${segmentSize}px`,
            height: `${segmentSize}px`,
            backgroundColor: getSegmentColor(index),
            opacity: getSegmentOpacity(index),
            borderRadius: index === 0 ? '4px' : '2px',
            boxShadow: `0 0 ${getSegmentGlow(index)} ${getSegmentColor(index)}`,
            filter: index === 0 ? 'blur(0.3px)' : 'blur(0.5px)',
            imageRendering: 'pixelated',
            border: index === 0 ? '2px solid #00FF41' : index < 4 ? '1px solid #FF6B35' : 'none',
            transform: index === 0 ? 'scale(1.3)' : `scale(${1 - index * 0.015})`,
            zIndex: snakeLength - index,
            transition: 'all 0.06s linear'
          }}
        />
      ))}
      
      {/* Snake eyes */}
      {snake.length > 0 && (
        <>
          <div
            className="absolute"
            style={{
              left: `${snake[0].x - 2}px`,
              top: `${snake[0].y - 3}px`,
              width: '3px',
              height: '3px',
              backgroundColor: '#1A1A2E',
              borderRadius: '50%',
              zIndex: 100
            }}
          />
          <div
            className="absolute"
            style={{
              left: `${snake[0].x + 2}px`,
              top: `${snake[0].y - 3}px`,
              width: '3px',
              height: '3px',
              backgroundColor: '#1A1A2E',
              borderRadius: '50%',
              zIndex: 100
            }}
          />
        </>
      )}

      {/* Mouse cursor indicator */}
      <div
        className="absolute"
        style={{
          left: `${mousePosition.x - 3}px`,
          top: `${mousePosition.y - 3}px`,
          width: '6px',
          height: '6px',
          backgroundColor: '#00FF41',
          borderRadius: '50%',
          boxShadow: '0 0 10px #00FF41',
          opacity: 0.7,
          zIndex: 50,
          animation: 'pulse 1s ease-in-out infinite'
        }}
      />
      </div>
    </>
  );
}