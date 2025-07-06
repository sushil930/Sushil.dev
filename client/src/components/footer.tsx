export default function Footer() {
  return (
    <footer className="bg-[var(--darker-blue)] border-t-4 border-[var(--neon-green)] py-8 scanline-overlay">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="font-pixel text-xs text-[var(--neon-green)] mb-4 md:mb-0">
            ALEX.DEV © 2024
          </div>
          <div className="font-retro text-sm text-[var(--light-grey)]">
            Built with passion and pixels
          </div>
        </div>
      </div>
    </footer>
  );
}
