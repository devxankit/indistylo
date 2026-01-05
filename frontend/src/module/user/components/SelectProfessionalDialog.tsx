import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { mockProfessionals } from "../services/mockData";
import { type Professional } from "../services/types";
import { Star, User, ChevronRight } from "lucide-react";

interface SelectProfessionalDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (professional: Professional) => void;
}

export function SelectProfessionalDialog({
    isOpen,
    onClose,
    onSelect,
}: SelectProfessionalDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-0 overflow-hidden bg-background">
                <DialogHeader className="px-4 py-3 border-b border-border">
                    <DialogTitle className="text-lg font-semibold text-center">
                        Select Professional
                    </DialogTitle>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto">
                    <div className="p-2 space-y-2">
                        {mockProfessionals.map((pro) => (
                            <button
                                key={pro.id}
                                onClick={() => onSelect(pro)}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left border border-transparent hover:border-border/50">
                                {/* Avatar / Placeholder */}
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    {pro.image ? (
                                        <img
                                            src={pro.image}
                                            alt={pro.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-6 h-6 text-primary" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-foreground truncate">
                                            {pro.name}
                                        </h4>
                                        <span className="flex items-center text-xs font-bold text-yellow-500 bg-yellow-400/10 px-1.5 py-0.5 rounded">
                                            {pro.rating} <Star className="w-3 h-3 ml-0.5 fill-current" />
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {pro.role} • {pro.experience}
                                    </p>
                                </div>

                                <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
                            </button>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
