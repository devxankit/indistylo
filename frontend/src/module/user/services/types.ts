export type Salon = {
  _id: string;
  id?: string;
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
  vendor?: string | any;
  geo?: {
    type: string;
    coordinates: number[];
  };
};

export type Deal = {
  _id: string;
  id?: string;
  title: string;
  description: string;
  salon: Salon;
  discount: string;
  color: string;
  dayInfo?: string;
};

export interface Order {
  _id: string;
  user: string;
  salon: any;
  bookings: Booking[];
  totalAmount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: "online" | "cash" | "wallet";
  createdAt: string;
}

export interface Booking {
  _id: string;
  id?: string;
  salon: Salon | { name: string; _id: string; location?: string; images?: string[]; geo?: { type: string; coordinates: number[] } };
  service: { name: string; _id: string; price: number };
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled" | "missed";
  type: "at-salon" | "at-home";
  price: number;
  professional?: string | { name: string; _id: string };
  address?: string;
  geo?: {
    type: string;
    coordinates: number[];
  };
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
  _id?: string;
  id: string;
  name: string;
  image: string;
  duration: number; // in minutes
  price: number;
  salon?: Salon | any;
}

export interface AtHomeServicePackage {
  _id?: string;
  id: string;
  title: string;
  name?: string; // Add name support
  description: string;
  image: string;
  price: number;
  duration: number;
  rating?: number;
  reviews?: number;
  overview?: string[];
  howItWorks?: string[];
  offerDetails?: string;
  salon?: Salon | any;
  salonId?: string;
  salonName?: string;
}
