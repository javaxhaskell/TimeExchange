import type { ExpertListing } from "@/lib/mock-data";

export function buildMentorVoicePreviewText(mentor: ExpertListing) {
  const expertise = mentor.expertise.slice(0, 2).join(" and ");

  return `Hi, I'm ${mentor.name}. I can help you with ${expertise}. Book a live session through TimeExchange.`;
}
