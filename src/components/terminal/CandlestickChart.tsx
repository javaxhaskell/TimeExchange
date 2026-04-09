"use client";

import { useEffect, useRef, useMemo } from "react";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  type IChartApi,
  ColorType,
} from "lightweight-charts";
import { EXPERTISE_MARKETS } from "@/lib/mock-data";
import { getCandlesForCategory } from "@/lib/seed-market-data";
import { useTerminalStore } from "@/lib/terminal-store";
import { cn } from "@/lib/utils";
import type { TimeFrame } from "@/types/market";

const TIMEFRAMES: TimeFrame[] = ["1H", "4H", "1D", "1W", "1M"];

export function CandlestickChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartApiRef = useRef<IChartApi | null>(null);
  const { selectedMarket, chartTimeframe, setChartTimeframe, setSelectedMarket } =
    useTerminalStore();

  const candles = useMemo(
    () => getCandlesForCategory(selectedMarket),
    [selectedMarket]
  );

  const lastCandle = candles[candles.length - 1];
  const prevCandle = candles.length > 1 ? candles[candles.length - 2] : lastCandle;
  const priceChange = lastCandle && prevCandle ? lastCandle.close - prevCandle.close : 0;
  const pctChange =
    prevCandle && prevCandle.close > 0
      ? ((priceChange / prevCandle.close) * 100).toFixed(2)
      : "0.00";
  const isPositive = priceChange >= 0;

  useEffect(() => {
    if (!chartRef.current || candles.length === 0) return;

    if (chartApiRef.current) {
      chartApiRef.current.remove();
      chartApiRef.current = null;
    }

    const chart = createChart(chartRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(255,255,255,0.45)",
        fontFamily: "Inter, ui-sans-serif, sans-serif",
        fontSize: 10,
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.03)" },
        horzLines: { color: "rgba(255,255,255,0.03)" },
      },
      crosshair: {
        vertLine: { color: "rgba(133,237,181,0.2)", width: 1, labelBackgroundColor: "#0f1c2a" },
        horzLine: { color: "rgba(133,237,181,0.2)", width: 1, labelBackgroundColor: "#0f1c2a" },
      },
      rightPriceScale: {
        borderColor: "rgba(255,255,255,0.06)",
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: "rgba(255,255,255,0.06)",
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: true,
      handleScale: true,
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#34d399",
      downColor: "#f87171",
      borderUpColor: "#34d399",
      borderDownColor: "#f87171",
      wickUpColor: "#34d399",
      wickDownColor: "#f87171",
    });

    series.setData(
      candles.map((c) => ({
        time: c.time as unknown as import("lightweight-charts").Time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }))
    );

    // Volume histogram
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "rgba(133,237,181,0.15)",
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.85, bottom: 0 },
    });

    volumeSeries.setData(
      candles.map((c) => ({
        time: c.time as unknown as import("lightweight-charts").Time,
        value: c.volume,
        color:
          c.close >= c.open
            ? "rgba(52,211,153,0.2)"
            : "rgba(248,113,113,0.2)",
      }))
    );

    chart.timeScale().fitContent();
    chartApiRef.current = chart;

    const resizeObserver = new ResizeObserver(() => {
      if (chartRef.current) {
        const { width, height } = chartRef.current.getBoundingClientRect();
        chart.resize(width, height);
      }
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartApiRef.current = null;
    };
  }, [candles]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/[0.06] bg-[#0a1018]/80 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[12px] font-semibold text-foreground outline-none focus:border-primary/30"
          >
            {EXPERTISE_MARKETS.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-[#0a1018] text-foreground">
                {cat.label}
              </option>
            ))}
          </select>

          {lastCandle && (
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-foreground">
                £{lastCandle.close}
              </span>
              <span
                className={cn(
                  "text-[11px] font-semibold",
                  isPositive ? "text-emerald-400" : "text-red-400"
                )}
              >
                {isPositive ? "+" : ""}
                {pctChange}%
              </span>
            </div>
          )}
        </div>

        {/* Timeframe buttons */}
        <div className="flex items-center gap-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setChartTimeframe(tf)}
              className={cn(
                "rounded-lg px-2 py-1 text-[10px] font-semibold transition-colors",
                chartTimeframe === tf
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div ref={chartRef} className="flex-1 min-h-0" />

      {/* Footer stats */}
      {lastCandle && (
        <div className="flex items-center gap-4 border-t border-white/[0.04] px-4 py-2 text-[10px] text-muted-foreground">
          <span>
            O <span className="text-foreground">£{lastCandle.open}</span>
          </span>
          <span>
            H <span className="text-emerald-300">£{lastCandle.high}</span>
          </span>
          <span>
            L <span className="text-red-300">£{lastCandle.low}</span>
          </span>
          <span>
            C <span className="text-foreground">£{lastCandle.close}</span>
          </span>
          <span>
            Vol <span className="text-primary">{lastCandle.volume} min</span>
          </span>
        </div>
      )}
    </div>
  );
}
