import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Info, MapPin, Star, Search } from 'lucide-react';
import { mockSalons } from '../services/mockData';
import { salonServiceCatalog } from '../services/salonDetailsData';
import salonInterior1 from '@/assets/atsalon/saloninterior/Screenshot from 2025-11-26 16-47-35.png';
import salonInterior2 from '@/assets/atsalon/saloninterior/Screenshot from 2025-11-26 16-47-39.png';
import salonInterior3 from '@/assets/atsalon/saloninterior/Screenshot from 2025-11-26 16-47-42.png';
import salonInterior4 from '@/assets/atsalon/saloninterior/Screenshot from 2025-11-26 16-47-44.png';
import { Button } from '@/components/ui/button';

export function ShopDetailsPage() {
  const navigate = useNavigate();
  const { salonId } = useParams<{ salonId: string }>();
  const fallbackSalon = mockSalons[0];
  const salon = mockSalons.find((item) => item.id === salonId) ?? fallbackSalon;

  const defaultGender: 'male' | 'female' = salon.gender === 'male' ? 'male' : 'female';
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>(defaultGender);
  const [search, setSearch] = useState('');
  const catalog = salonServiceCatalog[selectedGender];
  const [activeCategoryId, setActiveCategoryId] = useState(catalog[0]?.id ?? '');

  const activeCategory = useMemo(
    () => catalog.find((category) => category.id === activeCategoryId) ?? catalog[0],
    [catalog, activeCategoryId]
  );

  const servicesToShow = useMemo(() => {
    if (!activeCategory) return [];
    return activeCategory.services.filter((service) =>
      service.title.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [activeCategory, search]);

  const interiorImages = [salonInterior1, salonInterior2, salonInterior3, salonInterior4];
  const heroImage = interiorImages[salon.id.length % interiorImages.length];

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground">
      <div className="sticky top-0 z-40 bg-background/90 px-4 py-3 flex items-center gap-2 border-b border-border backdrop-blur">
        <button
          className="flex items-center gap-1 text-sm font-medium text-primary"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <main className="px-4 py-4 space-y-6">
        <section className="rounded-3xl bg-card text-left shadow-lg border border-border p-4">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
              <img src={heroImage} alt={salon.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Dasho</p>
                <h4 className="text-md font-semibold leading-tight">{salon.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-snug">
                {salon.distance.toFixed(2)} Km • {salon.location}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  {salon.rating.toFixed(1)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Route Map
                </span>
              </div>
              <Button variant="outline" className="inline-flex items-start text-left gap-2 text-sm font-semibold !bg-transparent text-foreground border border-border rounded-full p-0">
              <Info className="w-3.5 h-3.5" />
              More Info
            </Button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for the style you want"
              className="w-full pl-10 pr-4 py-3 bg-transparent border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-base font-semibold">Service Category</p>
            <div className="flex items-center gap-2 text-sm">
              <span className={selectedGender === 'female' ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                Female
              </span>
              <div
                className="relative w-12 h-6 bg-primary rounded-full cursor-pointer"
                onClick={() => setSelectedGender((prev) => (prev === 'male' ? 'female' : 'male'))}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-background rounded-full shadow transition-transform ${
                    selectedGender === 'female' ? 'translate-x-0.5' : 'translate-x-[22px]'
                  }`}
                />
              </div>
              <span className={selectedGender === 'male' ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                Male
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-black p-4 shadow">
            <p className="text-sm font-semibold">Service by Brand Products.</p>
            <p className="text-xs mt-2 opacity-90 tracking-wide">
              WELLA · RICA · LOTUS · VLCC · LOREAL · FIGARO
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {catalog.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategoryId(category.id)}
                className={`flex flex-col items-center gap-2 min-w-[80px] ${
                  activeCategory?.id === category.id ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl overflow-hidden border bg-card ${
                    activeCategory?.id === category.id ? 'border-primary shadow' : 'border-transparent'
                  }`}
                >
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-medium text-center leading-tight">{category.name}</span>
                {activeCategory?.id === category.id && <div className="w-8 h-0.5 bg-primary rounded-full" />}
              </button>
            ))}
          </div>
          {activeCategory && (
            <p className="text-base font-semibold">
              {activeCategory.name}{' '}
              <span className="text-muted-foreground text-sm">({servicesToShow.length})</span>
            </p>
          )}
        </section>

        <section className="space-y-4">
          {servicesToShow.map((service) => (
            <div key={service.id} className="bg-transparent border border-border rounded-3xl p-4 shadow">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold">{service.title}</h3>
                  <p className="text-sm text-left text-muted-foreground mt-1">{service.duration}</p>
                </div>
                <button className="px-3 py-1 text-xs font-semibold text-primary border border-primary rounded-full bg-primary/10">
                  {service.priceLabel ?? 'Price'}
                </button>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {service.highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/80" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {servicesToShow.length === 0 && (
            <div className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-2xl bg-card">
              No services match your search.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

