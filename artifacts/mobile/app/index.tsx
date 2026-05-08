import { Redirect } from "expo-router";
import React from "react";

import { useOnboarding } from "@/context/OnboardingContext";

export default function RootIndex() {
  const { isOnboarded } = useOnboarding();

  if (isOnboarded === null) return null;
  if (isOnboarded) return <Redirect href="/(tabs)/" />;
  return <Redirect href="/(onboarding)/welcome" />;
}
