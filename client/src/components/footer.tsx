import { useState } from "react";
import { Star } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter"; // This line was already present in the original code

import { apiRequest } from "@/lib/queryClient";

interface RatingStats {
  totalRatings: number;
  averageRating: number;
}

export default function Footer() {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch rating stats
  const { data: ratingStats, isLoading } = useQuery<RatingStats>({
    queryKey: ['/api/ratings/stats'],
  });

  // Submit rating mutation
  const submitRatingMutation = useMutation({
    mutationFn: async (rating: number) => {
      return apiRequest('POST', '/api/ratings', { rating });
    },
    onSuccess: () => {
      toast({
        title: "Thank you!",
        description: "Your rating has been submitted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ratings/stats'] });
      setSelectedRating(0);
    },
    onError: (error: any) => {
      toast({
        title: "Rating failed",
        description: error.message || "You may have already rated this portfolio.",
        variant: "destructive",
      });
    },
  });

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    submitRatingMutation.mutate(rating);
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        onClick={() => handleRatingClick(star)}
        onMouseEnter={() => setHoveredRating(star)}
        onMouseLeave={() => setHoveredRating(0)}
        disabled={submitRatingMutation.isPending}
        className="transition-all duration-200 hover:scale-110 disabled:opacity-50"
      >
        <Star
          className={`w-6 h-6 transition-colors duration-200 ${
            star <= (hoveredRating || selectedRating)
              ? 'fill-[var(--pixel-orange)] text-[var(--pixel-orange)]'
              : 'text-[var(--light-grey)] hover:text-[var(--pixel-orange)]'
          }`}
        />
      </button>
    ));
  };

  return (
    <footer className="bg-[var(--darker-blue)] border-t-4 border-[var(--neon-green)] py-12 scanline-overlay relative">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-10 w-1 h-1 bg-[var(--neon-green)] animate-pulse"></div>
        <div className="absolute top-8 right-20 w-1 h-1 bg-[var(--pixel-orange)] animate-pulse delay-500"></div>
        <div className="absolute bottom-6 left-1/4 w-1 h-1 bg-[var(--hot-pink)] animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Copyright */}
          <div className="text-center md:text-left">
            <div className="font-pixel text-sm text-[var(--neon-green)] mb-2">
              SUSHIL.DEV © 2025
            </div>
            <div className="font-retro text-xs text-[var(--light-grey)]">
              Built with passion and pixels
              <br />
              <Link href="/login" className="text-[var(--hot-pink)] hover:underline">Admin Login</Link>
            </div>
          </div>

          {/* Rating Section */}
          <div className="text-center">
            <div className="bg-[var(--charcoal-grey)]/30 border border-[var(--pixel-orange)]/30 rounded-lg p-6 backdrop-blur-sm">
              <div className="font-pixel text-sm text-[var(--pixel-orange)] mb-3">
                RATE THIS PORTFOLIO
              </div>
              
              <div className="flex justify-center gap-2 mb-4">
                {renderStars()}
              </div>

              {!isLoading && ratingStats && (
                <div className="space-y-1">
                  <div className="font-retro text-xs text-[var(--light-grey)]">
                    <span className="text-[var(--neon-green)]">
                      {ratingStats.averageRating.toFixed(1)}
                    </span> / 5.0
                  </div>
                  <div className="font-retro text-xs text-[var(--light-grey)]">
                    Based on {ratingStats.totalRatings} {ratingStats.totalRatings === 1 ? 'rating' : 'ratings'}
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="font-retro text-xs text-[var(--light-grey)]">
                  Loading ratings...
                </div>
              )}
            </div>
          </div>

          {/* Connect Section */}
          <div className="text-center md:text-right">
            <div className="font-pixel text-sm text-[var(--hot-pink)] mb-2">
              LET'S CONNECT
            </div>
            <div className="font-retro text-xs text-[var(--light-grey)]">
              Ready to build something amazing?
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
