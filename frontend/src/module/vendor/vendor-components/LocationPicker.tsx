
import { useState, useCallback, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Loader2, MapPin } from "lucide-react";

const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "0.75rem",
};

const defaultCenter = {
    lat: 12.9716, // Bangalore
    lng: 77.5946,
};

interface LocationPickerProps {
    onLocationSelect: (location: { lat: number; lng: number }) => void;
    initialLocation?: { lat: number; lng: number };
}

export function LocationPicker({
    onLocationSelect,
    initialLocation,
}: LocationPickerProps) {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    });

    // Separate map control center from selected location to avoid loops
    const [mapCenter, setMapCenter] = useState(initialLocation || defaultCenter);
    const mapRef = useRef<google.maps.Map | null>(null);

    const onLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    const onUnmount = useCallback(() => {
        mapRef.current = null;
    }, []);

    // Initialize with user's current location if no initial location provided
    const initializedRef = useRef(false);

    // Initialize with user's current location if no initial location provided
    useEffect(() => {
        if (!initialLocation && navigator.geolocation && !initializedRef.current) {
            initializedRef.current = true;
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    // Move map to user location initially
                    setMapCenter(userPos);
                    // And notify parent about this initial location
                    onLocationSelect(userPos);
                },
                () => {
                    // Fallback
                }
            );
        }
    }, [initialLocation]); // Removed onLocationSelect from deps

    const handleIdle = () => {
        if (mapRef.current) {
            const newCenter = mapRef.current.getCenter();
            if (newCenter) {
                const lat = newCenter.lat();
                const lng = newCenter.lng();

                // Sync local state so re-renders don't snap back
                setMapCenter({ lat, lng });

                // Notify parent of the new selection
                onLocationSelect({ lat, lng });
            }
        }
    };

    if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
        return (
            <div className="bg-destructive/10 p-4 rounded-xl text-center border border-destructive/20">
                <p className="text-destructive font-medium">Map Configuration Missing</p>
                <p className="text-muted-foreground text-sm mt-1">
                    Please add VITE_GOOGLE_MAPS_API_KEY to your env.
                </p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="h-[300px] w-full bg-muted animate-pulse rounded-xl flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-[300px] rounded-xl overflow-hidden border border-border">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={15}
                onLoad={onLoad}
                onUnmount={onUnmount}
                // Use onIdle instead of onCenterChanged + setCenter to avoid update loops
                onIdle={handleIdle}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    gestureHandling: "greedy",
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    styles: [ // Dark mode style
                        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                        { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
                        { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
                        { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
                        { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
                        { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
                        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
                        { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
                        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
                        { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
                        { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
                        { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
                        { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
                        { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
                        { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
                        { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
                    ],
                }}
            />

            {/* Fixed Center Marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                <div className="relative -mt-8">
                    <MapPin className="w-8 h-8 text-primary drop-shadow-md fill-current" />
                    <div className="w-2 h-2 bg-black/50 rounded-full blur-[2px] absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1" />
                </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg pointer-events-none">
                <p className="text-xs text-white/90 font-medium whitespace-nowrap">
                    Move map to adjust location
                </p>
            </div>
        </div>
    );
}
