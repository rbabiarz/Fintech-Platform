import { Stack } from "expo-router";
import React from "react";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="goal" />
      <Stack.Screen name="link" />
      <Stack.Screen name="risk" />
      <Stack.Screen name="ready" />
    </Stack>
  );
}
