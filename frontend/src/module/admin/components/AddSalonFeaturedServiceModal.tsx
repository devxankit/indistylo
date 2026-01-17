import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { useContentStore, type FeaturedService } from "../store/useContentStore";
import { useCategoryStore } from "../store/useCategoryStore";
import { ImageUpload } from "@/module/vendor/vendor-components/ImageUpload";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddSalonFeaturedServiceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddSalonFeaturedServiceModal({ open, onOpenChange }: AddSalonFeaturedServiceModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [image, setImage] = useState<string | null>(null);
    const [gender, setGender] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [subCategory, setSubCategory] = useState<string>("");

    // Store Data
    const { addSalonFeaturedService } = useContentStore();
    const { headerCategories, subcategories, fetchHeaderCategories, fetchSubcategories } = useCategoryStore();

    useEffect(() => {
        if (open) {
            fetchHeaderCategories();
            // Reset state
            setImage(null);
            setGender("");
            setCategory("");
            setSubCategory("");
        }
    }, [open]);

    // Fetch subcategories when gender changes
    useEffect(() => {
        if (gender === 'male' || gender === 'female') {
            fetchSubcategories(gender.toUpperCase() as "MALE" | "FEMALE");
        }
    }, [gender]);

    // Derived Options
    const availableCategories = useMemo(() => {
        return headerCategories.map(c => c.name);
    }, [headerCategories]);

    // Filter Sub Categories based on Header Category Name match
    const availableSubCategories = useMemo(() => {
        if (!category) return [];
        const selectedHeader = headerCategories.find(h => h.name === category);
        if (!selectedHeader) return [];

        return subcategories.filter(s => {
            const hId = typeof s.headerCategoryId === 'string' ? s.headerCategoryId : s.headerCategoryId._id;
            return hId === selectedHeader._id;
        }).map(s => s.name);
    }, [subcategories, headerCategories, category]);

    const handleAdd = async () => {
        if (!image) {
            toast.error("Please upload an image");
            return;
        }
        if (!gender) {
            toast.error("Please select a gender");
            return;
        }
        if (!category) {
            toast.error("Please select a category");
            return;
        }
        if (!subCategory) {
            toast.error("Please select a sub-category");
            return;
        }

        try {
            setIsLoading(true);
            const newService: FeaturedService = {
                image,
                gender,
                category,
                subCategory,
                name: subCategory, // Name is the subcategory
            };

            await addSalonFeaturedService(newService);
            onOpenChange(false);
        } catch (error) {
            toast.error("Failed to add featured service");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-6 bg-background border-border shadow-2xl">
                <DialogHeader className="mb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold">Add At Salon Featured Service</DialogTitle>
                        <DialogClose onClose={() => onOpenChange(false)} />
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>Service Image</Label>
                        <ImageUpload
                            value={image || ""}
                            onChange={(val) => setImage(val as string)}
                            label="Upload Image"
                            maxSizeMB={5}
                            className="aspect-video w-full"
                            uploadEndpoint="/admin/upload"
                        />
                    </div>

                    {/* Gender Selection */}
                    <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select value={gender} onValueChange={setGender}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999]">
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-2">
                        <Label>Header Category</Label>
                        <Select
                            value={category}
                            onValueChange={(val) => {
                                setCategory(val);
                                setSubCategory(""); // Reset sub when header changes
                            }}
                            disabled={!gender}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999]">
                                {availableCategories.length > 0 ? (
                                    availableCategories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-sm text-muted-foreground text-center">No categories found</div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sub Category Selection */}
                    <div className="space-y-2">
                        <Label>Sub Category (Service)</Label>
                        <Select
                            value={subCategory}
                            onValueChange={setSubCategory}
                            disabled={!category}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Service" />
                            </SelectTrigger>
                            <SelectContent className="z-[9999]">
                                {availableSubCategories.length > 0 ? (
                                    availableSubCategories.map((sub) => (
                                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-sm text-muted-foreground text-center">No services found for this category</div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button onClick={handleAdd} disabled={isLoading} className="bg-primary text-black hover:bg-primary/90">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Add Featured Service
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
