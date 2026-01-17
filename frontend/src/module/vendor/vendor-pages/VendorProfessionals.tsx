import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    MapPin,
    User,
    Briefcase,
    Trash2,
    Edit,
    UserPlus
} from "lucide-react";
import { useVendorProfessionalStore, type Professional } from "../store/useVendorProfessionalStore";
import { AddProfessionalModal } from "../vendor-components/AddProfessionalModal";
import { Loader2 } from "lucide-react";

export function VendorProfessionals() {
    const { professionals, loading, fetchProfessionals, deleteProfessional, addProfessional, updateProfessional } =
        useVendorProfessionalStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);

    useEffect(() => {
        fetchProfessionals();
    }, [fetchProfessionals]);

    const filteredProfessionals = professionals.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (professional: Professional) => {
        setSelectedProfessional(professional);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this professional?")) {
            await deleteProfessional(id);
        }
    };

    const handleSave = async (data: any) => {
        if (selectedProfessional) {
            await updateProfessional(selectedProfessional._id, data);
        } else {
            await addProfessional(data);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProfessional(null);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border transition-all">
                <div className="px-5 py-4 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Professionals
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Manage your salon team
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-semibold">Add New</span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="px-5 pb-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search professionals by name or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-4 py-2.5 bg-muted/40 border border-transparent rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:border-primary/20 focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
                {loading && professionals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground animate-pulse">Loading professionals...</p>
                    </div>
                ) : filteredProfessionals.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                    >
                        <div className="p-4 bg-muted/50 rounded-full">
                            <UserPlus className="w-12 h-12 text-muted-foreground/50" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-foreground">No professionals yet</h3>
                            <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
                                Add your staff members to manage their profiles and assignments.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-4 px-6 py-2.5 bg-white text-black rounded-full font-medium hover:bg-muted transition-colors"
                        >
                            Add Your First Professional
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence mode="popLayout">
                            {filteredProfessionals.map((prof) => (
                                <motion.div
                                    key={prof._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    layout
                                    className="group relative bg-card border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all hover:border-primary/20"
                                >
                                    <div className="flex gap-4">
                                        {/* Image */}
                                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-muted flex-shrink-0 border border-border/50">
                                            {prof.image ? (
                                                <img
                                                    src={prof.image}
                                                    alt={prof.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                                    <User className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                            )}
                                            {/* Active Status Indicator */}
                                            <div className={`absolute bottom-0 inset-x-0 h-1 ${prof.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="flex justify-between items-start -mt-0.5">
                                                <div className="space-y-0.5">
                                                    <h3 className="font-semibold text-base text-foreground truncate pr-2">
                                                        {prof.name}
                                                    </h3>
                                                    <p className="text-sm text-primary font-medium flex items-center gap-1.5">
                                                        {prof.role}
                                                    </p>
                                                </div>

                                                {/* Actions Dropdown Trigger (Hidden for better UX, using direct buttons instead) */}
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleEdit(prof); }}
                                                        className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(prof._id); }}
                                                        className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details section */}
                                    <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Specialization</div>
                                            <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                                                <Briefcase className="w-3.5 h-3.5 text-primary/70" />
                                                <span className="truncate">{prof.specialization[0]} {prof.specialization.length > 1 && `+${prof.specialization.length - 1}`}</span>
                                            </div>
                                        </div>
                                        {prof.address && (
                                            <div className="space-y-1">
                                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Location</div>
                                                <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                                                    <MapPin className="w-3.5 h-3.5 text-primary/70" />
                                                    <span className="truncate">{prof.address}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Quick Action Overlay for Mobile */}
                                    <div className="md:hidden absolute top-4 right-4 flex gap-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEdit(prof); }}
                                            className="p-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg shadow-sm"
                                        >
                                            <Edit className="w-4 h-4 text-foreground" />
                                        </button>
                                    </div>

                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <AddProfessionalModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                professional={selectedProfessional}
            />
        </div>
    );
}
