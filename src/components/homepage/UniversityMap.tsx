"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

type UniversityLocation = {
  id: string;
  name: string;
  slug: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  thumbnailPath?: string | null;
};

// Custom blue pin marker
const createMarkerIcon = () =>
  new L.DivIcon({
    className: "",
    html: `
 <div style="
 width: 32px; height: 32px;
 background: #102A43;
 border: 3px solid white;
 border-radius: 50% 50% 50% 0;
 transform: rotate(-45deg);
 box-shadow: 0 2px 8px rgba(0,0,0,0.4);
 ">
 <div style="
 width: 10px; height: 10px;
 background: white; border-radius: 50%;
 position: absolute; top: 50%; left: 50%;
 transform: translate(-50%, -50%);
 "></div>
 </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -36],
  });

// Custom cluster icon: blue circle with count
const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  const size = count < 10 ? 36 : count < 50 ? 44 : 52;
  return new L.DivIcon({
    className: "",
    html: `
 <div style="
 width: ${size}px; height: ${size}px;
 background: rgba(21, 101, 192, 0.85);
 border: 3px solid rgba(255,255,255,0.9);
 border-radius: 50%;
 display: flex; align-items: center; justify-content: center;
 box-shadow: 0 0 0 4px rgba(21, 101, 192, 0.3);
 font-size: ${count < 10 ? 14 : 13}px;
 font-weight: 700; color: white; font-family: sans-serif;
 ">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Component that enforces Ctrl+scroll zoom and shows tooltip hint
function CtrlScrollHandler() {
  const map = useMap();
  const [showHint, setShowHint] = useState(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const container = map.getContainer();

    // Disable default scroll zoom; only allow Ctrl+scroll
    map.scrollWheelZoom.disable();

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        map.scrollWheelZoom.enable();
        const delta = e.deltaY > 0 ? -1 : 1;
        map.setZoom(map.getZoom() + delta);
        setTimeout(() => map.scrollWheelZoom.disable(), 0);
      } else {
        setShowHint(true);
        if (hintTimer.current) clearTimeout(hintTimer.current);
        hintTimer.current = setTimeout(() => setShowHint(false), 2000);
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", onWheel);
      if (hintTimer.current) clearTimeout(hintTimer.current);
    };
  }, [map]);

  if (!showHint) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(0,0,0,0.72)",
        color: "white",
        padding: "10px 20px",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: 600,
        zIndex: 10000,
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      Use{" "}
      <kbd
        style={{
          background: "rgba(255,255,255,0.2)",
          padding: "2px 6px",
          borderRadius: "4px",
        }}
      >
        Ctrl
      </kbd>{" "}
      + Scroll to zoom
    </div>
  );
}

type LayerType = "map" | "satellite";

export default function UniversityMap({
  universities,
}: {
  universities: UniversityLocation[];
}) {
  const [activeLayer, setActiveLayer] = useState<LayerType>("map");

  const mapUniversities = universities.filter(
    (u) => u.latitude !== null && u.longitude !== null,
  );

  const markerIcon = createMarkerIcon();
  const isSingle = mapUniversities.length === 1;
  const center: [number, number] = isSingle 
    ? [Number(mapUniversities[0].latitude), Number(mapUniversities[0].longitude)] 
    : [36.2048, 138.2529];
  const zoomLevel = isSingle ? 12 : 5;

  const tileLayers: Record<LayerType, { url: string; attribution: string }> = {
    map: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
    },
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "520px" }}>
      <MapContainer
        center={center}
        zoom={zoomLevel}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: "100%", width: "100%", background: "#e5e3df" }}
      >
        <TileLayer key={activeLayer} {...tileLayers[activeLayer]} />
        <ZoomControl position="bottomright" />
        <CtrlScrollHandler />

        <MarkerClusterGroup
          iconCreateFunction={createClusterCustomIcon}
          chunkedLoading
          maxClusterRadius={60}
          showCoverageOnHover={false}
          spiderfyOnMaxZoom
          disableClusteringAtZoom={13}
        >
          {mapUniversities.map((uni) => (
            <Marker
              key={uni.id}
              position={[Number(uni.latitude), Number(uni.longitude)]}
              icon={markerIcon}
            >
              <Popup closeButton={false} maxWidth={220}>
                <div style={{ padding: "4px 2px", minWidth: "190px" }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "13px",
                      color: "#17202A",
                      marginBottom: "4px",
                      lineHeight: "1.3",
                    }}
                  >
                    {uni.name}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#4B5563",
                      marginBottom: "10px",
                    }}
                  >
                    📍 {uni.city}, Japan
                  </div>
                  <Link
                    href={`/universities/${uni.slug}`}
                    style={{
                      display: "inline-block",
                      background: "#102A43",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: 600,
                      padding: "5px 14px",
                      borderRadius: "6px",
                      textDecoration: "none",
                    }}
                  >
                    View Details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Map / Satellite Toggle */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          zIndex: 1000,
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          display: "flex",
          overflow: "hidden",
        }}
      >
        {(["map", "satellite"] as LayerType[]).map((layer) => (
          <button
            key={layer}
            onClick={() => setActiveLayer(layer)}
            style={{
              padding: "7px 16px",
              fontSize: "13px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              background: activeLayer === layer ? "#102A43" : "white",
              color: activeLayer === layer ? "white" : "#17202A",
              transition: "all 0.2s",
            }}
          >
            {layer === "map" ? "Map" : "Satellite"}
          </button>
        ))}
      </div>

      {/* University Count Badge */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          zIndex: 1000,
          background: "white",
          borderRadius: "10px",
          padding: "8px 14px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          fontSize: "13px",
          fontWeight: 700,
          color: "#102A43",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span
          style={{
            background: "#102A43",
            color: "white",
            borderRadius: "50%",
            width: "22px",
            height: "22px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
          }}
        >
          {mapUniversities.length}
        </span>
        Universities
      </div>
    </div>
  );
}
