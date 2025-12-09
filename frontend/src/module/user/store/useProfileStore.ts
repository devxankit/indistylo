import { create } from "zustand";

export type ServicePreference = "at-salon" | "at-home";

interface ProfileState {
  phoneNumber: string;
  membershipId: string;
  avatarUrl: string | null;
  servicePreference: ServicePreference;
  setPhoneNumber: (phone: string) => void;
  setMembershipId: (id: string) => void;
  setAvatarUrl: (url: string | null) => void;
  setServicePreference: (preference: ServicePreference) => void;
}

const STORAGE_KEY = "salon-service-profile";

// Default values
const defaultState = {
  phoneNumber: "8225819420",
  membershipId: "BPC-958958",
  avatarUrl: null,
  servicePreference: "at-salon" as ServicePreference,
};

// Load from localStorage
const loadFromStorage = (): Partial<ProfileState> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        phoneNumber: parsed.phoneNumber || defaultState.phoneNumber,
        membershipId: parsed.membershipId || defaultState.membershipId,
        avatarUrl: parsed.avatarUrl || defaultState.avatarUrl,
        servicePreference: parsed.servicePreference || defaultState.servicePreference,
      };
    }
  } catch (error) {
    console.error("Error loading profile from storage:", error);
  }
  return defaultState;
};

// Save to localStorage
const saveToStorage = (state: ProfileState) => {
  try {
    const stateToSave = {
      phoneNumber: state.phoneNumber,
      membershipId: state.membershipId,
      avatarUrl: state.avatarUrl,
      servicePreference: state.servicePreference,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.error("Error saving profile to storage:", error);
  }
};

const initialState = loadFromStorage();

export const useProfileStore = create<ProfileState>((set, get) => ({
  phoneNumber: initialState.phoneNumber || defaultState.phoneNumber,
  membershipId: initialState.membershipId || defaultState.membershipId,
  avatarUrl: initialState.avatarUrl || defaultState.avatarUrl,
  servicePreference: (initialState.servicePreference || defaultState.servicePreference) as ServicePreference,
  
  setPhoneNumber: (phone) => {
    set({ phoneNumber: phone });
    saveToStorage(get());
  },
  
  setMembershipId: (id) => {
    set({ membershipId: id });
    saveToStorage(get());
  },
  
  setAvatarUrl: (url) => {
    set({ avatarUrl: url });
    saveToStorage(get());
  },
  
  setServicePreference: (preference) => {
    set({ servicePreference: preference });
    saveToStorage(get());
  },
}));

