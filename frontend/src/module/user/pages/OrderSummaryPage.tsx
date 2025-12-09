import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { Button } from '@/components/ui/button';
import { AddressDialog } from '../components/AddressDialog';
import { useState } from 'react';
import { useAddressStore } from '../store/useAddressStore';
import { useBookingStore } from '../store/useBookingStore';

export function OrderSummaryPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getItemTotal, getConvenienceFee, getTotal, clearCart } = useCartStore();
  const { getSelectedAddress } = useAddressStore();
  const { addBookings } = useBookingStore();
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const selectedAddress = getSelectedAddress();

  const handlePlaceOrder = () => {
    if (!selectedAddress || items.length === 0) return;

    // Generate booking date and time (next day at 10 AM as default)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const bookingDate = tomorrow.toISOString().split('T')[0];
    const bookingTime = '10:00 AM';

    // Create bookings from cart items
    const newBookings = items.map((item) => ({
      salonName: 'Home Service',
      service: item.title,
      date: bookingDate,
      time: bookingTime,
      status: 'upcoming' as const,
      type: 'at-home' as const,
    }));

    // Add bookings to store
    addBookings(newBookings);

    // Clear cart
    clearCart();

    // Show order placed message
    setOrderPlaced(true);

    // Navigate to bookings page after 2 seconds
    setTimeout(() => {
      navigate('/bookings');
    }, 2000);
  };

    const handleQuantityChange = (itemId: string, change: number) => {
        const item = items.find(i => i.id === itemId);
        if (item) {
            const newQuantity = item.quantity + change;
            if (newQuantity <= 0) {
                removeItem(itemId);
            } else {
                updateQuantity(itemId, newQuantity);
            }
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <main className="p-3 space-y-6 pb-40 md:pb-32">
                {/* Header */}
                <div className="flex items-center gap-4 border-b border-border pb-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-card rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h3 className="text-xl font-bold text-foreground ">Order Summary</h3>
                </div>

                {/* Service Details */}
                {items.length > 0 ? (
                    <div className="space-y-2 text-left">
                        <h2 className="text-lg font-semibold text-foreground">Service Details</h2>
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-transparent border border-border rounded-lg p-4 space-y-3"
                            >
                                {/* Service Name and Category */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-base font-semibold text-foreground">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : 'Male'}
                                        </p>
                                    </div>
                                    <span className="text-green-500 font-bold text-lg">
                                        ₹{item.price}
                                    </span>
                                </div>

                                {/* Quantity Selector */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Quantity:</span>
                                    <div className="flex items-center gap-1 border border-yellow-400 rounded px-1.5 py-0.5">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, -1)}
                                            className="text-yellow-400 hover:text-yellow-500 p-0.5"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-foreground font-medium text-xs min-w-[16px] text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(item.id, 1)}
                                            className="text-yellow-400 hover:text-yellow-500 p-0.5"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Your cart is empty</p>
                        <Button
                            className="mt-4"
                            onClick={() => navigate('/')}
                        >
                            Browse Services
                        </Button>
                    </div>
                )}




                <hr className='border-border my-2' />


                {/* Payment Summary */}
                {items.length > 0 && (
                    <div className="space-y-4 text-left rounded-lg p-4">
                        <h2 className="text-lg  font-semibold text-foreground">Payment Summary</h2>
                        <div className="bg-transparent rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Item Total</span>
                                <span className="text-foreground font-medium">₹{getItemTotal()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Convenience Fee</span>
                                <span className="text-foreground font-medium">₹{getConvenienceFee()}</span>
                            </div>
                            <div className="border-t border-border pt-3 mt-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-foreground font-bold text-lg">Total Amount</span>
                                    <span className="text-foreground font-bold text-lg">₹{getTotal()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <hr className='border-border my-2' />

                {/* Cancellation Policy */}
                {items.length > 0 && (
                    <div className="bg-transparent text-left rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-foreground mb-2">Cancellation Policy</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Cancellation is free at minimum 2 hours before the appointment, otherwise there will be no refund.
                        </p>
                    </div>
                )}

                {/* Selected Address Display */}
                {items.length > 0 && selectedAddress && (
                    <div className="bg-card border border-border rounded-lg p-4 text-left">
                        <h3 className="text-sm font-semibold text-foreground mb-2">Delivery Address</h3>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-foreground">{selectedAddress.name}</p>
                            <p className="text-sm text-muted-foreground">{selectedAddress.phone}</p>
                            <p className="text-sm text-muted-foreground">
                                {selectedAddress.addressLine1}
                                {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                            </p>
                            {selectedAddress.landmark && (
                                <p className="text-sm text-muted-foreground">Near {selectedAddress.landmark}</p>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Place Order / Add Address Button - Fixed at bottom, above BottomNav on mobile */}
            {items.length > 0 && !orderPlaced && (
                <div className="fixed left-0 right-0 p-4 bg-background border-t border-border shadow-lg bottom-16 md:bottom-0 space-y-2" style={{ zIndex: 60 }}>
                    {selectedAddress ? (
                        <>
                            <Button
                                className="w-full bg-yellow-500 text-white hover:bg-yellow-600 font-semibold rounded-lg"
                                size="lg"
                                onClick={handlePlaceOrder}
                            >
                                Place Order
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full font-semibold rounded-lg"
                                size="lg"
                                onClick={() => setIsAddressDialogOpen(true)}
                            >
                                Change Address
                            </Button>
                        </>
                    ) : (
                        <Button
                            className="w-full bg-yellow-500 text-white hover:bg-foreground/90 font-semibold rounded-lg"
                            size="lg"
                            onClick={() => setIsAddressDialogOpen(true)}
                        >
                            Add Address
                        </Button>
                    )}
                </div>
            )}

            {/* Order Placed Message */}
            {orderPlaced && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-background border border-border rounded-lg p-8 mx-4 text-center max-w-md">
                        <div className="mb-4">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">Order Placed!</h3>
                            <p className="text-muted-foreground">Your order has been successfully placed.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Address Dialog */}
            <AddressDialog
                open={isAddressDialogOpen}
                onOpenChange={setIsAddressDialogOpen}
            />
        </div>
    );
}

