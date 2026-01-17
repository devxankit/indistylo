import {
  Upload,
  Trash2,
  Smartphone,
  Store,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { AddBannerModal } from "../components/AddBannerModal";
import { AddDealModal } from "../components/AddDealModal";
import { AddFeaturedServiceModal } from "../components/AddFeaturedServiceModal";
import { AddSalonFeaturedServiceModal } from "../components/AddSalonFeaturedServiceModal";
import { UpdatePromoModal } from "../components/UpdatePromoModal";
import { useContentStore } from "../store/useContentStore";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ContentManagement() {
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showSalonServiceModal, setShowSalonServiceModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "banners" | "categories" | "featured" | "referral" | "deals" | "promo"
  >("banners");
  const [isUpdatePromoOpen, setIsUpdatePromoOpen] = useState(false);

  const {
    banners,
    deleteBanner,
    deals,
    deleteDeal,
    featuredServices,
    salonFeaturedServices,
    removeFeaturedService,
    removeSalonFeaturedService,
    promoBanner,
    fetchContent,
  } = useContentStore();

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchContent();
      setIsLoading(false);
    };
    init();
  }, []);

  const handleDeleteBanner = (id: string) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      deleteBanner(id);
      toast.success("Banner deleted");
    }
  };

  const handleDeleteDeal = (id: string) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      deleteDeal(id);
      toast.success("Deal deleted");
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AddBannerModal
        open={showBannerModal}
        onOpenChange={setShowBannerModal}
      />
      <AddDealModal open={showDealModal} onOpenChange={setShowDealModal} />
      <AddFeaturedServiceModal
        open={showServiceModal}
        onOpenChange={setShowServiceModal}
      />
      <AddSalonFeaturedServiceModal
        open={showSalonServiceModal}
        onOpenChange={setShowSalonServiceModal}
      />
      <UpdatePromoModal
        open={showPromoModal || isUpdatePromoOpen}
        onOpenChange={showPromoModal ? setShowPromoModal : setIsUpdatePromoOpen}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Content Management
        </h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as any)}
        className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="banners">Hero Banners</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="featured">Featured Content</TabsTrigger>
          <TabsTrigger value="promos">Promotions</TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">User App Banners</h2>
              <p className="text-sm text-muted-foreground">
                Manage the main carousel banners on the home page.
              </p>
            </div>
            <Button
              size="sm"
              className="!bg-primary !text-black hover:!bg-primary/90"
              onClick={() => setShowBannerModal(true)}>
              <Upload className="w-4 h-4 mr-2" /> Upload New
            </Button>
          </div>
          {banners.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
              <p className="text-muted-foreground">No banners uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {banners.map((banner) => (
                <Card
                  key={banner.id}
                  className="group relative aspect-video overflow-hidden rounded-xl bg-muted border border-border/50">
                  <img
                    src={banner.image}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="!bg-red-600 !text-white hover:!bg-red-700"
                      onClick={() =>
                        handleDeleteBanner(banner._id || banner.id || "")
                      }>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="deals" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Last Minute At Salon Deals
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage deals displayed on the home page.
              </p>
            </div>
            <Button
              size="sm"
              className="!bg-primary !text-black hover:!bg-primary/90"
              onClick={() => setShowDealModal(true)}>
              <Upload className="w-4 h-4 mr-2" /> Create New Deal
            </Button>
          </div>
          {deals.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border">
              <p className="text-muted-foreground">No deals created yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {deals.map((deal, index) => {
                const gradientClasses = [
                  "bg-gradient-to-br from-[#ff6b6b] to-[#c73866]",
                  "bg-gradient-to-br from-[#8a4fff] to-[#512da8]",
                  "bg-gradient-to-br from-[#1e3c72] to-[#2a5298]",
                  "bg-gradient-to-br from-[#ffb347] to-[#ff7b00]",
                  "bg-gradient-to-br from-[#11998e] to-[#38ef7d]",
                  "bg-gradient-to-br from-[#141e30] to-[#243b55]",
                ];
                const gradient =
                  gradientClasses[index % gradientClasses.length];

                return (
                  <Card
                    key={deal._id || deal.id}
                    className={`group relative ${gradient} text-white overflow-hidden rounded-xl`}>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/30 pointer-events-none" />

                    <div className="relative z-10 p-4 flex flex-col h-full min-h-[180px] justify-between">
                      {/* Top: Copy stack */}
                      <div className="flex flex-col items-center text-center">
                        <span className="text-xs uppercase tracking-[0.2em] font-medium text-white/90">
                          UPTO
                        </span>
                        <div className="mt-1 bg-white text-black rounded-[6px] px-3 py-1 shadow-sm">
                          <span className="text-lg font-extrabold leading-none tabular-nums">
                            {deal.discount}
                          </span>
                        </div>
                        <span className="mt-1 text-xs text-white/85 leading-none">
                          on
                        </span>
                        <span className="mt-0.5 text-base font-semibold leading-tight">
                          {deal.title}
                        </span>
                      </div>

                      {/* Brand */}
                      <div className="flex justify-center my-2">
                        <div className="bg-black/75 px-2 py-0.5 rounded-[6px] border border-white/15 backdrop-blur-[2px] shadow-inner">
                          <span className="text-white font-extrabold text-[10px] tracking-[0.25em]">
                            {deal.salon?.name || "DASHO"}
                          </span>
                        </div>
                      </div>

                      {/* Bottom: Location + Meta */}
                      <div className="mt-auto text-start">
                        <p className="text-xs text-white/95 leading-snug px-2 mb-2 line-clamp-2">
                          {deal.salon?.location || "Location"}
                        </p>
                        <div className="flex items-center justify-between text-xs font-medium px-1 text-white/90">
                          <span>
                            {deal.salon?.distance?.toFixed(2) || "0.00"} Km
                          </span>
                          {deal.salon?.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300"
                                viewBox="0 0 24 24">
                                <path d="M12 .587l3.668 7.435L24 9.753l-6 5.849L19.335 24 12 19.897 4.665 24 6 15.602 0 9.753l8.332-1.731z" />
                              </svg>
                              <span className="tabular-nums">
                                {deal.salon?.rating}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="!bg-red-600 !text-white hover:!bg-red-700"
                        onClick={() =>
                          handleDeleteDeal(deal._id || deal.id || "")
                        }>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="featured" className="space-y-8">
          {/* Featured At How Services */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Smartphone className="w-5 h-5" /> At Home Services
                </h2>
                <p className="text-sm text-muted-foreground">
                  Services displayed in "Popular At Home Services".
                </p>
              </div>
              <Button
                size="sm"
                className="!bg-primary !text-black hover:!bg-primary/90"
                onClick={() => setShowServiceModal(true)}>
                <Upload className="w-4 h-4 mr-2" /> Add Service
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredServices.map((service) => (
                <Card
                  key={service.id}
                  className="group relative overflow-hidden rounded-xl border border-border/50">
                  <div className="aspect-square">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate">
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      ₹{service.price} • {service.duration} mins
                    </p>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      className="h-8 w-8 bg-black/50 hover:bg-red-600 text-white backdrop-blur-sm shadow-md"
                      onClick={() => removeFeaturedService(service.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* At Salon Services */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Store className="w-5 h-5" /> At Salon Services
                </h2>
                <p className="text-sm text-muted-foreground">
                  Services displayed in "Popular At Salon Services".
                </p>
              </div>
              <Button
                size="sm"
                className="!bg-primary !text-black hover:!bg-primary/90"
                onClick={() => setShowSalonServiceModal(true)}>
                <Upload className="w-4 h-4 mr-2" /> Add Service
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {salonFeaturedServices.map((service) => (
                <Card
                  key={service._id || service.id}
                  className="group relative overflow-hidden rounded-xl border border-border/50">
                  <div className="aspect-square">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate">
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      {service.category} • {service.gender}
                    </p>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      className="h-8 w-8 bg-black/50 hover:bg-red-600 text-white backdrop-blur-sm shadow-md"
                      onClick={() =>
                        removeSalonFeaturedService(
                          service._id || service.id || ""
                        )
                      }>
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
              <p className="text-sm text-muted-foreground">
                Manage the bottom promotional banner on the home page.
              </p>
            </div>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Bottom Shop Now Banner</h3>
              <div className="relative aspect-[21/9] w-full max-w-2xl rounded-xl overflow-hidden border border-border bg-muted">
                <img
                  src={promoBanner}
                  alt="Promo"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button onClick={() => setShowPromoModal(true)}>
                <Upload className="w-4 h-4 mr-2" /> Change Image
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
