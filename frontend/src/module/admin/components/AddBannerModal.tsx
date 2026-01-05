
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Link, Loader2 } from "lucide-react";
import { useContentStore } from "../store/useContentStore";
import { ImageUpload } from "@/module/vendor/vendor-components/ImageUpload";

interface AddBannerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddBannerModal({ open, onOpenChange }: AddBannerModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const { addBanner } = useContentStore();

    const handleSave = () => {
        if (!bannerImage) {
            toast.error("Please select an image");
            return;
        }
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            addBanner({
                image: bannerImage,
                link: "", // Optional link handling can be added later if needed
            });
            toast.success("Banner uploaded successfully");
            setIsLoading(false);
            onOpenChange(false);
            setBannerImage(null);
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-6 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-bold">Upload New Banner</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                        Add a promotional banner to the user app home screen.
                    </p>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="w-full">
                        <ImageUpload
                            value={bannerImage || ""}
                            onChange={(val) => setBannerImage(val as string)}
                            label="Upload Banner"
                            maxSizeMB={5}
                            className="aspect-video w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Link Target (Optional)</label>
                        <div className="flex items-center gap-2 px-3 py-2 border border-input rounded-lg focus-within:ring-2 focus-within:ring-primary/20">
                            <Link className="w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="e.g. /category/spa"
                                className="flex-1 bg-transparent border-none text-sm focus:outline-none placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="pt-4 gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isLoading} className="!bg-primary !text-black hover:!bg-primary/90">
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Upload Banner
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
