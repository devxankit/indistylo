import { useState } from 'react';
import { mockBookings } from '../services/mockData';
import { Button } from '@/components/ui/button';
import { BookingsHeader } from '../components/BookingsHeader';
import { BookingsTabs } from '../components/BookingsTabs';
import { BookingCard } from '../components/BookingCard';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../store/useBookingStore';

type BookingTabType = 'Upcoming' | 'Completed' | 'Cancelled' | 'Missed'
type SortOption = 'creation' | 'booking'

export function BookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingTabType>('Upcoming');
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('creation');
  const [pendingSort, setPendingSort] = useState<SortOption>('creation');
  const navigate = useNavigate();
  const { getBookings } = useBookingStore();

  // Combine mock bookings with store bookings
  const allBookings = [...mockBookings, ...getBookings()];

  const getBookingsByStatus = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return allBookings.filter((b) => b.status === 'upcoming');
      case 'Completed':
        return allBookings.filter((b) => b.status === 'completed');
      case 'Cancelled':
        return allBookings.filter((b) => b.status === 'cancelled');
      case 'Missed':
        return allBookings.filter((b) => b.status === 'missed');
      default:
        return [];
    }
  };

  const sortBookings = (bookings: typeof allBookings, sortBy: SortOption) => {
    const toDate = (booking: (typeof mockBookings)[number]) =>
      new Date(`${booking.date} ${booking.time}`)

    return [...bookings].sort((a, b) => {
      const dateA = toDate(a).getTime()
      const dateB = toDate(b).getTime()

      if (sortBy === 'creation') {
        // Newest first
        return dateB - dateA
      }

      // Booking date: earliest first
      return dateA - dateB
    })
  }

  const currentBookings = sortBookings(getBookingsByStatus(activeTab), selectedSort);

  const sortOptions: { id: SortOption; label: string }[] = [
    { id: 'creation', label: 'Creation Date' },
    { id: 'booking', label: 'Booking Date' },
  ]

  const handleOpenSort = () => {
    setPendingSort(selectedSort)
    setShowSortSheet(true)
  }

  const handleApplySort = () => {
    setSelectedSort(pendingSort)
    setShowSortSheet(false)
  }

  return (
    <div className="min-h-screen bg-[#060606] pb-20">
      <BookingsHeader onSortClick={handleOpenSort} />

      <main className="px-4 py-4 space-y-6">
        {/* Tab Switcher */}
        <BookingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Bookings List */}
        {currentBookings.length > 0 ? (
          <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
            {currentBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onReschedule={() => {
                  // Handle reschedule
                  console.log('Reschedule', booking.id)
                }}
                onCancel={() => {
                  // Handle cancel
                  console.log('Cancel', booking.id)
                }}
                onBookAgain={() => {
                  // Navigate to booking page
                  navigate('/at-salon')
                }}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <p className="text-[#f5f5f5]/60 mb-6 text-sm">
              You will see it, when you'll Book One!
            </p>
            <Button
              onClick={() => navigate('/at-salon')}
              className="bg-[#151515] text-white hover:bg-[#202020] px-6 py-3 rounded-lg font-semibold"
            >
              Book Now
            </Button>
          </div>
        )}
      </main>

      {showSortSheet && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-[1px]"
          onClick={() => setShowSortSheet(false)}
        >
          <div
            className="bg-[#060606] border-t border-[#3a3a3a] rounded-t-3xl p-5 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto w-10 h-1.5 bg-[#2a2a2a] rounded-full" />
            <h3 className="text-center text-base font-semibold text-[#f5f5f5]">Sort By</h3>

            <div className="space-y-3">
              {sortOptions.map((option) => {
                const isSelected = pendingSort === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => setPendingSort(option.id)}
                    className="flex items-center gap-3 w-full text-left"
                  >
                    <span
                      className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isSelected
                          ? 'bg-yellow-400 border-yellow-400'
                          : 'border-[#3a3a3a] bg-transparent'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-sm bg-black" />}
                    </span>
                    <span className={`text-sm ${isSelected ? 'text-[#f5f5f5]' : 'text-[#f5f5f5]/70'}`}>
                      {option.label}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowSortSheet(false)}
                className="flex-1 border-[#3a3a3a] text-[#f5f5f5]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplySort}
                className="flex-1 !bg-yellow-400 !text-black hover:!bg-yellow-500 border border-yellow-400/0"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

