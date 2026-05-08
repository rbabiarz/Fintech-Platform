import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type RiskProfile = "conservative" | "moderate" | "moderate-aggressive" | "aggressive";

export interface OnboardingState {
  isOnboarded: boolean | null;
  name: string;
  email: string;
  goalTitle: string;
  goalEmoji: string;
  goalTarget: number;
  goalDate: string;
  goalCategory: string;
  linkedAccounts: string[];
  riskProfile: RiskProfile | null;
}

interface OnboardingContextType extends OnboardingState {
  setField: <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => void;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const STORAGE_KEY = "@align_onboarded";

const defaultState: OnboardingState = {
  isOnboarded: null,
  name: "",
  email: "",
  goalTitle: "",
  goalEmoji: "🏡",
  goalTarget: 100000,
  goalDate: "2027-01-01",
  goalCategory: "home",
  linkedAccounts: [],
  riskProfile: null,
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>(defaultState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      setState((prev) => ({ ...prev, isOnboarded: val === "true" }));
    });
  }, []);

  const setField = <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(STORAGE_KEY, "true");
    setState((prev) => ({ ...prev, isOnboarded: true }));
  };

  const resetOnboarding = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setState({ ...defaultState, isOnboarded: false });
  };

  return (
    <OnboardingContext.Provider value={{ ...state, setField, completeOnboarding, resetOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
