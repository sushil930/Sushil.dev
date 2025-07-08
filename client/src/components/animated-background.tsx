import { useEffect, useState } from 'react';

interface FloatingPixel {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  direction: number;
}

interface GridLine {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
  color: string;
}

export default function AnimatedBackground() {
  const [pixels, setPixels] = useState<FloatingPixel[]>([]);
  const [gridLines, setGridLines] = useState<GridLine[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

    // Create floating pixels
    const newPixels: FloatingPixel[] = [];
    const colors = ['var(--neon-green)', 'var(--pixel-orange)', 'var(--hot-pink)'];
    
    for (let i = 0; i < 8; i++) {
      newPixels.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 2 + 0.5,
        direction: Math.random() * Math.PI * 2
      });
    }
    setPixels(newPixels);

    // Create grid lines
    const newGridLines: GridLine[] = [];
    const gridSpacing = 100;
    let lineId = 0;

    // Vertical lines
    for (let x = 0; x <= dimensions.width; x += gridSpacing) {
      newGridLines.push({
        id: lineId++,
        x1: x,
        y1: 0,
        x2: x,
        y2: dimensions.height,
        opacity: Math.random() * 0.1 + 0.02,
        color: 'var(--neon-green)'
      });
    }

    // Horizontal lines
    for (let y = 0; y <= dimensions.height; y += gridSpacing) {
      newGridLines.push({
        id: lineId++,
        x1: 0,
        y1: y,
        x2: dimensions.width,
        y2: y,
        opacity: Math.random() * 0.1 + 0.02,
        color: 'var(--neon-green)'
      });
    }

    setGridLines(newGridLines);
  }, [dimensions]);

  useEffect(() => {
    const animatePixels = () => {
      setPixels(currentPixels => 
        currentPixels.map(pixel => {
          let newX = pixel.x + Math.cos(pixel.direction) * pixel.speed;
          let newY = pixel.y + Math.sin(pixel.direction) * pixel.speed;
          let newDirection = pixel.direction;

          // Bounce off walls
          if (newX <= 0 || newX >= dimensions.width - pixel.size) {
            newDirection = Math.PI - pixel.direction;
            newX = Math.max(0, Math.min(dimensions.width - pixel.size, newX));
          }
          if (newY <= 0 || newY >= dimensions.height - pixel.size) {
            newDirection = -pixel.direction;
            newY = Math.max(0, Math.min(dimensions.height - pixel.size, newY));
          }

          return {
            ...pixel,
            x: newX,
            y: newY,
            direction: newDirection
          };
        })
      );
    };

    const interval = setInterval(animatePixels, 100);
    return () => clearInterval(interval);
  }, [dimensions]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Hexagonal Grid */}
      <div className="hexagonal-grid"></div>

      {/* Floating Particles */}
      <div className="floating-particles"></div>

      {/* Glow Orbs */}
      <div className="glow-orb" style={{ top: '10%', left: '80%' }}></div>
      <div className="glow-orb" style={{ top: '60%', left: '10%' }}></div>
      <div className="glow-orb" style={{ top: '40%', left: '60%' }}></div>

      {/* Grid Lines */}
      <svg className="absolute inset-0 w-full h-full">
        {gridLines.map(line => (
          <line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={line.color}
            strokeWidth="1"
            opacity={line.opacity}
            className="animate-pulse"
          />
        ))}
      </svg>

      {/* Floating Pixels */}
      {pixels.map(pixel => (
        <div
          key={pixel.id}
          className="absolute animate-pulse"
          style={{
            left: `${pixel.x}px`,
            top: `${pixel.y}px`,
            width: `${pixel.size}px`,
            height: `${pixel.size}px`,
            backgroundColor: pixel.color,
            borderRadius: '2px',
            boxShadow: `0 0 ${pixel.size * 2}px ${pixel.color}`,
            filter: 'blur(0.5px)',
            imageRendering: 'pixelated'
          }}
        />
      ))}

      {/* Matrix Rain Effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="matrix-rain"></div>
      </div>

      {/* Glitch Lines */}
      <div className="absolute inset-0">
        <div className="glitch-line-1"></div>
        <div className="glitch-line-2"></div>
        <div className="glitch-line-3"></div>
      </div>
    </div>
  );
}