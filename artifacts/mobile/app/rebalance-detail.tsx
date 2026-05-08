import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const DRIFTS = [
  { label: "Equities", current: 77, target: 75, color: "#2C7A7B" },
  { label: "Fixed Income", current: 15, target: 18, color: "#0F2A4A" },
  { label: "Cash", current: 6, target: 5, color: "#64748B" },
  { label: "Alternatives", current: 2, target: 2, color: "#B45309" },
];

const STEPS = [
  {
    icon: "search" as const,
    title: "Review your drift",
    body: "Compare current allocation against the educational reference for your time horizon.",
  },
  {
    icon: "shuffle" as const,
    title: "Pick a method",
    body: "You can sell what's overweight, or simply route new contributions toward what's underweight (no taxable event).",
  },
  {
    icon: "check-circle" as const,
    title: "Execute & monitor",
    body: "Most investors rebalance once or twice a year, or when an asset class drifts more than 5%.",
  },
];

export default function RebalanceDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Feather name="x" size={22} color={colors.navy} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.navy }]}>Rebalancing</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.intro, { backgroundColor: colors.cautionLight, borderColor: colors.caution }]}>
          <View style={styles.introHead}>
            <Feather name="alert-circle" size={16} color={colors.caution} />
            <Text style={[styles.introTitle, { color: colors.caution }]}>Drift detected: +2% equities</Text>
          </View>
          <Text style={[styles.introBody, { color: colors.text }]}>
            A strong stock market this quarter pushed your equity allocation slightly above your educational reference.
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Current vs. target</Text>
        <View style={[styles.driftCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {DRIFTS.map((d, i) => {
            const diff = d.current - d.target;
            const off = Math.abs(diff) >= 2;
            return (
              <View
                key={d.label}
                style={[
                  styles.driftRow,
                  i < DRIFTS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                ]}
              >
                <View style={[styles.driftDot, { backgroundColor: d.color }]} />
                <Text style={[styles.driftLabel, { color: colors.text }]}>{d.label}</Text>
                <Text style={[styles.driftCurrent, { color: colors.navy }]}>{d.current}%</Text>
                <Text style={[styles.driftTarget, { color: colors.mutedForeground }]}>/ {d.target}%</Text>
                <View style={[styles.diffPill, { backgroundColor: off ? colors.cautionLight : colors.successLight }]}>
                  <Text style={{ color: off ? colors.caution : colors.success, fontSize: 11, fontWeight: "700" }}>
                    {diff > 0 ? "+" : ""}{diff}%
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>How rebalancing works</Text>
        {STEPS.map((s, i) => (
          <View key={s.title} style={[styles.stepCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.stepIcon, { backgroundColor: "#EBF8F8" }]}>
              <Feather name={s.icon} size={16} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.stepNum, { color: colors.primary }]}>STEP {i + 1}</Text>
              <Text style={[styles.stepTitle, { color: colors.navy }]}>{s.title}</Text>
              <Text style={[styles.stepBody, { color: colors.text }]}>{s.body}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.cta, { backgroundColor: colors.navy }]}
          activeOpacity={0.85}
          onPress={() => router.back()}
        >
          <Feather name="shuffle" size={16} color="#fff" />
          <Text style={styles.ctaText}>Plan a rebalance</Text>
        </TouchableOpacity>

        <View style={[styles.disc, { backgroundColor: colors.muted }]}>
          <Feather name="info" size={12} color={colors.mutedForeground} />
          <Text style={[styles.discText, { color: colors.mutedForeground }]}>
            Educational reference, not personalized investment advice. Selling holdings may have tax implications — consider consulting a tax professional.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 17, fontWeight: "700" },
  iconBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  intro: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 22 },
  introHead: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  introTitle: { fontSize: 14, fontWeight: "700" },
  introBody: { fontSize: 13, lineHeight: 19 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 4,
  },
  driftCard: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, marginBottom: 22 },
  driftRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 12 },
  driftDot: { width: 10, height: 10, borderRadius: 5 },
  driftLabel: { flex: 1, fontSize: 13, fontWeight: "600" },
  driftCurrent: { fontSize: 14, fontWeight: "700" },
  driftTarget: { fontSize: 12 },
  diffPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  stepCard: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  stepIcon: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  stepNum: { fontSize: 10, fontWeight: "700", letterSpacing: 0.6, marginBottom: 2 },
  stepTitle: { fontSize: 14, fontWeight: "700", marginBottom: 4 },
  stepBody: { fontSize: 13, lineHeight: 19 },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 14,
    marginBottom: 14,
  },
  ctaText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  disc: { flexDirection: "row", gap: 6, padding: 10, borderRadius: 8, alignItems: "flex-start" },
  discText: { fontSize: 11, lineHeight: 15, flex: 1 },
});
