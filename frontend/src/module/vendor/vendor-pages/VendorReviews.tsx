import { useState, useMemo, useCallback } from "react";
import {
  Search,
  Star,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, transitions } from "@/lib/animations";
import { useCountUp } from "@/hooks/useCountUp";
import { useReviewStore, type Review } from "../store/useReviewStore";
import { ReviewReplyModal } from "../vendor-components/ReviewReplyModal";

const getRatingColor = (rating: number) => {
  if (rating >= 4) return "text-green-400";
  if (rating >= 3) return "text-yellow-400";
  return "text-red-400";
};

export function VendorReviews() {
  const navigate = useNavigate();
  const { reviews, addResponse, updateResponse } = useReviewStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<Review["status"] | "all">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (review) =>
          review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
          review.service.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((review) => review.status === filter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [searchQuery, filter, sortBy]);

  const stats = useMemo(() => {
    const publishedReviews = reviews.filter(r => r.status === "published");
    const averageRating = publishedReviews.length > 0 
      ? publishedReviews.reduce((sum, review) => sum + review.rating, 0) / publishedReviews.length
      : 0;
      
    return {
      total: publishedReviews.length,
      average: parseFloat(averageRating.toFixed(1)),
      fiveStar: publishedReviews.filter(r => r.rating === 5).length,
      fourStar: publishedReviews.filter(r => r.rating === 4).length,
      threeStar: publishedReviews.filter(r => r.rating === 3).length,
      positive: publishedReviews.filter(r => r.rating >= 4).length,
    };
  }, [reviews]);

  const animatedAverage = useCountUp(stats.average * 10, { duration: 1500 });
  const animatedPositive = useCountUp(Math.round((stats.positive / stats.total) * 100), { duration: 1500 });

  const handleSort = useCallback((field: typeof sortBy) => {
    setSortBy(field);
  }, []);

  const handleLike = useCallback((id: string) => {
    console.log("Liked review", id);
    // Handle like action
  }, []);

  const handleDislike = useCallback((id: string) => {
    console.log("Disliked review", id);
    // Handle dislike action
  }, []);

  const handleReply = useCallback((review: Review) => {
    setSelectedReview(review);
    setIsReplyModalOpen(true);
  }, []);

  const handleSaveResponse = useCallback((reviewId: string, response: string) => {
    const review = reviews.find(r => r.id === reviewId);
    if (review?.response) {
      updateResponse(reviewId, response);
    } else {
      addResponse(reviewId, response);
    }
  }, [reviews, addResponse, updateResponse]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24" style={{ paddingBottom: 'max(6rem, env(safe-area-inset-bottom))' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.smooth}
        className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border"
      >
        <div className="px-4 py-3 flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/vendor/profile')}
            className="p-2 min-w-[44px] min-h-[44px] hover:bg-muted rounded-lg transition-colors touch-manipulation flex items-center justify-center"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">Reviews</h2>
            <p className="text-xs text-muted-foreground">
              Manage customer feedback
            </p>
          </div>
        </div>
      </motion.div>

      <div className="px-4 py-6 space-y-6">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-primary fill-primary" />
                <p className="text-xs text-muted-foreground">Average Rating</p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {(animatedAverage / 10).toFixed(1)}
                <span className="text-base text-muted-foreground">/5</span>
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ThumbsUp className="w-5 h-5 text-primary" />
                <p className="text-xs text-muted-foreground">Positive Reviews</p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {animatedPositive}%
              </p>
            </div>
          </div>
          
          {/* Rating Distribution */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = stats[`${stars}Star` as keyof typeof stats] as number;
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <div className="flex items-center gap-1 w-10">
                      <span className="text-xs text-foreground">{stars}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.2 }}
          className="space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviews..."
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm placeholder:text-muted-foreground"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter("all")}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium transition-all min-h-[36px] touch-manipulation",
                filter === "all"
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-card text-muted-foreground border border-border hover:border-primary/50"
              )}
            >
              All ({reviews.length})
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter("published")}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium transition-all min-h-[36px] touch-manipulation",
                filter === "published"
                  ? "bg-green-400/10 text-green-400 border border-green-400/30"
                  : "bg-card text-muted-foreground border border-border hover:border-primary/50"
              )}
            >
              Published ({reviews.filter(r => r.status === "published").length})
            </motion.button>
          </div>
        </motion.div>

        {/* Sort Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.smooth, delay: 0.3 }}
          className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          <span className="text-xs text-muted-foreground whitespace-nowrap">Sort by:</span>
          {[
            { key: "newest", label: "Newest" },
            { key: "oldest", label: "Oldest" },
            { key: "highest", label: "Highest Rated" },
            { key: "lowest", label: "Lowest Rated" },
          ].map((option) => (
            <motion.button
              key={option.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSort(option.key as typeof sortBy)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all min-h-[32px] touch-manipulation",
                sortBy === option.key
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-card text-muted-foreground border border-border hover:border-primary/50"
              )}
            >
              {option.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Reviews List */}
        {filteredReviews.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                variants={staggerItem}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all touch-manipulation active:scale-[0.98] shadow-sm hover:shadow-md"
              >
                <div className="flex items-start gap-3 mb-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-base font-semibold min-w-[40px] min-h-[40px]">
                    {review.customerName.charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Customer Info */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-foreground text-sm">
                        {review.customerName}
                      </h3>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3.5 h-3.5",
                              i < review.rating 
                                ? `fill-${getRatingColor(review.rating)} text-${getRatingColor(review.rating)}` 
                                : "text-muted-foreground"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-1">
                      {review.service} • {review.date}
                    </p>
                    
                    <p className="text-sm text-foreground">
                      {review.comment}
                    </p>
                  </div>
                </div>
                
                {/* Response */}
                {review.response && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Reply className="w-3.5 h-3.5 text-primary rotate-180" />
                      <span className="text-xs font-medium text-primary">Your Response</span>
                    </div>
                    <p className="text-xs text-foreground">
                      {review.response}
                    </p>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(review.id)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors touch-manipulation"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{review.likes}</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDislike(review.id)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors touch-manipulation"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{review.dislikes}</span>
                    </motion.button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleReply(review)}
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors touch-manipulation"
                  >
                    {review.response ? (
                      <>
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </>
                    ) : (
                      <>
                        <Reply className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={transitions.smooth}
            className="text-center py-12 bg-card border border-border rounded-xl"
          >
            <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-sm">
              {searchQuery || filter !== "all" 
                ? "No reviews found matching your criteria" 
                : "No reviews yet"}
            </p>
          </motion.div>
        )}
      </div>

      {/* Reply Modal */}
      <ReviewReplyModal
        open={isReplyModalOpen}
        onOpenChange={setIsReplyModalOpen}
        onSave={handleSaveResponse}
        review={selectedReview}
      />
    </div>
  );
}