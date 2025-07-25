import { useEffect, useState, useRef } from 'react';

interface SnakeSegment {
  x: number;
  y: number;
}

export default function SimplePixelSnake() {
  const [snake, setSnake] = useState<SnakeSegment[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const directionRef = useRef({ x: 1, y: 0 });

  const segmentSize = 10;
  const snakeLength = 20;
  const speed = 2.5;

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
  }, [dimensions]);

  useEffect(() => {
    if (snake.length === 0 || dimensions.width === 0) return;

    const moveSnake = () => {
      setSnake(currentSnake => {
        if (currentSnake.length === 0) return currentSnake;

        const newSnake = [...currentSnake];
        const head = newSnake[0];
        const currentDirection = directionRef.current;
        
        // Calculate new head position
        let newX = head.x + currentDirection.x * speed;
        let newY = head.y + currentDirection.y * speed;

        // Calculate direction towards mouse cursor
        const dx = mousePosition.x - head.x;
        const dy = mousePosition.y - head.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 10) { // Only move if mouse is far enough away
          // Normalize direction vector
          const normalizedX = dx / distance;
          const normalizedY = dy / distance;
          
          // Update direction reference for smooth movement
          directionRef.current = {
            x: normalizedX,
            y: normalizedY
          };
          
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

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 80);
    return () => clearInterval(interval);
  }, [snake.length, dimensions]);

  const getSegmentColor = (index: number) => {
    if (index === 0) return '#00FF41'; // Head - neon green
    if (index < 3) return '#FF6B35'; // Neck - orange
    if (index < 6) return '#FF0080'; // Body - hot pink
    return '#EAEAEA'; // Tail - light grey
  };

  const getSegmentOpacity = (index: number) => {
    return Math.max(0.5, 1 - (index / snakeLength) * 0.5);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {snake.map((segment, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${segment.x}px`,
            top: `${segment.y}px`,
            width: `${segmentSize}px`,
            height: `${segmentSize}px`,
            backgroundColor: getSegmentColor(index),
            opacity: getSegmentOpacity(index),
            borderRadius: index === 0 ? '3px' : '1px',
            boxShadow: `0 0 ${index === 0 ? '6px' : '3px'} ${getSegmentColor(index)}`,
            filter: 'blur(0.5px)',
            imageRendering: 'pixelated',
            border: index === 0 ? '1px solid #00FF41' : 'none',
            transform: index === 0 ? 'scale(1.2)' : `scale(${1 - index * 0.02})`,
            zIndex: snakeLength - index,
            transition: 'all 0.08s linear'
          }}
        />
      ))}
      
      {/* Snake eyes */}
      {snake.length > 0 && (
        <>
          <div
            className="absolute"
            style={{
              left: `${snake[0].x + 2}px`,
              top: `${snake[0].y + 2}px`,
              width: '2px',
              height: '2px',
              backgroundColor: '#1A1A2E',
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
              backgroundColor: '#1A1A2E',
              borderRadius: '50%',
              zIndex: 100
            }}
          />
        </>
      )}
    </div>
  );
}