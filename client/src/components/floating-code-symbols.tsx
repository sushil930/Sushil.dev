import { useEffect, useState } from 'react';

interface CodeSymbol {
  id: number;
  symbol: string;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  rotation: number;
  rotationSpeed: number;
}

const codeSymbols = [
  '</>', '{}', '[]', '()', '&&', '||', '==', '!=', '>=', '<=', 
  '=>', '++', '--', '+=', '-=', '*=', '/=', '??', '!!', '##',
  '<html>', '<div>', '<span>', 'var', 'let', 'const', 'function',
  'return', 'import', 'export', 'class', 'extends', 'async', 'await'
];

export default function FloatingCodeSymbols() {
  const [symbols, setSymbols] = useState<CodeSymbol[]>([]);
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

    const newSymbols: CodeSymbol[] = [];
    const colors = ['var(--neon-green)', 'var(--pixel-orange)', 'var(--hot-pink)', 'var(--light-grey)'];
    
    for (let i = 0; i < 20; i++) {
      newSymbols.push({
        id: i,
        symbol: codeSymbols[Math.floor(Math.random() * codeSymbols.length)],
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 12 + 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.5 + 0.2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2
      });
    }
    setSymbols(newSymbols);
  }, [dimensions]);

  useEffect(() => {
    const animateSymbols = () => {
      setSymbols(currentSymbols => 
        currentSymbols.map(symbol => ({
          ...symbol,
          y: symbol.y - symbol.speed,
          rotation: symbol.rotation + symbol.rotationSpeed,
          // Reset position when it goes off screen
          ...(symbol.y < -50 ? {
            y: dimensions.height + 50,
            x: Math.random() * dimensions.width
          } : {})
        }))
      );
    };

    const interval = setInterval(animateSymbols, 50);
    return () => clearInterval(interval);
  }, [dimensions]);

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {symbols.map(symbol => (
        <div
          key={symbol.id}
          className="absolute font-pixel opacity-20 select-none"
          style={{
            left: `${symbol.x}px`,
            top: `${symbol.y}px`,
            fontSize: `${symbol.size}px`,
            color: symbol.color,
            transform: `rotate(${symbol.rotation}deg)`,
            filter: `drop-shadow(0 0 ${symbol.size/2}px ${symbol.color})`,
            fontFamily: 'VT323, monospace',
            fontWeight: 'bold',
            textShadow: `0 0 ${symbol.size/3}px ${symbol.color}`
          }}
        >
          {symbol.symbol}
        </div>
      ))}
    </div>
  );
}