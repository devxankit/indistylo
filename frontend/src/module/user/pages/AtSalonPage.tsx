import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  Search,
  Filter,
  Map as MapIcon,
  List,
  Loader2,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SalonMap } from "../components/SalonMap";
import { useSalonStore } from "../store/useSalonStore";
import { useServiceStore } from "../store/useServiceStore";
import { useCartStore } from "../store/useCartStore";
import { useContentStore } from "@/module/admin/store/useContentStore";
import { useUserCategoryStore } from "../store/useUserCategoryStore";
import { usePackageStore } from "../store/usePackageStore";
import { PackageCard } from "../components/PackageCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function AtSalonPage() {
  const navigate = useNavigate();
  const autoplayPlugin = useRef(
    Autoplay({ delay: 1500, stopOnInteraction: false, stopOnMouseEnter: false })
  );
  const [selectedGender, setSelectedGender] = useState<"male" | "female">(
    "male"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);

  const { salons, fetchSalons } = useSalonStore(); // Keep for map view
  const { services, loading, fetchServices } = useServiceStore();
  const { banners, fetchContent } = useContentStore();
  const { categories, setGender } = useUserCategoryStore();
  const { packages, fetchPackages } = usePackageStore();
  const { addItem } = useCartStore(); // Import addItem

  const handleAddToCart = (item: any, itemType: "service" | "package" = "service") => {
    addItem(
      item,
      1,
      selectedGender.toUpperCase() as "male" | "female",
      item.salon?._id || item.vendor?._id,
      item.salon?.name || item.vendor?.businessName,
      "at-salon",
      undefined,
      undefined,
      itemType
    );
    navigate("/order-summary");
  };

  useEffect(() => {
    fetchSalons();
    fetchServices({ type: "at-salon" });
    fetchContent();
    fetchPackages({ type: "at-salon", gender: selectedGender });
    setGender(selectedGender.toUpperCase() as "MALE" | "FEMALE");

    // Get user location
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
  }, [fetchSalons, fetchServices, fetchContent, selectedGender, setGender]);

  // Flatten subcategories from all header groups (for service cards)
  const currentServices = categories
    .filter(
      (group) =>
        selectedCategory === "All" || group.headerName === selectedCategory
    )
    .flatMap((group) =>
      group.subcategories.map((sub) => ({
        id: sub._id,
        name: sub.name,
        image: sub.image,
      }))
    );

  // Header categories for filter tabs
  const headerCategories = categories
    .map((group) => group.headerName)
    .sort((a, b) => {
      const orderA =
        categories.find((g) => g.headerName === a)?.headerOrder || 0;
      const orderB =
        categories.find((g) => g.headerName === b)?.headerOrder || 0;
      return orderA - orderB;
    });

  const calculateDistance = (salonGeo: { coordinates: number[] } | undefined) => {
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
    return (R * c).toFixed(1);
  };

  // Filter services based on search query, category, and gender
  const filteredServices = services.filter((service) => {
    // Ensure salon is populated
    if (typeof service.salon === 'string') return false;
    const salon = service.salon;

    const matchesSearch =
      searchQuery.trim() === "" ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      salon.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      salon.location.toLowerCase().includes(searchQuery.toLowerCase().trim());

    const matchesCategory =
      selectedCategory === "All" ||
      service.category === selectedCategory || // Direct match
      // Or check if it belongs to a header category (fetched via useUserCategoryStore)
      categories.some(g => g.headerName === selectedCategory && g.subcategories.some(s => s.name === service.name)); // Rough check, ideal is backend category field match

    // Filter by gender: show services that match the selected gender or are 'unisex'
    const matchesGender =
      service.gender === "unisex" ||
      service.gender === selectedGender;

    return matchesSearch && matchesGender && (selectedCategory === "All" ? true : matchesCategory);
  });

  if (loading && services.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="px-4 py-4 space-y-4">
        {/* Search and Filter - Mobile View */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for service or salon..."
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
            className="w-10 h-10 flex-shrink-0 border-border bg-card"
            aria-label={
              viewMode === "list" ? "Switch to map view" : "Switch to list view"
            }>
            {viewMode === "list" ? (
              <MapIcon className="w-4 h-4 text-yellow-400" />
            ) : (
              <List className="w-4 h-4 text-yellow-400" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 flex-shrink-0">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Category Filters - Mobile View */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:hidden">
          {["All", ...headerCategories].map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant="outline"
              size="sm"
              className={`whitespace-nowrap ${selectedCategory === category
                ? "!bg-yellow-400 !text-gray-900 !border-yellow-400 hover:!bg-yellow-400 hover:!text-gray-900"
                : "text-foreground hover:text-yellow-400 hover:border-yellow-400"
                }`}>
              {category}
            </Button>
          ))}
        </div>

        {/* Search and Filter - Desktop View */}
        <div className="hidden md:flex md:items-center md:justify-between">
          <div className="flex-1 relative md:max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for service or salon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {["All", ...headerCategories].map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant="outline"
                  size="sm"
                  className={`whitespace-nowrap ${selectedCategory === category
                    ? "border-yellow-400 text-yellow-400 bg-yellow-400/10 hover:text-yellow-400"
                    : "text-foreground hover:text-yellow-400 hover:border-yellow-400"
                    }`}>
                  {category}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setViewMode(viewMode === "list" ? "map" : "list")
                }
                className="w-10 h-10 flex-shrink-0 border-border bg-card">
                {viewMode === "list" ? (
                  <MapIcon className="w-4 h-4 text-yellow-400" />
                ) : (
                  <List className="w-4 h-4 text-yellow-400" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-10 h-10 flex-shrink-0">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content: Map or List View */}
        {viewMode === "map" ? (
          <section className="space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Salons Near You</h3>
              <span className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full border border-border">
                {salons.length} Salons found
              </span>
            </div>
            <SalonMap salons={salons} />
          </section>
        ) : (
          <>
            {/* Hero Carousel */}
            <Carousel
              className="w-full md:w-4/5 md:mx-auto mt-2"
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[autoplayPlugin.current]}>
              <CarouselContent>
                {banners
                  .filter((b) => b.active)
                  .map((banner) => (
                    <CarouselItem key={banner._id || banner.id}>
                      <div className="rounded-2xl overflow-hidden">
                        <img
                          src={banner.image}
                          alt="Promo Banner"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 md:-left-12" />
              <CarouselNext className="right-2 md:-right-12" />
            </Carousel>

            {/* Gender Selection and Services */}
            <section className="space-y-4">
              {/* Gender Toggle */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Select Gender
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedGender("male")}
                    className={`px-2 py-1 text-sm font-medium transition-colors ${selectedGender === "male"
                      ? "text-foreground"
                      : "text-muted-foreground"
                      }`}>
                    Male
                  </button>
                  <div
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${selectedGender === "male" ? "bg-primary" : "bg-primary"
                      }`}
                    onClick={() =>
                      setSelectedGender(
                        selectedGender === "male" ? "female" : "male"
                      )
                    }>
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${selectedGender === "male" ? "left-0.5" : "left-[22px]"
                        }`}
                    />
                  </div>
                  <button
                    onClick={() => setSelectedGender("female")}
                    className={`px-3 py-1 text-sm font-medium transition-colors ${selectedGender === "female"
                      ? "text-foreground"
                      : "text-muted-foreground"
                      }`}>
                    Female
                  </button>
                </div>
              </div>

              {/* Service Cards Grid - Sub Categories */}
              {/* Service Cards Grid - Sub Categories */}
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                {currentServices.map((service, index) => (
                  <Card
                    key={service.id}
                    className="min-w-[100px] max-w-[100px] flex-shrink-0 cursor-pointer hover:bg-muted transition-colors overflow-hidden bg-transparent border-transparent p-0 animate-in fade-in zoom-in duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}>
                    <CardContent className="p-0">
                      <div className="aspect-square rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="px-1 pt-2 text-center">
                        <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight">
                          {service.name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Available Services List */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Featured Services</h3>
                <span className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full border border-border">
                  {filteredServices.length} Services
                </span>
              </div>

              <div className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service, index) => {
                    // Type assertion since we filter out strings earlier
                    if (typeof service.salon === 'string') return null;
                    const salon = service.salon;
                    const displayImage = salon.images && salon.images.length > 0
                      ? salon.images[0]
                      : "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800";

                    const distance = calculateDistance(salon.geo);

                    return (
                      <Card
                        key={service._id}
                        onClick={() => navigate(`/shops/${salon._id}`)}
                        className="cursor-pointer bg-[#1A1A1A] border-none text-white hover:bg-[#252525] transition-colors py-3 px-1 animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-2xl"
                        style={{ animationDelay: `${index * 50}ms` }}>
                        <CardContent className="p-3">
                          <div className="flex gap-3 mb-3">
                            {/* Salon Image */}
                            <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                              <img
                                src={displayImage}
                                alt={salon.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                              <div>
                                <CardTitle className="text-[15px] text-start font-semibold text-white line-clamp-1 leading-tight">
                                  {salon.name}
                                </CardTitle>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1.5">
                                  <MapPin className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">
                                    {salon.location}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 text-xs font-medium mt-1">
                                <div className="flex items-center gap-1 text-white">
                                  <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                                  <span className="mt-0.5">{salon.rating || "5"}</span>
                                </div>
                                {distance && (
                                  <span className="text-gray-400 font-normal mt-0.5">
                                    {distance} km away
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Golden Divider */}
                          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-80 mb-3"></div>

                          {/* Footer: Service Name & Price & Book */}
                          <div className="flex items-center justify-between px-1">
                            <p className="text-[13px] font-medium text-yellow-500">
                              {service.name} @ ₹{service.price}
                            </p>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(service);
                              }}
                              className="px-6 h-8 text-xs rounded-lg font-medium bg-black text-white border border-gray-800 hover:bg-gray-900 hover:text-yellow-500 transition-colors"
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-muted-foreground md:col-span-3 bg-muted/20 rounded-xl border border-dashed border-border">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 opacity-50" />
                      <p>No services found matching your criteria.</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Exciting Packages Section */}
            <section className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Exciting packages</h3>
                <span className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full border border-border">
                  {packages.length} Packages
                </span>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {packages.length > 0 ? (
                  packages.map((pkg) => {
                    // Calculate distance if vendor has location
                    // Package model has vendor populated with address/city, but AtSalonPage needs coordinates for calculation.
                    // The 'getPackages' controller populates vendor with "businessName address city".
                    // It likely DOES NOT populate 'geo' or 'location' (coordinates).
                    // I need to check the controller and update it if needed.
                    // Wait, PackageCard needs distance. AtSalonPage has calculateDistance function.
                    // But I need the vendor's coordinates.

                    // Let's assume for now I will fix the backend to return geo.
                    // Or I can look up the salon corresponding to the vendor?
                    // The 'salons' store has all salons with geo.
                    // I can find the salon that belongs to this vendor.

                    const salon = salons.find(s => s.vendor === pkg.vendor._id || s.vendor === (pkg.vendor as any)._id);
                    const distance = salon ? calculateDistance(salon.geo) : null;

                    return <PackageCard key={pkg._id} pkg={pkg} distance={distance} onBook={(p) => handleAddToCart(p, "package")} />;
                  })
                ) : (
                  <div className="w-full text-center py-8 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                    <p>No packages available at the moment.</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
