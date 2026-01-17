import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Info,
  MapPin,
  Star,
  Search,
  Plus,
  Minus,
  ShoppingBag,
} from "lucide-react";
import salonInterior1 from "@/assets/atsalon/saloninterior/Screenshot from 2025-11-26 16-47-35.png";
import salonInterior2 from "@/assets/atsalon/saloninterior/Screenshot from 2025-11-26 16-47-39.png";
import salonInterior3 from "@/assets/atsalon/saloninterior/Screenshot from 2025-11-26 16-47-42.png";
import salonInterior4 from "@/assets/atsalon/saloninterior/Screenshot from 2025-11-26 16-47-44.png";
import { Button } from "@/components/ui/button";
import { useCartStore } from "../store/useCartStore";
import { useSalonStore } from "../store/useSalonStore";
import { useServiceStore } from "../store/useServiceStore";
import { SelectProfessionalDialog } from "../components/SelectProfessionalDialog";
import type { Professional } from "../services/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function ShopDetailsPage() {
  const navigate = useNavigate();
  const { salonId } = useParams<{ salonId: string }>();
  const { items, addItem, updateQuantity, getItemTotal } = useCartStore();
  const {
    currentSalon: salon,
    loading: salonLoading,
    fetchSalonById,
  } = useSalonStore();
  const {
    services,
    loading: servicesLoading,
    fetchServices,
  } = useServiceStore();

  useEffect(() => {
    if (salonId) {
      fetchSalonById(salonId);
      fetchServices({ salonId });
    }
  }, [salonId, fetchSalonById, fetchServices]);

  const [selectedGender, setSelectedGender] = useState<"male" | "female">(
    "female"
  );

  useEffect(() => {
    if (salon) {
      setSelectedGender(salon.gender === "male" ? "male" : "female");
    }
  }, [salon]);

  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const [search, setSearch] = useState("");

  // Group services by category for the current selected gender
  const catalog = useMemo(() => {
    const filteredServices = services.filter(
      (s) => s.gender === selectedGender || s.gender === "unisex"
    );

    const categoriesMap = new Map<string, any>();

    filteredServices.forEach((service) => {
      if (!categoriesMap.has(service.category)) {
        categoriesMap.set(service.category, {
          id: service.category.toLowerCase().replace(/\s+/g, "-"),
          name: service.category,
          image:
            service.image ||
            "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=60", // Fallback image
          services: [],
        });
      }

      const category = categoriesMap.get(service.category);
      category.services.push({
        id: service._id,
        title: service.name,
        duration: `${service.duration} min.`,
        highlights: service.highlights || [],
        priceLabel: `₹${service.price}`,
        price: service.price,
      });
    });

    return Array.from(categoriesMap.values());
  }, [services, selectedGender]);

  const [activeCategoryId, setActiveCategoryId] = useState("");

  useEffect(() => {
    if (catalog.length > 0 && !activeCategoryId) {
      setActiveCategoryId(catalog[0].id);
    }
  }, [catalog, activeCategoryId]);

  const [isProDialogOpen, setIsProDialogOpen] = useState(false);
  const [selectedServiceForPro, setSelectedServiceForPro] = useState<any>(null);

  const activeCategory = useMemo(
    () =>
      catalog.find((category) => category.id === activeCategoryId) ??
      catalog[0],
    [catalog, activeCategoryId]
  );

  const servicesToShow = useMemo(() => {
    if (!activeCategory) return [];
    return activeCategory.services.filter((service: any) =>
      service.title.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [activeCategory, search]);

  const interiorImages = [
    salonInterior1,
    salonInterior2,
    salonInterior3,
    salonInterior4,
  ];
  const heroImage =
    salon?.images?.[0] ||
    interiorImages[salon ? salon._id.length % interiorImages.length : 0];

  const handleAddService = (service: any) => {
    setSelectedServiceForPro(service);
    setIsProDialogOpen(true);
  };

  if (salonLoading || (servicesLoading && services.length === 0)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-4">Salon not found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const handleProfessionalSelect = (professional: Professional) => {
    if (!selectedServiceForPro) return;

    const cartItem = {
      id: selectedServiceForPro.id,
      title: selectedServiceForPro.title,
      price: selectedServiceForPro.price,
      image: "",
      duration: selectedServiceForPro.duration,
      category: activeCategory?.name || "",
    };

    const isAnyProfessional = professional.name === "Any Professional";

    addItem(
      cartItem as any,
      1,
      selectedGender,
      salonId,
      salon.name,
      "at-salon",
      isAnyProfessional ? undefined : professional.id,
      isAnyProfessional ? undefined : professional.name
    );

    setIsProDialogOpen(false);
    setSelectedServiceForPro(null);
    toast.success(`${selectedServiceForPro.title} added to cart`);
  };

  const getServiceQuantity = (serviceId: string) => {
    // Current logic just sums up quantity regardless of professional
    // Ideally, UI should show breakdown, but for this "Add" button simple sum is fine
    return items
      .filter((item) => item.id === serviceId)
      .reduce((acc, item) => acc + item.quantity, 0);
  };


  const calculateDistance = (salonGeo: { coordinates: [number, number] }) => {
    if (!userLocation || !salonGeo || !salonGeo.coordinates) return null;

    const [salonLng, salonLat] = salonGeo.coordinates;
    const R = 6371; // km
    const dLat = (salonLat - userLocation.lat) * Math.PI / 180;
    const dLon = (salonLng - userLocation.lng) * Math.PI / 180;
    const lat1 = userLocation.lat * Math.PI / 180;
    const lat2 = salonLat * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  const distance = salon ? calculateDistance(salon.geo) : null;

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground">
      <div className="sticky top-0 z-40 bg-background/90 px-4 py-3 flex items-center gap-2 border-b border-border backdrop-blur">
        <button
          className="flex items-center gap-1 text-sm font-medium text-primary"
          onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <main className="px-4 py-4 space-y-6">
        <section className="rounded-3xl bg-card text-left shadow-lg border border-border p-4">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
              <img
                src={heroImage}
                alt={salon.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Dasho
                </p>
                <h4 className="text-md font-semibold leading-tight">
                  {salon.name}
                </h4>
              </div>
              <p className="text-sm text-muted-foreground leading-snug">
                {distance ? `${distance} Km • ` : ""}{salon.location}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  {salon.rating.toFixed(1)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Route Map
                </span>
              </div>
              <Button
                variant="outline"
                className="inline-flex items-start text-left gap-2 text-sm font-semibold !bg-transparent text-foreground border border-border rounded-full p-0">
                <Info className="w-3.5 h-3.5" />
                More Info
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for the style you want"
              className="w-full pl-10 pr-4 py-3 bg-transparent border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-base font-semibold">Service Category</p>
            <div className="flex items-center gap-2 text-sm">
              <span
                className={
                  selectedGender === "female"
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }>
                Female
              </span>
              <div
                className="relative w-12 h-6 bg-primary rounded-full cursor-pointer"
                onClick={() =>
                  setSelectedGender((prev) =>
                    prev === "male" ? "female" : "male"
                  )
                }>
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-background rounded-full shadow transition-transform ${selectedGender === "female"
                    ? "translate-x-0.5"
                    : "translate-x-[22px]"
                    }`}
                />
              </div>
              <span
                className={
                  selectedGender === "male"
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }>
                Male
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-black p-4 shadow">
            <p className="text-sm font-semibold">Service by Brand Products.</p>
            <p className="text-xs mt-2 opacity-90 tracking-wide">
              WELLA · RICA · LOTUS · VLCC · LOREAL · FIGARO
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {catalog.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategoryId(category.id)}
                className={`flex flex-col items-center gap-2 min-w-[80px] ${activeCategory?.id === category.id
                  ? "text-primary"
                  : "text-muted-foreground"
                  }`}>
                <div
                  className={`w-16 h-16 rounded-2xl overflow-hidden border bg-card ${activeCategory?.id === category.id
                    ? "border-primary shadow"
                    : "border-transparent"
                    }`}>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-medium text-center leading-tight">
                  {category.name}
                </span>
                {activeCategory?.id === category.id && (
                  <div className="w-8 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
          {activeCategory && (
            <p className="text-base font-semibold">
              {activeCategory.name}{" "}
              <span className="text-muted-foreground text-sm">
                ({servicesToShow.length})
              </span>
            </p>
          )}
        </section>

        <section className="space-y-4">
          {servicesToShow.map((service, index) => {
            const qty = getServiceQuantity(service.id);
            return (
              <div
                key={service.id}
                onClick={() => handleAddService(service)}
                className="bg-transparent border border-border rounded-3xl p-4 shadow animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-pointer hover:border-yellow-400/50 transition-colors group"
                style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold group-hover:text-yellow-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-left text-muted-foreground mt-1">
                      {service.duration}
                    </p>
                    <p className="text-primary font-bold mt-2">
                      {service.priceLabel}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    {qty === 0 ? (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddService(service);
                        }}
                        size="sm"
                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-full px-6">
                        ADD
                      </Button>
                    ) : (
                      <div className="flex items-center gap-3 bg-yellow-400 rounded-full px-2 py-1">
                        <button
                          // Note: Decreasing will just remove instances sequentially.
                          // A proper UI would allow editing from cart or re-opening selection
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(service.id, qty - 1);
                          }}
                          className="p-1 hover:bg-yellow-500 rounded-full transition-colors">
                          <Minus className="w-4 h-4 text-gray-900" />
                        </button>
                        <span className="text-gray-900 font-bold min-w-[12px] text-center">
                          {qty}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddService(service);
                          }}
                          className="p-1 hover:bg-yellow-500 rounded-full transition-colors">
                          <Plus className="w-4 h-4 text-gray-900" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {service.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {servicesToShow.length === 0 && (
            <div className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-2xl bg-card">
              No services match your search.
            </div>
          )}
        </section>
      </main>

      {/* Sticky Bottom Cart Bar */}
      {items.length > 0 && (
        <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-yellow-400 rounded-2xl shadow-xl p-4 flex items-center justify-between text-gray-900">
            <div className="flex items-center gap-3">
              <div className="bg-gray-900 p-2 rounded-xl">
                <ShoppingBag className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-bold">
                  {items.length} {items.length === 1 ? "Service" : "Services"}{" "}
                  Added
                </p>
                <p className="text-xs font-semibold opacity-80">
                  ₹{getItemTotal()}
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/order-summary")}
              className="bg-gray-900 text-yellow-400 hover:bg-gray-800 font-bold rounded-xl">
              View Cart
            </Button>
          </div>
        </div>
      )}

      <SelectProfessionalDialog
        isOpen={isProDialogOpen}
        onClose={() => setIsProDialogOpen(false)}
        onSelect={handleProfessionalSelect}
        salonId={salonId}
      />
    </div>
  );
}
