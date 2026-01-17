
import { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { Loader2, Navigation } from "lucide-react";

const containerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "1rem",
};

const defaultCenter = {
    lat: 12.9716, // Bangalore
    lng: 77.5946,
};

interface MapRouteProps {
    destination: {
        lat: number;
        lng: number;
    } | null;
}

export function MapRoute({ destination }: MapRouteProps) {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    });

    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [distance, setDistance] = useState<string>("");
    const [duration, setDuration] = useState<string>("");
    const [error, setError] = useState<string | null>(null);


    // Get User Location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (err) => {
                    console.error("Error getting location", err);
                    setError("Please enable location access to see the route.");
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    }, []);

    // Calculate Route
    useEffect(() => {
        if (isLoaded && userLocation && destination) {
            const directionsService = new google.maps.DirectionsService();

            directionsService.route(
                {
                    origin: userLocation,
                    destination: destination,
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK && result) {
                        setDirections(result);
                        if (result.routes[0]?.legs[0]) {
                            setDistance(result.routes[0].legs[0].distance?.text || "");
                            setDuration(result.routes[0].legs[0].duration?.text || "");
                        }
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            );
        }
    }, [isLoaded, userLocation, destination]);

    if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
        return (
            <div className="bg-[#202020] p-4 rounded-xl text-center border border-[#333]">
                <p className="text-yellow-400 font-medium">Map Configuration Missing</p>
                <p className="text-[#f5f5f5]/60 text-sm mt-1">Please add VITE_GOOGLE_MAPS_API_KEY to your env.</p>
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <div className="h-[300px] w-full bg-[#202020] animate-pulse rounded-2xl flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {distance && (
                <div className="flex items-center justify-between bg-[#252525] p-3 rounded-xl border border-[#333]">
                    <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-[#f5f5f5]">
                            {distance} • {duration} away
                        </span>
                    </div>
                    <div className="text-xs text-[#f5f5f5]/40">Live Traffic</div>
                </div>
            )}

            <div className="w-full h-[300px] rounded-2xl overflow-hidden border border-[#333]">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={userLocation || defaultCenter}
                    zoom={14}
                    options={{
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
                        streetViewControl: false,
                        mapTypeControl: false,
                    }}
                >
                    {/* User Marker */}
                    {userLocation && (
                        <Marker
                            position={userLocation}
                            icon={{
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 7,
                                fillColor: "#4285F4",
                                fillOpacity: 1,
                                strokeColor: "white",
                                strokeWeight: 2,
                            }}
                        />
                    )}

                    {/* Destination Marker */}
                    {destination && <Marker position={destination} />}

                    {directions && (
                        <DirectionsRenderer
                            directions={directions}
                            options={{
                                suppressMarkers: true, // We use custom markers
                                polylineOptions: {
                                    strokeColor: "#FACC15", // Yellow-400
                                    strokeWeight: 5,
                                },
                            }}
                        />
                    )}
                </GoogleMap>
            </div>
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
        </div>
    );
}
