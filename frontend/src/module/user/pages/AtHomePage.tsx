import { useState, useEffect, useRef } from "react";
import { Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { useContentStore } from "@/module/admin/store/useContentStore";
import { useUserCategoryStore } from "../store/useUserCategoryStore";
import { useServiceStore } from "../store/useServiceStore";
import { usePackageStore } from "../store/usePackageStore";
import { PackageCard } from "../components/PackageCard";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function AtHomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCartStore();
  const { banners, fetchContent } = useContentStore();
  const {
    categories,
    selectedGender: storeGender,
    setGender,
  } = useUserCategoryStore();
  const { services, fetchServices } = useServiceStore();
  const { packages, fetchPackages } = usePackageStore();

  const [selectedGender, setSelectedGender] = useState<"male" | "female">(
    "male"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const autoplayPlugin = useRef(
    Autoplay({ delay: 1500, stopOnInteraction: false, stopOnMouseEnter: false })
  );

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Initialization: Sync from URL or Store on mount or URL change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genderParam = params.get("gender")?.toLowerCase();

    if (genderParam === "male" || genderParam === "female") {
      setSelectedGender(genderParam);
      setGender(genderParam.toUpperCase() as "MALE" | "FEMALE");
    } else {
      // If no URL param, default to store value on mount
      // We only do this check if we rarely expect store to be out of sync
      // But to avoid overriding user's local toggle if this effect runs for other reasons,
      // we should arguably not do this if we are handling store updates manually.
      // However, ensures consistency on navigation.
      if (storeGender) {
        setSelectedGender(storeGender.toLowerCase() as "male" | "female");
      }
    }
  }, [location.search, setGender, storeGender]);

  // Fetch Data: Runs when selectedGender or URL params change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    const searchParam = params.get("search");

    // Only update category from URL if it exists
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }

    const filters: any = {
      type: "at-home",
      gender: selectedGender,
    };
    if (categoryParam) filters.category = categoryParam;
    if (searchParam) filters.search = searchParam;

    fetchServices(filters);
    fetchPackages({ type: "at-home", gender: selectedGender });
  }, [fetchServices, fetchPackages, location.search, selectedGender]);

  // Flatten subcategories from all header groups
  const currentCategories = categories
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

  const handleAddToCart = (item: any, itemType: "service" | "package" = "service") => {
    // Determine type based on item structure or current page context
    // item could be a service or a package
    // For AtHomePage, mostly 'at-home' type

    // Construct cart item
    // Note: item might have different structure. 
    // If it's a service (from useServiceStore), it has '_id', 'name', 'price', etc.
    // Package also has similar.

    addItem(
      item,
      1, // quantity
      selectedGender.toUpperCase() as "male" | "female", // category/gender
      item.salon?._id || item.vendor?._id, // salonId from service.salon or package.vendor
      item.salon?.name || item.vendor?.businessName, // salonName
      "at-home", // type
      undefined, // professionalId
      undefined, // professionalName
      itemType // itemType
    );
    navigate("/order-summary");
  };

  // Filter services based on search query, category, and gender (client side refinement if needed, though API handles it)
  const filteredServices = services.filter((service) => {
    // Ensure salon is populated
    if (typeof service.salon === 'string') return false;
    const salon = service.salon;

    const matchesSearch =
      searchQuery.trim() === "" ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      salon.name.toLowerCase().includes(searchQuery.toLowerCase().trim());

    const matchesCategory =
      selectedCategory === "All" ||
      service.category === selectedCategory ||
      categories.some(g => g.headerName === selectedCategory && g.subcategories.some(s => s.name === service.name));

    const matchesGender =
      service.gender === "unisex" ||
      service.gender === selectedGender;

    return matchesSearch && matchesGender && (selectedCategory === "All" ? true : matchesCategory);
  });

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground">
      {/* Banner Section */}
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
                <div className="rounded-2xl overflow-hidden mx-4">
                  <img
                    src={banner.image}
                    alt="Promo Banner"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
        {/* Arrows hidden for mobile usually, but kept for desktop if needed */}
      </Carousel>

      <div className="px-4 mt-6 space-y-8">
        {/* Search Bar */}
        <div className="pt-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for At-Home services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Header Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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

        {/* Gender Selection */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Select Gender
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedGender("male");
                setGender("MALE");
              }}
              className={`px-2 py-1 text-sm font-medium transition-colors ${selectedGender === "male"
                ? "text-foreground"
                : "text-muted-foreground"
                }`}>
              Male
            </button>
            <div
              className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${selectedGender === "male" ? "bg-primary" : "bg-primary"
                }`}
              onClick={() => {
                const newGender = selectedGender === "male" ? "female" : "male";
                setSelectedGender(newGender);
                setGender(newGender.toUpperCase() as "MALE" | "FEMALE");
              }}>
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${selectedGender === "male" ? "left-0.5" : "left-[22px]"
                  }`}
              />
            </div>
            <button
              onClick={() => {
                setSelectedGender("female");
                setGender("FEMALE");
              }}
              className={`px-3 py-1 text-sm font-medium transition-colors ${selectedGender === "female"
                ? "text-foreground"
                : "text-muted-foreground"
                }`}>
              Female
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="space-y-4">
          {/* Service Cards Grid - Sub Categories */}
          {/* Service Cards Grid - Sub Categories */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {currentCategories.map((service, index) => (
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
        </div>

        <section className="space-y-4">
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
                // Prefer service image, fallback to first salon image, then placeholder
                const displayImage = service.image || (salon.images && salon.images.length > 0
                  ? salon.images[0]
                  : "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800");

                return (
                  <Card
                    key={service._id}
                    className="group cursor-pointer bg-[#1A1A1A] border border-white/5 text-white hover:bg-[#202020] hover:border-yellow-500/20 transition-all duration-300 py-3 px-3 animate-in fade-in slide-in-from-bottom-4 rounded-xl shadow-md hover:shadow-xl hover:shadow-yellow-900/10"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => navigate(`/shops/${salon._id}`)}
                  >
                    <CardContent className="p-0">
                      <div className="flex gap-4">
                        {/* Service/Salon Image */}
                        <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner relative group-hover:scale-[1.02] transition-transform duration-500">
                          <img
                            src={displayImage}
                            alt={salon.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Rating Badge on Image */}
                          <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-[2px] px-1.5 py-0.5 rounded text-[10px] font-bold text-yellow-500 flex items-center gap-0.5 border border-white/10">
                            <Star className="w-2.5 h-2.5 fill-yellow-500" />
                            <span>{salon.rating || "4.8"}</span>
                          </div>
                        </div>

                        {/* Details Column */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            {/* Service Name - Primary */}
                            <h4 className="text-[15px] font-bold text-gray-100 line-clamp-1 leading-tight group-hover:text-yellow-400 transition-colors">
                              {service.name}
                            </h4>

                            {/* Salon Name - Secondary */}
                            <div className="flex items-center gap-1.5 mt-1">
                              <p className="text-xs font-medium text-gray-400 line-clamp-1">
                                by {salon.name}
                              </p>
                            </div>
                          </div>

                          {/* Price and Action Row */}
                          <div className="flex items-end justify-between mt-2">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Price</span>
                              <span className="text-lg font-bold text-yellow-500 leading-none">
                                ₹{service.price}
                              </span>
                            </div>

                            <Button
                              size="sm"
                              className="h-8 px-5 text-xs font-bold rounded-lg bg-[#2A2A2A] text-white border border-white/10 hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all duration-300 shadow-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(service);
                              }}
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </div>
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

        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Exciting packages</h3>
            <span className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full border border-border">
              {packages.length} Packages
            </span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {packages.length > 0 ? (
              packages.map((pkg) => (
                // hideLocation={true} hides distance and address
                <PackageCard key={pkg._id} pkg={pkg} hideLocation={true} onBook={(p) => handleAddToCart(p, "package")} />
              ))
            ) : (
              <div className="w-full text-center py-8 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                <p>No packages available at the moment.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
