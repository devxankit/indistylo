import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Plus, Trash2, Package as PackageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useVendorPackageStore } from "../store/useVendorPackageStore";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function VendorPackages() {
    const navigate = useNavigate();
    const { packages, fetchPackages, deletePackage, loading } = useVendorPackageStore();

    useEffect(() => {
        fetchPackages();
    }, [fetchPackages]);

    const handleDelete = async (id: string) => {
        const success = await deletePackage(id);
        if (success) {
            toast.success("Package deleted");
        } else {
            toast.error("Failed to delete package");
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate("/vendor/profile")}
                            className="rounded-full"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-lg font-bold">My Packages</h1>
                    </div>
                    <Button onClick={() => navigate("/vendor/packages/create")} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New
                    </Button>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {loading && packages.length === 0 ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : packages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-card rounded-2xl border border-dashed border-border">
                        <PackageIcon className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-lg font-medium">No packages yet</p>
                        <p className="text-sm max-w-xs mt-1">
                            Create combined service packages to attract more customers.
                        </p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => navigate("/vendor/packages/create")}
                        >
                            Create First Package
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {packages.map((pkg) => (
                            <Card key={pkg._id} className="overflow-hidden">
                                <div className="flex">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted shrink-0">
                                        <img
                                            src={pkg.image}
                                            alt={pkg.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <CardContent className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-semibold line-clamp-1">{pkg.name}</h3>
                                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary whitespace-nowrap">
                                                    ₹{pkg.price}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                {pkg.description}
                                            </p>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {pkg.services.map((s: any) => (
                                                    <span
                                                        key={s._id}
                                                        className="text-[10px] bg-secondary px-2 py-0.5 rounded text-secondary-foreground"
                                                    >
                                                        {s.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-end mt-2">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Package?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the package.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(pkg._id)} className="bg-red-500 hover:bg-red-600">
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
