import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppContext } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const CLASS_LABELS = {
  equity: "Equities",
  "fixed-income": "Fixed Income",
  cash: "Cash",
  alternative: "Alternatives",
} as const;

const RANGES = ["1W", "1M", "3M", "1Y", "ALL"] as const;

function formatCurrency(n: number) {
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

export default function HoldingDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { holdings } = useAppContext();
  const params = useLocalSearchParams<{ id?: string }>();
  const [range, setRange] = useState<typeof RANGES[number]>("1M");

  const holding = holdings.find((h) => h.id === params.id) ?? holdings[0];
  const isPositive = holding.change >= 0;

  const facts = [
    { label: "Asset class", value: CLASS_LABELS[holding.assetClass] },
    { label: "Portfolio weight", value: `${holding.allocation}%` },
    { label: "Total value", value: formatCurrency(holding.value) },
    { label: "Today's change", value: `${isPositive ? "+" : ""}${formatCurrency(holding.change)} (${holding.changePercent.toFixed(2)}%)` },
    { label: "Expense ratio", value: holding.assetClass === "equity" ? "0.04%" : holding.assetClass === "fixed-income" ? "0.05%" : "0.11%" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 56 : 12), borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Feather name="x" size={22} color={colors.navy} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.navy }]} numberOfLines={1}>
          {holding.ticker}
        </Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Feather name="more-horizontal" size={20} color={colors.navy} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.summary, { backgroundColor: colors.navy }]}>
          <Text style={styles.summaryName}>{holding.name}</Text>
          <Text style={styles.summaryTicker}>{holding.ticker}</Text>
          <Text style={styles.summaryValue}>{formatCurrency(holding.value)}</Text>
          <View style={[styles.changePill, { backgroundColor: isPositive ? "#15803D" : "#B91C1C" }]}>
            <Feather name={isPositive ? "trending-up" : "trending-down"} size={12} color="#fff" />
            <Text style={styles.changePillText}>
              {isPositive ? "+" : ""}{formatCurrency(holding.change)} ({holding.changePercent.toFixed(2)}%) today
            </Text>
          </View>
        </View>

        <View style={styles.rangeRow}>
          {RANGES.map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.rangeChip,
                {
                  backgroundColor: range === r ? colors.navy : colors.card,
                  borderColor: range === r ? colors.navy : colors.border,
                },
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setRange(r);
              }}
            >
              <Text style={{ color: range === r ? "#fff" : colors.text, fontSize: 12, fontWeight: "700" }}>
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.chartArea}>
            {[28, 32, 26, 38, 34, 44, 40, 52, 48, 58, 54, 64].map((h, i) => (
              <View
                key={i}
                style={[
                  styles.chartBar,
                  { height: h, backgroundColor: isPositive ? colors.primary : colors.destructive },
                ]}
              />
            ))}
          </View>
          <Text style={[styles.chartCaption, { color: colors.mutedForeground }]}>
            {range} performance · indicative
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>About this holding</Text>
        <View style={[styles.factCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {facts.map((f, i) => (
            <View
              key={f.label}
              style={[
                styles.factRow,
                i < facts.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <Text style={[styles.factLabel, { color: colors.mutedForeground }]}>{f.label}</Text>
              <Text style={[styles.factValue, { color: colors.text }]}>{f.value}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Mapped to goals</Text>
        <View style={[styles.factCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.mapRow}>
            <Text style={styles.mapEmoji}>🌅</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.mapTitle, { color: colors.text }]}>Early Retirement</Text>
              <Text style={[styles.mapSub, { color: colors.mutedForeground }]}>~80% of this holding supports this goal</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.85}
          >
            <Feather name="plus" size={15} color="#fff" />
            <Text style={styles.actionPrimary}>Buy more</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }]}
            activeOpacity={0.85}
          >
            <Feather name="minus" size={15} color={colors.navy} />
            <Text style={[styles.actionSecondary, { color: colors.navy }]}>Sell</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.disc, { backgroundColor: colors.muted }]}>
          <Feather name="info" size={12} color={colors.mutedForeground} />
          <Text style={[styles.discText, { color: colors.mutedForeground }]}>
            Performance shown is illustrative. Trading actions route to your linked Vanguard brokerage.
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
  summary: { borderRadius: 16, padding: 20, marginBottom: 18 },
  summaryName: { color: "#fff", fontSize: 18, fontWeight: "700" },
  summaryTicker: { color: "#B2DFDB", fontSize: 12, fontWeight: "600", letterSpacing: 0.5, marginTop: 2 },
  summaryValue: { color: "#fff", fontSize: 36, fontWeight: "700", marginTop: 14 },
  changePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  changePillText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  rangeRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  rangeChip: { flex: 1, paddingVertical: 8, borderRadius: 12, borderWidth: 1, alignItems: "center" },
  chartCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 22 },
  chartArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    height: 80,
    marginBottom: 10,
  },
  chartBar: { flex: 1, borderRadius: 4 },
  chartCaption: { fontSize: 11, textAlign: "center" },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 4,
  },
  factCard: { borderRadius: 12, borderWidth: 1, marginBottom: 18, paddingHorizontal: 14 },
  factRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  factLabel: { fontSize: 13 },
  factValue: { fontSize: 13, fontWeight: "700" },
  mapRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  mapEmoji: { fontSize: 22 },
  mapTitle: { fontSize: 14, fontWeight: "700" },
  mapSub: { fontSize: 12, marginTop: 2 },
  actionRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionPrimary: { color: "#fff", fontSize: 14, fontWeight: "700" },
  actionSecondary: { fontSize: 14, fontWeight: "700" },
  disc: { flexDirection: "row", gap: 6, padding: 10, borderRadius: 8, alignItems: "flex-start" },
  discText: { fontSize: 11, lineHeight: 15, flex: 1 },
});
