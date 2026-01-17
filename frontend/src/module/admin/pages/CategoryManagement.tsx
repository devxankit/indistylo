import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { AddHeaderCategoryModal } from "../components/AddHeaderCategoryModal";
import { AddSubcategoryModal } from "../components/AddSubcategoryModal";
import { useCategoryStore, type HeaderCategory, type Subcategory } from "../store/useCategoryStore";

interface CategoryManagementProps {
    type?: "SALON" | "SPA";
}

export function CategoryManagement({ type = "SALON" }: CategoryManagementProps) {
    const [showHeaderModal, setShowHeaderModal] = useState(false);
    const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
    const [editingHeader, setEditingHeader] = useState<HeaderCategory | null>(null);
    const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);

    const {
        headerCategories,
        subcategories,
        selectedGender,
        isLoading,
        deleteHeaderCategory,
        deleteSubcategory,
        setSelectedGender,
        setSelectedType,
    } = useCategoryStore();

    useEffect(() => {
        setSelectedType(type);
    }, [type, setSelectedType]);

    const handleEditHeader = (header: HeaderCategory) => {
        setEditingHeader(header);
        setShowHeaderModal(true);
    };

    const handleDeleteHeader = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this header category?")) {
            await deleteHeaderCategory(id);
        }
    };

    const handleEditSubcategory = (subcategory: Subcategory) => {
        setEditingSubcategory(subcategory);
        setShowSubcategoryModal(true);
    };

    const handleDeleteSubcategory = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this subcategory?")) {
            await deleteSubcategory(id);
        }
    };

    // Group subcategories by header category
    const groupedSubcategories = headerCategories.map((header) => ({
        header,
        subcategories: subcategories.filter((sub) => {
            const headerId = typeof sub.headerCategoryId === "string"
                ? sub.headerCategoryId
                : sub.headerCategoryId._id;
            return headerId === header._id;
        }),
    }));

    if (isLoading && headerCategories.length === 0) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const title = type === "SALON" ? "Salon Category Management" : "Spa Category Management";
    const subtitle = type === "SALON"
        ? "Manage salon service categories with gender-specific subcategories"
        : "Manage spa service categories with header categories and subcategories";

    return (
        <div className="space-y-8">
            <AddHeaderCategoryModal
                open={showHeaderModal}
                onOpenChange={(open) => {
                    setShowHeaderModal(open);
                    if (!open) setEditingHeader(null);
                }}
                headerCategory={editingHeader}
                type={type}
            />
            <AddSubcategoryModal
                open={showSubcategoryModal}
                onOpenChange={(open) => {
                    setShowSubcategoryModal(open);
                    if (!open) setEditingSubcategory(null);
                }}
                subcategory={editingSubcategory}
                type={type}
            />

            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground mt-1">
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Header Categories Section */}
            <Card className="p-6 border-border/50">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">Header Categories</h2>
                        <p className="text-sm text-muted-foreground">
                            Main category headers {type === "SALON" ? "shared across both genders" : ""}
                        </p>
                    </div>
                    <Button
                        size="sm"
                        className="!bg-primary !text-black hover:!bg-primary/90"
                        onClick={() => {
                            setEditingHeader(null);
                            setShowHeaderModal(true);
                        }}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Header
                    </Button>
                </div>

                {headerCategories.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No header categories yet. Create one to get started.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {headerCategories.map((header) => (
                            <Card
                                key={header._id}
                                className="p-4 flex flex-col items-center justify-between gap-3 hover:shadow-lg transition-all border-border/50 group"
                            >
                                <div className="text-center flex-1 flex items-center">
                                    <h3 className="font-semibold text-sm">{header.name}</h3>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                                        onClick={() => handleEditHeader(header)}
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-400/10"
                                        onClick={() => handleDeleteHeader(header._id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </Card>

            {/* Subcategories Section */}
            <Card className="p-6 border-border/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">Subcategories</h2>
                        <p className="text-sm text-muted-foreground">
                            {type === "SALON" ? "Gender-specific subcategories with images" : "Spa subcategories with images"}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Gender Toggle */}
                        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                            <button
                                onClick={() => setSelectedGender("MALE")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedGender === "MALE"
                                    ? "bg-primary text-black shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Male
                            </button>
                            <button
                                onClick={() => setSelectedGender("FEMALE")}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedGender === "FEMALE"
                                    ? "bg-primary text-black shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Female
                            </button>
                        </div>
                        <Button
                            size="sm"
                            className="!bg-primary !text-black hover:!bg-primary/90"
                            onClick={() => {
                                setEditingSubcategory(null);
                                setShowSubcategoryModal(true);
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Subcategory
                        </Button>
                    </div>
                </div>

                {subcategories.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No subcategories for {selectedGender.toLowerCase()} yet. Create one to get started.
                    </div>
                ) : (
                    <div className="space-y-8">
                        {groupedSubcategories.map(({ header, subcategories: subs }) => {
                            if (subs.length === 0) return null;
                            return (
                                <div key={header._id}>
                                    <h3 className="text-lg font-semibold mb-4 text-primary">
                                        {header.name}
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {subs.map((sub) => (
                                            <Card
                                                key={sub._id}
                                                className="group relative overflow-hidden rounded-xl border border-border/50 hover:shadow-lg transition-all"
                                            >
                                                <div className="aspect-square relative">
                                                    <img
                                                        src={sub.image}
                                                        alt={sub.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <Button
                                                            size="icon"
                                                            className="h-8 w-8 bg-white/90 hover:bg-white text-black"
                                                            onClick={() => handleEditSubcategory(sub)}
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            className="h-8 w-8 bg-red-500 hover:bg-red-600 text-white"
                                                            onClick={() => handleDeleteSubcategory(sub._id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="p-3 text-center">
                                                    <p className="font-medium text-sm truncate">{sub.name}</p>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
}
