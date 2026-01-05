"use client";

import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  image: string;
}

const maleServices: Service[] = [
  {
    id: "1",
    title: "Haircut + Beard Trimming + Charcoal Facial",
    description: "Professional styling",
    price: 999,
    duration: 110,
    image:
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "2",
    title: "Haircut + Beard Trimming + 03+ Shave & Other Facial",
    description: "Complete grooming",
    price: 1349,
    duration: 125,
    image:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "3",
    title: "Haircut",
    description: "Classic haircut",
    price: 299,
    duration: 30,
    image:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "4",
    title: "Haircut + Shaving + 15 Minutes Head Massage",
    description: "Relaxation package",
    price: 549,
    duration: 60,
    image:
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=200",
  },
];

const femaleServices: Service[] = [
  {
    id: "1",
    title: "Haircut + Styling + Facial Treatment",
    description: "Professional beauty",
    price: 1199,
    duration: 120,
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "2",
    title: "Haircut + Hair Color + Facial",
    description: "Complete makeover",
    price: 1499,
    duration: 135,
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "3",
    title: "Haircut & Styling",
    description: "Classic haircut",
    price: 399,
    duration: 45,
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "4",
    title: "Haircut + Styling + 15 Minutes Head Massage",
    description: "Relaxation package",
    price: 649,
    duration: 75,
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=200",
  },
];

interface ServiceListingProps {
  selectedGender?: "male" | "female";
}

export function ServiceListing({
  selectedGender = "male",
}: ServiceListingProps) {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const currentServices =
    selectedGender === "male" ? maleServices : femaleServices;

  const handleAdd = (service: Service) => {
    const serviceItem = {
      id: service.id,
      title: service.title,
      description: service.description,
      image: service.image,
      price: service.price,
      duration: service.duration,
      overview: [],
      howItWorks: [],
    };
    addItem(serviceItem, 1, selectedGender, "Home Service", "at-home");
    navigate("/order-summary");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Haircut & styling (13)
      </h2>
      <div className="space-y-3 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
        {currentServices.map((service, index) => (
          <div
            key={service.id}
            className="flex gap-4 bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4 hover:border-yellow-400/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 50}ms` }}>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-100 mb-1">
                {service.title}
              </h3>
              <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                {service.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold text-yellow-400">
                    ₹{service.price}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                    {service.duration} mins
                  </span>
                </div>

                <button
                  onClick={() => handleAdd(service)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-lg shadow-yellow-400/10">
                  ADD
                </button>
              </div>

              <div className="text-yellow-400/80 hover:text-yellow-400 text-[11px] font-semibold mt-3 transition-colors flex items-center gap-1 cursor-pointer w-fit">
                View Details
              </div>
            </div>

            {/* Image */}
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700/50">
              <img
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
