import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockBookings } from "../services/mockData";

export function UserReviewsPage() {
    const navigate = useNavigate();

    // Mock reviews based on completed bookings
    const reviews = mockBookings
        .filter((b) => b.status === "completed")
        .map((b, idx) => ({
            id: `rev_${idx}`,
            booking: b,
            rating: 4 + (idx % 2), // 4 or 5 stars
            comment: idx % 2 === 0
                ? "Great service! Professional was very polite and skilled."
                : "Amazing experience. Highly recommended!",
            date: b.date,
        }));

    return (
        <div className="min-h-screen bg-background">
            <div className="sticky top-0 z-40 bg-background border-b border-border">
                <div className="flex items-center px-4 py-3 gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="h-10 w-10">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-lg font-bold">My Reviews</h1>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="bg-card border border-border rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-foreground">
                                    {review.booking.salonName}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {review.booking.service}
                                </p>
                            </div>
                            <div className="flex items-center bg-yellow-400/10 px-2 py-1 rounded text-yellow-400 font-bold text-xs">
                                {review.rating} <Star className="w-3 h-3 ml-1 fill-yellow-400" />
                            </div>
                        </div>

                        <p className="text-sm text-foreground/90 italic bg-muted/50 p-3 rounded-lg border border-border/50">
                            "{review.comment}"
                        </p>

                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                            <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                Reviewed on {review.date}
                            </span>
                            {review.booking.professionalName && (
                                <span>Professional: {review.booking.professionalName}</span>
                            )}
                        </div>
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <Star className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No reviews yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
