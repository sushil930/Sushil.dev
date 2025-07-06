import { useEffect, useState, useRef } from 'react';

interface SnakeSegment {
  x: number;
  y: number;
}

interface Direction {
  x: number;
  y: number;
}

interface TrailParticle {
  x: number;
  y: number;
  color: string;
  opacity: number;
  size: number;
  lifetime: number;
}

export default function PixelSnake() {
  const [snake, setSnake] = useState<SnakeSegment[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [trailParticles, setTrailParticles] = useState<TrailParticle[]>([]);
  
  const directionRef = useRef<Direction>({ x: 1, y: 0 });
  const nextDirectionChangeRef = useRef<number>(0);

  const segmentSize = 8;
  const snakeLength = 15;
  const speed = 3;

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
    nextDirectionChangeRef.current = Date.now() + 2000; // Initialize direction change timer
  }, [dimensions]);

  useEffect(() => {
    if (snake.length === 0) return;

    const moveSnake = () => {
      setSnake(currentSnake => {
        if (currentSnake.length === 0) return currentSnake;

        const newSnake = [...currentSnake];
        const head = newSnake[0];
        
        const currentDirection = directionRef.current;
        
        // Calculate new head position
        const newHead = {
          x: head.x + currentDirection.x * speed,
          y: head.y + currentDirection.y * speed
        };

        // Check boundaries and reflect direction if needed
        let newDirection = { ...currentDirection };
        let hitBoundary = false;

        if (newHead.x <= 0) {
          newDirection.x = Math.abs(currentDirection.x); // Reflect to positive
          newHead.x = 0;
          hitBoundary = true;
        } else if (newHead.x >= dimensions.width - segmentSize) {
          newDirection.x = -Math.abs(currentDirection.x); // Reflect to negative
          newHead.x = dimensions.width - segmentSize;
          hitBoundary = true;
        }

        if (newHead.y <= 0) {
          newDirection.y = Math.abs(currentDirection.y); // Reflect to positive
          newHead.y = 0;
          hitBoundary = true;
        } else if (newHead.y >= dimensions.height - segmentSize) {
          newDirection.y = -Math.abs(currentDirection.y); // Reflect to negative
          newHead.y = dimensions.height - segmentSize;
          hitBoundary = true;
        }

        // Random direction changes (only if not hitting boundary)
        if (!hitBoundary && Date.now() > nextDirectionChangeRef.current) {
          const directions = [
            { x: 1, y: 0 },   // right
            { x: -1, y: 0 },  // left
            { x: 0, y: 1 },   // down
            { x: 0, y: -1 },  // up
            { x: 1, y: 1 },   // diagonal down-right
            { x: -1, y: 1 },  // diagonal down-left
            { x: 1, y: -1 },  // diagonal up-right
            { x: -1, y: -1 }  // diagonal up-left
          ];
          
          if (Math.random() < 0.3) { // 30% chance to change direction
            const randomDirection = directions[Math.floor(Math.random() * directions.length)];
            newDirection = randomDirection;
          }
          nextDirectionChangeRef.current = Date.now() + 1000 + Math.random() * 3000; // 1-4 seconds
        }

        // Update direction if it changed
        if (newDirection.x !== currentDirection.x || newDirection.y !== currentDirection.y) {
          directionRef.current = newDirection;
        }

        // Add new head and remove tail
        newSnake.unshift(newHead);
        
        // Create trail particle from the tail before removing it
        if (newSnake.length > snakeLength) {
          const tail = newSnake[newSnake.length - 1];
          const colors = ['var(--neon-green)', 'var(--pixel-orange)', 'var(--hot-pink)'];
          
          setTrailParticles(current => [...current, {
            x: tail.x + Math.random() * 4 - 2,
            y: tail.y + Math.random() * 4 - 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 0.8,
            size: 2 + Math.random() * 2,
            lifetime: Date.now() + 2000 // 2 seconds
          }]);
          
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 50);
    return () => clearInterval(interval);
  }, [dimensions]); // Remove direction dependency to prevent recreation

  // Clean up expired trail particles
  useEffect(() => {
    const cleanupTrail = () => {
      setTrailParticles(current => 
        current.filter(particle => particle.lifetime > Date.now())
      );
    };

    const interval = setInterval(cleanupTrail, 100);
    return () => clearInterval(interval);
  }, []);

  const getSegmentColor = (index: number) => {
    if (index === 0) return 'var(--neon-green)'; // Head
    if (index < 3) return 'var(--pixel-orange)'; // Neck
    if (index < 6) return 'var(--hot-pink)'; // Upper body
    return 'var(--light-grey)'; // Tail
  };

  const getSegmentOpacity = (index: number) => {
    return Math.max(0.4, 1 - (index / snakeLength) * 0.6);
  };

  const getSegmentGlow = (index: number) => {
    if (index === 0) return '4px'; // Head glows more
    if (index < 3) return '3px';
    return '2px';
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Trail Particles */}
      {trailParticles.map((particle, index) => {
        const age = Date.now() - (particle.lifetime - 2000);
        const fadeOpacity = Math.max(0, particle.opacity * (1 - age / 2000));
        
        return (
          <div
            key={`trail-${index}`}
            className="absolute"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: fadeOpacity,
              borderRadius: '50%',
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              filter: 'blur(1px)',
              transform: `scale(${1 - age / 4000})`
            }}
          />
        );
      })}

      {/* Snake Segments */}
      {snake.map((segment, index) => (
        <div
          key={index}
          className="absolute transition-all duration-100 ease-linear"
          style={{
            left: `${segment.x}px`,
            top: `${segment.y}px`,
            width: `${segmentSize}px`,
            height: `${segmentSize}px`,
            backgroundColor: getSegmentColor(index),
            opacity: getSegmentOpacity(index),
            borderRadius: index === 0 ? '3px' : '1px',
            boxShadow: `0 0 ${getSegmentGlow(index)} ${getSegmentColor(index)}`,
            filter: index === 0 ? 'blur(0.3px)' : 'blur(0.5px)',
            imageRendering: 'pixelated',
            border: index === 0 ? '1px solid var(--neon-green)' : 'none',
            transform: index === 0 ? 'scale(1.3)' : `scale(${1 - index * 0.02})`,
            zIndex: snakeLength - index,
            animation: index === 0 ? 'pulse 1s ease-in-out infinite' : 'none'
          }}
        />
      ))}
      
      {/* Snake eyes for the head */}
      {snake.length > 0 && (
        <>
          <div
            className="absolute"
            style={{
              left: `${snake[0].x + 2}px`,
              top: `${snake[0].y + 2}px`,
              width: '2px',
              height: '2px',
              backgroundColor: 'var(--dark-navy)',
              borderRadius: '50%',
              zIndex: 100
            }}
          />
          <div
            className="absolute"
            style={{
              left: `${snake[0].x + 5}px`,
              top: `${snake[0].y + 2}px`,
              width: '2px',
              height: '2px',
              backgroundColor: 'var(--dark-navy)',
              borderRadius: '50%',
              zIndex: 100
            }}
          />
        </>
      )}
    </div>
  );
}