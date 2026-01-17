
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, User, Phone, MapPin, Mail } from "lucide-react";
import { useAdminStore } from "../store/useAdminStore";

interface AddCustomerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddCustomerModal({ open, onOpenChange }: AddCustomerModalProps) {
    const { addCustomer, isLoading } = useAdminStore();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        location: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addCustomer(formData);
        onOpenChange(false);
        setFormData({
            name: '',
            phone: '',
            email: '',
            location: ''
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-6 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                <DialogHeader className="mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-full">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">Add New Customer</DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Manually register a new customer.
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-muted-foreground" /> Full Name *
                        </label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Rahul Verma"
                            className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-muted-foreground" /> Phone Number *
                        </label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            type="tel"
                            placeholder="+91 98765 43210"
                            className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email Address
                        </label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="customer@example.com"
                            className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> Location / Address
                        </label>
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="City, Area"
                            className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        />
                    </div>

                    <DialogFooter className="pt-4 gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="!bg-primary !text-black hover:!bg-primary/90">
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Create Customer
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
