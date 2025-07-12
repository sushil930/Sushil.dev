// A fixed overlay with a vintage effect using a CSS filter and blend mode. Replace the background with your own texture for a more authentic look.

export default function VintageOverlay() {
  return (
    <div
      style={{
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 50,
        mixBlendMode: 'multiply',
        opacity: 0.5,
        background: `repeating-linear-gradient(0deg, rgba(255,255,180,0.12) 0px, rgba(255,255,180,0.12) 2px, transparent 2px, transparent 6px), repeating-linear-gradient(90deg, rgba(255,255,180,0.12) 0px, rgba(255,255,180,0.12) 2px, transparent 2px, transparent 6px)`,
        filter: 'grayscale(0.7) contrast(1.2) blur(0.7px) sepia(0.4)',
      }}
      aria-hidden="true"
    />
  );
}
