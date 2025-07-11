import { useEffect, useState, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SnakeSegment {
  x: number;
  y: number;
}

interface Coin {
  id: number;
  x: number;
  y: number;
}

export default function SnakeGame() {
  const isMobile = useIsMobile();
  const [snake, setSnake] = useState<SnakeSegment[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [coins, setCoins] = useState<Coin[]>([]);
  const [score, setScore] = useState(0);
  const coinIdRef = useRef(0);
  const coinsRef = useRef<Coin[]>([]);

  const segmentSize = 12;
  const snakeLength = 25;
  const speed = 6.5;
  const coinSize = 16;

  // Initialize dimensions
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

  // Initialize snake
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

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
    setMousePosition({ x: startX, y: startY });
  }, [dimensions]);

  // Spawn coins (maintain exactly 5 coins) - only on desktop
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0 || isMobile) return;

    const spawnCoin = () => {
      const margin = 50;
      const newCoin: Coin = {
        id: coinIdRef.current++,
        x: margin + Math.random() * (dimensions.width - 2 * margin),
        y: margin + Math.random() * (dimensions.height - 2 * margin)
      };
      
      setCoins(prev => {
        if (prev.length < 5) {
          const newCoins = [...prev, newCoin];
          coinsRef.current = newCoins;
          return newCoins;
        }
        return prev;
      });
    };

    // Initial coins - spawn 5 coins
    for (let i = 0; i < 5; i++) {
      setTimeout(() => spawnCoin(), i * 200);
    }

    // Check periodically if we need more coins
    const interval = setInterval(() => {
      setCoins(prev => {
        if (prev.length < 5) {
          const margin = 50;
          const newCoin: Coin = {
            id: coinIdRef.current++,
            x: margin + Math.random() * (dimensions.width - 2 * margin),
            y: margin + Math.random() * (dimensions.height - 2 * margin)
          };
          const newCoins = [...prev, newCoin];
          coinsRef.current = newCoins;
          return newCoins;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [dimensions, isMobile]);

  // Snake movement with integrated collision detection
  useEffect(() => {
    if (snake.length === 0 || dimensions.width === 0) return;

    const moveSnake = () => {
      setSnake(currentSnake => {
        if (currentSnake.length === 0) return currentSnake;

        const newSnake = [...currentSnake];
        const head = newSnake[0];
        
        // Calculate direction towards mouse
        const dx = mousePosition.x - head.x;
        const dy = mousePosition.y - head.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let newX = head.x;
        let newY = head.y;
        
        if (distance > 5) {
          const normalizedX = dx / distance;
          const normalizedY = dy / distance;
          
          newX = head.x + normalizedX * speed;
          newY = head.y + normalizedY * speed;
        }

        // Keep within boundaries
        newX = Math.max(segmentSize, Math.min(dimensions.width - segmentSize, newX));
        newY = Math.max(segmentSize, Math.min(dimensions.height - segmentSize, newY));

        // Add new head
        newSnake.unshift({ x: newX, y: newY });
        
        // Remove tail
        if (newSnake.length > snakeLength) {
          newSnake.pop();
        }

        // Check coin collisions with new head position - only on desktop
        const newHead = newSnake[0];
        const remainingCoins = [];
        let collectedCount = 0;
        
        if (!isMobile) {
          for (const coin of coinsRef.current) {
            const coinDistance = Math.sqrt(
              Math.pow(newHead.x - coin.x, 2) + Math.pow(newHead.y - coin.y, 2)
            );
            
            if (coinDistance < (segmentSize + coinSize) / 2) {
              collectedCount++;
            } else {
              remainingCoins.push(coin);
            }
          }
        } else {
          // On mobile, preserve all coins (no collision detection)
          remainingCoins.push(...coinsRef.current);
        }
        
        if (collectedCount > 0) {
          coinsRef.current = remainingCoins;
          setCoins(remainingCoins);
          setScore(prev => prev + collectedCount * 10);
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 100);
    return () => clearInterval(interval);
  }, [mousePosition, dimensions]);

  const getSegmentColor = (index: number) => {
    if (index === 0) return '#00FF41';
    if (index < 4) return '#FF6B35';
    if (index < 8) return '#FF0080';
    if (index < 15) return '#EAEAEA';
    return '#16213E';
  };

  const getSegmentOpacity = (index: number) => {
    return Math.max(0.6, 1 - (index / snakeLength) * 0.4);
  };

  const getSegmentGlow = (index: number) => {
    if (index === 0) return '8px';
    if (index < 4) return '6px';
    if (index < 8) return '4px';
    return '2px';
  };

  return (
    <>
      {/* Score Box - Only show on desktop */}
      {!isMobile && (
        <div className="fixed top-10 right-4 z-50 bg-[var(--dark-navy)] border-2 border-[var(--neon-green)] p-4 font-retro text-sm shadow-lg">
          <div className="text-[var(--neon-green)] text-xs mb-1">SCORE</div>
          <div className="text-[var(--pixel-orange)] text-lg font-bold">{score.toString().padStart(4, '0')}</div>
          <div className="text-[var(--light-grey)] text-xs mt-1">COINS: {coins.length}</div>
        </div>
      )}

      {/* Game Area */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        {/* Render Coins - Only show on desktop */}
        {!isMobile && coins.map((coin) => (
          <div
            key={coin.id}
            className="absolute"
            style={{
              left: `${coin.x - coinSize/2}px`,
              top: `${coin.y - coinSize/2}px`,
              width: `${coinSize}px`,
              height: `${coinSize}px`,
              zIndex: 40,
              imageRendering: 'pixelated'
            }}
          >
            {/* Pixel circle coin with spinning animation */}
            <div
              style={{
                width: '100%',
                height: '100%',
                background: `
                  radial-gradient(circle at 30% 30%, #FFD700 0%, #FFD700 20%, #FFA500 40%, #FF8C00 60%, #FF6B00 80%, #FF4500 100%),
                  conic-gradient(from 0deg, #FFD700 0%, #FFA500 25%, #FFD700 50%, #FFA500 75%, #FFD700 100%)
                `,
                borderRadius: '50%',
                border: '2px solid #FFA500',
                boxShadow: '0 0 8px #FFD700, inset 0 0 4px #FFA500',
                animation: 'spin-horizontal 2s linear infinite',
                position: 'relative'
              }}
            >
              {/* Inner pixel highlight */}
              <div
                style={{
                  position: 'absolute',
                  top: '25%',
                  left: '25%',
                  width: '50%',
                  height: '50%',
                  background: 'radial-gradient(circle at 40% 40%, #FFFF80 0%, transparent 70%)',
                  borderRadius: '50%',
                  opacity: 0.8
                }}
              />
              {/* Pixel dots for retro effect */}
              <div
                style={{
                  position: 'absolute',
                  top: '20%',
                  left: '60%',
                  width: '2px',
                  height: '2px',
                  backgroundColor: '#FFFF80',
                  borderRadius: '50%'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '70%',
                  left: '30%',
                  width: '2px',
                  height: '2px',
                  backgroundColor: '#FFFF80',
                  borderRadius: '50%'
                }}
              />
            </div>
          </div>
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