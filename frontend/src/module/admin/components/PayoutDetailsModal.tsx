
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Landmark, Info } from "lucide-react";

interface PayoutRequest {
    id: string;
    vendor: string;
    amount: number;
    requested: string;
    status: string;
    bankDetails?: {
        accountNumber: string;
        ifsc: string;
        bankName: string;
        holderName: string;
    };
}

interface PayoutDetailsModalProps {
    payout: PayoutRequest | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onProcess: (id: string, status: 'processed' | 'rejected') => void;
}

export function PayoutDetailsModal({ payout, open, onOpenChange, onProcess }: PayoutDetailsModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    if (!payout) return null;

    // Mock bank details if missing
    const bankDetails = payout.bankDetails || {
        accountNumber: "XXXX XXXX 1234",
        ifsc: "HDFC0001234",
        bankName: "HDFC Bank",
        holderName: payout.vendor
    };

    const handleAction = (status: 'processed' | 'rejected') => {
        setIsLoading(true);
        setTimeout(() => {
            onProcess(payout.id, status);
            toast.success(status === 'processed' ? "Payout processed successfully" : "Payout rejected");
            setIsLoading(false);
            onOpenChange(false);
        }, 1500);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-6 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                <DialogHeader className="mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-green-100 rounded-full">
                            <Landmark className="w-5 h-5 text-green-700" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">Payout Request</DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Review bank details before processing.
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-3">
                        <div className="flex justify-between items-center pb-3 border-b border-border/50">
                            <span className="text-sm text-muted-foreground">Requested Amount</span>
                            <span className="text-2xl font-bold">₹{payout.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Vendor</span>
                            <span className="font-medium">{payout.vendor}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Date</span>
                            <span className="font-medium">{payout.requested}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Info className="w-4 h-4 text-primary" /> Bank Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="p-3 bg-card rounded-lg border border-border">
                                <span className="block text-xs text-muted-foreground mb-1">Bank Name</span>
                                <span className="font-medium">{bankDetails.bankName}</span>
                            </div>
                            <div className="p-3 bg-card rounded-lg border border-border">
                                <span className="block text-xs text-muted-foreground mb-1">IFSC Code</span>
                                <span className="font-medium font-mono">{bankDetails.ifsc}</span>
                            </div>
                            <div className="col-span-2 p-3 bg-card rounded-lg border border-border">
                                <span className="block text-xs text-muted-foreground mb-1">Account Number</span>
                                <span className="font-medium font-mono tracking-wide">{bankDetails.accountNumber}</span>
                            </div>
                            <div className="col-span-2 p-3 bg-card rounded-lg border border-border">
                                <span className="block text-xs text-muted-foreground mb-1">Account Holder</span>
                                <span className="font-medium">{bankDetails.holderName}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="pt-6 gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        variant="destructive"
                        disabled={isLoading}
                        className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                        onClick={() => handleAction('rejected')}
                    >
                        Reject
                    </Button>
                    <Button
                        disabled={isLoading}
                        className="!bg-primary !text-black hover:!bg-primary/90"
                        onClick={() => handleAction('processed')}
                    >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Approve & Pay
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
