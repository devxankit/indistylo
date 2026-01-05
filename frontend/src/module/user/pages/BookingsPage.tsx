import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BookingsHeader } from "../components/BookingsHeader";
import { BookingsTabs, type BookingTabType } from "../components/BookingsTabs";
import { BookingCard } from "../components/BookingCard";
import { ReviewDialog } from "../components/ReviewDialog";
import { AddressDialog } from "../components/AddressDialog";
import { RescheduleDialog } from "../components/RescheduleDialog";
import { BookingDetailDialog } from "../components/BookingDetailDialog";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { Search, CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { bookingService } from "../services/bookingService";
import type { Booking } from "../services/types";

type SortOption = "creation" | "booking";

export function BookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingTabType>("Upcoming");
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>("creation");
  const [pendingSort, setPendingSort] = useState<SortOption>("creation");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBookingForReview, setSelectedBookingForReview] =
    useState<Booking | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [selectedBookingForDetail, setSelectedBookingForDetail] =
    useState<Booking | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedBookingForReschedule, setSelectedBookingForReschedule] =
    useState<Booking | null>(null);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);

  const navigate = useNavigate();

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const data = await bookingService.getBookings();
        setBookings(data);
      } catch (error) {
        toast.error("Failed to load bookings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleReviewSubmit = async (review: {
    rating: number;
    comment: string;
  }) => {
    if (!selectedBookingForReview) return;

    try {
      await bookingService.submitReview(selectedBookingForReview.id, review);
      toast.success(
        "Review submitted successfully! Thank you for your feedback."
      );
      setShowReviewDialog(false);
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
    }
  };

  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  const initiateCancel = (bookingId: string) => {
    setBookingToDelete(bookingId);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToDelete) return;

    try {
      await bookingService.cancelBooking(bookingToDelete);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingToDelete ? { ...b, status: "cancelled" } : b
        )
      );
      toast.success("Booking cancelled successfully");
      setShowDetailDialog(false);
    } catch (error) {
      toast.error("Failed to cancel booking. Please try again.");
    } finally {
      setBookingToDelete(null);
    }
  };

  const handleReschedule = async (
    bookingId: string,
    date: string,
    time: string
  ) => {
    try {
      await bookingService.rescheduleBooking(bookingId, date, time);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, date, time } : b))
      );
      toast.success(`Booking rescheduled to ${date} at ${time}`);
      setShowRescheduleDialog(false);
      setShowDetailDialog(false);
    } catch (error) {
      toast.error("Failed to reschedule booking. Please try again.");
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBookingForDetail(booking);
    setShowDetailDialog(true);
  };

  const getFilteredBookings = () => {
    let filtered = [];
    switch (activeTab) {
      case "Upcoming":
        filtered = bookings.filter((b) => b.status === "upcoming");
        break;
      case "Completed":
        filtered = bookings.filter((b) => b.status === "completed");
        break;
      case "Cancelled":
        filtered = bookings.filter((b) => b.status === "cancelled");
        break;
      case "Missed":
        filtered = bookings.filter((b) => b.status === "missed");
        break;
      default:
        filtered = bookings;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.salonName.toLowerCase().includes(query) ||
          b.service.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const sortBookings = (bookingsList: Booking[], sortBy: SortOption) => {
    const toDate = (booking: Booking) => {
      try {
        const date = new Date(booking.date);
        if (isNaN(date.getTime())) return new Date();
        return date;
      } catch (e) {
        return new Date();
      }
    };

    return [...bookingsList].sort((a, b) => {
      const dateA = toDate(a).getTime();
      const dateB = toDate(b).getTime();

      if (sortBy === "creation") {
        return dateB - dateA;
      }

      return activeTab === "Upcoming" ? dateA - dateB : dateB - dateA;
    });
  };

  const currentBookings = sortBookings(getFilteredBookings(), selectedSort);

  const sortOptions: { id: SortOption; label: string }[] = [
    { id: "creation", label: "Creation Date" },
    { id: "booking", label: "Booking Date" },
  ];

  const handleOpenSort = () => {
    setPendingSort(selectedSort);
    setShowSortSheet(true);
  };

  const handleApplySort = () => {
    setSelectedSort(pendingSort);
    setShowSortSheet(false);
  };

  return (
    <div className="min-h-screen bg-[#060606] pb-20">
      <BookingsHeader onSortClick={handleOpenSort} />

      <main className="px-4 py-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f5f5f5]/40" />
          <input
            type="text"
            placeholder="Search by salon or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl py-3 pl-10 pr-4 text-sm text-[#f5f5f5] placeholder:text-[#f5f5f5]/30 focus:outline-none focus:border-yellow-400/50 transition-colors"
          />
        </div>

        {/* Tab Switcher */}
        <BookingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Bookings List */}
        {isLoading ? (
          <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:space-y-0 pb-10">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[#202020] border-l-4 border-[#3a3a3a] rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded-full bg-[#3a3a3a]" />
                  <Skeleton className="h-5 w-32 bg-[#3a3a3a]" />
                </div>
                <Skeleton className="h-4 w-48 bg-[#3a3a3a]" />
                <div className="flex gap-4">
                  <Skeleton className="h-3 w-20 bg-[#3a3a3a]" />
                  <Skeleton className="h-3 w-20 bg-[#3a3a3a]" />
                </div>
                <div className="flex gap-2 pt-2 border-t border-[#3a3a3a]">
                  <Skeleton className="h-9 flex-1 bg-[#3a3a3a]" />
                  <Skeleton className="h-9 flex-1 bg-[#3a3a3a]" />
                </div>
              </div>
            ))}
          </div>
        ) : currentBookings.length > 0 ? (
          <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:space-y-0 pb-10">
            {currentBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onViewDetails={() => handleViewDetails(booking)}
                onReschedule={() => {
                  setSelectedBookingForReschedule(booking);
                  setShowRescheduleDialog(true);
                }}
                onCancel={() => initiateCancel(booking.id)}
                onBookAgain={() => {
                  toast.success("Redirecting to shop...");
                  navigate(`/shops/${booking.id}`); // Using booking ID as mock salon ID
                }}
                onReview={() => {
                  setSelectedBookingForReview(booking);
                  setShowReviewDialog(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center">
              <CalendarDays className="w-8 h-8 text-[#f5f5f5]/20" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[#f5f5f5] font-medium">No bookings found</h3>
              <p className="text-[#f5f5f5]/40 text-sm max-w-[250px]">
                {searchQuery
                  ? `No bookings match "${searchQuery}" in ${activeTab}`
                  : `You don't have any ${activeTab.toLowerCase()} bookings yet`}
              </p>
            </div>
            <Button
              onClick={() => navigate("/at-salon")}
              className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-8">
              Book Now
            </Button>
          </div>
        )}
      </main>

      {/* Dialogs & Sheets */}
      <AddressDialog
        open={isAddressDialogOpen}
        onOpenChange={setIsAddressDialogOpen}
      />

      {selectedBookingForReview && (
        <ReviewDialog
          open={showReviewDialog}
          onOpenChange={setShowReviewDialog}
          booking={selectedBookingForReview}
          onSubmit={handleReviewSubmit}
        />
      )}

      <BookingDetailDialog
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        booking={selectedBookingForDetail}
        onCancel={() => initiateCancel(selectedBookingForDetail?.id || "")}
        onReschedule={() => {
          setSelectedBookingForReschedule(selectedBookingForDetail);
          setShowRescheduleDialog(true);
        }}
      />

      <RescheduleDialog
        open={showRescheduleDialog}
        onOpenChange={setShowRescheduleDialog}
        booking={selectedBookingForReschedule}
        onReschedule={handleReschedule}
      />

      <ConfirmationDialog
        open={!!bookingToDelete}
        onOpenChange={(open) => !open && setBookingToDelete(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Booking"
        description="Are you sure you want to cancel this booking? This action cannot be undone."
        variant="destructive"
        confirmText="Cancel Booking"
      />

      {showSortSheet && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-[1px]"
          onClick={() => setShowSortSheet(false)}>
          <div
            className="bg-[#060606] border-t border-[#3a3a3a] rounded-t-3xl p-5 space-y-5"
            onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto w-10 h-1.5 bg-[#2a2a2a] rounded-full" />
            <h3 className="text-center text-base font-semibold text-[#f5f5f5]">
              Sort By
            </h3>

            <div className="space-y-3">
              {sortOptions.map((option) => {
                const isSelected = pendingSort === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setPendingSort(option.id)}
                    className="flex items-center gap-3 w-full text-left">
                    <span
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${isSelected
                        ? "bg-yellow-400 border-yellow-400"
                        : "border-[#3a3a3a] bg-transparent"
                        }`}>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-sm bg-black" />
                      )}
                    </span>
                    <span
                      className={`text-sm ${isSelected ? "text-[#f5f5f5]" : "text-[#f5f5f5]/70"
                        }`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowSortSheet(false)}
                className="flex-1 border-[#3a3a3a] text-[#f5f5f5]">
                Cancel
              </Button>
              <Button
                onClick={handleApplySort}
                className="flex-1 !bg-yellow-400 !text-black hover:!bg-yellow-500 border border-yellow-400/0">
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
