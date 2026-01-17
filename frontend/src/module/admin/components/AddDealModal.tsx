import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Tag, MapPin } from "lucide-react";
import { useContentStore } from "../store/useContentStore";
import { api } from "@/module/user/services/apiClient";

interface AddDealModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface Salon {
    _id: string;
    name: string;
    location: string;
    rating: number;
    geo: {
        coordinates: [number, number]; // [lng, lat]
    };
}

export function AddDealModal({ open, onOpenChange }: AddDealModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [salons, setSalons] = useState<Salon[]>([]);
    const [loadingSalons, setLoadingSalons] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        discount: "",
        salonId: "",
    });

    const { addDeal } = useContentStore();

    // Fetch salons when modal opens
    useEffect(() => {
        if (open) {
            fetchSalons();
        }
    }, [open]);

    const fetchSalons = async () => {
        try {
            setLoadingSalons(true);
            const response: any = await api.get("/admin/vendors");
            // Extract salons from vendors
            const salonList = response
                .filter((vendor: any) => vendor.salon)
                .map((vendor: any) => vendor.salon);
            setSalons(salonList);
        } catch (error) {
            toast.error("Failed to load salons");
            console.error(error);
        } finally {
            setLoadingSalons(false);
        }
    };

    const calculateDistance = () => {
        // Simple mock distance calculation (in real app, use user's location)
        // For now, return a random distance between 0.5 and 10 km
        return parseFloat((Math.random() * 9.5 + 0.5).toFixed(2));
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            toast.error("Please enter a title");
            return;
        }
        if (!formData.discount.trim()) {
            toast.error("Please enter a discount");
            return;
        }
        if (!formData.salonId) {
            toast.error("Please select a salon");
            return;
        }

        setIsLoading(true);

        try {
            const selectedSalon = salons.find(s => s._id === formData.salonId);
            if (!selectedSalon) {
                toast.error("Selected salon not found");
                return;
            }

            const dealData = {
                title: formData.title,
                discount: formData.discount,
                salon: {
                    id: selectedSalon._id,
                    name: selectedSalon.name,
                    location: selectedSalon.location,
                    rating: selectedSalon.rating,
                    distance: calculateDistance(),
                },
            };

            await addDeal(dealData);
            toast.success("Deal created successfully");
            onOpenChange(false);

            // Reset form
            setFormData({
                title: "",
                discount: "",
                salonId: "",
            });
        } catch (error) {
            toast.error("Failed to create deal");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const selectedSalon = salons.find(s => s._id === formData.salonId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-6 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-bold">Create New Deal</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                        Add a last-minute deal for the homepage.
                    </p>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Deal Title</label>
                        <div className="flex items-center gap-2 px-3 py-2 border border-input rounded-lg focus-within:ring-2 focus-within:ring-primary/20">
                            <Tag className="w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="e.g. Hair Services, Skin Services"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="flex-1 bg-transparent border-none text-sm focus:outline-none placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>

                    {/* Discount */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Discount</label>
                        <div className="flex items-center gap-2 px-3 py-2 border border-input rounded-lg focus-within:ring-2 focus-within:ring-primary/20">
                            <span className="text-muted-foreground text-sm">%</span>
                            <input
                                type="text"
                                placeholder="e.g. 80% OFF"
                                value={formData.discount}
                                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                className="flex-1 bg-transparent border-none text-sm focus:outline-none placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>

                    {/* Salon Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Salon</label>
                        {loadingSalons ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            </div>
                        ) : (
                            <select
                                value={formData.salonId}
                                onChange={(e) => setFormData({ ...formData, salonId: e.target.value })}
                                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Choose a salon...</option>
                                {salons.map((salon) => (
                                    <option key={salon._id} value={salon._id}>
                                        {salon.name} - {salon.location}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Salon Preview */}
                    {selectedSalon && (
                        <div className="p-3 bg-muted/50 rounded-lg border border-border/50 space-y-1">
                            <p className="text-sm font-medium">{selectedSalon.name}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span>{selectedSalon.location}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Rating: {selectedSalon.rating > 0 ? selectedSalon.rating : "No ratings yet"}
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="pt-4 gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading || loadingSalons}
                        className="!bg-primary !text-black hover:!bg-primary/90"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Create Deal
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
