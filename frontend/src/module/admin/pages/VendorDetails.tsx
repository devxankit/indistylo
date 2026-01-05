import { useParams, useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, FileText, BadgeCheck, ShieldAlert, Phone, Mail, MapPin, Store, Star, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function VendorDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { pendingVendors, activeVendors, approveVendor, rejectVendor } = useAdminStore();

    // Find vendor in either pending or active lists
    const vendor = [...pendingVendors, ...activeVendors].find(v => v.id === id);

    const [docStatus, setDocStatus] = useState<{ [key: string]: 'verified' | 'rejected' | 'pending' }>({
        aadhar: 'pending',
        gst: 'pending',
        certification: 'pending'
    });

    const handleDocAction = (doc: string, status: 'verified' | 'rejected') => {
        setDocStatus(prev => ({ ...prev, [doc]: status }));
        toast.success(`Document marked as ${status}`);
    };

    const handleFinalApproval = () => {
        if (!vendor) return;
        if (Object.values(docStatus).some(s => s !== 'verified')) {
            toast.error("Please verify all documents first!");
            return;
        }
        approveVendor(vendor.id);
        toast.success("Vendor Approved Successfully!");
        navigate("/admin/vendors");
    };

    if (!vendor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
                <Store className="w-16 h-16 mb-4 opacity-50" />
                <h2 className="text-xl font-bold text-foreground">Vendor Not Found</h2>
                <p>The vendor you are looking for does not exist or has been removed.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate("/admin/vendors")}>
                    Back to Vendors
                </Button>
            </div>
        );
    }

    const isPending = vendor.status === 'pending';
    const isActive = vendor.status === 'active';

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold">{vendor.businessName}</h1>
                            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border capitalize ${isPending ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
                                }`}>
                                {vendor.status}
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm">ID: #{vendor.id.toUpperCase()}</p>
                    </div>
                </div>

                {isPending && (
                    <div className="flex gap-3">
                        <Button variant="destructive" className="!bg-red-600 !text-white hover:!bg-red-700" onClick={() => {
                            rejectVendor(vendor.id);
                            toast.info("Vendor application rejected.");
                            navigate("/admin/vendors");
                        }}>
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                        </Button>
                        <Button onClick={handleFinalApproval} className="!bg-green-600 !text-white hover:!bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                        </Button>
                    </div>
                )}
            </div>

            {isPending ? (
                // PENDING VENDOR VIEW (Document Verification)
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Info */}
                    <div className="space-y-6">
                        <Card className="p-6 space-y-4">
                            <h3 className="font-semibold text-lg border-b border-border pb-2">Business Details</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase font-bold">Owner Name</label>
                                    <p className="font-medium flex items-center gap-2">
                                        {vendor.ownerName}
                                        <BadgeCheck className="w-4 h-4 text-blue-500" />
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase font-bold">Contact</label>
                                    <p className="text-sm flex items-center gap-2 mt-1">
                                        <Phone className="w-3.5 h-3.5" /> {vendor.phone}
                                    </p>
                                    <p className="text-sm flex items-center gap-2 mt-1">
                                        <Mail className="w-3.5 h-3.5" /> admin@glamour.com
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground uppercase font-bold">Address</label>
                                    <p className="text-sm flex items-start gap-2 mt-1">
                                        <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                        {vendor.location}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-blue-500/5 border-blue-500/20">
                            <div className="flex items-center gap-3 mb-2">
                                <ShieldAlert className="w-5 h-5 text-blue-500" />
                                <h3 className="font-semibold text-blue-500">System Analysis</h3>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                This vendor has submitted valid GST credentials. The provided location matches Google Maps coordinates. Phone number verified via OTP. Risk score: Low.
                            </p>
                        </Card>
                    </div>

                    {/* Right Column: Documents */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="p-6">
                            <h3 className="font-semibold text-lg border-b border-border pb-4 mb-6">Document Verification</h3>
                            <div className="space-y-6">
                                {/* Document Item 1 */}
                                <div className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-xl bg-muted/20">
                                    <div className="w-full sm:w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                                        <FileText className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">Aadhar Card (Front & Back)</h4>
                                            <span className={`px-2 py-0.5 text-xs rounded-full border capitalize ${docStatus.aadhar === 'verified' ? 'bg-green-100 text-green-700 border-green-200' :
                                                docStatus.aadhar === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                                    'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                }`}>
                                                {docStatus.aadhar}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">ID Proof submitted by owner. Check for name match and clarity.</p>
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" variant="outline" onClick={() => window.open('https://via.placeholder.com/600', '_blank')}>View Full</Button>
                                            <Button size="sm" className="!bg-green-600 !text-white hover:!bg-green-700" onClick={() => handleDocAction('aadhar', 'verified')}>Approve</Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleDocAction('aadhar', 'rejected')}>Reject</Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Document Item 2 */}
                                <div className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-xl bg-muted/20">
                                    <div className="w-full sm:w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                                        <FileText className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">GST Registration Certificate</h4>
                                            <span className={`px-2 py-0.5 text-xs rounded-full border capitalize ${docStatus.gst === 'verified' ? 'bg-green-100 text-green-700 border-green-200' :
                                                docStatus.gst === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                                    'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                }`}>
                                                {docStatus.gst}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Business proof. Verify GSTIN matches business name.</p>
                                        <div className="flex gap-2 mt-2">
                                            <Button size="sm" variant="outline" onClick={() => window.open('https://via.placeholder.com/600', '_blank')}>View Full</Button>
                                            <Button size="sm" className="!bg-green-600 !text-white hover:!bg-green-700" onClick={() => handleDocAction('gst', 'verified')}>Approve</Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleDocAction('gst', 'rejected')}>Reject</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                // ACTIVE VENDOR VIEW (Details Tabs)
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 max-w-[600px] mb-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="services">Services</TabsTrigger>
                        <TabsTrigger value="bookings">Bookings</TabsTrigger>
                        <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Vendor Info Card */}
                            <Card className="p-6 md:col-span-1 border-l-4 border-l-primary/50">
                                <div className="flex flex-col items-center text-center mb-6">
                                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary mb-3">
                                        {vendor.businessName.charAt(0)}
                                    </div>
                                    <h2 className="font-bold text-xl">{vendor.businessName}</h2>
                                    <p className="text-sm text-muted-foreground">{vendor.ownerName}</p>
                                    <div className="flex items-center gap-1 mt-2 text-sm font-medium">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span>4.8</span>
                                        <span className="text-muted-foreground">(124 Reviews)</span>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-border">
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span>{vendor.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <span>{vendor.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span>Joined {vendor.joinedDate}</span>
                                    </div>
                                </div>
                            </Card>

                            {/* Stats & Revenue */}
                            <div className="md:col-span-2 space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <Card className="p-4 bg-muted/30">
                                        <div className="text-sm text-muted-foreground mb-1">Total Revenue</div>
                                        <div className="text-2xl font-bold flex items-center gap-2">
                                            ₹1,24,500 <DollarSign className="w-4 h-4 text-green-500" />
                                        </div>
                                    </Card>
                                    <Card className="p-4 bg-muted/30">
                                        <div className="text-sm text-muted-foreground mb-1">Total Bookings</div>
                                        <div className="text-2xl font-bold">452</div>
                                    </Card>
                                    <Card className="p-4 bg-muted/30">
                                        <div className="text-sm text-muted-foreground mb-1">Commission Paid</div>
                                        <div className="text-2xl font-bold text-primary">₹12,450</div>
                                    </Card>
                                </div>

                                <Card className="p-6">
                                    <h3 className="font-bold mb-4">Recent Payouts</h3>
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((_, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-green-100 rounded-full">
                                                        <DollarSign className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-sm">Weekly Payout</div>
                                                        <div className="text-xs text-muted-foreground">Processed on 12 Jan 2024</div>
                                                    </div>
                                                </div>
                                                <span className="font-mono font-bold">₹4,500</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="services">
                        <Card className="p-6">
                            <h3 className="font-bold mb-4">Offered Services</h3>
                            <div className="text-muted-foreground text-center py-8">
                                Services list will be displayed here.
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="bookings">
                        <Card className="p-6">
                            <h3 className="font-bold mb-4">Recent Bookings</h3>
                            <div className="text-muted-foreground text-center py-8">
                                Booking history list will be displayed here.
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="reviews">
                        <Card className="p-6">
                            <h3 className="font-bold mb-4">Customer Reviews</h3>
                            <div className="text-muted-foreground text-center py-8">
                                Reviews and ratings list will be displayed here.
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}
