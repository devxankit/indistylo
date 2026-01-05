import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Store, MapPin, Calendar, CreditCard, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface Booking {
    id: string;
    customer: string;
    vendor: string;
    amount: number;
    status: string;
    date: string;
    customerLocation?: string;
    services?: string[];
}

interface InspectBookingModalProps {
    booking: Booking | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onStatusUpdate: (id: string, status: string) => void;
}

export function InspectBookingModal({ booking, open, onOpenChange, onStatusUpdate }: InspectBookingModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    if (!booking) return null;

    const handleAction = (status: string) => {
        setIsLoading(true);
        setTimeout(() => {
            onStatusUpdate(booking.id, status);
            toast.success(`Order marked as ${status}`);
            setIsLoading(false);
            onOpenChange(false);
        }, 800);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-6 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                <DialogHeader className="mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                Booking Details
                                <span className="text-muted-foreground font-normal text-base">#{booking.id}</span>
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> {booking.date}
                            </p>
                        </div>
                        <span className={`capitalize px-3 py-1 rounded-full text-sm font-medium border
                            ${booking.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                    'bg-red-100 text-red-700 border-red-200'}`}>
                            {booking.status}
                        </span>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-6 py-2">
                    {/* Customer Info */}
                    <div className="space-y-4 p-4 rounded-lg bg-muted/20 border border-border/50">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            <User className="w-4 h-4" /> Customer
                        </div>
                        <div>
                            <p className="font-semibold text-lg">{booking.customer}</p>
                            <div className="flex items-start gap-2 mt-2 text-sm text-muted-foreground">
                                <MapPin className="w-3.5 h-3.5 mt-0.5" />
                                <span>{booking.customerLocation || "Sector 45, Gurgaon"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Vendor Info */}
                    <div className="space-y-4 p-4 rounded-lg bg-muted/20 border border-border/50">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            <Store className="w-4 h-4" /> Vendor
                        </div>
                        <div>
                            <p className="font-semibold text-lg">{booking.vendor}</p>
                            <div className="flex items-start gap-2 mt-2 text-sm text-muted-foreground">
                                <CreditCard className="w-3.5 h-3.5 mt-0.5" />
                                <span>Total: <span className="text-foreground font-bold">₹{booking.amount}</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="my-2">
                    <p className="text-sm font-medium mb-2 text-muted-foreground">Services Booked</p>
                    <div className="flex flex-wrap gap-2">
                        {['Haircut', 'Spa Treatment', 'Manicure'].map((s) => (
                            <span key={s} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border/50">
                                {s}
                            </span>
                        ))}
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-2 pt-4">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="hover:bg-muted"
                    >
                        Close
                    </Button>

                    {booking.status === 'pending' && (
                        <>
                            <Button
                                variant="destructive"
                                disabled={isLoading}
                                onClick={() => handleAction('cancelled')}
                                className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200"
                            >
                                <XCircle className="w-4 h-4 mr-2" /> Cancel Order
                            </Button>
                            <Button
                                disabled={isLoading}
                                onClick={() => handleAction('completed')}
                                className="!bg-primary !text-black hover:!bg-primary/90"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" /> Mark Completed
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
