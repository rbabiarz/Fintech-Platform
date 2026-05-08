import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const SLIDES = [
  {
    id: "1",
    emoji: "🎯",
    title: "Money around your life,\nnot the other way around.",
    body: "Align organizes everything around the life you're building — your goals are the spine, not an afterthought.",
    bg: "#EBF8F8",
  },
  {
    id: "2",
    emoji: "🧭",
    title: "See what every dollar\nmeans for what matters.",
    body: "Every transaction, every account, every investment — rendered through the lens of what you're actually trying to achieve.",
    bg: "#E8EDF3",
  },
  {
    id: "3",
    emoji: "✨",
    title: "Transparent AI guidance,\nnot black-box nudges.",
    body: "Every suggestion shows you the math behind it. No shame, no gamification — just calm, clear, compassionate guidance.",
    bg: "#DCFCE7",
  },
];

export default function WelcomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  const animateToSlide = (nextIndex: number) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setIndex(nextIndex);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleNext = () => {
    if (!isLast) {
      animateToSlide(index + 1);
    } else {
      router.push("/(onboarding)/signup");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.logoRow}>
        <View style={[styles.logoMark, { backgroundColor: colors.navy }]}>
          <Feather name="target" size={16} color={colors.primary} />
        </View>
        <Text style={[styles.logoText, { color: colors.navy }]}>align</Text>
      </View>

      <Animated.View style={[styles.slideArea, { opacity: fadeAnim }]}>
        <View style={[styles.emojiCard, { backgroundColor: slide.bg }]}>
          <Text style={styles.slideEmoji}>{slide.emoji}</Text>
        </View>
        <Text style={[styles.slideTitle, { color: colors.navy }]}>{slide.title}</Text>
        <Text style={[styles.slideBody, { color: colors.mutedForeground }]}>{slide.body}</Text>
      </Animated.View>

      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => animateToSlide(i)}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: i === index ? colors.primary : colors.border,
                  width: i === index ? 22 : 7,
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.navy }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>
            {isLast ? "Get started" : "Continue"}
          </Text>
          <Feather name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>

        {isLast && (
          <TouchableOpacity
            onPress={() => router.push("/(onboarding)/signup")}
            style={styles.signInBtn}
          >
            <Text style={[styles.signInText, { color: colors.mutedForeground }]}>
              Already have an account?{" "}
              <Text style={{ color: colors.primary, fontWeight: "700" }}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        )}

        {!isLast && (
          <TouchableOpacity
            onPress={() => router.push("/(onboarding)/signup")}
            style={styles.signInBtn}
          >
            <Text style={[styles.signInText, { color: colors.mutedForeground }]}>Skip intro</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  slideArea: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  emojiCard: {
    width: 148,
    height: 148,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  slideEmoji: { fontSize: 68 },
  slideTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  slideBody: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 25,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 20,
  },
  dot: { height: 7, borderRadius: 4 },
  actions: { paddingHorizontal: 24, paddingBottom: 16, gap: 8 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 17,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  signInBtn: { alignItems: "center", paddingVertical: 10 },
  signInText: { fontSize: 14 },
});
