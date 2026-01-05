import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import type { Salon } from "../services/types";
import { useState } from "react";
import { Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SalonMapProps {
  salons: Salon[];
}

const GURUGRAM_CENTER = { lat: 28.4595, lng: 77.0266 };

export function SalonMap({ salons }: SalonMapProps) {
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);

  // NOTE: In a real production app, the API key should be in an environment variable
  // and users would need to provide their own key.
  const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY_HERE";

  if (GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
    return (
      <div className="w-full h-[500px] bg-muted rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-4 border-2 border-dashed border-border">
        <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center">
          <MapPin className="w-8 h-8 text-yellow-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold">Google Maps API Required</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            To enable the interactive map, please add your Google Maps API key
            in
            <code className="bg-muted px-1 rounded text-xs">SalonMap.tsx</code>.
          </p>
        </div>

        {/* Mock Map Preview for UI demonstration */}
        <div className="w-full grid grid-cols-1 gap-4 mt-8">
          <div className="text-left space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Nearby Salons Preview
            </h4>
            <div className="space-y-3">
              {salons.slice(0, 3).map((salon) => (
                <div
                  key={salon.id}
                  className="bg-card p-3 rounded-xl border border-border flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-sm">{salon.name}</h5>
                    <p className="text-xs text-muted-foreground">
                      {salon.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-yellow-400 text-xs font-bold">
                      <Star className="w-3 h-3 fill-yellow-400 mr-1" />
                      {salon.rating}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {salon.distance} km away
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-border shadow-xl">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={GURUGRAM_CENTER}
          defaultZoom={12}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          mapId={"bf51a910020ad1"} // Optional: your map style ID
        >
          {salons.map(
            (salon) =>
              salon.coordinates && (
                <Marker
                  key={salon.id}
                  position={salon.coordinates}
                  onClick={() => setSelectedSalon(salon)}
                />
              )
          )}

          {selectedSalon && selectedSalon.coordinates && (
            <InfoWindow
              position={selectedSalon.coordinates}
              onCloseClick={() => setSelectedSalon(null)}>
              <div className="p-2 min-w-[200px] space-y-2">
                <div className="relative h-24 w-full rounded-lg overflow-hidden bg-muted">
                  {selectedSalon.image && (
                    <img
                      src={selectedSalon.image}
                      alt={selectedSalon.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">
                    {selectedSalon.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {selectedSalon.location}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-yellow-400 text-xs font-bold">
                    <Star className="w-3 h-3 fill-yellow-400 mr-1" />
                    {selectedSalon.rating}
                  </div>
                  <span className="text-xs font-bold">
                    ₹{selectedSalon.price}
                  </span>
                </div>
                <Button
                  size="sm"
                  className="w-full h-8 text-[10px] bg-yellow-400 text-gray-900 hover:bg-yellow-500 font-bold"
                  onClick={() => {
                    /* Navigate to salon detail */
                  }}>
                  View Details
                </Button>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
