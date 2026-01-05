import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AdminExportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AdminExportModal({ open, onOpenChange }: AdminExportModalProps) {
    const [date, setDate] = useState<string>("");
    const [reportType, setReportType] = useState('revenue');

    const handleExport = () => {
        toast.success("Report generation started", {
            description: "You will receive a notification when it's ready."
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Export Report</DialogTitle>
                    <p className="text-sm text-muted-foreground">Select the type of report and date range you want to export.</p>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="report-type" className="text-right text-sm font-medium">
                            Type
                        </label>
                        <div className="col-span-3">
                            <select
                                id="report-type"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                            >
                                <option value="revenue">Revenue Data</option>
                                <option value="users">User Activity</option>
                                <option value="vendors">Vendor Performance</option>
                                <option value="bookings">Booking History</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="date" className="text-right text-sm font-medium">
                            Date
                        </label>
                        <div className="col-span-3">
                            <input
                                type="date"
                                id="date"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button className="!bg-primary !text-black hover:!bg-primary/90" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
