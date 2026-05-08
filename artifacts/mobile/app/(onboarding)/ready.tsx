import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

function StepBar({ step, total }: { step: number; total: number }) {
  const colors = useColors();
  return (
    <View style={styles.stepBarWrap}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.stepSegment, { backgroundColor: i < step ? colors.primary : colors.border }]} />
      ))}
    </View>
  );
}

const CHECKLIST = [
  { icon: "user", label: "Account created" },
  { icon: "target", label: "First goal set" },
  { icon: "link", label: "Accounts connected" },
  { icon: "sliders", label: "Risk profile established" },
];

export default function ReadyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { completeOnboarding, goalTitle, goalEmoji, goalTarget, riskProfile, linkedAccounts, name } = useOnboarding();

  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const checkAnims = useRef(CHECKLIST.map(() => new Animated.Value(0))).current;

  function formatCurrency(n: number) {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return `$${n}`;
  }

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 7 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    checkAnims.forEach((anim, i) => {
      setTimeout(() => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }).start();
      }, 300 + i * 150);
    });
  }, []);

  const handleLaunch = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await completeOnboarding();
    router.replace("/(tabs)/");
  };

  const riskLabel: Record<string, string> = {
    conservative: "Conservative",
    moderate: "Moderate",
    "moderate-aggressive": "Moderate Aggressive",
    aggressive: "Aggressive",
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.inner}>
        <StepBar step={5} total={5} />

        <Animated.View style={[styles.emojiWrap, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>
          <View style={[styles.emojiRing, { backgroundColor: "#EBF8F8" }]}>
            <View style={[styles.emojiInner, { backgroundColor: colors.primary }]}>
              <Text style={styles.checkEmoji}>✓</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={[styles.headline, { color: colors.navy }]}>
            You're all set,{"\n"}{name || "there"}!
          </Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            Your first projection is ready. Let's see where you stand.
          </Text>
        </Animated.View>

        <View style={[styles.summaryCard, { backgroundColor: colors.navy }]}>
          <Text style={[styles.summaryTitle, { color: colors.primaryTint }]}>Your starting picture</Text>
          <View style={styles.summaryRows}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: "#B2DFDB" }]}>First goal</Text>
              <Text style={[styles.summaryValue, { color: "#fff" }]}>
                {goalEmoji} {goalTitle || "Home purchase"} · {formatCurrency(goalTarget)}
              </Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: "rgba(255,255,255,0.1)" }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: "#B2DFDB" }]}>Accounts linked</Text>
              <Text style={[styles.summaryValue, { color: "#fff" }]}>
                {linkedAccounts.length > 0 ? `${linkedAccounts.length} account${linkedAccounts.length !== 1 ? "s" : ""}` : "None yet"}
              </Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: "rgba(255,255,255,0.1)" }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: "#B2DFDB" }]}>Risk profile</Text>
              <Text style={[styles.summaryValue, { color: "#fff" }]}>
                {riskLabel[riskProfile ?? "moderate"] ?? "Moderate"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.checklist}>
          {CHECKLIST.map((item, i) => (
            <Animated.View
              key={item.label}
              style={[
                styles.checkRow,
                {
                  opacity: checkAnims[i],
                  transform: [{ scale: checkAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
                },
              ]}
            >
              <View style={[styles.checkIcon, { backgroundColor: colors.successLight }]}>
                <Feather name={item.icon as any} size={14} color={colors.success} />
              </View>
              <Text style={[styles.checkLabel, { color: colors.text }]}>{item.label}</Text>
              <Feather name="check-circle" size={16} color={colors.success} />
            </Animated.View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.navy }]}
          onPress={handleLaunch}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Open my dashboard</Text>
          <Feather name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, paddingHorizontal: 24, paddingTop: 12 },
  stepBarWrap: { flexDirection: "row", gap: 4, marginBottom: 28 },
  stepSegment: { flex: 1, height: 4, borderRadius: 2 },
  emojiWrap: { alignItems: "center", marginBottom: 24 },
  emojiRing: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  emojiInner: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  checkEmoji: { fontSize: 34, color: "#fff", fontWeight: "800" },
  headline: { fontSize: 32, fontWeight: "800", letterSpacing: -0.5, textAlign: "center", marginBottom: 8 },
  sub: { fontSize: 16, textAlign: "center", lineHeight: 23, marginBottom: 24 },
  summaryCard: { borderRadius: 16, padding: 20, marginBottom: 20 },
  summaryTitle: { fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14 },
  summaryRows: { gap: 0 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingVertical: 10 },
  summaryLabel: { fontSize: 13 },
  summaryValue: { fontSize: 13, fontWeight: "700", flex: 1, textAlign: "right", marginLeft: 12 },
  summaryDivider: { height: 1 },
  checklist: { gap: 10 },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkIcon: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  checkLabel: { flex: 1, fontSize: 14, fontWeight: "500" },
  footer: { paddingHorizontal: 24, paddingBottom: 32 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 17,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
