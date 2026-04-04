"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { getVisibleListings, getVisibleRegionSummaries } from "@/lib/market-selectors";
import { useMarketStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { RegionDetailPanel } from "./RegionDetailPanel";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const DEFAULT_CENTER: [number, number] = [10, 10];
const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 0.6;
const MAX_ZOOM = 8;
const ZOOM_STEP = 0.35;

type RegionSummary = ReturnType<typeof getVisibleRegionSummaries>[number];

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function getMarkerRadius(expertCount: number, zoom: number) {
  return clamp(14 + expertCount * 0.8, 13, 22) / Math.pow(zoom, 0.25);
}

interface MarkerProps {
  summary: RegionSummary;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  zoom: number;
}

function RegionMarker({ summary, isSelected, isHovered, onHover, onSelect, zoom }: MarkerProps) {
  const r = getMarkerRadius(summary.expertCount, zoom);
  const showTip = isHovered || isSelected;

  return (
    <Marker coordinates={summary.coordinates as [number, number]}>
      <g
        onMouseEnter={() => onHover(summary.id)}
        onMouseLeave={() => onHover(null)}
        onClick={(e) => { e.stopPropagation(); onSelect(summary.id); }}
        style={{ cursor: "pointer" }}
      >
        {/* Outer ring when selected */}
        {isSelected && (
          <circle r={r + 5} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={1.5} />
        )}

        {/* Main circle */}
        <circle
          r={r}
          fill={isSelected ? "rgba(255,255,255,0.13)" : "rgba(6,12,22,0.88)"}
          stroke={isSelected ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.42)"}
          strokeWidth={isSelected ? 1.5 : 1}
          style={{ filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.55))" }}
        />

        {/* Count */}
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={r * 0.72}
          fontWeight="600"
          fill="white"
          style={{ userSelect: "none", fontFamily: "Inter, ui-sans-serif, sans-serif", letterSpacing: "-0.02em" }}
        >
          {summary.expertCount}
        </text>

        {/* Live dot */}
        {summary.liveCount > 0 && (
          <circle
            cx={r * 0.68}
            cy={-r * 0.68}
            r={r * 0.26}
            fill="#34d399"
            stroke="rgba(0,0,0,0.55)"
            strokeWidth={1}
          />
        )}

        {/* Tooltip */}
        {showTip && (
          <g transform={`translate(0, ${-r - 14})`} style={{ pointerEvents: "none" }}>
            <rect
              x={-72}
              y={-30}
              width={144}
              height={32}
              rx={8}
              fill="rgba(6,10,18,0.94)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={1}
            />
            <text
              textAnchor="middle"
              y={-16}
              fontSize={10}
              fontWeight="600"
              fill="white"
              style={{ fontFamily: "Inter, ui-sans-serif, sans-serif" }}
            >
              {summary.name}
            </text>
            <text
              textAnchor="middle"
              y={-4}
              fontSize={9}
              fill="rgba(255,255,255,0.55)"
              style={{ fontFamily: "Inter, ui-sans-serif, sans-serif" }}
            >
              {summary.expertCount} visible · {summary.liveCount} live · {summary.forwardCount} fwd
            </text>
          </g>
        )}
      </g>
    </Marker>
  );
}

export function WorldMapPanel() {
  const {
    selectedRegion,
    setSelectedRegion,
    selectedLanguage,
    selectedCategoryId,
    selectedExpertise,
    searchQuery,
    availabilityFilter,
    simulationTick: _tick,
  } = useMarketStore();

  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const isDragging = useRef(false);
  const lastPos = useRef<[number, number]>([0, 0]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) setDimensions({ width, height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const visibleListings = getVisibleListings({
    selectedRegion: null,
    selectedLanguage,
    selectedCategoryId,
    selectedExpertise,
    searchQuery,
    availabilityFilter,
  });

  const regionSummaries = getVisibleRegionSummaries({
    selectedRegion: null,
    selectedLanguage,
    selectedCategoryId,
    selectedExpertise,
    searchQuery,
    availabilityFilter,
  }).filter((s) => s.expertCount > 0);

  const baseScale = dimensions.width / 5.8;
  const scale = baseScale * zoom;

  // Pan: convert pixel delta to degree delta for geoMercator
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    setDragging(true);
    lastPos.current = [e.clientX, e.clientY];
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current[0];
    const dy = e.clientY - lastPos.current[1];
    lastPos.current = [e.clientX, e.clientY];
    const factor = 180 / (Math.PI * scale);
    setCenter((prev) => [
      prev[0] - dx * factor,
      clamp(prev[1] + dy * factor * 0.72, -72, 72),
    ]);
  }, [scale]);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    setDragging(false);
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY / 600;
    setZoom((prev) => clamp(prev + delta * prev, MIN_ZOOM, MAX_ZOOM));
  }, []);

  function adjustZoom(delta: number) {
    setZoom((prev) => clamp(prev + delta, MIN_ZOOM, MAX_ZOOM));
  }

  function resetView() {
    setSelectedRegion(null);
    setZoom(DEFAULT_ZOOM);
    setCenter(DEFAULT_CENTER);
  }

  function handleRegionSelect(regionId: string) {
    setSelectedRegion(selectedRegion === regionId ? null : regionId);
  }

  return (
    <div
      ref={wrapperRef}
      className="relative h-full w-full overflow-hidden bg-[#060d16]"
      style={{ cursor: dragging ? "grabbing" : "grab" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale, center }}
        width={dimensions.width}
        height={dimensions.height}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { fill: "#0d1e2e", stroke: "#1a3347", strokeWidth: 0.5, outline: "none" },
                  hover:   { fill: "#0d1e2e", stroke: "#1a3347", strokeWidth: 0.5, outline: "none" },
                  pressed: { fill: "#0d1e2e", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {regionSummaries.map((summary) => (
          <RegionMarker
            key={summary.id}
            summary={summary}
            isSelected={selectedRegion === summary.id}
            isHovered={hoveredRegion === summary.id}
            onHover={setHoveredRegion}
            onSelect={handleRegionSelect}
            zoom={zoom}
          />
        ))}
      </ComposableMap>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_55%,rgba(1,4,10,0.45)_100%)]" />

      {/* Zoom controls */}
      <div className="absolute left-5 top-5 z-20 flex flex-col gap-2">
        <div className="rounded-[1rem] border border-white/12 bg-black/45 p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.32)] backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-[0.8rem] text-white/70 hover:bg-white/10 hover:text-white"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => adjustZoom(ZOOM_STEP)}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-[0.8rem] text-white/70 hover:bg-white/10 hover:text-white"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => adjustZoom(-ZOOM_STEP)}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-[0.8rem] text-white/70 hover:bg-white/10 hover:text-white"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={resetView}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div className="rounded-[1rem] border border-white/10 bg-black/28 px-3 py-2 text-[11px] text-white/75 backdrop-blur-md">
          Zoom {zoom.toFixed(1)}x
        </div>
      </div>

      {/* Info panel */}
      <div className="absolute bottom-5 left-5 z-20 max-w-[300px] rounded-[1.1rem] border border-white/10 bg-black/42 px-4 py-3 text-[11px] text-white/80 shadow-[0_12px_30px_rgba(0,0,0,0.32)] backdrop-blur-md">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
          Global Surface
        </div>
        <div className="mt-1 leading-5 text-white/70">
          Drag to pan · scroll to zoom · select a region to inspect expertise depth.
        </div>
        <div className="mt-2 text-white/45">
          {regionSummaries.length} active regions •{" "}
          {visibleListings.filter((l) => l.availabilityStatus === "live").length} live now •{" "}
          {visibleListings.filter((l) => l.supportsForwardOrders).length} forward-ready
        </div>
      </div>

      <RegionDetailPanel />
    </div>
  );
}
