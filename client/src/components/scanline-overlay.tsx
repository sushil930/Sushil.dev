export default function ScanlineOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="moving-scanline"></div>
      <div className="moving-scanline" style={{ animationDelay: '0.7s', opacity: 0.2 }}></div>
      <div className="moving-scanline" style={{ animationDelay: '1.4s', opacity: 0.15 }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--dark-navy)] opacity-20 pointer-events-none"></div>
    </div>
  );
}
