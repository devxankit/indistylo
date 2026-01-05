import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { mockSalons } from "../services/mockData";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Filter, MapPin, Search, Star } from "lucide-react";
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

  const spaSalons = mockSalons.filter((salon) =>
    salon.category?.includes("Spa")
  );

  const spaImages = [
    salonInterior1,
    salonInterior2,
    salonInterior3,
    salonInterior4,
  ];

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

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="px-4 py-4 space-y-4">
        <section className="text-left">
          <h2 className="text-2xl font-semibold text-foreground">
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
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 flex-shrink-0">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Category Filters - Mobile View */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:hidden">
          {["All", "Hair", "Skin", "Nails", "Spa"].map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant="outline"
              size="sm"
              className={`whitespace-nowrap ${
                selectedCategory === category
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
              placeholder="Search for spa rituals, centres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {["All", "Hair", "Skin", "Nails", "Spa"].map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant="outline"
                  size="sm"
                  className={`whitespace-nowrap ${
                    selectedCategory === category
                      ? "border-yellow-400 text-yellow-400 bg-yellow-400/10 hover:text-yellow-400"
                      : "text-foreground hover:text-yellow-400 hover:border-yellow-400"
                  }`}>
                  {category}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 flex-shrink-0">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Carousel
          className="w-full pt-2 md:w-4/5 md:mx-auto mt-2"
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplayPlugin.current]}>
          <CarouselContent>
            <CarouselItem>
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={carousel1}
                  alt="Carousel 1"
                  className="w-full h-auto object-cover"
                />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={carousel2}
                  alt="Carousel 2"
                  className="w-full h-auto object-cover"
                />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={carousel3}
                  alt="Carousel 3"
                  className="w-full h-auto object-cover"
                />
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-2 md:-left-12" />
          <CarouselNext className="right-2 md:-right-12" />
        </Carousel>

        <section>
          <div className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
            {filteredSpas.length > 0 ? (
              filteredSpas.map((salon, index) => (
                <Card
                  key={salon.id}
                  className="cursor-pointer hover:bg-muted transition-colors py-2">
                  <CardContent className="p-4">
                    <div className="flex gap-4 mb-2">
                      <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img
                          src={spaImages[index % spaImages.length]}
                          alt={salon.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base text-start mb-1">
                          {salon.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{salon.location}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{salon.rating}</span>
                          </div>
                          <span className="text-muted-foreground">
                            {salon.distance} km away
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 text-sm text-primary text-left">
                      <div className="h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mb-4"></div>
                      <div className="flex items-center justify-between">
                        <span>Service starting from ₹{salon.price}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/shops/${salon.id}`)}>
                          Book
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground md:col-span-3">
                No spa centres found matching your filters.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
