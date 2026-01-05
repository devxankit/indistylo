
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Percent } from "lucide-react";

interface CommissionSettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentRate: number;
    onRateUpdate: (newRate: number) => void;
}

export function CommissionSettingsModal({ open, onOpenChange, currentRate, onRateUpdate }: CommissionSettingsModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [rate, setRate] = useState(currentRate.toString());

    const handleSave = () => {
        const newRate = parseFloat(rate);
        if (isNaN(newRate) || newRate < 0 || newRate > 100) {
            toast.error("Please enter a valid percentage between 0 and 100");
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            onRateUpdate(newRate);
            toast.success("Commission rate updated successfully");
            setIsLoading(false);
            onOpenChange(false);
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] p-6 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                <DialogHeader className="mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 rounded-full">
                            <Percent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">Commission Rate</DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Set the global platform fee percentage.
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Percentage (%)</label>
                        <div className="flex items-center gap-2 px-3 py-2 border border-input rounded-lg focus-within:ring-2 focus-within:ring-primary/20">
                            <input
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                className="flex-1 bg-transparent border-none text-lg font-bold focus:outline-none"
                                min="0"
                                max="100"
                                step="0.1"
                            />
                            <span className="text-muted-foreground font-medium">%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            This rate will apply to all future orders.
                        </p>
                    </div>
                </div>

                <DialogFooter className="pt-4 gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isLoading} className="!bg-primary !text-black hover:!bg-primary/90">
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Update Rate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
