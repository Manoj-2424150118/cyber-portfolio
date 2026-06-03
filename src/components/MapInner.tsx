"use client";
import { useState, useEffect, Fragment } from "react";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Layers } from "lucide-react";

// Fix Leaflet's default icon path issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom HTML marker that pulses and shows the IP address
const createIpMarker = (ip: string, color: string) => {
  return L.divIcon({
    className: 'custom-attack-icon bg-transparent border-none',
    html: `
      <div class="relative flex items-center justify-center pointer-events-none" style="width: 8px; height: 8px;">
        <div class="absolute w-4 h-4 rounded-full animate-ping opacity-75" style="background-color: ${color};"></div>
        <div class="relative w-2 h-2 rounded-full" style="background-color: ${color};"></div>
        <div class="absolute top-3 bg-black/80 text-[9px] font-mono text-white px-1.5 py-0.5 rounded whitespace-nowrap border" style="border-color: ${color}40;">${ip}</div>
      </div>
    `,
    iconSize: [8, 8],
    iconAnchor: [4, 4]
  });
};

export default function MapInner() {
  const [mapType, setMapType] = useState<"geeky" | "satellite">("geeky");
  const [attacks, setAttacks] = useState<any[]>([]);

  useEffect(() => {
    // Generate random projectile attacks
    const interval = setInterval(() => {
      // Source coords (random anywhere)
      const srcLat = (Math.random() - 0.5) * 120; // -60 to 60
      const srcLng = (Math.random() - 0.5) * 300; // -150 to 150
      
      // Dest coords (random anywhere)
      const dstLat = (Math.random() - 0.5) * 120;
      const dstLng = (Math.random() - 0.5) * 300;

      const type = ["DDoS", "SQLi Attempt", "Ransomware Payload", "Malware C2", "Port Scan", "Credential Stuffing"][Math.floor(Math.random() * 6)];
      let severity = "medium";
      if (type.includes("Ransomware") || type.includes("Malware") || type.includes("DDoS")) severity = "critical";
      else if (type.includes("SQLi")) severity = "high";

      const newAttack = {
        id: Date.now(),
        src: [srcLat, srcLng] as [number, number],
        dst: [dstLat, dstLng] as [number, number],
        srcIp: `${Math.floor(Math.random()*200+10)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.x`,
        dstIp: `10.0.0.${Math.floor(Math.random()*255)}`,
        color: ["#ef4444", "#3b82f6", "#eab308", "#22c55e"][Math.floor(Math.random() * 4)], // Red, Blue, Yellow, Green
        type,
        severity
      };
      
      setAttacks(prev => [...prev.slice(-3), newAttack]); // Keep up to 4 attacks on screen

      // Broadcast to SocLab
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('new_soc_threat', { detail: newAttack }));
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={[20, 0]} 
        zoom={2}
        minZoom={1}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%", background: mapType === 'geeky' ? '#0a0a0a' : '#1a1a1a' }}
        zoomControl={false}
        attributionControl={false}
      >
        {mapType === "geeky" ? (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO'
          />
        ) : (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; Esri'
          />
        )}

        {attacks.map(attack => (
          <Fragment key={attack.id}>
            {/* The Projectile Arc / Line */}
            <Polyline 
              positions={[attack.src, attack.dst]} 
              color={attack.color}
              weight={2} 
              opacity={0.6}
              dashArray="6, 8"
              className="animate-[pulse_1s_ease-in-out_infinite]"
            />
            {/* Endpoints with IP Labels */}
            <Marker position={attack.src} icon={createIpMarker(attack.srcIp, attack.color)} />
            <Marker position={attack.dst} icon={createIpMarker(attack.dstIp, '#00F5FF')} />
          </Fragment>
        ))}
      </MapContainer>

      {/* Map Type Toggle Control */}
      <button 
        onClick={() => setMapType(prev => prev === 'geeky' ? 'satellite' : 'geeky')}
        className="absolute top-3 right-3 z-[1000] bg-black/80 border border-soc-success/30 px-3 py-1.5 rounded flex items-center space-x-2 hover:bg-black transition-colors cursor-pointer"
      >
        <Layers className="w-3 h-3 text-soc-success" />
        <span className="text-[10px] font-mono text-soc-success uppercase">{mapType} View</span>
      </button>

      {/* Cyber Aesthetic Monitor Label */}
      <div className="absolute top-3 left-3 z-[1000] bg-black/80 border border-[#00F5FF]/30 px-2 py-1 rounded shadow-[0_0_10px_rgba(0,245,255,0.2)] pointer-events-none">
        <span className="text-[10px] font-mono text-[#00F5FF] uppercase animate-pulse">LIVE TRAJECTORY MONITOR</span>
      </div>
      
      {/* CSS overrides for Leaflet in dark environments */}
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-container { background: transparent; }
        .custom-attack-icon { background: none; border: none; }
      `}} />
    </div>
  );
}
