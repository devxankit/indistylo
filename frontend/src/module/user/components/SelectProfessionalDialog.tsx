import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Professional } from "../services/types";
import { Star, User, ChevronRight, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useSalonStore } from "../store/useSalonStore";

interface SelectProfessionalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (professional: Professional) => void;
  salonId?: string;
}

export function SelectProfessionalDialog({
  isOpen,
  onClose,
  onSelect,
  salonId,
}: SelectProfessionalDialogProps) {
  const { staff, loading, fetchStaff } = useSalonStore();

  useEffect(() => {
    if (isOpen && salonId) {
      fetchStaff(salonId);
    }
  }, [isOpen, salonId, fetchStaff]);

  const anyProfessional: Professional = {
    id: "any",
    name: "Any Professional",
    role: "Next Available",
    rating: 5.0,
    experience: "Best for quick service",
  };

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
            {loading && staff.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <button
                  onClick={() => onSelect(anyProfessional)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left border border-transparent hover:border-border/50">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">
                      {anyProfessional.name}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {anyProfessional.role}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
                </button>

                {staff.map((pro: any) => (
                  <button
                    key={pro._id}
                    onClick={() =>
                      onSelect({
                        id: pro._id,
                        name: pro.name,
                        role: pro.role,
                        rating: 5.0, // Backend staff model doesn't have rating yet
                        experience: pro.specialization?.join(", ") || "Expert",
                        image: pro.image,
                      })
                    }
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
                          5.0 <Star className="w-3 h-3 ml-0.5 fill-current" />
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {pro.role} •{" "}
                        {pro.specialization?.join(", ") || "Expert"}
                      </p>
                    </div>

                    <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
