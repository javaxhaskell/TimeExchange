import {
  CATEGORY_LABELS,
  EXPERT_LISTINGS,
  REGION_DEFINITIONS,
  SUBCATEGORY_TO_CATEGORY,
  type AvailabilityStatus,
  type ExpertListing,
  type RegionSummary,
  getRegionDefinitionById,
  getRegionSummaries,
} from "@/lib/mock-data";
import type { SortDirection, SortField } from "@/lib/store";

export interface MarketFilters {
  selectedRegion: string | null;
  selectedLanguage: string | null;
  selectedCategoryId: string | null;
  selectedExpertise: string[];
  searchQuery: string;
  availabilityFilter: AvailabilityStatus | null;
}

export function formatHourlyRate(hourlyRate: number) {
  return `£${hourlyRate}/hr`;
}

export function formatHourlyRange(
  minHourlyRate: number | null,
  maxHourlyRate: number | null
) {
  if (minHourlyRate === null || maxHourlyRate === null) {
    return "No visible asks";
  }

  if (minHourlyRate === maxHourlyRate) {
    return `From £${minHourlyRate}/hr`;
  }

  return `£${minHourlyRate}-${maxHourlyRate}/hr`;
}

export function getHourlyRange(listings: ExpertListing[]) {
  if (listings.length === 0) {
    return { minHourlyRate: null, maxHourlyRate: null };
  }

  const rates = listings.map((listing) => listing.hourlyRate);
  return {
    minHourlyRate: Math.min(...rates),
    maxHourlyRate: Math.max(...rates),
  };
}

export function getListingStatusMeta(listing: ExpertListing) {
  switch (listing.availabilityStatus) {
    case "live":
      return {
        label: "Live now",
        shortLabel: "LIVE",
        className:
          "bg-emerald-500/15 text-emerald-300 border-emerald-400/30 shadow-[0_0_0_1px_rgba(16,185,129,0.08)]",
        dotClassName: "bg-emerald-300",
        pulse: true,
      };
    case "scheduled":
      return {
        label: "Forward slot",
        shortLabel: "SCHEDULED",
        className:
          "bg-sky-500/12 text-sky-300 border-sky-400/25 shadow-[0_0_0_1px_rgba(56,189,248,0.06)]",
        dotClassName: "bg-sky-300",
        pulse: false,
      };
    case "offline":
    default:
      return {
        label: "Offline",
        shortLabel: "OFFLINE",
        className:
          "bg-zinc-500/12 text-zinc-300 border-zinc-400/20 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]",
        dotClassName: "bg-zinc-400",
        pulse: false,
      };
  }
}

export function getAvailabilityText(listing: ExpertListing) {
  if (listing.availabilityStatus === "live") {
    return `Live now • next slot ${listing.nextOpenSlot}`;
  }

  return `Next slot ${listing.nextOpenSlot}`;
}

export function getAccessModes(listing: ExpertListing) {
  const modes = [];

  if (listing.supportsInstant) {
    modes.push("Spot");
  }

  if (listing.supportsForwardOrders) {
    modes.push("Forward");
  }

  return modes;
}

export function filterListings(
  listings: ExpertListing[],
  filters: MarketFilters
) {
  const query = filters.searchQuery.trim().toLowerCase();

  return listings.filter((listing) => {
    if (filters.selectedRegion && listing.region !== filters.selectedRegion) {
      return false;
    }

    if (
      filters.selectedLanguage &&
      !listing.languages.includes(filters.selectedLanguage)
    ) {
      return false;
    }

    if (
      filters.selectedCategoryId &&
      listing.categoryId !== filters.selectedCategoryId
    ) {
      return false;
    }

    if (
      filters.selectedExpertise.length > 0 &&
      !filters.selectedExpertise.some((tag) => listing.expertise.includes(tag))
    ) {
      return false;
    }

    if (
      filters.availabilityFilter &&
      listing.availabilityStatus !== filters.availabilityFilter
    ) {
      return false;
    }

    if (!query) {
      return true;
    }

    const regionName = getRegionDefinitionById(listing.region)?.name ?? "";
    const categoryLabel = CATEGORY_LABELS[listing.categoryId] ?? "";

    return [
      listing.name,
      listing.headline,
      listing.bio,
      listing.responseTime,
      listing.nextOpenSlot,
      regionName,
      categoryLabel,
      ...listing.expertise,
      ...listing.languages,
    ]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

export function sortListings(
  listings: ExpertListing[],
  sortField: SortField,
  sortDirection: SortDirection
) {
  const direction = sortDirection === "asc" ? 1 : -1;
  const availabilityOrder: Record<AvailabilityStatus, number> = {
    live: 0,
    scheduled: 1,
    offline: 2,
  };

  return [...listings].sort((left, right) => {
    switch (sortField) {
      case "name":
        return direction * left.name.localeCompare(right.name);
      case "rating":
        return direction * (left.rating - right.rating);
      case "price":
        return direction * (left.hourlyRate - right.hourlyRate);
      case "sessions":
        return direction * (left.sessionsCompleted - right.sessionsCompleted);
      case "availability":
        return (
          direction *
          (availabilityOrder[left.availabilityStatus] -
            availabilityOrder[right.availabilityStatus])
        );
      default:
        return 0;
    }
  });
}

export function getVisibleListings(
  filters: MarketFilters,
  sortField?: SortField,
  sortDirection?: SortDirection
) {
  const filtered = filterListings(EXPERT_LISTINGS, filters);
  if (!sortField || !sortDirection) {
    return filtered;
  }

  return sortListings(filtered, sortField, sortDirection);
}

export function getVisibleRegionSummaries(filters: MarketFilters) {
  return getRegionSummaries(getVisibleListings(filters));
}

export function getRegionSummaryMaps(filters?: MarketFilters) {
  const visibleSummaries = filters
    ? getRegionSummaries(getVisibleListings(filters))
    : getRegionSummaries();

  const baseSummaries = getRegionSummaries(EXPERT_LISTINGS);

  return {
    visible: Object.fromEntries(
      visibleSummaries.map((summary) => [summary.id, summary])
    ) as Record<string, RegionSummary>,
    base: Object.fromEntries(
      baseSummaries.map((summary) => [summary.id, summary])
    ) as Record<string, RegionSummary>,
  };
}

export function getVisibleRegionIds(filters: MarketFilters) {
  return new Set(
    getVisibleListings(filters).map((listing) => listing.region)
  );
}

export function getCategorySummary(categoryId: string | null) {
  if (!categoryId) {
    return "All markets";
  }

  return CATEGORY_LABELS[categoryId] ?? "Selected market";
}

export function getSubcategoriesForCategory(categoryId: string | null) {
  if (!categoryId) {
    return Object.entries(SUBCATEGORY_TO_CATEGORY)
      .map(([subcategory]) => subcategory)
      .sort((left, right) => left.localeCompare(right));
  }

  return Object.entries(SUBCATEGORY_TO_CATEGORY)
    .filter(([, parentId]) => parentId === categoryId)
    .map(([subcategory]) => subcategory)
    .sort((left, right) => left.localeCompare(right));
}

export function getRegionRateRange(regionId: string, listings: ExpertListing[]) {
  const regionListings = listings.filter((listing) => listing.region === regionId);
  return getHourlyRange(regionListings);
}

export function getTopSpotListings(listings: ExpertListing[], limit = 3) {
  return [...listings]
    .filter((listing) => listing.availabilityStatus === "live")
    .sort((left, right) => right.rating - left.rating)
    .slice(0, limit);
}

export function getForwardReadyCount(listings: ExpertListing[]) {
  return listings.filter((listing) => listing.supportsForwardOrders).length;
}

export function getRegionDefinitionMap() {
  return Object.fromEntries(
    REGION_DEFINITIONS.map((region) => [region.id, region])
  ) as Record<string, (typeof REGION_DEFINITIONS)[number]>;
}
