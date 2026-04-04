import { create } from "zustand";
import type { AvailabilityStatus } from "@/lib/mock-data";

export type ViewMode = "map" | "table";
export type SortField =
  | "name"
  | "rating"
  | "price"
  | "availability"
  | "sessions";
export type SortDirection = "asc" | "desc";

export interface MarketStore {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  selectedRegion: string | null;
  setSelectedRegion: (region: string | null) => void;

  selectedLanguage: string | null;
  setSelectedLanguage: (language: string | null) => void;

  selectedCategoryId: string | null;
  setSelectedCategoryId: (categoryId: string | null) => void;

  selectedExpertise: string[];
  toggleExpertise: (tag: string) => void;
  clearExpertise: () => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  availabilityFilter: AvailabilityStatus | null;
  setAvailabilityFilter: (filter: AvailabilityStatus | null) => void;

  sortField: SortField;
  sortDirection: SortDirection;
  setSort: (field: SortField) => void;

  /** Incremented by live simulation to trigger re-renders */
  simulationTick: number;
  bumpSimulation: () => void;

  clearFilters: () => void;
}

export const useMarketStore = create<MarketStore>((set) => ({
  viewMode: "map",
  setViewMode: (mode) => set({ viewMode: mode }),

  selectedRegion: null,
  setSelectedRegion: (region) => set({ selectedRegion: region }),

  selectedLanguage: null,
  setSelectedLanguage: (language) => set({ selectedLanguage: language }),

  selectedCategoryId: null,
  setSelectedCategoryId: (categoryId) => set({ selectedCategoryId: categoryId }),

  selectedExpertise: [],
  toggleExpertise: (tag) =>
    set((state) => ({
      selectedExpertise: state.selectedExpertise.includes(tag)
        ? state.selectedExpertise.filter((selectedTag) => selectedTag !== tag)
        : [...state.selectedExpertise, tag],
    })),
  clearExpertise: () => set({ selectedExpertise: [] }),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  availabilityFilter: null,
  setAvailabilityFilter: (filter) => set({ availabilityFilter: filter }),

  sortField: "rating",
  sortDirection: "desc",
  simulationTick: 0,
  bumpSimulation: () => set((state) => ({ simulationTick: state.simulationTick + 1 })),
  setSort: (field) =>
    set((state) => ({
      sortField: field,
      sortDirection:
        state.sortField === field && state.sortDirection === "desc"
          ? "asc"
          : "desc",
    })),

  clearFilters: () =>
    set({
      selectedRegion: null,
      selectedLanguage: null,
      selectedCategoryId: null,
      selectedExpertise: [],
      searchQuery: "",
      availabilityFilter: null,
    }),
}));
