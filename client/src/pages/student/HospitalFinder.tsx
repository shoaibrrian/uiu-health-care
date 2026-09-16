import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import {
  Hospital,
  Navigation,
  MapPin,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import StudentLayout from "../../layouts/StudentLayout";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const hospitalIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface HospitalItem {
  id: number;
  name: string;
  lat: number;
  lon: number;
  distance: number;
}

function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 14);
  }, [lat, lon, map]);
  return null;
}

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function HospitalFinder() {
  const [position, setPosition] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [hospitals, setHospitals] = useState<HospitalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHospitals = async (lat: number, lon: number) => {
    setError("");
    setLoading(true);

    const query = `[out:json][timeout:25];(node["amenity"="hospital"](around:5000,${lat},${lon});way["amenity"="hospital"](around:5000,${lat},${lon});relation["amenity"="hospital"](around:5000,${lat},${lon}););out center;`;

    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "data=" + encodeURIComponent(query),
      });

      if (!response.ok) throw new Error(`Overpass returned ${response.status}`);

      const data = await response.json();

      const results: HospitalItem[] = data.elements
        .map((el: any) => {
          const hLat = el.lat || el.center?.lat;
          const hLon = el.lon || el.center?.lon;
          if (!hLat || !hLon) return null;
          return {
            id: el.id,
            name: el.tags?.name || "Unnamed Hospital",
            lat: hLat,
            lon: hLon,
            distance: getDistanceKm(lat, lon, hLat, hLon),
          };
        })
        .filter(Boolean)
        .sort((a: HospitalItem, b: HospitalItem) => a.distance - b.distance)
        .slice(0, 10);

      setHospitals(results);

      if (results.length === 0) {
        setError(
          "No hospitals found within 5km. Try again later or check a wider area.",
        );
      }
    } catch (err) {
      console.error("Overpass error:", err);
      setError(
        "Could not load nearby hospitals right now. The map data service may be busy — try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setPosition({ lat, lon });
        fetchHospitals(lat, lon);
      },
      () => {
        setError(
          "Location permission denied. Please enable location access in your browser.",
        );
        setLoading(false);
      },
    );
  }, []);

  const retry = () => {
    if (position) fetchHospitals(position.lat, position.lon);
  };

  return (
    <StudentLayout pageTitle="Nearby Hospitals">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#34E7A6]/10 text-[#34E7A6] ring-1 ring-[#34E7A6]/20">
          <Hospital size={20} />
        </div>
        <div>
          <h1 className="font-['Manrope'] text-2xl font-extrabold tracking-tight">
            Nearby Hospitals
          </h1>
          <p className="text-sm text-white/40">
            Hospitals within 5km of your current location
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.015] py-16">
          <Loader2 size={24} className="animate-spin text-[#34E7A6]" />
          <p className="text-sm text-white/40">Finding hospitals near you...</p>
        </div>
      )}

      {!loading && error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#F0B429]/20 bg-[#F0B429]/[0.06] p-5">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#F0B429]" />
          <div className="flex-1">
            <p className="text-sm text-white/70">{error}</p>
            {position && (
              <button
                onClick={retry}
                className="mt-3 flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 py-1.5 text-xs font-medium text-white/60 hover:border-[#34E7A6]/40 hover:text-[#34E7A6]"
              >
                <RefreshCw size={12} /> Try again
              </button>
            )}
          </div>
        </div>
      )}

      {!loading && position && (
        <>
          <div className="mb-6 overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
            <MapContainer
              center={[position.lat, position.lon]}
              zoom={14}
              style={{ height: "380px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <RecenterMap lat={position.lat} lon={position.lon} />

              <Marker position={[position.lat, position.lon]}>
                <Popup>You are here</Popup>
              </Marker>

              {hospitals.map((h) => (
                <Marker
                  key={h.id}
                  position={[h.lat, h.lon]}
                  icon={hospitalIcon}
                >
                  <Popup>{h.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {hospitals.length > 0 && (
            <>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/40">
                {hospitals.length} hospitals found
              </p>
              <div className="space-y-3">
                {hospitals.map((h, i) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-[#34E7A6]/20 hover:bg-[#34E7A6]/[0.03]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#34E7A6]/10 text-[#34E7A6]">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{h.name}</p>
                        <p className="text-xs text-white/40">
                          {h.distance.toFixed(1)} km away
                        </p>
                      </div>
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${position.lat},${position.lon}&destination=${h.lat},${h.lon}&travelmode=driving`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-medium text-white/60 transition hover:border-[#34E7A6]/40 hover:text-[#34E7A6]"
                    >
                      <Navigation size={13} /> Directions
                    </a>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </StudentLayout>
  );
}
