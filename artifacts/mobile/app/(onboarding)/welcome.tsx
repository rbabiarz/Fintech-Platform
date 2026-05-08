import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    emoji: "🎯",
    title: "Money around your life,\nnot the other way around.",
    body: "Align organizes everything around the life you're building — your goals are the spine, not an afterthought.",
    accent: "#2C7A7B",
    bg: "#EBF8F8",
  },
  {
    id: "2",
    emoji: "🧭",
    title: "See what every dollar\nmeans for what matters.",
    body: "Every transaction, every account, every investment — rendered through the lens of what you're actually trying to achieve.",
    accent: "#0F2A4A",
    bg: "#E8EDF3",
  },
  {
    id: "3",
    emoji: "✨",
    title: "Transparent AI guidance,\nnot black-box nudges.",
    body: "Every suggestion shows you the math behind it. No shame, no gamification — just calm, clear, compassionate guidance.",
    accent: "#15803D",
    bg: "#DCFCE7",
  },
];

export default function WelcomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      router.push("/(onboarding)/signup");
    }
  };

  const current = SLIDES[activeIndex];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.logoRow}>
        <View style={[styles.logoMark, { backgroundColor: colors.navy }]}>
          <Feather name="target" size={16} color={colors.primary} />
        </View>
        <Text style={[styles.logoText, { color: colors.navy }]}>align</Text>
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(idx);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.emojiCard, { backgroundColor: item.bg }]}>
              <Text style={styles.slideEmoji}>{item.emoji}</Text>
            </View>
            <Text style={[styles.slideTitle, { color: colors.navy }]}>{item.title}</Text>
            <Text style={[styles.slideBody, { color: colors.mutedForeground }]}>{item.body}</Text>
          </View>
        )}
      />

      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === activeIndex ? colors.primary : colors.border,
                width: i === activeIndex ? 22 : 7,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.navy }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>
            {activeIndex < SLIDES.length - 1 ? "Continue" : "Get started"}
          </Text>
          <Feather name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>

        {activeIndex === SLIDES.length - 1 && (
          <TouchableOpacity onPress={() => router.push("/(onboarding)/signup")} style={styles.signInBtn}>
            <Text style={[styles.signInText, { color: colors.mutedForeground }]}>
              Already have an account?{" "}
              <Text style={{ color: colors.primary, fontWeight: "700" }}>Sign in</Text>
            </Text>
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
  slide: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    paddingVertical: 24,
  },
  emojiCard: {
    width: 140,
    height: 140,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  slideEmoji: { fontSize: 64 },
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
    lineHeight: 24,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 16,
  },
  dot: { height: 7, borderRadius: 4 },
  actions: { paddingHorizontal: 24, paddingBottom: 16, gap: 12 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 17,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  signInBtn: { alignItems: "center", paddingVertical: 8 },
  signInText: { fontSize: 14 },
});
