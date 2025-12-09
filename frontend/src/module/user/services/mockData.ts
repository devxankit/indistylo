export interface Salon {
  id: string;
  name: string;
  location: string;
  distance: number;
  rating: number;
  image?: string;
  price: number;
  category?: string[];
  gender?: 'male' | 'female' | 'both';
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  salon: Salon;
  discount: string;
  color: string;
  dayInfo?: string;
}

export interface Booking {
  id: string;
  salonName: string;
  service: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'missed';
  type: 'at-salon' | 'at-home';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
}

export const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'UPTO 80% OFF on Hair Services',
    description: 'Get amazing discounts on all hair services',
    salon: {
      id: 's1',
      name: 'Dasho Sapphire Sec 90 Gurugram',
      location: 'Dasho Sapphire Sector 90, Gurugram',
      distance: 639.86,
      rating: 5,
      price: 100,
    },
    discount: '80% OFF',
    color: 'bg-slate-500', // Grey
  },
  {
    id: '2',
    title: 'UPTO 80% OFF on Skin Services',
    description: 'Pamper yourself with skin treatments',
    salon: {
      id: 's2',
      name: 'Dasho Urbana',
      location: 'Dasho Urbana, Sector 67, Gurugram',
      distance: 640.75,
      rating: 0,
      price: 100,
    },
    discount: '80% OFF',
    color: 'bg-yellow-600', // Gold/Brown
  },
  {
    id: '3',
    title: 'FREE HAIRCUT Monday to Friday For Womens',
    description: 'Special offer for women',
    salon: {
      id: 's3',
      name: 'Dasho Bhutani City Center',
      location: 'Dasho Bhutani City Center, Sector 150',
      distance: 654.03,
      rating: 4.8,
      price: 100,
    },
    discount: 'FREE',
    color: 'bg-rose-400', // Pinkish
    dayInfo: 'Mon-Fri',
  },
  {
    id: '4',
    title: 'UPTO 70% OFF on Bridal Packages',
    description: 'Luxury bridal prep with senior artists',
    salon: {
      id: 's4',
      name: 'Dasho Signature Bridal Studio',
      location: 'SCO 42, South City, Gurugram',
      distance: 642.12,
      rating: 4.9,
      price: 100,
    },
    discount: '70% OFF',
    color: 'bg-indigo-600',
    dayInfo: 'Weekends',
  },
  {
    id: '5',
    title: 'FLASH 60% OFF on Nail Art',
    description: 'Premium gel & chrome nail art combos',
    salon: {
      id: 's5',
      name: 'Dasho Luxe Nail Bar',
      location: 'DLF Phase 4, Gurugram',
      distance: 645.44,
      rating: 4.7,
      price: 100,
    },
    discount: '60% OFF',
    color: 'bg-emerald-600',
    dayInfo: 'Limited Slots',
  },
];

export const mockSalons: Salon[] = [
  {
    id: 's1',
    name: 'Dasho Sapphire',
    location: 'Sector 90, Gurugram',
    distance: 2.5,
    rating: 5,
    price: 100,
    category: ['Hair', 'Skin', 'Nails'],
    gender: 'both',
  },
  {
    id: 's2',
    name: 'Dasho Urbana',
    location: 'Sector 67, Gurugram',
    distance: 3.2,
    rating: 4.5,
    price: 150,
    category: ['Hair', 'Spa'],
    gender: 'female',
  },
  {
    id: 's3',
    name: 'Dasho Bhutani City Center',
    location: 'Sector 150',
    distance: 5.1,
    rating: 4.8,
    price: 120,
    category: ['Hair', 'Skin', 'Nails', 'Spa'],
    gender: 'both',
  },
  {
    id: 's4',
    name: 'Dasho Downtown',
    location: 'Sector 29, Gurugram',
    distance: 1.8,
    rating: 4.7,
    price: 200,
    category: ['Hair', 'Skin'],
    gender: 'male',
  },
  {
    id: 's5',
    name: 'Dasho Premium',
    location: 'Sector 43, Gurugram',
    distance: 4.2,
    rating: 4.9,
    price: 250,
    category: ['Hair', 'Skin', 'Spa'],
    gender: 'female',
  },
  {
    id: 's6',
    name: 'Dasho Elite',
    location: 'Sector 56, Gurugram',
    distance: 3.8,
    rating: 4.6,
    price: 180,
    category: ['Hair', 'Nails', 'Spa'],
    gender: 'both',
  },
  {
    id: 's7',
    name: 'Dasho Classic',
    location: 'Sector 15, Gurugram',
    distance: 2.1,
    rating: 4.4,
    price: 130,
    category: ['Hair', 'Skin', 'Nails'],
    gender: 'male',
  },
  {
    id: 's8',
    name: 'Dasho Luxe',
    location: 'Sector 102, Gurugram',
    distance: 6.5,
    rating: 5,
    price: 300,
    category: ['Hair', 'Skin', 'Nails', 'Spa'],
    gender: 'female',
  },
  {
    id: 's9',
    name: 'Dasho Express',
    location: 'Sector 18, Gurugram',
    distance: 1.5,
    rating: 4.3,
    price: 90,
    category: ['Hair', 'Nails'],
    gender: 'male',
  },
  {
    id: 's10',
    name: 'Dasho Signature',
    location: 'Sector 49, Gurugram',
    distance: 4.8,
    rating: 4.7,
    price: 220,
    category: ['Hair', 'Skin', 'Spa'],
    gender: 'both',
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    salonName: 'IndiStylo Sapphire',
    service: 'Haircut & Styling',
    date: '2024-01-20',
    time: '10:00 AM',
    status: 'upcoming',
    type: 'at-salon',
  },
  {
    id: 'b2',
    salonName: 'Home Service',
    service: 'Facial & Clean-up',
    date: '2024-01-18',
    time: '2:00 PM',
    status: 'completed',
    type: 'at-home',
  },
  {
    id: 'b3',
    salonName: 'IndiStylo Urbana',
    service: 'Hair Spa',
    date: '2024-01-15',
    time: '11:00 AM',
    status: 'completed',
    type: 'at-salon',
  },
  {
    id: 'b4',
    salonName: 'IndiStylo City Center',
    service: 'Haircut & Beard Trim',
    date: '2024-01-12',
    time: '3:00 PM',
    status: 'cancelled',
    type: 'at-salon',
  },
  {
    id: 'b5',
    salonName: 'Home Service',
    service: 'Full Body Massage',
    date: '2024-01-10',
    time: '4:00 PM',
    status: 'missed',
    type: 'at-home',
  },
  {
    id: 'b6',
    salonName: 'IndiStylo Platinum',
    service: 'Keratin Treatment',
    date: '2024-02-05',
    time: '1:30 PM',
    status: 'upcoming',
    type: 'at-salon',
  },
  {
    id: 'b7',
    salonName: 'IndiStylo Elite',
    service: 'Bridal Makeup Trial',
    date: '2023-12-28',
    time: '9:00 AM',
    status: 'completed',
    type: 'at-salon',
  },
  {
    id: 'b8',
    salonName: 'Home Luxe Service',
    service: 'Spa Pedicure',
    date: '2024-01-25',
    time: '5:30 PM',
    status: 'cancelled',
    type: 'at-home',
  },
  {
    id: 'b9',
    salonName: 'IndiStylo Signature',
    service: 'Skin Glow Therapy',
    date: '2024-01-08',
    time: '12:00 PM',
    status: 'missed',
    type: 'at-salon',
  },
];

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Premium Hair Serum',
    price: 599,
    category: 'Hair Care',
  },
  {
    id: 'p2',
    name: 'Face Cleanser',
    price: 349,
    category: 'Skin Care',
  },
  {
    id: 'p3',
    name: 'Hair Trimmer',
    price: 1299,
    category: 'Grooming',
  },
  {
    id: 'p4',
    name: 'Moisturizer',
    price: 449,
    category: 'Skin Care',
  },
];

export const userLocation = 'New Palasia';

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

export const popularAtHomeServices: AtHomeService[] = [
  {
    id: 'ah1',
    name: 'Classic Grooming',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=300',
    duration: 60,
    price: 499,
  },
  {
    id: 'ah2',
    name: 'Haircut + Beard Trim',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=300',
    duration: 110,
    price: 999,
  },
  {
    id: 'ah3',
    name: 'Pedicure',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=300',
    duration: 15,
    price: 599,
  },
  {
    id: 'ah4',
    name: 'Manicure',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=300',
    duration: 20,
    price: 399,
  },
  {
    id: 'ah5',
    name: 'Facial & Cleanup',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=300',
    duration: 45,
    price: 799,
  },
  {
    id: 'ah6',
    name: 'Detan & Glow Ritual',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=300',
    duration: 70,
    price: 999,
  }
];

export const popularAtHomeServicePackages: AtHomeServicePackage[] = [
  {
    id: 'pkg1',
    title: 'Classic Grooming',
    description: 'Haircut & Beard/Shaving\n10 Minutes Head Massage',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=400',
    price: 499,
    duration: 60,
    rating: 4.9,
    reviews: 27,
    overview: [
      'Haircut & Beard/Shaving.',
      '10 Minutes Head Massage With Olive Oil.',
    ],
    howItWorks: [
      'Haircut - Consultation: Professional understands customer needs and hair condition to suggest suitable options.',
      'Set-up: Sanitisation of tools and placement of cape, mirror, floor sheet.',
      'Parting & Sectioning: Detangling of hair followed by dividing it into small sections.',
      'Haircut: Spraying of water, followed by cutting of hair as per the desired hairstyle with the cape on.',
      'Confirmation: Rechecking of the output with customer and working on suggestions (if any) for desired results.',
      'Clean-up: Removal of all the hair strands sanitisation of tools and area.',
    ],
    offerDetails: 'Offer Details',
  },
  {
    id: 'pkg2',
    title: 'Premium Grooming',
    description: 'Haircut & Beard/Shaving\n15 Minutes Head Massage\n(Aromamagic Olive Oil)',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=400',
    price: 549,
    duration: 75,
    rating: 4.8,
    reviews: 42,
    overview: [
      'Haircut & Beard/Shaving.',
      '15 Minutes Head Massage With Aromamagic Olive Oil.',
      'Premium styling tools and products.',
    ],
    howItWorks: [
      'Consultation: Detailed discussion about preferred style and hair care.',
      'Preparation: Sanitisation and setup with premium tools.',
      'Haircut & Styling: Professional cut with advanced techniques.',
      'Beard Grooming: Precision trimming and shaping.',
      'Head Massage: 15-minute relaxing massage with Aromamagic Olive Oil.',
      'Final Styling: Product application and finishing touches.',
    ],
    offerDetails: 'Offer Details',
  },
  {
    id: 'pkg3',
    title: 'Elite Care Package',
    description: 'Complete Grooming\n20 Minutes Head & Shoulder Massage\nPremium Products',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=400',
    price: 799,
    duration: 90,
    rating: 4.7,
    reviews: 33,
    overview: [
      'Complete Grooming Package.',
      '20 Minutes Head & Shoulder Massage.',
      'Premium Products Used.',
      'Extended consultation and styling.',
    ],
    howItWorks: [
      'Initial Consultation: Comprehensive discussion about grooming needs.',
      'Hair Services: Professional haircut with advanced styling techniques.',
      'Beard Services: Complete beard grooming and styling.',
      'Massage Therapy: 20-minute head and shoulder massage for relaxation.',
      'Premium Products: Application of high-quality styling and care products.',
      'Final Review: Quality check and customer satisfaction confirmation.',
    ],
    offerDetails: 'Offer Details',
  },
  {
    id: 'pkg4',
    title: 'Luxury Wellness',
    description: 'Full Body Spa\nHair & Facial Treatment\n45 Minutes Massage',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400',
    price: 1299,
    duration: 120,
    rating: 5.0,
    reviews: 18,
    overview: [
      'Full Body Spa Treatment.',
      'Hair & Facial Treatment.',
      '45 Minutes Professional Massage.',
      'Luxury products and premium experience.',
    ],
    howItWorks: [
      'Welcome & Consultation: Understanding your wellness goals.',
      'Hair Treatment: Deep conditioning and professional styling.',
      'Facial Care: Cleansing, exfoliation, and nourishing facial treatment.',
      'Body Massage: 45-minute full body massage for complete relaxation.',
      'Final Touch: Premium products application and styling.',
      'Completion: Final review and aftercare recommendations.',
    ],
    offerDetails: 'Offer Details',
  },
];

