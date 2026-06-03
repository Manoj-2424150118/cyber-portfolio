"use client";
import dynamic from 'next/dynamic';

// Leaflet interacts with the window object, so we must disable SSR for the map component
const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center font-mono text-[#00F5FF] text-xs">
      <div className="flex items-center space-x-2 animate-pulse">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F5FF] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00F5FF]"></span>
        </span>
        <span>INITIALIZING SATELLITE UPLINK...</span>
      </div>
    </div>
  )
});

export function WorldMap() {
  return (
    <div className="w-full h-full rounded overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] z-0">
      <MapInner />
    </div>
  );
}
