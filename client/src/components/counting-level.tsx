import React, { useState, useEffect } from 'react';

interface CountingLevelProps {
  targetLevel: number;
  duration: number; // in milliseconds
}

const CountingLevel: React.FC<CountingLevelProps> = ({ targetLevel, duration }) => {
  const [currentLevel, setCurrentLevel] = useState(0);

  useEffect(() => {
    if (currentLevel < targetLevel) {
      const incrementTime = duration / targetLevel; // Time per increment
      const timer = setTimeout(() => {
        setCurrentLevel(prevLevel => prevLevel + 1);
      }, incrementTime);
      return () => clearTimeout(timer);
    }
  }, [currentLevel, targetLevel, duration]);

  return (
    <span className="text-[var(--hot-pink)]">
      LEVEL {currentLevel}
    </span>
  );
};

export default CountingLevel;
