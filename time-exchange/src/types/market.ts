// ── Core market types for TimeExchange trading platform ──

export type OrderSide = "bid" | "ask";
export type OrderType = "spot" | "futures";
export type OrderStatus = "open" | "filled" | "partial" | "cancelled";
export type SessionStatus = "scheduled" | "in_progress" | "completed" | "cancelled" | "disputed";

export interface SpotOrder {
  id: string;
  side: OrderSide;
  mentorId: string;
  buyerId: string | null;
  categoryId: string;
  expertise: string[];
  price: number; // £/hr
  status: OrderStatus;
  createdAt: string; // ISO
  filledAt: string | null;
}

export interface FuturesOrder {
  id: string;
  side: OrderSide;
  mentorId: string | null; // null for bids
  buyerId: string | null; // null for asks
  categoryId: string;
  expertise: string[];
  price: number;
  scheduledDate: string; // ISO date
  scheduledTime: string; // HH:mm
  durationMinutes: number;
  timezone: string;
  status: OrderStatus;
  createdAt: string;
  filledAt: string | null;
}

export interface Trade {
  id: string;
  orderId: string;
  orderType: OrderType;
  mentorId: string;
  buyerId: string;
  categoryId: string;
  expertise: string[];
  price: number;
  durationMinutes: number;
  executedAt: string;
}

export interface CandleData {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number; // matched minutes
}

export interface OrderBookLevel {
  price: number;
  quantity: number; // number of orders
  totalMinutes: number;
}

export interface OrderBookSnapshot {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spread: number;
  lastPrice: number;
  lastTradeTime: string;
}

// ── AI / Recommendation types ──

export interface MatchScore {
  mentorId: string;
  overallScore: number; // 0-100
  breakdown: {
    topicFit: number;
    languageFit: number;
    priceFit: number;
    availabilityFit: number;
    responseSpeed: number;
    mentorRating: number;
    repeatSuccess: number;
    fulfillmentQuality: number;
    timezoneFit: number;
  };
  confidence: number; // 0-1
  reason: string;
  matchType: "best_match" | "best_value" | "fastest_fill" | "highest_rated" | "rising_star";
}

export interface Recommendation {
  id: string;
  userId: string;
  mentorId: string;
  matchScore: MatchScore;
  recommendationType: "spot" | "futures" | "next_booking";
  createdAt: string;
  accepted: boolean | null;
  feedbackRating: number | null;
}

// ── Session Intelligence types ──

export interface SessionConsent {
  sessionId: string;
  userId: string;
  mentorId: string;
  consentType: "transcript_analysis" | "topic_extraction" | "quality_assessment";
  granted: boolean;
  grantedAt: string;
}

export interface SessionSummary {
  sessionId: string;
  topics: string[];
  keyInsights: string[];
  qualitySignals: {
    clarity: number;
    depth: number;
    relevance: number;
    engagement: number;
  };
  extractedAt: string;
}

export interface MentorQualityMetrics {
  mentorId: string;
  categoryId: string;
  completionRate: number;
  averageRating: number;
  repeatBookingRate: number;
  disputeRate: number;
  averageResponseTime: number; // minutes
  topicMatchQuality: number;
  totalSessions: number;
  recentTrend: "improving" | "stable" | "declining";
  lastUpdated: string;
}

// ── Watchlist ──

export interface WatchlistItem {
  id: string;
  userId: string;
  categoryId: string;
  expertise: string[];
  priceAlert: number | null;
  createdAt: string;
}

// ── Chart timeframes ──

export type TimeFrame = "1H" | "4H" | "1D" | "1W" | "1M";

export const TIMEFRAME_LABELS: Record<TimeFrame, string> = {
  "1H": "1 Hour",
  "4H": "4 Hours",
  "1D": "1 Day",
  "1W": "1 Week",
  "1M": "1 Month",
};
