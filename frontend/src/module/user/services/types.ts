export type Salon = {
  id: string;
  name: string;
  location: string;
  distance: number;
  rating: number;
  image?: string;
  price: number;
  category?: string[];
  gender?: "male" | "female" | "both";
  coordinates?: {
    lat: number;
    lng: number;
  };
};

export type Deal = {
  id: string;
  title: string;
  description: string;
  salon: Salon;
  discount: string;
  color: string;
  dayInfo?: string;
};

export interface Booking {
  id: string;
  salonName: string;
  service: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled" | "missed";
  type: "at-salon" | "at-home";
  price?: number;
  professionalName?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  rating: number;
  image?: string;
  experience: string;
}

export interface AtHomeService {
  id: string;
  name: string;
  image: string;
  duration: number; // in minutes
  price: number;
}

export interface AtHomeServicePackage {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  duration: number;
  rating?: number;
  reviews?: number;
  overview?: string[];
  howItWorks?: string[];
  offerDetails?: string;
}
