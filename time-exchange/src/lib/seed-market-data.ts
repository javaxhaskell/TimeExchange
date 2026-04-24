// ── Deterministic seed data for the TimeExchange marketplace ──
// Generates realistic orders, trades, candles, and order book snapshots

import { STATIC_EXPERT_LISTINGS, EXPERTISE_MARKETS } from "@/lib/mock-data";
import type {
  CandleData,
  FuturesOrder,
  MentorQualityMetrics,
  OrderBookLevel,
  OrderBookSnapshot,
  SpotOrder,
  Trade,
} from "@/types/market";

export const MARKET_REFERENCE_TIMESTAMP = Date.parse("2026-04-09T00:00:00.000Z");
export const MARKET_REFERENCE_ISO = new Date(MARKET_REFERENCE_TIMESTAMP).toISOString();

// ── Seeded random for determinism ──
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function uuid(prefix: string, i: number) {
  return `${prefix}-${String(i).padStart(4, "0")}`;
}

function hoursAgo(rand: () => number, hours: number) {
  return new Date(
    MARKET_REFERENCE_TIMESTAMP - Math.floor(rand() * 3600000 * hours)
  ).toISOString();
}

// ── Generate spot orders ──
export function generateSpotOrders(): SpotOrder[] {
  const rand = seededRandom(42);
  const orders: SpotOrder[] = [];
  const liveExperts = STATIC_EXPERT_LISTINGS.filter(
    (e) => e.availabilityStatus === "live" || e.supportsInstant
  );

  for (let i = 0; i < 40; i++) {
    const expert = pick(liveExperts, rand);
    const isAsk = rand() > 0.4;
    orders.push({
      id: uuid("spot", i),
      side: isAsk ? "ask" : "bid",
      mentorId: isAsk ? expert.id : "",
      buyerId: isAsk ? null : `buyer-${Math.floor(rand() * 20)}`,
      categoryId: expert.categoryId,
      expertise: expert.expertise.slice(0, 2),
      price: Math.round(expert.hourlyRate * (0.85 + rand() * 0.3)),
      status: rand() > 0.7 ? "filled" : "open",
      createdAt: hoursAgo(rand, 24),
      filledAt: rand() > 0.7 ? hoursAgo(rand, 6) : null,
    });
  }
  return orders;
}

// ── Generate futures orders ──
export function generateFuturesOrders(): FuturesOrder[] {
  const rand = seededRandom(84);
  const orders: FuturesOrder[] = [];
  const forwardExperts = STATIC_EXPERT_LISTINGS.filter((e) => e.supportsForwardOrders);

  const futureDays = [1, 2, 3, 5, 7, 10, 14];
  const times = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  for (let i = 0; i < 35; i++) {
    const expert = pick(forwardExperts, rand);
    const isAsk = rand() > 0.35;
    const futureDate = new Date(MARKET_REFERENCE_TIMESTAMP);
    futureDate.setDate(futureDate.getDate() + pick(futureDays, rand));

    orders.push({
      id: uuid("fut", i),
      side: isAsk ? "ask" : "bid",
      mentorId: isAsk ? expert.id : null,
      buyerId: isAsk ? null : `buyer-${Math.floor(rand() * 20)}`,
      categoryId: expert.categoryId,
      expertise: expert.expertise.slice(0, 2),
      price: Math.round(expert.hourlyRate * (0.9 + rand() * 0.25)),
      scheduledDate: futureDate.toISOString().split("T")[0],
      scheduledTime: pick(times, rand),
      durationMinutes: pick([30, 45, 60, 90], rand),
      timezone: expert.timezone,
      status: rand() > 0.8 ? "filled" : "open",
      createdAt: hoursAgo(rand, 48),
      filledAt: rand() > 0.8 ? hoursAgo(rand, 8) : null,
    });
  }
  return orders;
}

// ── Generate trades (filled orders) ──
export function generateTrades(): Trade[] {
  const rand = seededRandom(126);
  const trades: Trade[] = [];
  const now = MARKET_REFERENCE_TIMESTAMP;

  for (let i = 0; i < 60; i++) {
    const expert = pick(STATIC_EXPERT_LISTINGS, rand);
    trades.push({
      id: uuid("trade", i),
      orderId: uuid(rand() > 0.5 ? "spot" : "fut", Math.floor(rand() * 40)),
      orderType: rand() > 0.5 ? "spot" : "futures",
      mentorId: expert.id,
      buyerId: `buyer-${Math.floor(rand() * 20)}`,
      categoryId: expert.categoryId,
      expertise: expert.expertise.slice(0, 2),
      price: Math.round(expert.hourlyRate * (0.9 + rand() * 0.2)),
      durationMinutes: pick([30, 45, 60, 90], rand),
      executedAt: new Date(
        now - Math.floor(rand() * 3600000 * 72)
      ).toISOString(),
    });
  }

  return trades.sort(
    (a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()
  );
}

// ── Generate candlestick data for a category ──
export function generateCandles(
  categoryId: string,
  bucketCount: number = 48,
  bucketMs: number = 3600000
): CandleData[] {
  const seed = Array.from(categoryId).reduce(
    (total, char) => total + char.charCodeAt(0),
    0
  );
  const rand = seededRandom(200 + seed + bucketCount);
  const candles: CandleData[] = [];
  const categoryExperts = STATIC_EXPERT_LISTINGS.filter(
    (e) => e.categoryId === categoryId
  );
  if (categoryExperts.length === 0) return candles;

  const avgRate =
    categoryExperts.reduce((s, e) => s + e.hourlyRate, 0) /
    categoryExperts.length;

  let lastClose = avgRate;
  const now = MARKET_REFERENCE_TIMESTAMP;
  const startTime = now - bucketCount * bucketMs;

  for (let i = 0; i < bucketCount; i++) {
    const time = Math.floor((startTime + i * bucketMs) / 1000);
    const drift = (rand() - 0.48) * avgRate * 0.08;
    const open = Math.round(lastClose + drift);
    const high = Math.round(open + rand() * avgRate * 0.12);
    const low = Math.round(open - rand() * avgRate * 0.1);
    const close = Math.round(
      low + rand() * (high - low)
    );
    const volume = Math.round(30 + rand() * 180);

    candles.push({
      time,
      open: Math.max(5, open),
      high: Math.max(5, high),
      low: Math.max(5, low),
      close: Math.max(5, close),
      volume: Math.max(0, volume),
    });

    lastClose = close;
  }

  return candles;
}

// ── Generate candle data for all categories ──
export function generateAllCandles(): Record<string, CandleData[]> {
  const result: Record<string, CandleData[]> = {};
  for (const cat of EXPERTISE_MARKETS) {
    result[cat.id] = generateCandles(cat.id);
  }
  return result;
}

// ── Generate order book snapshot ──
export function generateOrderBook(categoryId: string): OrderBookSnapshot {
  const seed = Array.from(categoryId).reduce(
    (total, char) => total + char.charCodeAt(0),
    0
  );
  const rand = seededRandom(500 + seed);
  const categoryExperts = STATIC_EXPERT_LISTINGS.filter(
    (e) => e.categoryId === categoryId
  );
  const avgRate =
    categoryExperts.length > 0
      ? categoryExperts.reduce((s, e) => s + e.hourlyRate, 0) / categoryExperts.length
      : 80;

  const bids: OrderBookLevel[] = [];
  const asks: OrderBookLevel[] = [];

  // Generate 10 bid levels below midprice
  for (let i = 0; i < 10; i++) {
    const price = Math.round(avgRate - (i + 1) * (avgRate * 0.02 + rand() * 3));
    bids.push({
      price: Math.max(5, price),
      quantity: Math.floor(1 + rand() * 6),
      totalMinutes: Math.floor(30 + rand() * 150),
    });
  }

  // Generate 10 ask levels above midprice
  for (let i = 0; i < 10; i++) {
    const price = Math.round(avgRate + (i + 1) * (avgRate * 0.02 + rand() * 3));
    asks.push({
      price,
      quantity: Math.floor(1 + rand() * 6),
      totalMinutes: Math.floor(30 + rand() * 150),
    });
  }

  const spread = asks[0].price - bids[0].price;
  const lastPrice = Math.round(avgRate + (rand() - 0.5) * 6);

  return {
    bids,
    asks,
    spread,
    lastPrice,
    lastTradeTime: new Date(
      MARKET_REFERENCE_TIMESTAMP - Math.floor(rand() * 600000)
    ).toISOString(),
  };
}

// ── Generate mentor quality metrics ──
export function generateMentorQualityMetrics(): MentorQualityMetrics[] {
  const rand = seededRandom(777);
  return STATIC_EXPERT_LISTINGS.map((expert) => ({
    mentorId: expert.id,
    categoryId: expert.categoryId,
    completionRate: Math.round((0.85 + rand() * 0.15) * 100) / 100,
    averageRating: Math.round((3.5 + rand() * 1.5) * 10) / 10,
    repeatBookingRate: Math.round((0.15 + rand() * 0.55) * 100) / 100,
    disputeRate: Math.round(rand() * 0.05 * 100) / 100,
    averageResponseTime: Math.round(2 + rand() * 28),
    topicMatchQuality: Math.round((0.7 + rand() * 0.3) * 100) / 100,
    totalSessions: expert.sessionsCompleted,
    recentTrend: pick(["improving", "stable", "declining"] as const, rand),
    lastUpdated: MARKET_REFERENCE_ISO,
  }));
}

// ── Singleton caches ──
let _spotOrders: SpotOrder[] | null = null;
let _futuresOrders: FuturesOrder[] | null = null;
let _trades: Trade[] | null = null;
let _allCandles: Record<string, CandleData[]> | null = null;
let _qualityMetrics: MentorQualityMetrics[] | null = null;

export function getSpotOrders() {
  if (!_spotOrders) _spotOrders = generateSpotOrders();
  return _spotOrders;
}

export function getFuturesOrders() {
  if (!_futuresOrders) _futuresOrders = generateFuturesOrders();
  return _futuresOrders;
}

export function getTrades() {
  if (!_trades) _trades = generateTrades();
  return _trades;
}

export function getAllCandles() {
  if (!_allCandles) _allCandles = generateAllCandles();
  return _allCandles;
}

export function getCandlesForCategory(categoryId: string): CandleData[] {
  return getAllCandles()[categoryId] ?? [];
}

export function getQualityMetrics() {
  if (!_qualityMetrics) _qualityMetrics = generateMentorQualityMetrics();
  return _qualityMetrics;
}

export function getMentorQuality(mentorId: string) {
  return getQualityMetrics().find((m) => m.mentorId === mentorId) ?? null;
}
