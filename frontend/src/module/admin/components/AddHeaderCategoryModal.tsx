import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Loader2, Layers } from "lucide-react";
import { useCategoryStore, type HeaderCategory } from "../store/useCategoryStore";

interface AddHeaderCategoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    headerCategory?: HeaderCategory | null;
    type?: "SALON" | "SPA";
}

export function AddHeaderCategoryModal({ open, onOpenChange, headerCategory, type = "SALON" }: AddHeaderCategoryModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const { createHeaderCategory, updateHeaderCategory } = useCategoryStore();

    useEffect(() => {
        if (open) {
            if (headerCategory) {
                setName(headerCategory.name);
            } else {
                setName("");
            }
        }
    }, [open, headerCategory]);

    const handleSave = async () => {
        if (!name.trim()) {
            return;
        }

        setIsLoading(true);
        try {
            if (headerCategory) {
                await updateHeaderCategory(headerCategory._id, name);
            } else {
                await createHeaderCategory(name, type);
            }
            onOpenChange(false);
        } catch (error) {
            // Error already handled in store
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] p-6 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                <DialogHeader className="mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-full">
                            <Layers className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">
                                {headerCategory ? "Edit Header Category" : "Add Header Category"}
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {headerCategory ? "Update the category name." : "Create a new header category."}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Hair, Skin, Nails"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !isLoading) {
                                    handleSave();
                                }
                            }}
                        />
                    </div>
                </div>

                <DialogFooter className="pt-4 gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading || !name.trim()}
                        className="!bg-primary !text-black hover:!bg-primary/90"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {headerCategory ? "Update" : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
