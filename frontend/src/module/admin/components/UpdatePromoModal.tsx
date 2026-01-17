import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { useContentStore } from "../store/useContentStore";
import { ImageUpload } from "@/module/vendor/vendor-components/ImageUpload";

interface UpdatePromoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdatePromoModal({ open, onOpenChange }: UpdatePromoModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState<string>("");

    const { updatePromoBanner, promoBanner } = useContentStore();

    // Initialize with current banner
    useEffect(() => {
        if (open && promoBanner && typeof promoBanner === 'string') {
            setImage(promoBanner);
        } else {
            setImage("");
        }
    }, [open, promoBanner]);

    const handleSave = async () => {
        if (!image) {
            toast.error("Please select an image");
            return;
        }

        try {
            setIsLoading(true);
            await updatePromoBanner(image);
            toast.success("Promo banner updated successfully");
            onOpenChange(false);
        } catch (error) {
            toast.error("Failed to update banner");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-6 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                <DialogHeader className="mb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold">Update Promo Banner</DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        Update the promotional banner displayed on the home page.
                    </p>
                </DialogHeader>

                <div className="space-y-4">
                    <ImageUpload
                        value={image}
                        onChange={(val) => setImage(val as string)}
                        label="Upload Banner"
                        maxSizeMB={5}
                        className="aspect-[21/9] w-full"
                        uploadEndpoint="/admin/upload"
                    />
                </div>

                <DialogFooter className="pt-4 gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="!bg-primary !text-black hover:!bg-primary/90"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Update Banner
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
