import { Header } from "../components/Header";
import { mockDeals } from "../services/mockData";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Clock, ShoppingCart, Minus, Plus, Star } from "lucide-react";
import service1 from "@/assets/heropage/homeservices/service1.png";
import service2 from "@/assets/heropage/homeservices/service2.png";
import service3 from "@/assets/heropage/homeservices/service3.png";
import service4 from "@/assets/heropage/homeservices/service4.png";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogBody,
} from "@/components/ui/dialog";
import { useCartStore } from "../store/useCartStore";
import { useContentStore } from "@/module/admin/store/useContentStore";

export function HomePage() {
  const { banners, featuredServices, popularPackages, promoBanner } = useContentStore();
  const autoplayPlugin = useRef(
    Autoplay({ delay: 1500, stopOnInteraction: false, stopOnMouseEnter: false })
  );
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<Record<string, number>>({});

  const handleOpenDialog = (pkgId: string) => {
    setSelectedPackage(pkgId);
    if (!quantity[pkgId]) {
      setQuantity((prev) => ({ ...prev, [pkgId]: 1 }));
    }
  };

  const handleCloseDialog = () => {
    setSelectedPackage(null);
  };

  const handleQuantityChange = (pkgId: string, change: number) => {
    setQuantity((prev) => ({
      ...prev,
      [pkgId]: Math.max(1, (prev[pkgId] || 1) + change),
    }));
  };

  const handleBuyNow = (pkgId: string) => {
    const pkg = popularPackages.find((p) => p.id === pkgId);
    if (pkg) {
      const qty = quantity[pkgId] || 1;
      addItem(pkg, qty, "male", "Home Service", "at-home"); // Default to male, can be customized
      handleCloseDialog();
      navigate("/order-summary");
    }
  };

  const currentPackage = selectedPackage
    ? popularPackages.find((pkg) => pkg.id === selectedPackage)
    : null;

  return (
    <div className="min-h-screen mx-auto">
      <Header />

      <main className="px-4 py-2 space-y-5 mx-auto mt-4">
        {/* Hero Carousel */}
        <Carousel
          className="w-full pt-2 md:pt-8 md:w-4/5 md:mx-auto"
          aria-label="Hero carousel"
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplayPlugin.current]}>
          <CarouselContent>
            {banners.length > 0 ? (
              banners.map((banner) => (
                <CarouselItem key={banner.id}>
                  <div className="rounded-2xl overflow-hidden aspect-[16/6] md:aspect-[21/9]">
                    <img
                      src={banner.image}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <div className="rounded-2xl overflow-hidden aspect-[16/6] md:aspect-[21/9] bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">No banners available</p>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious className="left-2 md:-left-12" />
          <CarouselNext className="right-2 md:-right-12" />
        </Carousel>

        {/* Last Minute At Salon Deals Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-foreground">
              Last Minute At Salon Deals
            </h3>
            <Link
              to="/at-salon"
              className="text-yellow-400 text-sm font-semibold hover:text-yellow-500 transition-colors">
              See all
            </Link>
          </div>

          {/* Horizontally Scrollable Deal Cards */}
          {/* Horizontally Scrollable Deal Cards */}
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {mockDeals.map((deal, index) => {
              // Define visually appealing single-color gradients
              const gradientClasses = [
                "bg-gradient-to-br from-[#ff6b6b] to-[#c73866]", // vivid coral-red
                "bg-gradient-to-br from-[#8a4fff] to-[#512da8]", // deep violet-purple
                "bg-gradient-to-br from-[#1e3c72] to-[#2a5298]", // rich blue
                "bg-gradient-to-br from-[#ffb347] to-[#ff7b00]", // warm amber-orange
                "bg-gradient-to-br from-[#11998e] to-[#38ef7d]", // emerald-mint
                "bg-gradient-to-br from-[#141e30] to-[#243b55]", // dark steel-blue (luxury tone)
              ];

              const gradient = gradientClasses[index % gradientClasses.length];

              return (
                <div
                  key={deal.id}
                  className={`${gradient} min-w-[260px] max-w-[260px] flex-shrink-0 rounded-2xl text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] relative overflow-hidden`}>
                  {/* Contrast overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/30 pointer-events-none" />

                  <div className="relative z-10 p-4 flex flex-col h-full min-h-[180px] justify-between">
                    {/* Top: Copy stack */}
                    <div className="flex flex-col items-center text-center">
                      {/* UPTO */}
                      <span className="text-[18px] sm:text-xs uppercase tracking-[0.2em] font-medium text-white/90">
                        UPTO
                      </span>

                      {/* 80% OFF badge */}
                      <div className="mt-1 bg-white text-black rounded-[6px] px-3 py-1 shadow-sm">
                        <span className="text-[18px] sm:text-lg font-extrabold leading-none tabular-nums">
                          {deal.discount}
                        </span>
                      </div>

                      {/* on */}
                      <span className="mt-1 text-[11px] sm:text-xs text-white/85 leading-none">
                        on
                      </span>

                      {/* Service line (Hair / Skin / Services) */}
                      <span className="mt-0.5 text-[20px] sm:text-base font-semibold leading-tight">
                        {deal.title.includes("Hair")
                          ? "Hair Services"
                          : deal.title.includes("Skin")
                            ? "Skin Services"
                            : "Services"}
                      </span>
                    </div>

                    {/* Brand */}
                    <div className="flex justify-center my-2">
                      <div className="bg-black/75 px-2 py-0.5 rounded-[6px] border border-white/15 backdrop-blur-[2px] shadow-inner">
                        <span className="text-white font-extrabold text-[10px] tracking-[0.25em]">
                          DASHO
                        </span>
                      </div>
                    </div>

                    {/* Bottom: Location + Meta */}
                    <div className="mt-auto text-start">
                      <p className="text-[12px] text-white/95 leading-snug px-2 mb-2 line-clamp-2">
                        {deal.salon.location}
                      </p>

                      <div className="flex items-center justify-between text-[11px] font-medium px-1 text-white/90">
                        <span>{deal.salon.distance.toFixed(2)} Km</span>

                        {deal.salon.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300"
                              viewBox="0 0 24 24">
                              <path d="M12 .587l3.668 7.435L24 9.753l-6 5.849L19.335 24 12 19.897 4.665 24 6 15.602 0 9.753l8.332-1.731z" />
                            </svg>
                            <span className="tabular-nums">
                              {deal.salon.rating}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-foreground">
              At Home Services
            </h3>
          </div>

          {/* Horizontally Scrollable Deal Cards */}
          {/* Horizontally Scrollable Deal Cards */}
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {[
              { id: "1", image: service1, name: "Service 1" },
              { id: "2", image: service2, name: "Service 2" },
              { id: "3", image: service3, name: "Service 3" },
              { id: "4", image: service4, name: "Service 4" },
              { id: "5", image: service1, name: "Service 1" },
              { id: "6", image: service2, name: "Service 2" },
              { id: "7", image: service3, name: "Service 3" },
              { id: "8", image: service4, name: "Service 4" },
            ].map((service) => (
              <div
                key={service.id}
                className="min-w-[150px] max-w-[150px] flex-shrink-0 rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Popular At Home Services Section */}
        <section className="space-y-4 text-left">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-foreground">
              Popular At Home Services
            </h3>
            <Link
              to="/at-home"
              className="text-yellow-400 text-sm font-semibold hover:text-yellow-500 transition-colors">
              See all
            </Link>
          </div>

          {/* Horizontally Scrollable Service Cards */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                className="min-w-[200px] max-w-[200px] flex-shrink-0 bg-transparent  rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:border-yellow-400/50 transition-colors">
                {/* Image */}
                <div className="w-full aspect-square overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Service Name */}
                  <h4 className="text-base font-bold text-foreground line-clamp-1">
                    {service.name}
                  </h4>

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration} min.</span>
                  </div>

                  {/* Price and Button */}
                  <div className="space-y-2">
                    <div className="text-xl font-bold text-yellow-400">
                      ₹{service.price}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent text-yellow-400 border border-yellow-400 hover:bg-yellow-400/20 hover:text-yellow-400 hover:border-yellow-400 font-semibold"
                      size="sm"
                      onClick={() => {
                        // Convert service to package format and add to cart
                        const servicePackage = {
                          id: service.id,
                          title: service.name,
                          description: "",
                          image: service.image,
                          price: service.price,
                          duration: service.duration,
                          overview: [],
                          howItWorks: [],
                        };
                        addItem(
                          servicePackage,
                          1,
                          "male",
                          "Home Service",
                          "at-home"
                        );
                        navigate("/order-summary");
                      }}>
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add to cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular At Home Service Packages Section */}
        <section className="space-y-4 text-left">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-foreground">
              Popular At Home Service Packages
            </h3>
            <Link
              to="/at-home"
              className="text-yellow-400 text-sm font-semibold hover:text-yellow-500 transition-colors">
              See all
            </Link>
          </div>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {popularPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-card rounded-md overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:border-yellow-400/50 transition-colors flex flex-col">
                {/* Image */}
                <div className="w-full h-32 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-2 space-y-1 flex flex-col flex-1 md:p-4 md:space-y-2">
                  {/* Title */}
                  <h4 className="text-sm font-bold text-foreground">
                    {pkg.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground ">
                    {pkg.description}
                  </p>

                  {/* Offer Details Link */}
                  <div className="flex justify-between align-center items-center">
                    <span className="text-xl font-bold text-yellow-400">
                      ₹ {pkg.price}
                    </span>

                    {pkg.offerDetails && (
                      <button
                        onClick={() => handleOpenDialog(pkg.id)}
                        type="button"
                        className="text-yellow-400 text-sm font-medium hover:text-yellow-500 transition-colors underline underline-offset-2"
                        style={{
                          background: "transparent",
                          border: "none",
                          padding: 0,
                          margin: 0,
                          textDecoration: "underline",
                          textUnderlineOffset: "2px",
                          cursor: "pointer",
                          boxShadow: "none",
                        }}>
                        {pkg.offerDetails}
                      </button>
                    )}
                  </div>

                  {/* Button - Pushed to bottom */}
                  <div className="mt-auto pt-2">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent text-yellow-400 border border-yellow-400 hover:bg-yellow-400/20 hover:text-yellow-400 hover:border-yellow-400 font-semibold"
                      size="sm"
                      onClick={() => handleBuyNow(pkg.id)}>
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      <span className="text-sm font-semibold">Buy now</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Explore Products Section - Dark Theme with Yellow */}
        <section>
          <div className="rounded-2xl overflow-hidden md:w-3/5 md:mx-auto my-16">
            <img
              src={promoBanner}
              alt="Carousel 2"
              className="w-full h-auto object-cover"
            />
          </div>
        </section>
      </main>

      {/* Service Package Details Dialog */}
      {currentPackage && (
        <Dialog open={!!selectedPackage} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-h-[90vh]">
            <DialogHeader>
              <div className="flex items-start justify-between w-full text-left">
                <DialogTitle className="text-left">
                  {currentPackage.title}
                </DialogTitle>
                <div className="flex items-center gap-2">
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-1 border border-yellow-400 rounded px-1 py-0.5">
                    <button
                      onClick={() =>
                        handleQuantityChange(currentPackage.id, -1)
                      }
                      className="text-yellow-400 hover:text-yellow-500 p-0.5">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-foreground font-medium text-xs min-w-[2px] text-center">
                      {quantity[currentPackage.id] || 1}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(currentPackage.id, 1)}
                      className="text-yellow-400 hover:text-yellow-500 p-0.5">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <DialogClose onClose={handleCloseDialog} />
                </div>
              </div>
            </DialogHeader>

            <DialogBody className="p-4 space-y-4 pb-24 relative">
              <div className="space-y-4 text-left">
                {/* Rating */}
                {currentPackage.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-pink-500 text-pink-500" />
                      <span className="text-pink-500 font-semibold text-base">
                        {currentPackage.rating}
                      </span>
                    </div>
                    {currentPackage.reviews && (
                      <span className="text-muted-foreground text-sm">
                        ({currentPackage.reviews} reviews)
                      </span>
                    )}
                  </div>
                )}

                {/* Price and Duration */}
                <div className="flex items-center gap-4">
                  <span className="text-green-500 text-2xl font-bold">
                    ₹{currentPackage.price}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {currentPackage.duration} min
                    </span>
                  </div>
                </div>

                {/* Overview Section */}
                {currentPackage.overview &&
                  currentPackage.overview.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-foreground">
                        Overview
                      </h3>
                      <ul className="space-y-1 pl-4">
                        {currentPackage.overview.map((item, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground list-disc">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* How it Works Section */}
                {currentPackage.howItWorks &&
                  currentPackage.howItWorks.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-foreground">
                        How it Works
                      </h3>
                      <ul className="space-y-2 pl-4">
                        {currentPackage.howItWorks.map((step, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground list-disc">
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>

              {/* Next Button - Sticky at bottom */}
              <div className="sticky bottom-0 pt-4 pb-2 bg-background border-t border-border mt-4 -mx-4 px-4">
                <Button
                  className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold rounded-lg"
                  size="lg"
                  onClick={() => {
                    if (currentPackage) {
                      handleBuyNow(currentPackage.id);
                    }
                  }}>
                  Next
                </Button>
              </div>
            </DialogBody>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
