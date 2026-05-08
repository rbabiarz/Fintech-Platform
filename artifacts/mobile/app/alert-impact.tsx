import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppContext } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const ALERT_TYPE_CFG = {
  nudge: { color: "#2C7A7B", bg: "#EBF8F8", icon: "zap" as const, label: "Nudge" },
  celebration: { color: "#15803D", bg: "#DCFCE7", icon: "star" as const, label: "Celebration" },
  warning: { color: "#B45309", bg: "#FEF3C7", icon: "alert-circle" as const, label: "Warning" },
  info: { color: "#64748B", bg: "#F0EDEA", icon: "info" as const, label: "Info" },
};

function formatMoney(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

function monthsBetween(now: Date, target: Date) {
  return Math.max(
    0,
    (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth()),
  );
}

export default function AlertImpactScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { alerts, goals } = useAppContext();

  const alert = alerts.find((a) => a.id === params.id) ?? alerts[0];
  const cfg = ALERT_TYPE_CFG[alert.type];
  const goal = alert.goalId ? goals.find((g) => g.id === alert.goalId) : undefined;

  const isPositive = alert.type === "celebration" || alert.type === "nudge";
  const remaining = goal ? Math.max(0, goal.targetAmount - goal.currentAmount) : 0;
  const monthsLeft = goal ? monthsBetween(new Date(), new Date(goal.targetDate)) : 0;
  const requiredMonthly = goal && monthsLeft > 0 ? Math.round(remaining / monthsLeft) : 0;
  const gap = goal ? Math.max(0, requiredMonthly - goal.monthlyContribution) : 0;

  const shiftWeeks = isPositive ? 12 : 5;
  const shiftLabel = isPositive ? `${shiftWeeks} weeks earlier` : `${shiftWeeks} weeks later`;

  const drivers = isPositive
    ? [
        { label: "Above-pace contributions", value: `+${formatMoney(goal?.monthlyContribution ?? 0)}/mo`, tone: "good" as const },
        { label: "Aligned spending streak", value: "12 days", tone: "good" as const },
        { label: "Bonus deposit (Apr)", value: "+$1,200", tone: "good" as const },
      ]
    : [
        { label: "Dining (last 30 days)", value: "+31% vs. plan", tone: "bad" as const },
        { label: "Subscriptions creep", value: "+$22/mo", tone: "bad" as const },
        { label: "Aligned categories", value: "Groceries, Health", tone: "good" as const },
      ];

  const projection = isPositive
    ? [
        { label: "Today's pace", value: `${monthsLeft - shiftWeeks / 4 | 0} months to go`, highlight: true },
        { label: "Original target", value: `${monthsLeft} months`, highlight: false },
      ]
    : [
        { label: "Original target", value: `${monthsLeft} months`, highlight: false },
        { label: "Current trajectory", value: `${monthsLeft + shiftWeeks / 4 | 0} months`, highlight: true },
      ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Feather name="x" size={22} color={colors.navy} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.navy }]} numberOfLines={1}>
          Impact analysis
        </Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.navy }]}>
          <View style={[styles.heroIcon, { backgroundColor: "rgba(178,223,219,0.18)" }]}>
            <Feather name={cfg.icon} size={20} color={cfg.color === "#64748B" ? "#B2DFDB" : cfg.color} />
          </View>
          <Text style={styles.heroTag}>{cfg.label.toUpperCase()}</Text>
          <Text style={styles.heroTitle}>{alert.title}</Text>
          <Text style={styles.heroBody}>{alert.body}</Text>
        </View>

        {goal && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Affected goal</Text>
            <TouchableOpacity
              style={[styles.goalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => {
                Haptics.selectionAsync();
                router.replace({ pathname: "/goal-editor", params: { id: goal.id } });
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.goalEmoji}>{goal.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.goalTitle, { color: colors.navy }]}>{goal.title}</Text>
                <Text style={[styles.goalSub, { color: colors.mutedForeground }]}>
                  {formatMoney(goal.currentAmount)} of {formatMoney(goal.targetAmount)} · {monthsLeft} mo left
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          </>
        )}

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Timeline impact</Text>
        <View style={[styles.shiftCard, { backgroundColor: cfg.bg, borderColor: cfg.color }]}>
          <View style={styles.shiftHeader}>
            <Feather
              name={isPositive ? "trending-up" : "trending-down"}
              size={20}
              color={cfg.color}
            />
            <Text style={[styles.shiftAmount, { color: cfg.color }]}>{shiftLabel}</Text>
          </View>
          <Text style={[styles.shiftBody, { color: colors.navy }]}>
            {isPositive
              ? "Keep this pace and you'll cross the finish line ahead of schedule."
              : "If this trend continues, your goal target date moves out by this much."}
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Projection</Text>
        <View style={[styles.projCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {projection.map((p, i) => (
            <View
              key={p.label}
              style={[
                styles.projRow,
                i < projection.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <Text style={[styles.projLabel, { color: colors.mutedForeground }]}>{p.label}</Text>
              <Text
                style={[
                  styles.projValue,
                  { color: p.highlight ? cfg.color : colors.text, fontWeight: p.highlight ? "700" : "600" },
                ]}
              >
                {p.value}
              </Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>What's driving this</Text>
        <View style={[styles.projCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {drivers.map((d, i) => (
            <View
              key={d.label}
              style={[
                styles.projRow,
                i < drivers.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <Text style={[styles.projLabel, { color: colors.text, flex: 1 }]}>{d.label}</Text>
              <Text
                style={[
                  styles.projValue,
                  { color: d.tone === "good" ? colors.success : colors.caution },
                ]}
              >
                {d.value}
              </Text>
            </View>
          ))}
        </View>

        {gap > 0 && goal && (
          <View style={[styles.suggestCard, { backgroundColor: "#EBF8F8" }]}>
            <Feather name="zap" size={16} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.suggestTitle, { color: colors.navy }]}>Quick fix</Text>
              <Text style={[styles.suggestBody, { color: colors.text }]}>
                Adding {formatMoney(gap)}/mo to {goal.title} would put it back on the original timeline.
              </Text>
            </View>
          </View>
        )}

        <View style={[styles.footerNote, { borderColor: colors.border }]}>
          <Feather name="info" size={13} color={colors.mutedForeground} />
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            Impact estimates are educational projections based on the last 90 days, not a forecast.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.actionBar, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + 12 }]}>
        {goal ? (
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={() => {
              Haptics.selectionAsync();
              router.replace({ pathname: "/goal-editor", params: { id: goal.id } });
            }}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryBtnText}>Adjust goal</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryBtnText}>Got it</Text>
          </TouchableOpacity>
        )}
      </View>
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
  headerTitle: { fontSize: 17, fontWeight: "700", flex: 1, textAlign: "center" },
  iconBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  heroCard: { borderRadius: 16, padding: 20, marginBottom: 18 },
  heroIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  heroTag: { color: "#B2DFDB", fontSize: 11, fontWeight: "700", letterSpacing: 0.8, marginBottom: 6 },
  heroTitle: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 8, lineHeight: 26 },
  heroBody: { color: "#B2DFDB", fontSize: 13, lineHeight: 19 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 4,
  },
  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 18,
  },
  goalEmoji: { fontSize: 26 },
  goalTitle: { fontSize: 15, fontWeight: "700" },
  goalSub: { fontSize: 12, marginTop: 2 },
  shiftCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 18 },
  shiftHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  shiftAmount: { fontSize: 20, fontWeight: "700" },
  shiftBody: { fontSize: 13, lineHeight: 19 },
  projCard: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, marginBottom: 18 },
  projRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  projLabel: { fontSize: 13 },
  projValue: { fontSize: 13, fontWeight: "600" },
  suggestCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  suggestTitle: { fontSize: 13, fontWeight: "700", marginBottom: 2 },
  suggestBody: { fontSize: 13, lineHeight: 19 },
  footerNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderTopWidth: 1,
    paddingTop: 14,
  },
  footerText: { flex: 1, fontSize: 11, lineHeight: 16 },
  actionBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  primaryBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
