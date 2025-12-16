import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogBody } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Review } from "../store/useReviewStore";

interface ReviewReplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (reviewId: string, response: string) => void;
  review: Review | null;
}

export function ReviewReplyModal({
  open,
  onOpenChange,
  onSave,
  review,
}: ReviewReplyModalProps) {
  const [response, setResponse] = useState("");
  const [errors, setErrors] = useState<string>("");

  useEffect(() => {
    if (review) {
      setResponse(review.response || "");
    }
    setErrors("");
  }, [review, open]);

  const handleSubmit = () => {
    if (!review) return;

    if (!response.trim()) {
      setErrors("Response cannot be empty");
      return;
    }

    onSave(review.id, response.trim());
    onOpenChange(false);
  };

  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold">
              {review.response ? "Edit Response" : "Reply to Review"}
            </DialogTitle>
            <DialogClose onClose={() => onOpenChange(false)} />
          </div>
        </DialogHeader>
        <DialogBody className="px-4 pb-4 space-y-4">
          {/* Review Info */}
          <div className="bg-card border border-border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                {review.customerName}
              </p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "text-xs",
                      i < review.rating ? "text-yellow-400" : "text-muted-foreground"
                    )}>
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{review.service}</p>
            <p className="text-sm text-foreground">{review.comment}</p>
          </div>

          {/* Response Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Your Response <span className="text-red-400">*</span>
            </label>
            <textarea
              value={response}
              onChange={(e) => {
                setResponse(e.target.value);
                setErrors("");
              }}
              placeholder="Write your response to this review..."
              rows={5}
              className={cn(
                "w-full px-3 py-2 rounded-lg bg-card border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-base resize-none",
                errors && "border-red-400"
              )}
            />
            {errors && (
              <p className="text-xs text-red-400">{errors}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Your response will be visible to all customers
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 min-h-[44px] touch-manipulation">
              Cancel
            </Button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="flex-1 min-h-[44px] bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition-colors touch-manipulation">
              {review.response ? "Update Response" : "Post Response"}
            </motion.button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

