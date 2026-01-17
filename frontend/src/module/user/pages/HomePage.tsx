import { Header } from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import { Button } from "@/components/ui/button";

import { useContentStore } from "@/module/admin/store/useContentStore";
import { useUserCategoryStore } from "../store/useUserCategoryStore";
import { useEffect } from "react";

export function HomePage() {
  const {
    banners,
    featuredServices,
    salonFeaturedServices,
    promoBanner,
    deals,
    fetchContent,
  } = useContentStore();

  const { categories, fetchCategories } = useUserCategoryStore();

  useEffect(() => {
    fetchContent();
    fetchCategories();
  }, [fetchContent, fetchCategories]);

  const displayDeals = deals;

  const autoplayPlugin = useRef(
    Autoplay({ delay: 1500, stopOnInteraction: false, stopOnMouseEnter: false })
  );
  const navigate = useNavigate();

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
                <CarouselItem key={banner._id || banner.id}>
                  <div className="rounded-2xl overflow-hidden aspect-[16/6] md:aspect-[21/9]">
                    {banner.image ? (
                      <img
                        src={banner.image}
                        alt="Banner"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">No image</p>
                      </div>
                    )}
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
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {displayDeals.map((deal, index) => {
              const gradientClasses = [
                "bg-gradient-to-br from-[#ff6b6b] to-[#c73866]",
                "bg-gradient-to-br from-[#8a4fff] to-[#512da8]",
                "bg-gradient-to-br from-[#1e3c72] to-[#2a5298]",
                "bg-gradient-to-br from-[#ffb347] to-[#ff7b00]",
                "bg-gradient-to-br from-[#11998e] to-[#38ef7d]",
                "bg-gradient-to-br from-[#141e30] to-[#243b55]",
              ];

              const gradient = gradientClasses[index % gradientClasses.length];

              return (
                <div
                  key={deal._id || deal.id}
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

          {/* Horizontally Scrollable Category Cards */}
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {categories.flatMap((group) =>
              group.subcategories.map((subcategory) => (
                <div
                  key={subcategory._id || subcategory.id}
                  onClick={() =>
                    navigate(`/at-home?category=${subcategory.name}`)
                  }
                  className="min-w-[150px] max-w-[150px] flex-shrink-0 rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer">
                  {subcategory.image && (
                    <img
                      src={subcategory.image}
                      alt={subcategory.name}
                      className="w-full h-auto object-cover"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Popular At Home Services Section */}
        <section className="space-y-4 text-left">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-foreground">
              Popular At Home Services
            </h3>
            <Button
              variant="default"
              size="sm"
              className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold"
              onClick={() => navigate("/at-home")}>
              Explore all
            </Button>
          </div>

          {/* Horizontally Scrollable Service Cards */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {featuredServices.map((service) => (
              <div
                key={service._id || service.id}
                className="min-w-[200px] max-w-[200px] flex-shrink-0 bg-transparent  rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:border-yellow-400/50 transition-colors">
                {/* Image */}
                <div className="w-full aspect-square overflow-hidden">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">No image</p>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Service Name */}
                  <h4 className="text-base font-bold text-foreground line-clamp-1">
                    {service.name}
                  </h4>

                  {/* Button */}
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent text-yellow-400 border border-yellow-400 hover:bg-yellow-400/20 hover:text-yellow-400 hover:border-yellow-400 font-semibold"
                      size="sm"
                      onClick={() => {
                        // Navigate to services page with filters
                        const params = new URLSearchParams();
                        if (service.category)
                          params.append("category", service.category);
                        if (service.gender)
                          params.append("gender", service.gender);
                        if (service.name) params.append("search", service.name); // Search by subcategory name
                        navigate(`/at-home?${params.toString()}`);
                      }}>
                      Explore all
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular At Salon Services Section */}
        <section className="space-y-4 text-left">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-foreground">
              Popular At Salon Services
            </h3>
            <Link
              to="/at-salon"
              className="text-yellow-400 text-sm font-semibold hover:text-yellow-500 transition-colors">
              See all
            </Link>
          </div>

          {/* Horizontally Scrollable Service Cards */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {salonFeaturedServices.map((service) => (
              <div
                key={service._id || service.id}
                className="min-w-[200px] max-w-[200px] flex-shrink-0 bg-transparent rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:border-yellow-400/50 transition-colors">
                {/* Image */}
                <div className="w-full aspect-square overflow-hidden">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">No image</p>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Service Name */}
                  <h4 className="text-base font-bold text-foreground line-clamp-1">
                    {service.name}
                  </h4>

                  {/* Button */}
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent text-yellow-400 border border-yellow-400 hover:bg-yellow-400/20 hover:text-yellow-400 hover:border-yellow-400 font-semibold"
                      size="sm"
                      onClick={() => {
                        const params = new URLSearchParams();
                        if (service.category)
                          params.append("category", service.category);
                        if (service.gender)
                          params.append("gender", service.gender);
                        if (service.name) params.append("search", service.name);
                        navigate(`/at-salon?${params.toString()}`);
                      }}>
                      Explore all
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Explore Products Section - Dark Theme with Yellow */}
        {promoBanner && (
          <section>
            <div className="rounded-2xl overflow-hidden md:w-3/5 md:mx-auto my-16">
              <img
                src={promoBanner}
                alt="Promo Banner"
                className="w-full h-auto object-cover"
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
