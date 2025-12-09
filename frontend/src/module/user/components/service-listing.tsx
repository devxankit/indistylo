"use client"

import { useNavigate } from "react-router-dom"
import { useCartStore } from "../store/useCartStore"

interface Service {
  id: string
  title: string
  description: string
  price: number
  duration: number
  image: string
}

const maleServices: Service[] = [
  {
    id: "1",
    title: "Haircut + Beard Trimming + Charcoal Facial",
    description: "Professional styling",
    price: 999,
    duration: 110,
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "2",
    title: "Haircut + Beard Trimming + 03+ Shave & Other Facial",
    description: "Complete grooming",
    price: 1349,
    duration: 125,
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "3",
    title: "Haircut",
    description: "Classic haircut",
    price: 299,
    duration: 30,
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "4",
    title: "Haircut + Shaving + 15 Minutes Head Massage",
    description: "Relaxation package",
    price: 549,
    duration: 60,
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=200",
  },
]

const femaleServices: Service[] = [
  {
    id: "1",
    title: "Haircut + Styling + Facial Treatment",
    description: "Professional beauty",
    price: 1199,
    duration: 120,
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "2",
    title: "Haircut + Hair Color + Facial",
    description: "Complete makeover",
    price: 1499,
    duration: 135,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "3",
    title: "Haircut & Styling",
    description: "Classic haircut",
    price: 399,
    duration: 45,
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "4",
    title: "Haircut + Styling + 15 Minutes Head Massage",
    description: "Relaxation package",
    price: 649,
    duration: 75,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=200",
  },
]

interface ServiceListingProps {
  selectedGender?: 'male' | 'female'
}

export function ServiceListing({ selectedGender = 'male' }: ServiceListingProps) {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const currentServices = selectedGender === 'male' ? maleServices : femaleServices;

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
    addItem(serviceItem, 1, selectedGender);
    navigate('/order-summary');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Haircut & styling (13)</h2>

      <div className="space-y-3 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
        {currentServices.map((service) => (
          <div
            key={service.id}
            className="flex gap-4 bg-card border border-gray-700 rounded-lg p-4 hover:border-yellow-400/50 transition-colors"
          >
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-100 mb-1">{service.title}</h3>
              <p className="text-xs text-gray-400 mb-3">{service.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8 my-2">
                  <span className="text-lg font-bold text-yellow-400">₹{service.price}</span>
                  <span className="text-xs text-gray-400">{service.duration} mins</span>
                </div>

                 <br />

              </div>


                {/* Quantity Controls */}
                <div className="flex items-center gap-4 mb-2">
                  <button
                    onClick={() => handleAdd(service)}
                    className="py-1 px-3 rounded-sm text-xs bg-transparent border border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 hover:text-yellow-400 hover:border-yellow-400 transition-colors font-semibold"
                  >
                    Add
                  </button>
                </div>
              <div className="text-yellow-400 hover:text-yellow-300 text-md mt-3 font-medium mt-2 transition-colors">
                View Details
              </div>
            </div>

            {/* Image */}
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
              <img
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
