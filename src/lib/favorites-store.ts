"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FavoritesStore {
  favoriteMentorIds: string[];
  toggleFavoriteMentor: (mentorId: string) => void;
  isFavoriteMentor: (mentorId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteMentorIds: [],
      toggleFavoriteMentor: (mentorId) =>
        set((state) => ({
          favoriteMentorIds: state.favoriteMentorIds.includes(mentorId)
            ? state.favoriteMentorIds.filter((id) => id !== mentorId)
            : [...state.favoriteMentorIds, mentorId],
        })),
      isFavoriteMentor: (mentorId) => get().favoriteMentorIds.includes(mentorId),
    }),
    {
      name: "timeexchange-favorite-mentors",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favoriteMentorIds: state.favoriteMentorIds }),
    }
  )
);
