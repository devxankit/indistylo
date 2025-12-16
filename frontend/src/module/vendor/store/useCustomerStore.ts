import { create } from "zustand";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit: string;
  rating?: number;
  status: "active" | "inactive" | "vip";
  notes?: string;
}

interface CustomerState {
  customers: Customer[];
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  updateCustomerStatus: (id: string, status: Customer["status"]) => void;
  getCustomer: (id: string) => Customer | undefined;
  getCustomerBookings: (customerId: string) => any[]; // Will return booking history
}

// Initial mock customers data
const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    phone: "+91 9876543210",
    email: "rajesh@example.com",
    address: "123 Main Street, City",
    totalBookings: 15,
    totalSpent: 7485,
    lastVisit: "2024-01-15",
    rating: 4.8,
    status: "vip",
    notes: "Prefers morning appointments",
  },
  {
    id: "2",
    name: "Priya Sharma",
    phone: "+91 9876543211",
    email: "priya@example.com",
    totalBookings: 8,
    totalSpent: 3200,
    lastVisit: "2024-01-12",
    rating: 4.5,
    status: "active",
  },
  {
    id: "3",
    name: "Amit Singh",
    phone: "+91 9876543212",
    totalBookings: 12,
    totalSpent: 4500,
    lastVisit: "2024-01-10",
    status: "active",
  },
  {
    id: "4",
    name: "Sneha Patel",
    phone: "+91 9876543213",
    email: "sneha@example.com",
    address: "456 Park Avenue, City",
    totalBookings: 5,
    totalSpent: 2200,
    lastVisit: "2024-01-08",
    rating: 5.0,
    status: "active",
  },
  {
    id: "5",
    name: "Vikram Mehta",
    phone: "+91 9876543214",
    totalBookings: 3,
    totalSpent: 1200,
    lastVisit: "2023-12-28",
    status: "inactive",
  },
  {
    id: "6",
    name: "Anjali Desai",
    phone: "+91 9876543215",
    email: "anjali@example.com",
    totalBookings: 20,
    totalSpent: 9800,
    lastVisit: "2024-01-14",
    rating: 4.9,
    status: "vip",
    notes: "Regular customer, very satisfied",
  },
];

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: initialCustomers,
  
  updateCustomer: (id, updates) => {
    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === id ? { ...customer, ...updates } : customer
      ),
    }));
  },
  
  updateCustomerStatus: (id, status) => {
    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === id ? { ...customer, status } : customer
      ),
    }));
  },
  
  getCustomer: (id) => {
    return get().customers.find((customer) => customer.id === id);
  },
  
  getCustomerBookings: (customerId) => {
    // Mock booking history - in real app, this would come from bookings store
    // For now, return empty array or mock data
    return [];
  },
}));

