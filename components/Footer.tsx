import React, { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import LiquidGlassCard from './LiquidGlassCard';
import { getRatingsFromFirebase, saveRatingToFirebase } from '../utils/firebaseService';

interface RatingData {
  totalRatings: number;
  sumOfRatings: number;
}

interface RatingProps {
  onRate: (value: number) => void;
  submitted: boolean;
  ratingData: RatingData;
  hasRated: boolean;
}

const Rating: React.FC<RatingProps> = ({ onRate, submitted, ratingData, hasRated }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const messages = [
    "Rate this portfolio!",
    "Needs work...",
    "Getting there!",
    "Good job!",
    "Awesome!",
    "Legendary!"
  ];

  const handleRate = (value: number) => {
    if (hasRated) return;
    setRating(value);
    onRate(value);
  };

  const avgRating = ratingData.totalRatings > 0 
    ? (ratingData.sumOfRatings / ratingData.totalRatings).toFixed(1) 
    : '0.0';

  return (
    <div className="flex items-center gap-4">
      <LiquidGlassCard className={`flex items-center gap-1 p-2 rounded-full border border-slate-800 ${hasRated ? 'opacity-75' : ''}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={hasRated}
            className={`relative group focus:outline-none transition-transform p-1 ${
              hasRated ? 'cursor-default' : 'md:hover:scale-110 active:scale-95'
            }`}
            onMouseEnter={() => !hasRated && setHover(star)}
            onMouseLeave={() => !hasRated && setHover(0)}
            onClick={() => handleRate(star)}
            aria-label={`Rate ${star} stars`}
          >
            <Star
              size={20}
              className={`transition-all duration-300 ${
                star <= (hover || rating)
                  ? 'fill-neon-green text-neon-green drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]'
                  : 'text-slate-700 fill-transparent md:group-hover:text-slate-500'
              }`}
            />
            {!hasRated && (
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-mono rounded opacity-0 md:group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                {messages[star]}
              </span>
            )}
          </button>
        ))}
      </LiquidGlassCard>

      {/* Rating Stats */}
      {ratingData.totalRatings > 0 && (
        <div className="flex flex-col items-start justify-center font-mono text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <span className="text-neon-green font-bold text-lg leading-none">{avgRating}</span>
            <Star className="text-neon-green fill-neon-green" size={10} />
          </div>
          <span className="text-[10px] opacity-60 whitespace-nowrap">{ratingData.totalRatings} reviews</span>
        </div>
      )}
    </div>
  );
};

const Footer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ratingData, setRatingData] = useState<RatingData>({ totalRatings: 0, sumOfRatings: 0 });
  const [hasRated, setHasRated] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  // Load rating data from Firebase on mount
  useEffect(() => {
    // Check if user has already rated
    const userHasRated = localStorage.getItem('userHasRated');
    if (userHasRated) {
      setHasRated(true);
    }

    const loadRatings = async () => {
      try {
        const data = await getRatingsFromFirebase();
        setRatingData(data);
        
        // Also cache in localStorage
        localStorage.setItem('portfolioRatings', JSON.stringify(data));
      } catch (error) {
        console.error('Error loading ratings from Firebase:', error);
        
        // Fallback to localStorage
        const storedData = localStorage.getItem('portfolioRatings');
        if (storedData) {
          try {
            const parsed = JSON.parse(storedData);
            setRatingData(parsed);
          } catch (e) {
            console.error('Failed to parse rating data:', e);
          }
        }
      }
    };
    
    loadRatings();
  }, []);

  const handleRate = async (value: number) => {
    if (hasRated) return;

    try {
      // Save to Firebase
      const newData = await saveRatingToFirebase(value);
      
      // Update state
      setRatingData(newData);
      setHasRated(true);
      
      // Cache in localStorage
      localStorage.setItem('portfolioRatings', JSON.stringify(newData));
      localStorage.setItem('userHasRated', 'true');
      
      // Show toast
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error saving rating:', error);
      
      // Fallback to localStorage only
      const newData: RatingData = {
        totalRatings: ratingData.totalRatings + 1,
        sumOfRatings: ratingData.sumOfRatings + value,
      };
      
      localStorage.setItem('portfolioRatings', JSON.stringify(newData));
      localStorage.setItem('userHasRated', 'true');
      setRatingData(newData);
      setHasRated(true);
      
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="py-12 border-t border-slate-900 bg-slate-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] bg-neon-green/5 blur-[50px] rounded-full pointer-events-none"></div>



      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className={`flex flex-col md:flex-row justify-between items-center gap-6 transition-all duration-1000 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
          
          <p className="font-pixel text-[10px] text-slate-400 uppercase tracking-widest hover:text-neon-green transition-colors cursor-default order-2 md:order-1 text-center">
            © {new Date().getFullYear()} Sushil.dev. Insert Coin to Continue.
          </p>

          <div className="order-1 md:order-2">
            <Rating onRate={handleRate} submitted={submitted} ratingData={ratingData} hasRated={hasRated} />
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 transform ${
        submitted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}>
        <LiquidGlassCard className="px-6 py-3 rounded-full border border-neon-green/30 flex items-center gap-3 shadow-[0_0_20px_rgba(74,222,128,0.2)] bg-slate-950/90 backdrop-blur-md">
          <span className="font-mono text-neon-green text-sm font-bold">Thanks for rating!</span>
        </LiquidGlassCard>
      </div>
    </footer>
  );
};

export default Footer;