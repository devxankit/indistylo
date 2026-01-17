import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Filter, MapPin, Search, Star, Loader2 } from "lucide-react";
import { useSalonStore } from "../store/useSalonStore";
import { useContentStore } from "@/module/admin/store/useContentStore";
import { useUserCategoryStore } from "../store/useUserCategoryStore";
import { useServiceStore } from "../store/useServiceStore";
import { usePackageStore } from "../store/usePackageStore";
import { useCartStore } from "../store/useCartStore";
import { PackageCard } from "../components/PackageCard";
import carousel1 from "@/assets/heropage/carousel/carousel1.png";
import carousel2 from "@/assets/heropage/carousel/carousel2.png";
import carousel3 from "@/assets/heropage/carousel/carousel3.png";
import salonInterior1 from "@/assets/atsalon/saloninterior/Screenshot from 2025-11-26 16-47-35.png";
import salonInterior2 from "@/assets/atsalon/saloninterior/Screenshot from 2025-11-26 16-47-39.png";
import salonInterior3 from "@/assets/atsalon/saloninterior/Screenshot from 2025-11-26 16-47-42.png";
import salonInterior4 from "@/assets/atsalon/saloninterior/Screenshot from 2025-11-26 16-47-44.png";

export function SpaPage() {
  const navigate = useNavigate();
  const autoplayPlugin = useRef(
    Autoplay({ delay: 1500, stopOnInteraction: false, stopOnMouseEnter: false })
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { salons, loading, fetchSalons } = useSalonStore();
  const { banners, fetchContent } = useContentStore();
  const {
    categories,
    selectedGender: storeGender,
    setGender,
    fetchCategories,
  } = useUserCategoryStore();
  const { services, fetchServices } = useServiceStore();
  const { packages, fetchPackages } = usePackageStore();
  const { addItem } = useCartStore();

  const [selectedGender, setSelectedGender] = useState<"male" | "female">(
    "male"
  );

  useEffect(() => {
    fetchSalons({ category: "Spa" });
    fetchContent();
    fetchServices({ type: "spa", gender: selectedGender });
    fetchPackages({ type: "spa", gender: selectedGender });
  }, [fetchSalons, fetchContent, fetchServices, fetchPackages, selectedGender]);

  // Sync internal gender state with store gender and fetch categories
  useEffect(() => {
    if (storeGender) {
      setSelectedGender(storeGender.toLowerCase() as "male" | "female");
    }
  }, [storeGender]);

  // Fetch categories when gender changes
  useEffect(() => {
    fetchCategories(selectedGender.toUpperCase() as "MALE" | "FEMALE", "SPA");
  }, [selectedGender, fetchCategories]);

  const handleAddToCart = (item: any, itemType: "service" | "package" = "service") => {
    addItem(
      item,
      1,
      selectedGender.toUpperCase() as "male" | "female",
      item.salon?._id || item.vendor?._id,
      item.salon?.name || item.vendor?.businessName,
      "spa",
      undefined,
      undefined,
      itemType
    );
    navigate("/order-summary");
  };

  const spaSalons = salons.filter((salon) => salon.category?.includes("Spa"));

  const spaImages = [
    salonInterior1,
    salonInterior2,
    salonInterior3,
    salonInterior4,
  ];

  // Flatten subcategories from all header groups for the icons grid
  const currentSubcategories = categories
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

  const filteredSpas = spaSalons.filter((salon) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      salon.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      salon.location.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (salon.category &&
        salon.category.some((cat) =>
          cat.toLowerCase().includes(searchQuery.toLowerCase().trim())
        ));

    const matchesCategory =
      selectedCategory === "All" ||
      (salon.category && salon.category.includes(selectedCategory));

    return matchesSearch && matchesCategory;
  });

  // Filter services based on search query, category, and gender
  const filteredServices = services.filter((service) => {
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

  if (loading && salons.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="px-4 py-4 space-y-6">
        <section className="text-left">
          <h2 className="text-2xl font-bold text-foreground">
            Spa Retreats
          </h2>
          <p className="text-muted-foreground text-sm">
            Curated spa therapies for pure relaxation and instant glow
          </p>
        </section>

        {/* Search and Filter - Mobile View */}
        <div className="flex gap-2 md:hidden">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for spa rituals, centres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 flex-shrink-0 rounded-xl border-border">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Carousel */}
        <Carousel
          className="w-full md:w-4/5 md:mx-auto mt-2"
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplayPlugin.current]}>
          <CarouselContent>
            {banners.length > 0 ? (
              banners
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
                ))
            ) : null}
          </CarouselContent>
        </Carousel>

        {/* Category Filters - Mobile View */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:hidden">
          {["All", ...headerCategories].map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant="outline"
              size="sm"
              className={`whitespace-nowrap px-4 py-1.5 h-auto rounded-full text-xs font-semibold ${selectedCategory === category
                ? "!bg-yellow-400 !text-gray-900 !border-yellow-400"
                : "text-foreground hover:text-yellow-400 hover:border-yellow-400"
                }`}>
              {category}
            </Button>
          ))}
        </div>

        {/* Gender Selection */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">
            Select Gender
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedGender("male");
                setGender("MALE");
              }}
              className={`px-2 py-1 text-sm font-bold transition-colors ${selectedGender === "male"
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
              className={`px-3 py-1 text-sm font-bold transition-colors ${selectedGender === "female"
                ? "text-foreground"
                : "text-muted-foreground"
                }`}>
              Female
            </button>
          </div>
        </div>

        {/* Subcategories Grid */}
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {currentSubcategories.map((sub, index) => (
              <Card
                key={sub.id}
                className="cursor-pointer hover:bg-muted transition-colors overflow-hidden bg-transparent border-transparent p-0 animate-in fade-in zoom-in duration-500"
                style={{ animationDelay: `${index * 50}ms` }}>
                <CardContent className="p-0 text-center">
                  <div className="aspect-square rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border border-white/5 mx-auto w-full">
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="px-1 pt-2">
                    <p className="text-[10px] font-bold text-foreground leading-tight line-clamp-2">
                      {sub.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Search and Filter - Desktop View */}
        <div className="hidden md:flex md:items-center md:justify-between">
          <div className="flex-1 relative md:max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for spa rituals, centres..."
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
                  className={`whitespace-nowrap px-4 rounded-full text-xs font-semibold ${selectedCategory === category
                    ? "border-yellow-400 text-yellow-400 bg-yellow-400/10"
                    : "text-foreground hover:text-yellow-400 hover:border-yellow-400"
                    }`}>
                  {category}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 flex-shrink-0 border-border rounded-xl">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Featured Services Section */}
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
                if (typeof service.salon === 'string') return null;
                const salon = service.salon;
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
                        <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner relative group-hover:scale-[1.02] transition-transform duration-500">
                          <img
                            src={displayImage}
                            alt={salon.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-[2px] px-1.5 py-0.5 rounded text-[10px] font-bold text-yellow-500 flex items-center gap-0.5 border border-white/10">
                            <Star className="w-2.5 h-2.5 fill-yellow-500" />
                            <span>{salon.rating || "4.8"}</span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <h4 className="text-[15px] font-bold text-gray-100 line-clamp-1 leading-tight group-hover:text-yellow-400 transition-colors">
                              {service.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1">
                              <p className="text-xs font-medium text-gray-400 line-clamp-1">
                                by {salon.name}
                              </p>
                            </div>
                          </div>

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
              packages.map((pkg) => (
                <PackageCard key={pkg._id} pkg={pkg} hideLocation={true} onBook={(p) => handleAddToCart(p, "package")} />
              ))
            ) : (
              <div className="w-full text-center py-8 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                <p>No packages available at the moment.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
