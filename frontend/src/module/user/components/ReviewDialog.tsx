import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: {
    id: string;
    salonName: string;
    service: string;
  };
  onSubmit: (review: { rating: number; comment: string }) => void;
}

export function ReviewDialog({ open, onOpenChange, booking, onSubmit }: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit({ rating, comment });
    onOpenChange(false);
    // Reset state
    setRating(0);
    setComment("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#121212] border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Rate your experience</DialogTitle>
          <p className="text-sm text-muted-foreground">
            How was your {booking.service} at {booking.salonName}?
          </p>
        </DialogHeader>

        <div className="flex flex-col items-center py-6 space-y-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="transition-all hover:scale-110 focus:outline-none"
              >
                <Star
                  className={cn(
                    "w-10 h-10 transition-colors",
                    (hoverRating || rating) >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/30"
                  )}
                />
              </button>
            ))}
          </div>

          <div className="w-full space-y-2">
            <label className="text-sm font-medium px-1">Write a review (Optional)</label>
            <textarea
              className="w-full min-h-[100px] bg-card border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none resize-none transition-all"
              placeholder="Tell others about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-3 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-border"
          >
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className={cn(
              "flex-1 bg-yellow-400 text-gray-900 hover:bg-yellow-500 font-bold",
              rating === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
