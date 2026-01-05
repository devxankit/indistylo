"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Navigation } from "lucide-react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useUserStore } from "../store/useUserStore";

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Should be in env

export function LocationDialog({ open, onOpenChange }: LocationDialogProps) {
  const { setLocation } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPos, setSelectedPos] = useState({
    lat: 28.4595,
    lng: 77.0266,
  }); // Default Gurugram

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setSelectedPos({ lat: latitude, lng: longitude });
        // In a real app, we would reverse geocode this
        setLocation("Current Location, Gurugram");
        onOpenChange(false);
      });
    }
  };

  const handleConfirmLocation = () => {
    // In a real app, we would get the address from the map coordinates
    setLocation(searchQuery || "Sector 44, Gurugram");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-background border-border">
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle className="text-xl font-bold">
            Select Location
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[70vh]">
          {/* Search Bar */}
          <div className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for area, street name..."
                aria-label="Search location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
            </div>

            <Button
              variant="outline"
              onClick={handleUseCurrentLocation}
              className="w-full justify-start gap-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 rounded-xl py-6">
              <Navigation className="w-4 h-4" />
              <span className="font-bold">Use Current Location</span>
            </Button>
          </div>

          {/* Map Area */}
          <div className="flex-1 relative bg-muted min-h-[300px]">
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
              <Map
                defaultCenter={selectedPos}
                defaultZoom={15}
                gestureHandling={"greedy"}
                disableDefaultUI={true}
                className="w-full h-full"
                onClick={(e) => {
                  if (e.detail.latLng) {
                    setSelectedPos(e.detail.latLng);
                  }
                }}>
                <Marker position={selectedPos} />
              </Map>
            </APIProvider>

            <div className="absolute bottom-6 left-4 right-4">
              <div className="bg-background border border-border rounded-2xl p-4 shadow-xl mb-4">
                <div className="flex gap-3">
                  <div className="p-2 bg-yellow-400/10 rounded-xl shrink-0 h-fit">
                    <MapPin className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Selected Location
                    </p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {searchQuery || "Sector 44, Gurugram, Haryana, India"}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleConfirmLocation}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-6 rounded-xl text-lg shadow-lg">
                Confirm Location
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
