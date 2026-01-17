import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { useCategoryStore, type Subcategory } from "../store/useCategoryStore";
import { ImageUpload } from "@/module/vendor/vendor-components/ImageUpload";

interface AddSubcategoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    subcategory?: Subcategory | null;
    type?: "SALON" | "SPA";
}

export function AddSubcategoryModal({
    open,
    onOpenChange,
    subcategory,
    type = "SALON",
}: AddSubcategoryModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [headerCategoryId, setHeaderCategoryId] = useState("");
    const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
    const [image, setImage] = useState<string>("");

    const { headerCategories, selectedGender, createSubcategory, updateSubcategory } = useCategoryStore();

    useEffect(() => {
        if (open) {
            if (subcategory) {
                setName(subcategory.name);
                setHeaderCategoryId(
                    typeof subcategory.headerCategoryId === "string"
                        ? subcategory.headerCategoryId
                        : subcategory.headerCategoryId._id
                );
                setGender(subcategory.gender);
                setImage(subcategory.image);
            } else {
                setName("");
                setHeaderCategoryId(headerCategories[0]?._id || "");
                setGender(selectedGender);
                setImage("");
            }
        }
    }, [open, subcategory, headerCategories, selectedGender]);

    const handleSave = async () => {
        if (!name.trim() || !headerCategoryId || !image) {
            return;
        }

        setIsLoading(true);
        try {
            if (subcategory) {
                await updateSubcategory(subcategory._id, {
                    name,
                    headerCategoryId,
                    gender,
                    image,
                });
            } else {
                await createSubcategory({
                    name,
                    headerCategoryId,
                    gender,
                    image,
                    type,
                });
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
            <DialogContent className="sm:max-w-[500px] p-6 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
                <DialogHeader className="mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-full">
                            <ImageIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">
                                {subcategory ? "Edit Subcategory" : "Add Subcategory"}
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {subcategory ? "Update subcategory details." : "Create a new subcategory with image."}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Image Upload */}
                    <div className="w-full flex justify-center">
                        <div className="w-40">
                            <ImageUpload
                                value={image}
                                onChange={(val) => setImage(val as string)}
                                label="Upload Image"
                                maxSizeMB={10}
                                uploadEndpoint="/admin/upload"
                            />
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Subcategory Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Hair Cut & Style"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        />
                    </div>

                    {/* Header Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Header Category</label>
                        <select
                            value={headerCategoryId}
                            onChange={(e) => setHeaderCategoryId(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                        >
                            {headerCategories.map((header) => (
                                <option key={header._id} value={header._id}>
                                    {header.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Gender</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="MALE"
                                    checked={gender === "MALE"}
                                    onChange={(e) => setGender(e.target.value as "MALE")}
                                    className="w-4 h-4 text-primary focus:ring-primary"
                                />
                                <span className="text-sm">Male</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="FEMALE"
                                    checked={gender === "FEMALE"}
                                    onChange={(e) => setGender(e.target.value as "FEMALE")}
                                    className="w-4 h-4 text-primary focus:ring-primary"
                                />
                                <span className="text-sm">Female</span>
                            </label>
                        </div>
                    </div>
                </div>

                <DialogFooter className="pt-4 gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading || !name.trim() || !headerCategoryId || !image}
                        className="!bg-primary !text-black hover:!bg-primary/90"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {subcategory ? "Update" : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
