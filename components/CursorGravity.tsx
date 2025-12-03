import React, { useEffect, useRef } from 'react';

const CursorGravity: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Disable on mobile - check early to avoid setting up listeners
    if (window.innerWidth < 768) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Create grid of particles
    const gridSpacing = 40;
    const distortionRadius = 150;
    const distortionStrength = 0.3;

    const particles: Array<{ x: number; y: number; originalX: number; originalY: number }> = [];

    for (let x = 0; x < canvas.width; x += gridSpacing) {
      for (let y = 0; y < canvas.height; y += gridSpacing) {
        particles.push({ x, y, originalX: x, originalY: y });
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        const dx = mousePos.current.x - particle.originalX;
        const dy = mousePos.current.y - particle.originalY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < distortionRadius) {
          // Apply gravitational pull
          const force = (1 - distance / distortionRadius) * distortionStrength;
          particle.x = particle.originalX + dx * force;
          particle.y = particle.originalY + dy * force;
        } else {
          // Smoothly return to original position
          particle.x += (particle.originalX - particle.x) * 0.1;
          particle.y += (particle.originalY - particle.y) * 0.1;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74, 222, 128, 0.4)';
        ctx.fill();

        // Draw connections
        particles.forEach((otherParticle) => {
          const pdx = otherParticle.x - particle.x;
          const pdy = otherParticle.y - particle.y;
          const pDistance = Math.sqrt(pdx * pdx + pdy * pdy);

          if (pDistance < gridSpacing * 1.5 && pDistance > 0) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(74, 222, 128, ${0.25 * (1 - pDistance / (gridSpacing * 1.5))})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default CursorGravity;
