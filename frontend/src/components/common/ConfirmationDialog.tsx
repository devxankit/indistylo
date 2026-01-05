import { motion } from "framer-motion";
import { AlertTriangle, Info } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogBody,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title: string;
    description: string;
    variant?: "destructive" | "default";
    confirmText?: string;
    cancelText?: string;
}

export function ConfirmationDialog({
    open,
    onOpenChange,
    onConfirm,
    title,
    description,
    variant = "default",
    confirmText = "Confirm",
    cancelText = "Cancel",
}: ConfirmationDialogProps) {
    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    const isDestructive = variant === "destructive";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                isDestructive ? "bg-red-400/10" : "bg-primary/10"
                            )}>
                            {isDestructive ? (
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                            ) : (
                                <Info className="w-5 h-5 text-primary" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-base font-semibold text-foreground text-left">
                                {title}
                            </DialogTitle>
                        </div>
                        <DialogClose onClose={() => onOpenChange(false)} />
                    </div>
                </DialogHeader>
                <DialogBody className="px-4 pb-4">
                    <div className="space-y-4">
                        <p className="text-sm text-left text-muted-foreground">{description}</p>
                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="flex-1 min-h-[44px] touch-manipulation">
                                {cancelText}
                            </Button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleConfirm}
                                className={cn(
                                    "flex-1 min-h-[44px] rounded-lg font-medium transition-colors touch-manipulation text-white",
                                    isDestructive
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                                )}>
                                {confirmText}
                            </motion.button>
                        </div>
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
