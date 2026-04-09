// ── AI Match Engine for TimeExchange ──
// Structured scoring system with explainable ranking and feedback loop support

import { STATIC_EXPERT_LISTINGS, type ExpertListing } from "@/lib/mock-data";
import { getMentorQuality } from "@/lib/seed-market-data";
import type { MatchScore, Recommendation } from "@/types/market";

export interface MatchQuery {
  userId: string;
  categoryId?: string;
  expertise?: string[];
  languages?: string[];
  maxPrice?: number;
  timezone?: string;
  preferInstant?: boolean;
  previousMentorIds?: string[];
}

// ── Scoring weights (tunable) ──
const WEIGHTS = {
  topicFit: 0.22,
  languageFit: 0.08,
  priceFit: 0.12,
  availabilityFit: 0.15,
  responseSpeed: 0.08,
  mentorRating: 0.15,
  repeatSuccess: 0.07,
  fulfillmentQuality: 0.08,
  timezoneFit: 0.05,
} as const;

function scoreTopic(mentor: ExpertListing, query: MatchQuery): number {
  if (!query.expertise || query.expertise.length === 0) {
    return query.categoryId && mentor.categoryId === query.categoryId ? 70 : 50;
  }
  const overlap = mentor.expertise.filter((e) =>
    query.expertise!.includes(e)
  ).length;
  return Math.min(100, (overlap / query.expertise.length) * 100);
}

function scoreLanguage(mentor: ExpertListing, query: MatchQuery): number {
  if (!query.languages || query.languages.length === 0) return 80;
  const hasMatch = mentor.languages.some((l) => query.languages!.includes(l));
  return hasMatch ? 100 : 20;
}

function scorePrice(mentor: ExpertListing, query: MatchQuery): number {
  if (!query.maxPrice) return 70;
  if (mentor.hourlyRate <= query.maxPrice) {
    return 100 - ((query.maxPrice - mentor.hourlyRate) / query.maxPrice) * 20;
  }
  const overBy = (mentor.hourlyRate - query.maxPrice) / query.maxPrice;
  return Math.max(0, 60 - overBy * 200);
}

function scoreAvailability(mentor: ExpertListing, query: MatchQuery): number {
  if (query.preferInstant) {
    if (mentor.availabilityStatus === "live") return 100;
    if (mentor.availabilityStatus === "scheduled") return 50;
    return 10;
  }
  if (mentor.availabilityStatus === "live") return 90;
  if (mentor.availabilityStatus === "scheduled") return 75;
  return 25;
}

function scoreResponseSpeed(mentor: ExpertListing): number {
  const rt = mentor.responseTime;
  if (rt.includes("min")) {
    const mins = parseInt(rt);
    if (mins <= 5) return 100;
    if (mins <= 15) return 85;
    return 65;
  }
  if (rt.includes("hour")) return 45;
  return 30;
}

function scoreRating(mentor: ExpertListing): number {
  return Math.min(100, (mentor.rating / 5) * 100);
}

function scoreRepeatSuccess(mentor: ExpertListing, query: MatchQuery): number {
  if (query.previousMentorIds?.includes(mentor.id)) return 90;
  return 50 + (mentor.sessionsCompleted / 200) * 30;
}

function scoreFulfillment(mentor: ExpertListing): number {
  const quality = getMentorQuality(mentor.id);
  if (!quality) return 60;
  return (
    quality.completionRate * 40 +
    (1 - quality.disputeRate) * 30 +
    quality.topicMatchQuality * 30
  );
}

function scoreTimezone(mentor: ExpertListing, query: MatchQuery): number {
  if (!query.timezone) return 70;
  if (mentor.timezone === query.timezone) return 100;
  return 50;
}

function classifyMatch(
  score: number,
  breakdown: MatchScore["breakdown"],
  mentor: ExpertListing
): MatchScore["matchType"] {
  if (breakdown.priceFit > 85 && breakdown.topicFit > 70) return "best_value";
  if (breakdown.availabilityFit > 90 && breakdown.responseSpeed > 80) return "fastest_fill";
  if (breakdown.mentorRating > 90) return "highest_rated";
  if (mentor.sessionsCompleted < 30 && score > 70) return "rising_star";
  return "best_match";
}

function generateReason(matchType: MatchScore["matchType"], mentor: ExpertListing): string {
  switch (matchType) {
    case "best_match":
      return `Strong overall fit across topic expertise, availability, and track record`;
    case "best_value":
      return `Excellent topic match at competitive pricing — ${mentor.hourlyRate}/hr with ${mentor.rating} rating`;
    case "fastest_fill":
      return `Available now with ${mentor.responseTime} response time — quickest path to a session`;
    case "highest_rated":
      return `Top-rated mentor at ${mentor.rating}/5 with ${mentor.sessionsCompleted} completed sessions`;
    case "rising_star":
      return `Emerging mentor with strong early signals — great opportunity for early access`;
  }
}

// ── Main matching function ──
export function rankMentors(query: MatchQuery): MatchScore[] {
  const candidates = STATIC_EXPERT_LISTINGS.filter((mentor) => {
    if (query.categoryId && mentor.categoryId !== query.categoryId) return false;
    return true;
  });

  const scores: MatchScore[] = candidates.map((mentor) => {
    const breakdown = {
      topicFit: Math.round(scoreTopic(mentor, query)),
      languageFit: Math.round(scoreLanguage(mentor, query)),
      priceFit: Math.round(scorePrice(mentor, query)),
      availabilityFit: Math.round(scoreAvailability(mentor, query)),
      responseSpeed: Math.round(scoreResponseSpeed(mentor)),
      mentorRating: Math.round(scoreRating(mentor)),
      repeatSuccess: Math.round(scoreRepeatSuccess(mentor, query)),
      fulfillmentQuality: Math.round(scoreFulfillment(mentor)),
      timezoneFit: Math.round(scoreTimezone(mentor, query)),
    };

    const overallScore = Math.round(
      breakdown.topicFit * WEIGHTS.topicFit +
        breakdown.languageFit * WEIGHTS.languageFit +
        breakdown.priceFit * WEIGHTS.priceFit +
        breakdown.availabilityFit * WEIGHTS.availabilityFit +
        breakdown.responseSpeed * WEIGHTS.responseSpeed +
        breakdown.mentorRating * WEIGHTS.mentorRating +
        breakdown.repeatSuccess * WEIGHTS.repeatSuccess +
        breakdown.fulfillmentQuality * WEIGHTS.fulfillmentQuality +
        breakdown.timezoneFit * WEIGHTS.timezoneFit
    );

    const matchType = classifyMatch(overallScore, breakdown, mentor);

    return {
      mentorId: mentor.id,
      overallScore,
      breakdown,
      confidence: Math.min(0.99, 0.5 + (overallScore / 200)),
      reason: generateReason(matchType, mentor),
      matchType,
    };
  });

  return scores.sort((a, b) => b.overallScore - a.overallScore);
}

// ── Get top recommendations ──
export function getTopRecommendations(
  query: MatchQuery,
  limit: number = 5
): Recommendation[] {
  const ranked = rankMentors(query).slice(0, limit);
  return ranked.map((match, i) => ({
    id: `rec-${query.userId}-${i}`,
    userId: query.userId,
    mentorId: match.mentorId,
    matchScore: match,
    recommendationType: match.breakdown.availabilityFit > 80 ? "spot" : "futures",
    createdAt: new Date().toISOString(),
    accepted: null,
    feedbackRating: null,
  }));
}

// ── Get diversified recommendations (one per matchType) ──
export function getDiversifiedRecommendations(query: MatchQuery): MatchScore[] {
  const all = rankMentors(query);
  const types: MatchScore["matchType"][] = [
    "best_match",
    "best_value",
    "fastest_fill",
    "highest_rated",
    "rising_star",
  ];
  const result: MatchScore[] = [];
  const used = new Set<string>();

  for (const type of types) {
    const match = all.find((m) => m.matchType === type && !used.has(m.mentorId));
    if (match) {
      result.push(match);
      used.add(match.mentorId);
    }
  }

  // Fill remaining with top unused
  for (const match of all) {
    if (result.length >= 6) break;
    if (!used.has(match.mentorId)) {
      result.push(match);
      used.add(match.mentorId);
    }
  }

  return result;
}

// ── Feedback storage (in-memory for demo, would be Supabase in prod) ──
const feedbackLog: Array<{
  recommendationId: string;
  accepted: boolean;
  rating: number | null;
  timestamp: string;
}> = [];

export function recordRecommendationFeedback(
  recommendationId: string,
  accepted: boolean,
  rating?: number
) {
  feedbackLog.push({
    recommendationId,
    accepted,
    rating: rating ?? null,
    timestamp: new Date().toISOString(),
  });
}

export function getFeedbackLog() {
  return feedbackLog;
}
