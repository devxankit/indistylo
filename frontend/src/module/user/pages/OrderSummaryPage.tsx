import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Tag, User, Star } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { Button } from "@/components/ui/button";
import { AddressDialog } from "../components/AddressDialog";
import { useState } from "react";
import { useAddressStore } from "../store/useAddressStore";
import { useBookingStore } from "../store/useBookingStore";
import { SlotPicker } from "../components/SlotPicker";
import { mockProfessionals } from "../services/mockData";
import { cn } from "@/lib/utils";
import {
  PaymentMethodPicker,
  type PaymentMethod,
} from "../components/PaymentMethodPicker";

export function OrderSummaryPage() {
  const navigate = useNavigate();
  const {
    items,
    updateQuantity,
    removeItem,
    getItemTotal,
    getConvenienceFee,
    getTotal,
    clearCart,
  } = useCartStore();
  const { getSelectedAddress } = useAddressStore();
  const { addBookings } = useBookingStore();
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("salon");
  const [selectedProfessional, setSelectedProfessional] = useState(
    mockProfessionals[3].id
  );
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const selectedAddress = getSelectedAddress();

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "FIRST50") {
      setIsCouponApplied(true);
    }
  };

  const discountAmount = isCouponApplied ? 50 : 0;
  const finalTotal = Math.max(0, getTotal() - discountAmount);

  const handlePlaceOrder = () => {
    if (items.length === 0 || orderPlaced) return;

    if (!selectedAddress) {
      setIsAddressDialogOpen(true);
      return;
    }

    if (!selectedDate || !selectedTime) {
      return;
    }

    // Create bookings from cart items
    const newBookings = items.map((item) => ({
      salonName: item.salonName || "Home Service",
      service: item.title,
      date: selectedDate,
      time: selectedTime,
      status: "upcoming" as const,
      type: item.type || ("at-home" as const),
    }));

    // Add bookings to store
    addBookings(newBookings);

    // Clear cart
    clearCart();

    // Show order placed message
    setOrderPlaced(true);

    // Navigate to bookings page after 2 seconds
    setTimeout(() => {
      navigate("/bookings");
    }, 2000);
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    const item = items.find((i) => i.id === itemId);
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
            className="p-2 hover:bg-card rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold text-foreground ">Order Summary</h3>
        </div>

        {/* Service Details */}
        {items.length > 0 ? (
          <div className="space-y-2 text-left">
            <h2 className="text-lg font-semibold text-foreground">
              Service Details
            </h2>
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-transparent border border-border rounded-lg p-4 space-y-3">
                {/* Service Name and Category */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.category
                        ? item.category.charAt(0).toUpperCase() +
                          item.category.slice(1)
                        : "Male"}
                    </p>
                  </div>
                  <span className="text-green-500 font-bold text-lg">
                    ₹{item.price}
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Quantity:
                  </span>
                  <div className="flex items-center gap-1 border border-yellow-400 rounded px-1.5 py-0.5">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="text-yellow-400 hover:text-yellow-500 p-0.5">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-foreground font-medium text-xs min-w-[16px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="text-yellow-400 hover:text-yellow-500 p-0.5">
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
            <Button className="mt-4" onClick={() => navigate("/")}>
              Browse Services
            </Button>
          </div>
        )}

        <hr className="border-border my-2" />

        {/* Professional Selection */}
        {items.length > 0 && (
          <div className="space-y-4 px-1">
            <h2 className="text-lg font-semibold text-foreground text-left">
              Select Professional
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
              {mockProfessionals.map((pro) => (
                <button
                  key={pro.id}
                  onClick={() => setSelectedProfessional(pro.id)}
                  className={cn(
                    "flex flex-col items-center min-w-[140px] p-4 rounded-2xl border transition-all",
                    selectedProfessional === pro.id
                      ? "bg-yellow-400/10 border-yellow-400 ring-1 ring-yellow-400"
                      : "bg-card border-border hover:border-yellow-400/50"
                  )}>
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3 overflow-hidden border-2 border-background">
                    {pro.image ? (
                      <img
                        src={pro.image}
                        alt={pro.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm font-bold text-foreground text-center line-clamp-1">
                    {pro.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground text-center mt-0.5">
                    {pro.role}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] font-bold">{pro.rating}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <hr className="border-border my-2" />

        {/* Slot Selection */}
        {items.length > 0 && (
          <div className="space-y-4 px-1">
            <h2 className="text-lg font-semibold text-foreground text-left">
              Select Slot
            </h2>
            <SlotPicker
              onSelect={(date, time) => {
                setSelectedDate(date);
                setSelectedTime(time);
              }}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
          </div>
        )}

        <hr className="border-border my-2" />

        {/* Coupons */}
        {items.length > 0 && (
          <div className="space-y-4 px-1">
            <h2 className="text-lg font-semibold text-foreground text-left">
              Coupons & Offers
            </h2>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
              </div>
              <Button
                variant="outline"
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900"
                onClick={handleApplyCoupon}>
                Apply
              </Button>
            </div>
            {isCouponApplied && (
              <p className="text-xs text-green-500 font-medium ml-1">
                Coupon FIRST50 applied successfully! ₹50 saved.
              </p>
            )}
          </div>
        )}

        <hr className="border-border my-2" />

        {/* Payment Method */}
        {items.length > 0 && (
          <div className="space-y-4 px-1">
            <h2 className="text-lg font-semibold text-foreground text-left">
              Payment Method
            </h2>
            <PaymentMethodPicker
              selected={paymentMethod}
              onSelect={setPaymentMethod}
            />
          </div>
        )}

        <hr className="border-border my-2" />

        {/* Payment Summary */}
        {items.length > 0 && (
          <div className="space-y-4 text-left rounded-lg p-4">
            <h2 className="text-lg  font-semibold text-foreground">
              Payment Summary
            </h2>
            <div className="bg-transparent rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Item Total</span>
                <span className="text-foreground font-medium">
                  ₹{getItemTotal()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Convenience Fee</span>
                <span className="text-foreground font-medium">
                  ₹{getConvenienceFee()}
                </span>
              </div>
              {isCouponApplied && (
                <div className="flex items-center justify-between text-green-500">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="border-t border-border pt-3 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-bold text-lg">
                    Total Amount
                  </span>
                  <span className="text-foreground font-bold text-lg">
                    ₹{finalTotal}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <hr className="border-border my-2" />

        {/* Cancellation Policy */}
        {items.length > 0 && (
          <div className="bg-transparent text-left rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Cancellation Policy
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Cancellation is free at minimum 2 hours before the appointment,
              otherwise there will be no refund.
            </p>
          </div>
        )}

        {/* Delivery Address */}
        {items.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-4 text-left">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Delivery Address
            </h3>
            {selectedAddress ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {selectedAddress.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedAddress.phone}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedAddress.addressLine1}
                  {selectedAddress.addressLine2 &&
                    `, ${selectedAddress.addressLine2}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedAddress.city}, {selectedAddress.state} -{" "}
                  {selectedAddress.pincode}
                </p>
                {selectedAddress.landmark && (
                  <p className="text-sm text-muted-foreground">
                    Near {selectedAddress.landmark}
                  </p>
                )}
                <Button
                  variant="link"
                  className="text-yellow-400 p-0 h-auto mt-2 text-xs"
                  onClick={() => setIsAddressDialogOpen(true)}>
                  Change Address
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  No address selected for delivery
                </p>
                <Button
                  variant="outline"
                  className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900"
                  onClick={() => setIsAddressDialogOpen(true)}>
                  Add Address
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Action Bar */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 pb-8 md:pb-4 z-50">
          <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
            <div className="text-left">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                Total Payable
              </p>
              <p className="text-xl font-black text-foreground">
                ₹{finalTotal}
              </p>
            </div>
            <Button
              className={`flex-1 py-6 rounded-2xl text-lg font-bold transition-all bg-yellow-400 text-white shadow-lg shadow-yellow-400/20 active:scale-95 ${
                (!selectedAddress || !selectedDate || !selectedTime) &&
                !!selectedAddress // Enable if no address
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-yellow-500"
              }`}
              onClick={handlePlaceOrder}
              disabled={
                (selectedAddress && (!selectedDate || !selectedTime)) || // Disable only if address selected but no slot
                orderPlaced
              }>
              {orderPlaced
                ? "Booking..."
                : !selectedAddress
                ? "Add Address"
                : !selectedDate || !selectedTime
                ? "Select Slot"
                : "Place Order"}
            </Button>
          </div>
        </div>
      )}

      {/* Order Placed Message */}
      {orderPlaced && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-lg p-8 mx-4 text-center max-w-md">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Order Placed!
              </h3>
              <p className="text-muted-foreground">
                Your order has been successfully placed.
              </p>
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
