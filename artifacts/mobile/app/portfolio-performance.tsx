import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
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

const RANGES = ["1M", "3M", "YTD", "1Y", "ALL"] as const;

const RANGE_DATA: Record<typeof RANGES[number], { ret: number; pct: number; bench: number; series: number[] }> = {
  "1M": { ret: 4280, pct: 1.51, bench: 1.32, series: [40, 44, 42, 48, 46, 52, 56, 54, 60, 58, 64, 70] },
  "3M": { ret: 12640, pct: 4.6, bench: 4.1, series: [30, 36, 34, 42, 40, 48, 52, 50, 58, 64, 70, 76] },
  YTD: { ret: 22180, pct: 8.4, bench: 7.8, series: [22, 28, 32, 30, 38, 44, 42, 52, 58, 56, 66, 74] },
  "1Y": { ret: 38420, pct: 15.4, bench: 13.9, series: [18, 22, 28, 26, 34, 38, 44, 50, 48, 56, 62, 70] },
  ALL: { ret: 92140, pct: 47.2, bench: 39.8, series: [12, 18, 24, 28, 32, 38, 44, 52, 56, 60, 64, 72] },
};

function formatCurrency(n: number) {
  if (Math.abs(n) >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export default function PortfolioPerformanceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { totalInvested } = useAppContext();
  const [range, setRange] = useState<typeof RANGES[number]>("YTD");

  const data = RANGE_DATA[range];
  const isPositive = data.ret >= 0;
  const beat = data.pct - data.bench;

  const stats = [
    { label: "Starting balance", value: formatCurrency(totalInvested - data.ret) },
    { label: "Net contributions", value: "+$8,400" },
    { label: "Market gain/loss", value: `${isPositive ? "+" : ""}${formatCurrency(data.ret - 8400)}` },
    { label: "Dividends received", value: "+$1,820" },
    { label: "Fees paid", value: "−$42" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Feather name="x" size={22} color={colors.navy} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.navy }]}>Portfolio performance</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Feather name="share-2" size={18} color={colors.navy} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.summary, { backgroundColor: colors.navy }]}>
          <Text style={styles.summaryLabel}>TOTAL VALUE</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalInvested)}</Text>
          <View style={[styles.changePill, { backgroundColor: isPositive ? "#15803D" : "#B91C1C" }]}>
            <Feather name={isPositive ? "trending-up" : "trending-down"} size={12} color="#fff" />
            <Text style={styles.changePillText}>
              {isPositive ? "+" : ""}{formatCurrency(data.ret)} ({data.pct.toFixed(2)}%) · {range}
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
            {data.series.map((h, i) => (
              <View
                key={i}
                style={[
                  styles.chartBar,
                  { height: h, backgroundColor: colors.primary },
                ]}
              />
            ))}
          </View>
          <View style={styles.chartFooter}>
            <View style={styles.chartLegend}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.legendText, { color: colors.text }]}>Your portfolio</Text>
              <Text style={[styles.legendVal, { color: colors.success }]}>+{data.pct.toFixed(2)}%</Text>
            </View>
            <View style={styles.chartLegend}>
              <View style={[styles.legendDot, { backgroundColor: colors.mutedForeground }]} />
              <Text style={[styles.legendText, { color: colors.text }]}>S&P 500 benchmark</Text>
              <Text style={[styles.legendVal, { color: colors.mutedForeground }]}>+{data.bench.toFixed(2)}%</Text>
            </View>
          </View>
        </View>

        <View style={[styles.beatCard, { backgroundColor: beat >= 0 ? colors.successLight : colors.cautionLight }]}>
          <Feather
            name={beat >= 0 ? "award" : "alert-circle"}
            size={16}
            color={beat >= 0 ? colors.success : colors.caution}
          />
          <Text style={[styles.beatText, { color: colors.text }]}>
            You're {beat >= 0 ? "outperforming" : "underperforming"} your benchmark by {Math.abs(beat).toFixed(2)}% over {range}.
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Where it came from</Text>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {stats.map((s, i) => (
            <View
              key={s.label}
              style={[
                styles.statRow,
                i < stats.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.disc, { backgroundColor: colors.muted }]}>
          <Feather name="info" size={12} color={colors.mutedForeground} />
          <Text style={[styles.discText, { color: colors.mutedForeground }]}>
            Past performance does not guarantee future returns. Figures are illustrative based on linked accounts.
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
  summary: { borderRadius: 16, padding: 20, marginBottom: 18, alignItems: "center" },
  summaryLabel: { color: "#B2DFDB", fontSize: 12, fontWeight: "700", letterSpacing: 0.6 },
  summaryValue: { color: "#fff", fontSize: 36, fontWeight: "700", marginTop: 6 },
  changePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
  },
  changePillText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  rangeRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  rangeChip: { flex: 1, paddingVertical: 8, borderRadius: 12, borderWidth: 1, alignItems: "center" },
  chartCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16 },
  chartArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    height: 90,
    marginBottom: 14,
  },
  chartBar: { flex: 1, borderRadius: 4 },
  chartFooter: { gap: 8 },
  chartLegend: { flexDirection: "row", alignItems: "center", gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { flex: 1, fontSize: 12 },
  legendVal: { fontSize: 12, fontWeight: "700" },
  beatCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 12,
    padding: 12,
    marginBottom: 22,
  },
  beatText: { flex: 1, fontSize: 13, lineHeight: 19 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 4,
  },
  statCard: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, marginBottom: 18 },
  statRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  statLabel: { fontSize: 13 },
  statValue: { fontSize: 13, fontWeight: "700" },
  disc: { flexDirection: "row", gap: 6, padding: 10, borderRadius: 8, alignItems: "flex-start" },
  discText: { fontSize: 11, lineHeight: 15, flex: 1 },
});
