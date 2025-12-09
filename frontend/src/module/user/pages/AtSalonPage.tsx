import { mockSalons } from '../services/mockData';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Search, Filter } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import carousel1 from '@/assets/heropage/carousel/carousel1.png';
import carousel2 from '@/assets/heropage/carousel/carousel2.png';
import carousel3 from '@/assets/heropage/carousel/carousel3.png';
import service1 from '@/assets/atsalon/service1.png';
import service2 from '@/assets/atsalon/service2.png';
import service3 from '@/assets/atsalon/service3.png';
import service4 from '@/assets/atsalon/service4.png';
import femaleservice1 from '@/assets/atsalon/femaleservice1.png';
import femaleservice2 from '@/assets/atsalon/femaleservice2.png';
import femaleservice3 from '@/assets/atsalon/femaleservice3.png';
import femaleservice4 from '@/assets/atsalon/femaleservice4.png';
import salonInterior1 from '@/assets/atsalon/saloninterior/Screenshot from 2025-11-26 16-47-35.png';
import salonInterior2 from '@/assets/atsalon/saloninterior/Screenshot from 2025-11-26 16-47-39.png';
import salonInterior3 from '@/assets/atsalon/saloninterior/Screenshot from 2025-11-26 16-47-42.png';
import salonInterior4 from '@/assets/atsalon/saloninterior/Screenshot from 2025-11-26 16-47-44.png';

const maleServices = [
  {
    id: 1,
    name: 'Hair Cut & Style',
    image: service1,
  },
  {
    id: 2,
    name: 'Skin Care',
    image: service2,
  },
  {
    id: 3,
    name: 'Hair Color',
    image: service3,
  },
  {
    id: 4,
    name: 'Hair Chemical',
    image: service4,
  },
];

const femaleServices = [
  {
    id: 1,
    name: 'Hair Cut & Style',
    image: femaleservice1,
  },
  {
    id: 2,
    name: 'Skin Care',
    image: femaleservice2,
  },
  {
    id: 3,
    name: 'Hair Color',
    image: femaleservice3,
  },
  {
    id: 4,
    name: 'Hair Chemical',
    image: femaleservice4,
  },
];

export function AtSalonPage() {
  const navigate = useNavigate();
  const autoplayPlugin = useRef(
    Autoplay({ delay: 1500, stopOnInteraction: false, stopOnMouseEnter: false })
  );
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const currentServices = selectedGender === 'male' ? maleServices : femaleServices;

  const salonImages = [
    salonInterior1,
    salonInterior2,
    salonInterior3,
    salonInterior4,
  ];

  // Filter salons based on search query, category, and gender
  const filteredSalons = mockSalons.filter((salon) => {
    // If search query is empty, match all salons
    const matchesSearch =
      searchQuery.trim() === '' ||
      salon.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      salon.location.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (salon.category && salon.category.some(cat => 
        cat.toLowerCase().includes(searchQuery.toLowerCase().trim())
      ));
    
    const matchesCategory =
      selectedCategory === 'All' ||
      (salon.category && salon.category.includes(selectedCategory));
    
    // Filter by gender: show salons that match the selected gender or are 'both'
    const matchesGender =
      !salon.gender ||
      salon.gender === 'both' ||
      salon.gender === selectedGender;
    
    return matchesSearch && matchesCategory && matchesGender;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="px-4 py-4 space-y-4">
        {/* Search and Filter - Mobile View */}
        <div className="flex gap-2 md:hidden">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for the style you want..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button variant="outline" size="icon" className="w-10 h-10 flex-shrink-0">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Category Filters - Mobile View */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:hidden">
          {['All', 'Hair', 'Skin', 'Nails', 'Spa'].map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant="outline"
              size="sm"
              className={`whitespace-nowrap ${
                selectedCategory === category
                  ? '!bg-yellow-400 !text-gray-900 !border-yellow-400 hover:!bg-yellow-400 hover:!text-gray-900'
                  : 'text-foreground hover:text-yellow-400 hover:border-yellow-400'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Search and Filter - Desktop View */}
        <div className="hidden md:flex md:items-center md:justify-between">
          <div className="flex-1 relative md:max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for the style you want..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {['All', 'Hair', 'Skin', 'Nails', 'Spa'].map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant="outline"
                  size="sm"
                  className={`whitespace-nowrap ${
                    selectedCategory === category
                      ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10 hover:text-yellow-400'
                      : 'text-foreground hover:text-yellow-400 hover:border-yellow-400'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="icon" className="w-10 h-10 flex-shrink-0">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Hero Carousel */}
        <Carousel
          className="w-full md:w-4/5 md:mx-auto mt-2"
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={[autoplayPlugin.current]}
        >
          <CarouselContent>
            <CarouselItem>
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={carousel1}
                  alt="Carousel 1"
                  className="w-full h-auto object-cover"
                />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={carousel2}
                  alt="Carousel 2"
                  className="w-full h-auto object-cover"
                />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={carousel3}
                  alt="Carousel 3"
                  className="w-full h-auto object-cover"
                />
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-2 md:-left-12" />
          <CarouselNext className="right-2 md:-right-12" />
        </Carousel>

        {/* Gender Selection and Services */}
        <section className="space-y-4">
          {/* Gender Toggle */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Select Gender</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedGender('male')}
                className={`px-2 py-1 text-sm font-medium transition-colors ${
                  selectedGender === 'male'
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                Male
              </button>
              <div
                className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${
                  selectedGender === 'male' ? 'bg-primary' : 'bg-primary'
                }`}
                onClick={() => setSelectedGender(selectedGender === 'male' ? 'female' : 'male')}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    selectedGender === 'male' ? 'left-0.5' : 'left-[22px]'
                  }`}
                />
              </div>
              <button
                onClick={() => setSelectedGender('female')}
                className={`px-3 py-1 text-sm font-medium transition-colors ${
                  selectedGender === 'female'
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-4 gap-2">
            {currentServices.map((service) => (
              <Card
                key={service.id}
                className="cursor-pointer hover:bg-muted transition-colors overflow-hidden bg-transparent border-transparent p-0"
              >
                <CardContent className="p-0">
                  <div className="aspect-square rounded-md bg-primary/10 flex items-center justify-center overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="px-2 pt-2 text-center">
                    <p className="text-sm font-medium text-foreground">{service.name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Salons List */}
        <section>
          <div className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
            {filteredSalons.length > 0 ? (
              filteredSalons.map((salon, index) => (
                <Card key={salon.id} className="cursor-pointer hover:bg-muted transition-colors py-2">
                  <CardContent className="p-4">
                    <div className="flex gap-4 mb-2">
                      <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img
                          src={salonImages[index % salonImages.length]}
                          alt={salon.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base text-start mb-1">{salon.name}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{salon.location}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{salon.rating}</span>
                          </div>
                          <span className="text-muted-foreground">
                            {salon.distance} km away
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 text-sm text-primary text-left">
                      <div className="h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mb-4"></div>
                      <div className="flex items-center justify-between">
                        <span>Service starting from ₹{salon.price}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/shops/${salon.id}`)}
                        >
                          Book
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground md:col-span-3">
                No salons found matching your criteria.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

