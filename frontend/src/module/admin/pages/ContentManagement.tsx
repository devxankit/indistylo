import { Upload, Plus, Trash2, Package, Smartphone, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AddBannerModal } from "../components/AddBannerModal";
import { AddCategoryModal } from "../components/AddCategoryModal";
import { useContentStore } from "../store/useContentStore";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ContentManagement() {
    const [showBannerModal, setShowBannerModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const {
        banners,
        categories,
        deleteBanner,
        deleteCategory,
        featuredServices,
        popularPackages,
        removeFeaturedService,
        removePopularPackage,
        promoBanner,
        updatePromoBanner
    } = useContentStore();

    const handleDeleteBanner = (id: string) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            deleteBanner(id);
            toast.success("Banner deleted");
        }
    };

    const handleDeleteCategory = (id: string) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            deleteCategory(id);
            toast.success("Category deleted");
        }
    }

    const handleUpdatePromo = () => {
        // Simulating upload by asking for URL
        const newUrl = window.prompt("Enter new Promo Banner URL:", promoBanner);
        if (newUrl) {
            updatePromoBanner(newUrl);
            toast.success("Promo banner updated");
        }
    }

    return (
        <div className="space-y-8">
            <AddBannerModal open={showBannerModal} onOpenChange={setShowBannerModal} />
            <AddCategoryModal open={showCategoryModal} onOpenChange={setShowCategoryModal} />

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
            </div>

            <Tabs defaultValue="banners" className="space-y-6">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="banners">Hero Banners</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="featured">Featured Content</TabsTrigger>
                    <TabsTrigger value="promos">Promotions</TabsTrigger>
                </TabsList>

                <TabsContent value="banners" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold">User App Banners</h2>
                            <p className="text-sm text-muted-foreground">Manage the main carousel banners on the home page.</p>
                        </div>
                        <Button
                            size="sm"
                            className="!bg-primary !text-black hover:!bg-primary/90"
                            onClick={() => setShowBannerModal(true)}
                        >
                            <Upload className="w-4 h-4 mr-2" /> Upload New
                        </Button>
                    </div>
                    {banners.length === 0 ? (
                        <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
                            <p className="text-muted-foreground">No banners uploaded yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {banners.map(banner => (
                                <Card key={banner.id} className="group relative aspect-video overflow-hidden rounded-xl bg-muted border border-border/50">
                                    <img src={banner.image} alt="Banner" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="!bg-red-600 !text-white hover:!bg-red-700"
                                            onClick={() => handleDeleteBanner(banner.id)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="categories" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold">Service Categories</h2>
                            <p className="text-sm text-muted-foreground">Manage service categories and sub-categories.</p>
                        </div>
                        <Button
                            size="sm"
                            className="!bg-primary !text-black hover:!bg-primary/90"
                            onClick={() => setShowCategoryModal(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Category
                        </Button>
                    </div>
                    <Card className="p-0 overflow-hidden border-border/50">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 border-b border-border">
                                    <tr>
                                        <th className="text-left p-4 font-medium text-muted-foreground w-[100px]">Icon</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Category Name</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Sub-categories</th>
                                        <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {categories.map(cat => (
                                        <tr key={cat.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="p-4">
                                                {cat.image ? (
                                                    <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-lg object-cover bg-muted" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">None</div>
                                                )}
                                            </td>
                                            <td className="p-4 font-medium">{cat.name}</td>
                                            <td className="p-4 text-muted-foreground">{cat.subCategories.length} Sub-categories</td>
                                            <td className="p-4 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-400 hover:text-red-500 hover:bg-red-400/10"
                                                    onClick={() => handleDeleteCategory(cat.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="featured" className="space-y-8">
                    {/* Featured At How Services */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Smartphone className="w-5 h-5" /> At Home Services
                                </h2>
                                <p className="text-sm text-muted-foreground">Services displayed in "Popular At Home Services".</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {featuredServices.map(service => (
                                <Card key={service.id} className="group relative overflow-hidden rounded-xl border border-border/50">
                                    <div className="aspect-square">
                                        <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-semibold text-sm truncate">{service.name}</h3>
                                        <p className="text-muted-foreground text-xs">₹{service.price} • {service.duration} mins</p>
                                    </div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="icon"
                                            className="h-8 w-8 bg-black/50 hover:bg-red-600 text-white backdrop-blur-sm shadow-md"
                                            onClick={() => removeFeaturedService(service.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Popular Packages */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Package className="w-5 h-5" /> Popular Packages
                                </h2>
                                <p className="text-sm text-muted-foreground">Packages displayed in "Popular At Home Service Packages".</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {popularPackages.map(pkg => (
                                <Card key={pkg.id} className="group relative overflow-hidden rounded-xl border border-border/50">
                                    <div className="aspect-video">
                                        <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-semibold text-sm">{pkg.title}</h3>
                                        <p className="text-muted-foreground text-xs line-clamp-1">{pkg.description.replace('\n', ', ')}</p>
                                        <p className="font-bold text-primary mt-1">₹{pkg.price}</p>
                                    </div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="icon"
                                            className="h-8 w-8 bg-black/50 hover:bg-red-600 text-white backdrop-blur-sm shadow-md"
                                            onClick={() => removePopularPackage(pkg.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="promos" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <ImageIcon className="w-5 h-5" /> Promotional Banners
                            </h2>
                            <p className="text-sm text-muted-foreground">Manage the bottom promotional banner on the home page.</p>
                        </div>
                    </div>

                    <Card className="p-6">
                        <div className="space-y-4">
                            <h3 className="font-medium text-sm">Bottom Shop Now Banner</h3>
                            <div className="relative aspect-[21/9] w-full max-w-2xl rounded-xl overflow-hidden border border-border bg-muted">
                                <img src={promoBanner} alt="Promo" className="w-full h-full object-cover" />
                            </div>
                            <Button onClick={handleUpdatePromo}>
                                <Upload className="w-4 h-4 mr-2" /> Change Image
                            </Button>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

