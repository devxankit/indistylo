import { create } from "zustand";

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number; // in minutes
  description: string;
  isActive: boolean;
  rating?: number;
  bookings?: number;
  image?: string;
  pricingTiers?: PricingTier[];
  tags?: string[];
}

interface ServiceState {
  services: Service[];
  addService: (service: Omit<Service, "id">) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  toggleActive: (id: string) => void;
  getService: (id: string) => Service | undefined;
}

// Initial mock services data
const initialServices: Service[] = [
  {
    id: "1",
    name: "Haircut & Styling",
    category: "Hair",
    price: 499,
    duration: 45,
    description: "Professional haircut with styling",
    isActive: true,
    rating: 4.8,
    bookings: 156,
  },
  {
    id: "2",
    name: "Hair Color & Treatment",
    category: "Hair",
    price: 1299,
    duration: 120,
    description: "Full hair color with conditioning treatment",
    isActive: true,
    rating: 4.9,
    bookings: 89,
  },
  {
    id: "3",
    name: "Beard Trim",
    category: "Grooming",
    price: 299,
    duration: 30,
    description: "Professional beard trimming and shaping",
    isActive: true,
    rating: 4.7,
    bookings: 234,
  },
  {
    id: "4",
    name: "Facial Treatment",
    category: "Skin",
    price: 899,
    duration: 60,
    description: "Deep cleansing facial with massage",
    isActive: true,
    rating: 4.9,
    bookings: 145,
  },
  {
    id: "5",
    name: "Manicure & Pedicure",
    category: "Nails",
    price: 799,
    duration: 90,
    description: "Complete nail care and polish",
    isActive: false,
    rating: 4.6,
    bookings: 67,
  },
  {
    id: "6",
    name: "Hair Spa",
    category: "Hair",
    price: 1099,
    duration: 75,
    description: "Relaxing hair spa treatment",
    isActive: true,
    rating: 4.8,
    bookings: 98,
  },
];

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: initialServices,
  
  addService: (service) => {
    const newService: Service = {
      ...service,
      id: `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    set((state) => ({
      services: [...state.services, newService],
    }));
  },
  
  updateService: (id, updates) => {
    set((state) => ({
      services: state.services.map((service) =>
        service.id === id ? { ...service, ...updates } : service
      ),
    }));
  },
  
  deleteService: (id) => {
    set((state) => ({
      services: state.services.filter((service) => service.id !== id),
    }));
  },
  
  toggleActive: (id) => {
    set((state) => ({
      services: state.services.map((service) =>
        service.id === id ? { ...service, isActive: !service.isActive } : service
      ),
    }));
  },
  
  getService: (id) => {
    return get().services.find((service) => service.id === id);
  },
}));

