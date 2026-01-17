import { useState, useEffect } from "react";
import { X, Loader2, User, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Professional } from "../store/useVendorProfessionalStore";
import { ImageUpload } from "./ImageUpload";

interface AddProfessionalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Professional> & { imageFile?: File }) => Promise<void>;
    professional?: Professional | null; // If provided, we are in edit mode
}

export function AddProfessionalModal({
    isOpen,
    onClose,
    onSave,
    professional,
}: AddProfessionalModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        role: "Stylist",
        specialization: "",
        gender: "female",
        address: "",
        image: "",
    });

    useEffect(() => {
        if (professional) {
            setFormData({
                name: professional.name,
                role: professional.role,
                specialization: professional.specialization.join(", "),
                gender: professional.gender,
                address: professional.address,
                image: professional.image || "",
            });
        } else {
            setFormData({
                name: "",
                role: "Stylist",
                specialization: "",
                gender: "female",
                address: "",
                image: "",
            });
        }
    }, [professional, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({
                ...formData,
                specialization: formData.specialization.split(",").map((s) => s.trim()),
            } as any);
            onClose();
        } catch (error) {
            // Error handled in store
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-4">
                        <div className="bg-background rounded-2xl shadow-xl border border-border overflow-hidden">
                            <div className="p-4 border-b border-border flex items-center justify-between">
                                <h2 className="text-lg font-semibold">
                                    {professional ? "Edit Professional" : "Add New Professional"}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-muted rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="flex justify-center mb-6">
                                    <div className="w-32">
                                        <ImageUpload
                                            value={formData.image}
                                            onChange={(val) => setFormData(prev => ({ ...prev, image: val as string }))}
                                            label="Photo"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                required
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                placeholder="e.g. Sarah Jones"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Gender</label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            >
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-1 block">Role</label>
                                            <input
                                                required
                                                name="role"
                                                value={formData.role}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                placeholder="e.g. Senior Stylist"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Specialization (comma separated)</label>
                                        <input
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            placeholder="e.g. Haircut, Coloring, Spa"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                rows={3}
                                                className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                                placeholder="Enter full address"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 py-2.5 rounded-xl border border-border font-medium hover:bg-muted transition-colors">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {professional ? "Save Changes" : "Add Professional"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
