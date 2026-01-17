"use client";

import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";

interface Service {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  salon?: any;
}

interface ServiceListingProps {
  selectedGender?: "male" | "female";
  services?: Service[];
}

export function ServiceListing({
  selectedGender = "male",
  services = [],
}: ServiceListingProps) {
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  const handleAdd = (service: Service) => {
    const serviceItem = {
      id: service._id || service.id!,
      title: service.name || service.title!,
      description: service.description,
      image: service.image,
      price: service.price,
      duration: service.duration,
      overview: [],
      howItWorks: [],
    };

    const salonId =
      typeof service.salon === "string"
        ? service.salon
        : service.salon?._id || service.salon?.id;

    addItem(
      serviceItem,
      1,
      selectedGender,
      salonId,
      service.salon?.name || "Home Service",
      "at-home"
    );
    navigate("/order-summary");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground text-left">
        Services ({services.length})
      </h2>
      <div className="space-y-3 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
        {services.map((service, index) => (
          <div
            key={service._id || service.id}
            className="flex gap-4 bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4 hover:border-yellow-400/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left"
            style={{ animationDelay: `${index * 50}ms` }}>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-100 mb-1">
                {service.name || service.title}
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
                alt={service.name || service.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
