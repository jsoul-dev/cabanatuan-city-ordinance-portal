import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DraftState {
  reportType: string;
  description: string;
  contactName: string;
  contactPhone: string;
  isAnonymous: boolean;
  barangayId: string;
  setField: (field: string, value: string | boolean) => void;
  reset: () => void;
}

const initialState = {
  reportType: "",
  description: "",
  contactName: "",
  contactPhone: "",
  isAnonymous: false,
  barangayId: "",
};

/**
 * Zustand store for the community report form.
 * Persisted to localStorage so form data survives page refresh.
 * Blueprint requirement: "localStorage Draft Persistence"
 */
export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      ...initialState,
      setField: (field, value) => set({ [field]: value }),
      reset: () => set(initialState),
    }),
    {
      name: "report-draft-v1", // versioned localStorage key per client-localstorage-schema rule
    }
  )
);
