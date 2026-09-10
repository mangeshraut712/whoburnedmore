import { create } from "zustand";
import { DEFAULT_THEME_ID } from "../lib/theme-config";

export interface CardStudioState {
  themeId: string;
  layout: "hero" | "compact" | "tachometer";
  privacy: boolean;
  showSparkline: boolean;
  showBreakdown: boolean;
  showStreak: boolean;
  handle: string;

  setThemeId: (id: string) => void;
  setLayout: (layout: "hero" | "compact" | "tachometer") => void;
  setPrivacy: (privacy: boolean) => void;
  setShowSparkline: (show: boolean) => void;
  setShowBreakdown: (show: boolean) => void;
  setShowStreak: (show: boolean) => void;
  setHandle: (handle: string) => void;
}

export const useCardStudioStore = create<CardStudioState>((set) => ({
  themeId: DEFAULT_THEME_ID,
  layout: "hero",
  privacy: false,
  showSparkline: true,
  showBreakdown: true,
  showStreak: true,
  handle: "mangeshraut712",

  setThemeId: (themeId) => set({ themeId }),
  setLayout: (layout) => set({ layout }),
  setPrivacy: (privacy) => set({ privacy }),
  setShowSparkline: (showSparkline) => set({ showSparkline }),
  setShowBreakdown: (showBreakdown) => set({ showBreakdown }),
  setShowStreak: (showStreak) => set({ showStreak }),
  setHandle: (handle) => set({ handle }),
}));
