
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Layers } from "lucide-react";
import { useContentStore, type Category } from "../store/useContentStore";
import { ImageUpload } from "@/module/vendor/vendor-components/ImageUpload";

interface AddCategoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: Category | null; // Optional category for editing
}

export function AddCategoryModal({ open, onOpenChange, category }: AddCategoryModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [categoryImage, setCategoryImage] = useState<string | null>(null);
    const [subCategories, setSubCategories] = useState<string[]>([""]);
    const { addCategory, updateCategory } = useContentStore();

    // Reset or populate form when modal opens or category changes
    useEffect(() => {
        if (open) {
            if (category) {
                setCategoryName(category.name);
                setCategoryImage(category.image || null);
                setSubCategories(category.subCategories.length > 0 ? category.subCategories : [""]);
            } else {
                // Reset for new category
                setCategoryName("");
                setCategoryImage(null);
                setSubCategories([""]);
            }
        }
    }, [open, category]);

    const addSubCategory = () => setSubCategories([...subCategories, ""]);

    const removeSubCategory = (index: number) => {
        const newSubs = [...subCategories];
        newSubs.splice(index, 1);
        setSubCategories(newSubs);
    };

    const updateSubCategory = (index: number, value: string) => {
        const newSubs = [...subCategories];
        newSubs[index] = value;
        setSubCategories(newSubs);
    };

    const handleSave = () => {
        if (!categoryName) {
            toast.error("Category name is required");
            return;
        }
        setIsLoading(true);
        setTimeout(async () => {
            try {
                const subCats = subCategories.filter(s => s.trim() !== "");
                if (category) {
                    // Update existing
                    await updateCategory(category._id, {
                        name: categoryName,
                        image: categoryImage || "",
                        subCategories: subCats,
                    });
                    toast.success("Category updated successfully");
                } else {
                    // Create new
                    await addCategory({
                        name: categoryName,
                        image: categoryImage || "",
                        subCategories: subCats,
                    });
                    toast.success("Category created successfully");
                }
                onOpenChange(false);
            } catch (error) {
                toast.error("Failed to save category");
            } finally {
                setIsLoading(false);
            }
        }, 1000); // reduced timeout slightly, added real async await inside
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-6 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                <DialogHeader className="mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-full">
                            <Layers className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">
                                {category ? "Edit Service Category" : "Add Service Category"}
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {category ? "Update category details." : "Create a new main category for services."}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="w-full flex justify-center">
                        <div className="w-32">
                            <ImageUpload
                                value={categoryImage || ""}
                                onChange={(val) => setCategoryImage(val as string)}
                                label="Icon"
                                maxSizeMB={2}
                                uploadEndpoint="/admin/upload"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Massage Therapy"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Sub-Categories</label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={addSubCategory}
                                className="h-8 text-xs text-primary hover:text-primary hover:bg-primary/10"
                            >
                                <Plus className="w-3 h-3 mr-1" /> Add Sub
                            </Button>
                        </div>
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                            {subCategories.map((sub, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Sub-category name"
                                        value={sub}
                                        onChange={(e) => updateSubCategory(index, e.target.value)}
                                        className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                                    />
                                    {subCategories.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 text-muted-foreground hover:text-destructive"
                                            onClick={() => removeSubCategory(index)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter className="pt-4 gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isLoading} className="!bg-primary !text-black hover:!bg-primary/90">
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {category ? "Update Category" : "Create Category"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
