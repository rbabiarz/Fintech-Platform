import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppContext, type Holding } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

function formatCurrency(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

const CLASS_CONFIG = {
  equity: { color: "#2C7A7B", label: "Equities" },
  "fixed-income": { color: "#0F2A4A", label: "Fixed Income" },
  cash: { color: "#64748B", label: "Cash" },
  alternative: { color: "#B45309", label: "Alternatives" },
};

function AllocationBar({ holdings }: { holdings: Holding[] }) {
  const colors = useColors();
  const totalVal = holdings.reduce((sum, h) => sum + h.value, 0);
  const classes = ["equity", "fixed-income", "cash", "alternative"] as const;
  const classData = classes.map((cls) => {
    const val = holdings.filter((h) => h.assetClass === cls).reduce((s, h) => s + h.value, 0);
    return { cls, val, pct: (val / totalVal) * 100 };
  });

  return (
    <View style={[styles.allocationCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.allocationHeader}>
        <Text style={[styles.allocationTitle, { color: colors.navy }]}>Asset Allocation</Text>
        <View style={[styles.refPill, { backgroundColor: colors.muted }]}>
          <Text style={[styles.refText, { color: colors.mutedForeground }]}>Educational reference</Text>
        </View>
      </View>
      <View style={styles.allocationBar}>
        {classData.map((c) => (
          <View
            key={c.cls}
            style={[
              styles.barSegment,
              { width: `${c.pct}%` as `${number}%`, backgroundColor: CLASS_CONFIG[c.cls].color },
            ]}
          />
        ))}
      </View>
      <View style={styles.legendRow}>
        {classData.map((c) => (
          <View key={c.cls} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: CLASS_CONFIG[c.cls].color }]} />
            <Text style={[styles.legendLabel, { color: colors.mutedForeground }]}>{CLASS_CONFIG[c.cls].label}</Text>
            <Text style={[styles.legendPct, { color: colors.text }]}>{c.pct.toFixed(0)}%</Text>
          </View>
        ))}
      </View>
      <View style={[styles.refDisc, { backgroundColor: colors.muted }]}>
        <Feather name="info" size={12} color={colors.mutedForeground} />
        <Text style={[styles.refDiscText, { color: colors.mutedForeground }]}>
          Educational reference, not personalized investment advice. Consider your personal circumstances before making investment decisions.
        </Text>
      </View>
    </View>
  );
}

function GoalMapping() {
  const colors = useColors();
  const { goals } = useAppContext();

  const mappings = [
    { goal: goals[1], account: "Vanguard Brokerage", pct: 80 },
    { goal: goals[0], account: "Marcus HISA", pct: 95 },
    { goal: goals[2], account: "Chase Checking", pct: 65 },
  ];

  return (
    <View style={[styles.mappingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.mappingTitle, { color: colors.navy }]}>Goal-Portfolio Mapping</Text>
      {mappings.map((m, i) => (
        <View key={i} style={[styles.mappingRow, i < mappings.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
          <Text style={styles.mappingEmoji}>{m.goal.emoji}</Text>
          <View style={styles.mappingInfo}>
            <Text style={[styles.mappingGoal, { color: colors.text }]}>{m.goal.title}</Text>
            <Text style={[styles.mappingAccount, { color: colors.mutedForeground }]}>{m.account}</Text>
          </View>
          <View style={[styles.mappingPill, { backgroundColor: m.pct >= 80 ? colors.successLight : colors.cautionLight }]}>
            <Text style={[styles.mappingPct, { color: m.pct >= 80 ? colors.success : colors.caution }]}>
              {m.pct}% aligned
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function HoldingRow({ holding }: { holding: Holding }) {
  const colors = useColors();
  const isPositive = holding.change >= 0;
  const cfg = CLASS_CONFIG[holding.assetClass];

  return (
    <Pressable style={[styles.holdingRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.holdingIcon, { backgroundColor: `${cfg.color}18` }]}>
        <Text style={[styles.holdingTicker, { color: cfg.color }]}>{holding.ticker.slice(0, 2)}</Text>
      </View>
      <View style={styles.holdingInfo}>
        <Text style={[styles.holdingName, { color: colors.text }]} numberOfLines={1}>{holding.name}</Text>
        <Text style={[styles.holdingTick, { color: colors.mutedForeground }]}>{holding.ticker} · {holding.allocation}%</Text>
      </View>
      <View style={styles.holdingRight}>
        <Text style={[styles.holdingValue, { color: colors.navy }]}>{formatCurrency(holding.value)}</Text>
        <Text style={[styles.holdingChange, { color: isPositive ? colors.success : colors.destructive }]}>
          {isPositive ? "+" : ""}{formatCurrency(holding.change)} ({holding.changePercent.toFixed(2)}%)
        </Text>
      </View>
    </Pressable>
  );
}

export default function InvestScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { holdings, totalInvested } = useAppContext();

  const totalChange = holdings.reduce((s, h) => s + h.change, 0);
  const isPositive = totalChange >= 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: insets.top + (Platform.OS === "web" ? 67 : 12),
        paddingBottom: insets.bottom + 100,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerSection}>
        <Text style={[styles.headline, { color: colors.navy }]}>Invest</Text>
      </View>

      <View style={[styles.portfolioCard, { backgroundColor: colors.navy }]}>
        <Text style={[styles.portLabel, { color: colors.primaryTint }]}>Total Portfolio Value</Text>
        <Text style={[styles.portValue, { color: "#fff" }]}>{formatCurrency(totalInvested)}</Text>
        <View style={[styles.changePill, { backgroundColor: isPositive ? "#15803D" : "#B91C1C" }]}>
          <Feather name={isPositive ? "trending-up" : "trending-down"} size={12} color="#fff" />
          <Text style={styles.changePillText}>{isPositive ? "+" : ""}{formatCurrency(totalChange)} today</Text>
        </View>
        <Text style={[styles.portDisclaimer, { color: "rgba(178,223,219,0.7)" }]}>
          Across 1 linked investment account
        </Text>
      </View>

      <AllocationBar holdings={holdings} />
      <GoalMapping />

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.navy }]}>Holdings</Text>
      </View>

      {holdings.map((h) => (
        <HoldingRow key={h.id} holding={h} />
      ))}

      <View style={[styles.driftCard, { backgroundColor: colors.cautionLight, borderColor: colors.caution, borderWidth: 1 }]}>
        <View style={styles.driftHeader}>
          <Feather name="alert-circle" size={16} color={colors.caution} />
          <Text style={[styles.driftTitle, { color: colors.caution }]}>Allocation drift detected</Text>
        </View>
        <Text style={[styles.driftBody, { color: colors.text }]}>
          Your equity allocation (77%) is 2% above your educational reference for a 25-year horizon. Consider reviewing during your next rebalance.
        </Text>
        <TouchableOpacity>
          <Text style={[styles.driftLink, { color: colors.caution }]}>Learn about rebalancing →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSection: { paddingHorizontal: 20, paddingBottom: 14 },
  headline: { fontSize: 28, fontWeight: "700" },
  portfolioCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  portLabel: { fontSize: 13, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
  portValue: { fontSize: 42, fontWeight: "700", marginBottom: 10 },
  changePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 8,
  },
  changePillText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  portDisclaimer: { fontSize: 11 },
  allocationCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  allocationHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  allocationTitle: { fontSize: 15, fontWeight: "700" },
  refPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  refText: { fontSize: 10, fontWeight: "500" },
  allocationBar: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 14,
    gap: 2,
  },
  barSegment: { height: 10 },
  legendRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 11 },
  legendPct: { fontSize: 11, fontWeight: "700" },
  refDisc: { flexDirection: "row", gap: 6, padding: 10, borderRadius: 8, alignItems: "flex-start" },
  refDiscText: { fontSize: 10, lineHeight: 15, flex: 1 },
  mappingCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  mappingTitle: { fontSize: 15, fontWeight: "700", marginBottom: 12 },
  mappingRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10 },
  mappingEmoji: { fontSize: 20 },
  mappingInfo: { flex: 1 },
  mappingGoal: { fontSize: 13, fontWeight: "600" },
  mappingAccount: { fontSize: 12, marginTop: 2 },
  mappingPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  mappingPct: { fontSize: 11, fontWeight: "600" },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 10, marginTop: 4 },
  sectionTitle: { fontSize: 17, fontWeight: "700" },
  holdingRow: {
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  holdingIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  holdingTicker: { fontSize: 13, fontWeight: "800" },
  holdingInfo: { flex: 1 },
  holdingName: { fontSize: 14, fontWeight: "600" },
  holdingTick: { fontSize: 11, marginTop: 2 },
  holdingRight: { alignItems: "flex-end" },
  holdingValue: { fontSize: 14, fontWeight: "700" },
  holdingChange: { fontSize: 11, marginTop: 2 },
  driftCard: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 12,
    borderRadius: 14,
    padding: 16,
  },
  driftHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  driftTitle: { fontSize: 14, fontWeight: "700" },
  driftBody: { fontSize: 13, lineHeight: 19, marginBottom: 8 },
  driftLink: { fontSize: 13, fontWeight: "600" },
});
