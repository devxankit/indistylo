import { useState } from "react";
import { ChevronRight, Search, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { ServiceListing } from "../components/service-listing";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import femaleservice1 from "@/assets/atsalon/femaleservice1.png";
import femaleservice2 from "@/assets/atsalon/femaleservice2.png";
import femaleservice3 from "@/assets/atsalon/femaleservice3.png";
import femaleservice4 from "@/assets/atsalon/femaleservice4.png";

// Mock Data - Male Categories
const maleCategories = [
  {
    id: 1,
    name: "Haircut & styling",
    image:
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 2,
    name: "Facials & Cleanups",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 3,
    name: "Shave & Beard",
    image:
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: 4,
    name: "Hand & Feet",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=200",
  },
];

// Mock Data - Female Categories
const femaleCategories = [
  { id: 1, name: "Haircut & styling", image: femaleservice1 },
  { id: 2, name: "Facials & Cleanups", image: femaleservice2 },
  { id: 3, name: "Hair Color & Treatment", image: femaleservice3 },
  { id: 4, name: "Hand & Feet", image: femaleservice4 },
];

// Mock Data - Male Packages
const malePackages = [
  {
    id: "1",
    title: "Classic Grooming",
    description: "Haircut & Beard/Shaving\n10 Minutes Head Massage",
    offerDetails: "Offer Details",
    price: "499",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "2",
    title: "Premium Care",
    description: "Haircut & Full Grooming\n15 Minute Spa Treatment",
    offerDetails: "Offer Details",
    price: "549",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "3",
    title: "Elite Pamper",
    description: "Complete Makeover\n30 Minute Massage & Treatment",
    offerDetails: "Offer Details",
    price: "799",
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "4",
    title: "Luxury Package",
    description: "Full Body Spa & Grooming\nPersonal Styling Session",
    offerDetails: "Offer Details",
    price: "999",
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=200",
  },
];

// Mock Data - Female Packages
const femalePackages = [
  {
    id: "1",
    title: "Classic Beauty",
    description: "Haircut & Styling\n10 Minutes Head Massage",
    offerDetails: "Offer Details",
    price: "599",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "2",
    title: "Premium Glow",
    description: "Haircut & Full Styling\n15 Minute Facial Treatment",
    offerDetails: "Offer Details",
    price: "649",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "3",
    title: "Elite Transformation",
    description: "Complete Makeover\n30 Minute Spa & Treatment",
    offerDetails: "Offer Details",
    price: "899",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "4",
    title: "Luxury Package",
    description: "Full Body Spa & Styling\nPersonal Beauty Session",
    offerDetails: "Offer Details",
    price: "1099",
    rating: 5.0,
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=200",
  },
];

export function AtHomePage() {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [selectedGender, setSelectedGender] = useState<"male" | "female">(
    "male"
  );

  // Filter categories and packages based on selected gender
  const currentCategories =
    selectedGender === "male" ? maleCategories : femaleCategories;
  const currentPackages =
    selectedGender === "male" ? malePackages : femalePackages;

  const handleBuyNow = (pkg: (typeof currentPackages)[0]) => {
    const packageItem = {
      id: pkg.id,
      title: pkg.title,
      description: pkg.description,
      image: pkg.image,
      price: parseInt(pkg.price),
      duration: 60, // Default duration
      overview: [],
      howItWorks: [],
    };
    addItem(packageItem, 1, selectedGender, "Home Service", "at-home");
    navigate("/order-summary");
  };

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground">
      {/* Banner Section */}
      <div className="relative w-full min-h-[200px] sm:h-64 overflow-hidden bg-gradient-to-r from-background to-secondary/20">
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent z-0"></div>
        <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-6 sm:py-0 min-h-[200px] sm:h-full">
          <div className="z-20 max-w-[65%] sm:max-w-[60%] space-y-2 pr-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight text-foreground">
              Transform your look{" "}
              <span className="text-primary">At-Home !</span>
            </h1>
            <p className="text-xs sm:text-sm text-foreground/90">
              Get professional grooming services with Billu's Salon App.
            </p>
          </div>
          <div className="relative w-[35%] sm:w-[40%] h-full min-h-[200px] sm:min-h-0">
            {/* Placeholder for the barber/stylist image from screenshot */}
            <img
              src={
                selectedGender === "male"
                  ? "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=400"
                  : "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=400"
              }
              alt={selectedGender === "male" ? "Barber" : "Stylist"}
              className="object-cover w-full h-full opacity-90 mask-image-gradient"
              style={{
                maskImage: "linear-gradient(to right, transparent, black 30%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 30%)",
              }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-8">
        {/* Search Bar */}
        <div className="pt-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search"
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-card border border-border focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Gender Selection */}
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
                setSelectedGender(selectedGender === "male" ? "female" : "male")
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

        {/* Categories */}
        <div className="space-y-4">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {currentCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex flex-col items-center gap-2 min-w-[100px] cursor-pointer group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-card border border-border group-hover:border-primary transition-colors">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span
                  className={cn(
                    "text-xs text-center font-medium",
                    cat.id === 1 ? "text-primary" : "text-muted-foreground"
                  )}>
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-100">
              Grab Exciting Packages
            </h2>
            <button className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1 text-sm font-medium">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {currentPackages.map((pkg, index) => (
              <div
                key={pkg.id}
                className="flex-shrink-0 w-[280px] bg-[#1a1a1a] border border-gray-800 rounded-2xl p-5 flex flex-col hover:border-yellow-400/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-100 text-left line-clamp-1">
                      {pkg.title}
                    </h3>
                    <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold text-yellow-400">
                        {pkg.rating}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line mb-3 flex-grow text-left">
                    {pkg.description}
                  </p>

                  {/* Offer Link */}
                  <div className="text-yellow-400 bg-transparent text-sm font-medium mb-4 hover:text-yellow-300 transition-colors text-left align-left">
                    {pkg.offerDetails}
                  </div>

                  {/* Image */}
                  <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-700 mb-4">
                    <img
                      src={pkg.image || "/placeholder.svg"}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-yellow-400">
                      ₹ {pkg.price}
                    </span>
                    <button
                      onClick={() => handleBuyNow(pkg)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 flex items-center justify-center rounded-full cursor-pointer text-sm font-bold px-6 h-9 transition-colors">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hide scrollbar styles */}
          <style type="text/css">{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </section>

        <div className="pt-6 text-left">
          <ServiceListing selectedGender={selectedGender} />
        </div>
      </div>
    </div>
  );
}
