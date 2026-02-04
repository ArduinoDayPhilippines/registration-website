"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

interface LocationMapPreviewProps {
  location: string;
  className?: string;
}

export function LocationMapPreview({ location, className = "" }: LocationMapPreviewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!location || !mapRef.current || mapInstanceRef.current) return;

    // Geocode the location and display it on the map
    const initMap = async () => {
      try {
        // Small delay to respect Nominatim rate limits
        await new Promise(resolve => setTimeout(resolve, 500));

        // First, geocode the location
        const geocodeResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&countrycodes=ph&limit=1`,
          {
            headers: {
              'User-Agent': 'EventRegistrationApp'
            }
          }
        );
        const geocodeData = await geocodeResponse.json();

        if (!geocodeData || geocodeData.length === 0) {
          setError(true);
          return;
        }

        const { lat, lon } = geocodeData[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        // Load Leaflet dynamically
        const [L] = await Promise.all([
          import("leaflet"),
          import("leaflet/dist/leaflet.css"),
          import("@/styles/leaflet-custom.css"),
        ]);

        const Leaflet = L.default;

        // Fix Leaflet default marker icon issue
        delete (Leaflet.Icon.Default.prototype as any)._getIconUrl;
        Leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        // Initialize map
        const map = Leaflet.map(mapRef.current!, {
          center: [latitude, longitude],
          zoom: 15,
          zoomControl: true,
          dragging: true,
          scrollWheelZoom: false,
          doubleClickZoom: true,
          touchZoom: true,
        });

        // Add light theme tile layer
        Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          subdomains: "abc",
          maxZoom: 19,
        }).addTo(map);

        // Create custom marker
        const customIcon = Leaflet.divIcon({
          className: "custom-marker",
          html: `<div style="background: #10b981; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4);"><div style="width: 8px; height: 8px; background: white; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg);"></div></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        // Add marker
        const marker = Leaflet.marker([latitude, longitude], { icon: customIcon }).addTo(map);
        markerRef.current = marker;
        mapInstanceRef.current = map;
        setIsMapReady(true);
      } catch (err) {
        console.error("Failed to load map:", err);
        setError(true);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location]);

  if (!location) return null;

  return (
    <div className={className}>
      <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40 relative">
        <div ref={mapRef} className="w-full h-64" />
        {!isMapReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="text-white/60 text-sm">Loading map...</div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <MapPin className="w-4 h-4" />
              <span>Map preview unavailable</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
