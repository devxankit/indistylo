import { Star, MapPin, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import type { Package } from "../store/usePackageStore";
import { useState } from "react";

interface PackageCardProps {
    pkg: Package;
    distance?: string | null;
    hideLocation?: boolean;
    onBook?: (pkg: Package) => void;
}

export function PackageCard({ pkg, distance, hideLocation = false, onBook }: PackageCardProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Card className="min-w-[280px] w-[280px] bg-[#121212] border border-[#222] text-white overflow-hidden rounded-2xl flex-shrink-0 shadow-lg hover:border-[#333] transition-colors">
                <CardContent className="p-4 flex flex-col h-full relative">
                    {/* Header: Name and Rating */}
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-extrabold text-lg text-white leading-tight line-clamp-1 pr-2 tracking-wide">
                            {pkg.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-yellow-500/20 px-1.5 py-0.5 rounded text-yellow-500 text-[10px] font-bold flex-shrink-0">
                            <Star className="w-2.5 h-2.5 fill-yellow-500" />
                            <span>4.8</span>
                        </div>
                    </div>

                    {/* Services Subtext */}
                    <div className="text-[11px] text-gray-400 mb-3 line-clamp-2 min-h-[2.5em] font-medium leading-relaxed">
                        {pkg.services.map(s => s.name).join(' & ')}
                    </div>

                    {/* Offer Details Button */}
                    <div className="mb-3">
                        <button
                            onClick={() => setOpen(true)}
                            className="bg-[#151515] hover:bg-[#202020] text-yellow-500 text-[10px] font-medium px-3 py-1 rounded-md border border-white/5 transition-colors focus:outline-none"
                        >
                            Offer Details
                        </button>
                    </div>

                    {/* Image */}
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-4 relative bg-[#1A1A1A]">
                        <img
                            src={pkg.image}
                            alt={pkg.name}
                            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                        />
                        {!hideLocation && distance && (
                            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[9px] text-white flex items-center gap-0.5 font-medium border border-white/10">
                                <MapPin className="w-2.5 h-2.5" />
                                {distance} km
                            </div>
                        )}
                    </div>

                    {/* Footer: Price and Buy Now */}
                    <div className="mt-auto flex items-center justify-between">
                        <span className="text-xl font-bold text-yellow-500 tracking-tight">
                            ₹ {pkg.price}
                        </span>
                        <Button
                            onClick={() => onBook && onBook(pkg)}
                            className="bg-[#0f0f0f] hover:bg-black text-white hover:text-yellow-500 border border-white/10 h-9 px-5 text-xs font-bold rounded-lg shadow-sm transition-all"
                        >
                            Add to Cart
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-[#18181b] border-none text-white max-w-sm w-[95%] rounded-3xl p-0 overflow-hidden gap-0">

                    {/* Header Section */}
                    <div className="p-5 pb-3">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-white tracking-wide">{pkg.name}</h2>
                                {/* Show salon name only if location is not hidden, or keep it? Request said "don't display the distances and salon address". Salon name might be fine, but let's hide address details. */}
                                {!hideLocation && (
                                    <p className="text-lg font-semibold text-white/90">
                                        {(pkg.vendor as any).businessName || "Salon"}
                                    </p>
                                )}
                            </div>
                            <div className="text-right space-y-1.5">
                                <div className="text-xl font-bold text-yellow-500">
                                    ₹ {pkg.price}
                                </div>
                                <div className="flex justify-end">
                                    <div className="bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold text-[10px]">
                                        <Star className="w-2.5 h-2.5 fill-yellow-500" /> 4.8
                                    </div>
                                </div>
                                {!hideLocation && (
                                    <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400">
                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate max-w-[150px]">
                                            {(pkg.vendor as any).address || "Location unavailable"}, {(pkg.vendor as any).city}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-5 pt-0 space-y-4 max-h-[75vh] overflow-y-auto">
                        {/* Image */}
                        <div className="w-full h-44 rounded-2xl overflow-hidden relative shadow-lg">
                            <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                        </div>

                        {/* Description */}
                        <div>
                            <p className="text-sm text-gray-300 font-medium leading-relaxed">
                                {pkg.description}
                            </p>
                        </div>

                        {/* Services Included */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                <Info className="w-4 h-4 text-yellow-500" /> Services Included
                            </h4>
                            <div className="space-y-2">
                                {pkg.services.map((service, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-[#27272a] px-3 py-2.5 rounded-xl border border-white/5">
                                        <span className="text-sm font-medium text-gray-200">{service.name}</span>
                                        {service.duration && (
                                            <span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                                                <Clock className="w-3.5 h-3.5" /> {service.duration} min
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer / Book Button */}
                    <div className="p-4 bg-[#18181b] border-t border-white/5">
                        <Button
                            onClick={() => onBook && onBook(pkg)}
                            className="w-full bg-[#09090b] hover:bg-black text-white font-bold h-12 rounded-xl text-base border border-white/10 shadow-xl"
                        >
                            Add to Cart
                        </Button>
                    </div>

                </DialogContent>
            </Dialog>
        </>
    );
}
