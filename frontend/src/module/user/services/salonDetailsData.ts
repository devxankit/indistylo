import service1 from '@/assets/atsalon/service1.png';
import service2 from '@/assets/atsalon/service2.png';
import service3 from '@/assets/atsalon/service3.png';
import service4 from '@/assets/atsalon/service4.png';
import femaleservice1 from '@/assets/atsalon/femaleservice1.png';
import femaleservice2 from '@/assets/atsalon/femaleservice2.png';
import femaleservice3 from '@/assets/atsalon/femaleservice3.png';
import femaleservice4 from '@/assets/atsalon/femaleservice4.png';

export interface SalonServiceOption {
  id: string;
  title: string;
  duration: string;
  highlights: string[];
  priceLabel?: string;
}

export interface SalonServiceCategory {
  id: string;
  name: string;
  image: string;
  services: SalonServiceOption[];
}

export const salonServiceCatalog: Record<'male' | 'female', SalonServiceCategory[]> = {
  female: [
    {
      id: 'mani-pedi',
      name: 'Mani Pedi & Hygiene',
      image: femaleservice1,
      services: [
        {
          id: 'cut-file-hand',
          title: 'Cut & File (Hand)',
          duration: '15 min.',
          highlights: ['Groomed Nails', 'Desired Shape'],
          priceLabel: '₹349 onwards',
        },
        {
          id: 'cut-file-feet',
          title: 'Cut & File (Feet)',
          duration: '20 min.',
          highlights: ['Relaxed Experience', 'Clean Nails'],
          priceLabel: '₹449 onwards',
        },
      ],
    },
    {
      id: 'hair-cut-style',
      name: 'Hair Cut & Style',
      image: femaleservice2,
      services: [
        {
          id: 'classic-cut',
          title: 'Classic Cut',
          duration: '30 min.',
          highlights: ['Expert Consultation', 'Blow Dry Finish'],
          priceLabel: '₹699 onwards',
        },
        {
          id: 'advanced-styling',
          title: 'Advanced Styling',
          duration: '45 min.',
          highlights: ['Texturising', 'Premium Products'],
          priceLabel: '₹999 onwards',
        },
      ],
    },
    {
      id: 'skin-care',
      name: 'Skin Care',
      image: femaleservice3,
      services: [
        {
          id: 'clean-up',
          title: 'Deep Clean-up',
          duration: '35 min.',
          highlights: ['Steam & Exfoliation', 'Glow Mask'],
          priceLabel: '₹799 onwards',
        },
        {
          id: 'hydrating-facial',
          title: 'Hydrating Facial',
          duration: '50 min.',
          highlights: ['Serum Massage', 'Cooling Mask'],
          priceLabel: '₹1199 onwards',
        },
      ],
    },
    {
      id: 'hair-color',
      name: 'Hair Color',
      image: femaleservice4,
      services: [
        {
          id: 'global-color',
          title: 'Global Color',
          duration: '75 min.',
          highlights: ['Ammonia Free', 'Shine Lock'],
          priceLabel: '₹1799 onwards',
        },
        {
          id: 'root-touchup',
          title: 'Root Touch-up',
          duration: '40 min.',
          highlights: ['Grey Coverage', 'Quick Service'],
          priceLabel: '₹999 onwards',
        },
      ],
    },
  ],
  male: [
    {
      id: 'hair-cut-style-m',
      name: 'Hair Cut & Style',
      image: service1,
      services: [
        {
          id: 'express-cut',
          title: 'Express Cut',
          duration: '20 min.',
          highlights: ['Taper & Fade', 'Quick Styling'],
          priceLabel: '₹399 onwards',
        },
        {
          id: 'signature-cut',
          title: 'Signature Cut',
          duration: '30 min.',
          highlights: ['Detailed Consultation', 'Finishing Products'],
          priceLabel: '₹549 onwards',
        },
      ],
    },
    {
      id: 'skin-care-m',
      name: 'Skin Care',
      image: service2,
      services: [
        {
          id: 'detan-facial',
          title: 'Detan Clean-up',
          duration: '30 min.',
          highlights: ['Detox Mask', 'Neck Massage'],
          priceLabel: '₹699 onwards',
        },
        {
          id: 'glass-facial',
          title: 'Glass Skin Facial',
          duration: '45 min.',
          highlights: ['Vitamin Boost', 'Moisture Lock'],
          priceLabel: '₹1099 onwards',
        },
      ],
    },
    {
      id: 'hair-color-m',
      name: 'Hair Color',
      image: service3,
      services: [
        {
          id: 'express-color',
          title: 'Express Color',
          duration: '35 min.',
          highlights: ['Semi-permanent', 'Quick Finish'],
          priceLabel: '₹799 onwards',
        },
        {
          id: 'highlights',
          title: 'Highlights',
          duration: '60 min.',
          highlights: ['Foil Technique', 'Customized Tones'],
          priceLabel: '₹1499 onwards',
        },
      ],
    },
    {
      id: 'hair-chemical',
      name: 'Hair Chemical',
      image: service4,
      services: [
        {
          id: 'smoothening',
          title: 'Smoothening',
          duration: '120 min.',
          highlights: ['Keratin Boost', 'Free Aftercare Kit'],
          priceLabel: '₹2499 onwards',
        },
        {
          id: 'perm',
          title: 'Texture Perm',
          duration: '90 min.',
          highlights: ['Defined Curls', 'Damage Protection'],
          priceLabel: '₹1999 onwards',
        },
      ],
    },
  ],
};

