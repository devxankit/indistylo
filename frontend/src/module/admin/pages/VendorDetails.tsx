import { useParams, useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, FileText, BadgeCheck, ShieldAlert, Phone, Mail, MapPin, Store, Star, Calendar, DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function VendorDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const {
        approveVendor, rejectVendor, verifyDocument, isLoading,
        selectedVendor, fetchVendorDetails
    } = useAdminStore();

    useEffect(() => {
        if (id) {
            fetchVendorDetails(id);
        }
    }, [id, fetchVendorDetails]);

    // Use selectedVendor from store
    const vendor = selectedVendor;

    const handleFinalApproval = () => {
        if (!vendor) return;
        const allVerified = vendor.verificationDocuments?.every((doc: any) => doc.status === 'verified');
        if (!allVerified) {
            toast.error("Please verify all documents first!");
            return;
        }
        approveVendor(vendor.id);
        navigate("/admin/vendors");
    };

    if (isLoading && !vendor) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

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
                                        <Mail className="w-3.5 h-3.5" /> {vendor.email}
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
                                Please review the submitted documents carefully. Verify that the credentials match the business details provided.
                            </p>
                        </Card>
                    </div>

                    {/* Right Column: Documents */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="p-6">
                            <h3 className="font-semibold text-lg border-b border-border pb-4 mb-6">Document Verification</h3>
                            <div className="space-y-6">
                                {vendor.verificationDocuments?.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No documents submitted.
                                    </div>
                                ) : (
                                    vendor.verificationDocuments?.map((doc: any, index: number) => (
                                        <div key={doc._id || index} className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-xl bg-muted/20">
                                            <div className="w-full sm:w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                                                {doc.url.toLowerCase().endsWith('.pdf') ? (
                                                    <FileText className="w-8 h-8 text-gray-400" />
                                                ) : (
                                                    <img src={doc.url} alt={doc.type} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium capitalize">{doc.type.replace(/_/g, " ")}</h4>
                                                    <span className={`px-2 py-0.5 text-xs rounded-full border capitalize ${doc.status === 'verified' ? 'bg-green-100 text-green-700 border-green-200' :
                                                        doc.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                                            'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                        }`}>
                                                        {doc.status}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2 mt-2">
                                                    <Button size="sm" variant="outline" onClick={() => window.open(doc.url, '_blank')}>View Full</Button>
                                                    <Button
                                                        size="sm"
                                                        className="!bg-green-600 !text-white hover:!bg-green-700"
                                                        disabled={doc.status === 'verified'}
                                                        onClick={() => verifyDocument(vendor.id, doc._id, 'verified')}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        disabled={doc.status === 'rejected'}
                                                        onClick={() => verifyDocument(vendor.id, doc._id, 'rejected')}
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                // ACTIVE VENDOR VIEW (Details Tabs)
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 max-w-[750px] mb-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="services">Services</TabsTrigger>
                        <TabsTrigger value="bookings">Bookings</TabsTrigger>
                        <TabsTrigger value="transactions">Transactions</TabsTrigger>
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
                                        <span>{vendor.salon?.rating ? vendor.salon.rating.toFixed(1) : "New"}</span>
                                        <span className="text-muted-foreground">({vendor.reviews?.length || 0} Reviews)</span>
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
                                        <div className="text-sm text-muted-foreground mb-1">Lifetime Earning</div>
                                        <div className="text-2xl font-bold flex items-center gap-2">
                                            ₹{vendor?.stats?.totalEarnings?.toLocaleString('en-IN') || 0} <DollarSign className="w-4 h-4 text-green-500" />
                                        </div>
                                    </Card>
                                    <Card className="p-4 bg-muted/30">
                                        <div className="text-sm text-muted-foreground mb-1">Total Bookings</div>
                                        <div className="text-2xl font-bold">{vendor?.stats?.totalBookings || 0}</div>
                                    </Card>
                                    <Card className="p-4 bg-muted/30">
                                        <div className="text-sm text-muted-foreground mb-1">Commission Earned</div>
                                        <div className="text-2xl font-bold text-primary">₹{vendor?.stats?.totalCommission?.toLocaleString('en-IN') || 0}</div>
                                    </Card>
                                </div>

                                <Card className="p-6">
                                    <h3 className="font-bold mb-4">Recent Payouts</h3>
                                    <div className="space-y-3">
                                        {vendor?.stats?.recentPayouts && vendor.stats.recentPayouts.length > 0 ? (
                                            vendor.stats.recentPayouts.map((payout: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-green-100 rounded-full">
                                                            <DollarSign className="w-4 h-4 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-sm">{payout.status || 'Weekly Payout'}</div>
                                                            <div className="text-xs text-muted-foreground">Processed on {new Date(payout.createdAt).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                    <span className="font-mono font-bold">₹{payout.amount?.toLocaleString('en-IN')}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-muted-foreground py-4">No recent payouts found</div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="services" className="space-y-6">
                        <Card className="p-6">
                            <h3 className="font-bold mb-4">Offered Services</h3>
                            {vendor.services && vendor.services.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {vendor.services.map((service: any) => (
                                        <div key={service._id} className="p-3 bg-muted/30 rounded-lg border border-border flex items-start gap-3">
                                            {service.image && (
                                                <img src={service.image} alt={service.name} className="w-16 h-16 object-cover rounded-md bg-muted" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm truncate">{service.name}</h4>
                                                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{service.description}</div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="font-bold text-sm">₹{service.price}</span>
                                                    <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full border">{service.duration} mins</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-muted-foreground text-center py-4 text-sm">
                                    No services found for this vendor.
                                </div>
                            )}
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-bold mb-4">Packages</h3>
                            {vendor.packages && vendor.packages.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {vendor.packages.map((pkg: any) => (
                                        <div key={pkg._id} className="p-3 bg-muted/30 rounded-lg border border-border flex items-start gap-3">
                                            {pkg.image && (
                                                <img src={pkg.image} alt={pkg.name} className="w-16 h-16 object-cover rounded-md bg-muted" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm truncate">{pkg.name}</h4>
                                                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{pkg.description}</div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="font-bold text-sm">₹{pkg.price}</span>
                                                    <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full border capitalize">{pkg.type.replace('-', ' ')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-muted-foreground text-center py-4 text-sm">
                                    No packages found for this vendor.
                                </div>
                            )}
                        </Card>
                    </TabsContent>

                    <TabsContent value="bookings">
                        <Card className="p-6">
                            <h3 className="font-bold mb-4">All Bookings</h3>
                            {vendor.recentBookings && vendor.recentBookings.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-12 gap-4 pb-2 border-b text-xs font-bold text-muted-foreground uppercase">
                                        <div className="col-span-3">Date</div>
                                        <div className="col-span-3">Customer</div>
                                        <div className="col-span-2">Service</div>
                                        <div className="col-span-2">Status</div>
                                        <div className="col-span-2 text-right">Price</div>
                                    </div>
                                    <div className="space-y-2">
                                        {vendor.recentBookings.map((booking: any) => (
                                            <div key={booking._id} className="grid grid-cols-12 gap-4 py-3 items-center text-sm border-b last:border-0 hover:bg-muted/30 px-2 -mx-2 rounded-md transition-colors">
                                                <div className="col-span-3 text-muted-foreground">
                                                    {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                                </div>
                                                <div className="col-span-3 font-medium">
                                                    {booking.user?.name || "Unknown"}
                                                </div>
                                                <div className="col-span-2 text-muted-foreground truncate">
                                                    {booking.service?.name}
                                                </div>
                                                <div className="col-span-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize 
                                                        ${booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                'bg-yellow-100 text-yellow-700'}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 text-right font-bold">
                                                    ₹{booking.price}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted-foreground text-center py-8">
                                    No bookings found for this vendor.
                                </div>
                            )}
                        </Card>
                    </TabsContent>

                    <TabsContent value="reviews">
                        <Card className="p-6">
                            <h3 className="font-bold mb-4">Customer Reviews</h3>
                            {vendor.reviews && vendor.reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {vendor.reviews.map((review: any) => (
                                        <div key={review._id} className="p-4 border border-border rounded-lg bg-muted/20">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                        {review.user?.image ? (
                                                            <img src={review.user.image} alt={review.user.name} className="w-full h-full rounded-full object-cover" />
                                                        ) : (
                                                            review.user?.name?.charAt(0) || "U"
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-sm">{review.user?.name || "Anonymous User"}</h4>
                                                        <div className="flex items-center text-xs text-muted-foreground">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 bg-background px-2 py-1 rounded-full border">
                                                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-bold text-sm">{review.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-foreground/90 mt-2">{review.comment}</p>
                                            <div className="text-xs text-muted-foreground mt-2 font-medium">
                                                Service: {review.service?.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-muted-foreground text-center py-8">
                                    No reviews found for this vendor.
                                </div>
                            )}
                        </Card>
                    </TabsContent>

                    <TabsContent value="transactions" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="p-4 bg-muted/30">
                                <div className="text-sm text-muted-foreground mb-1">Lifetime Earnings</div>
                                <div className="text-2xl font-bold flex items-center gap-2">
                                    ₹{vendor?.stats?.totalEarnings?.toLocaleString('en-IN') || 0}
                                </div>
                            </Card>
                            <Card className="p-4 bg-muted/30">
                                <div className="text-sm text-muted-foreground mb-1">Current Balance</div>
                                <div className="text-2xl font-bold flex items-center gap-2">
                                    ₹{vendor?.stats?.walletBalance?.toLocaleString('en-IN') || 0}
                                </div>
                            </Card>
                            <Card className="p-4 bg-muted/30">
                                <div className="text-sm text-muted-foreground mb-1">Amount Paid</div>
                                <div className="text-2xl font-bold flex items-center gap-2">
                                    ₹{vendor?.stats?.totalPayouts?.toLocaleString('en-IN') || 0}
                                </div>
                            </Card>
                            <Card className="p-4 bg-muted/30">
                                <div className="text-sm text-muted-foreground mb-1">Commission Earned</div>
                                <div className="text-2xl font-bold text-primary flex items-center gap-2">
                                    ₹{vendor?.stats?.totalCommission?.toLocaleString('en-IN') || 0}
                                </div>
                            </Card>
                        </div>
                        <Card className="p-6">
                            <h3 className="font-bold mb-4">Transaction History</h3>
                            {vendor.payouts && vendor.payouts.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-12 gap-4 pb-2 border-b text-xs font-bold text-muted-foreground uppercase px-2">
                                        <div className="col-span-2">Date</div>
                                        <div className="col-span-3">Transaction ID</div>
                                        <div className="col-span-2">Status</div>
                                        <div className="col-span-3">Notes</div>
                                        <div className="col-span-2 text-right">Amount</div>
                                    </div>
                                    <div className="space-y-1">
                                        {vendor.payouts.map((payout: any) => (
                                            <div key={payout._id} className="grid grid-cols-12 gap-4 py-3 items-center text-sm border-b last:border-0 hover:bg-muted/50 px-2 rounded-md transition-colors group">
                                                <div className="col-span-2 text-muted-foreground text-xs">
                                                    <div className="font-medium text-foreground">{new Date(payout.createdAt).toLocaleDateString()}</div>
                                                    <div>{new Date(payout.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </div>
                                                <div className="col-span-3 font-mono text-xs text-muted-foreground">
                                                    {payout.transactionId ? (
                                                        <span className="bg-muted px-1.5 py-0.5 rounded border select-all">{payout.transactionId}</span>
                                                    ) : (
                                                        <span className="opacity-50">-</span>
                                                    )}
                                                </div>
                                                <div className="col-span-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border
                                                        ${payout.status === 'processed' ? 'bg-green-100 text-green-700 border-green-200' :
                                                            payout.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                                                'bg-red-100 text-red-700 border-red-200'}`}>
                                                        {payout.status}
                                                    </span>
                                                </div>
                                                <div className="col-span-3 text-xs text-muted-foreground truncate" title={payout.adminNotes}>
                                                    {payout.adminNotes || "-"}
                                                </div>
                                                <div className="col-span-2 text-right font-bold font-mono">
                                                    {payout.status === 'processed' ? '+' : ''}₹{payout.amount?.toLocaleString('en-IN')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted-foreground text-center py-8">
                                    No transactions found for this vendor.
                                </div>
                            )}
                        </Card>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}
