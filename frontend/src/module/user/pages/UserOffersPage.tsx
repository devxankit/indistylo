import { useNavigate } from "react-router-dom";
import { ArrowLeft, Ticket, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockDeals } from "../services/mockData";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

export function UserOffersPage() {
    const navigate = useNavigate();

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success("Coupon code copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="sticky top-0 z-40 bg-background border-b border-border">
                <div className="flex items-center px-4 py-3 gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="h-10 w-10">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-lg font-bold">Offers & Deals</h1>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Active Coupons Section */}
                <div className="space-y-4">
                    <h2 className="text-md font-semibold text-foreground flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-yellow-400" />
                        Active Coupons
                    </h2>

                    <div className="space-y-3">
                        {mockDeals.map((deal) => (
                            <Card
                                key={deal.id}
                                className="overflow-hidden bg-card border border-border group">
                                <CardContent className="p-0 flex">
                                    {/* Left Side (Color Strip) */}
                                    <div className={`w-2 ${deal.color || "bg-gray-500"} shrink-0`} />

                                    {/* Content */}
                                    <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">
                                                    {deal.title}
                                                </h3>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${deal.color || "bg-gray-500"}`}>
                                                    {deal.discount}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                {deal.description}
                                            </p>
                                            <p className="text-xs text-primary/80 mt-1 font-medium">
                                                Valid at: {deal.salon.name}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-dashed border-border pt-3 mt-1">
                                            <div className="border border-yellow-400/30 bg-yellow-400/5 rounded px-2 py-1 text-xs font-mono font-bold text-yellow-400 tracking-wider">
                                                SAVE{deal.id}0
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleCopyCode(`SAVE${deal.id}0`)}
                                                className="h-7 text-xs hover:bg-muted ml-auto gap-1.5 text-muted-foreground">
                                                <Copy className="w-3 h-3" />
                                                Copy Code
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
