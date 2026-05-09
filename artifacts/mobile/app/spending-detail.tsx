import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
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

const PERIODS = ["This month", "Last month", "Last 3 months"] as const;

export default function SpendingDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { budgetCategories, budgets } = useAppContext();
  const [period, setPeriod] = useState<typeof PERIODS[number]>("This month");

  const categories = budgetCategories.map((c) => ({
    ...c,
    budget: budgets[c.name] ?? c.recommendedBudget,
  }));

  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
  const totalBudget = categories.reduce((s, c) => s + c.budget, 0);
  const pct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 56 : 12), borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Feather name="x" size={22} color={colors.navy} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.navy }]}>Spending breakdown</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.periodRow}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.periodChip,
                {
                  backgroundColor: period === p ? colors.navy : colors.card,
                  borderColor: period === p ? colors.navy : colors.border,
                },
              ]}
              onPress={() => setPeriod(p)}
            >
              <Text style={{ color: period === p ? "#fff" : colors.text, fontSize: 12, fontWeight: "600" }}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.navy }]}>
          <Text style={{ color: "#B2DFDB", fontSize: 12, fontWeight: "700", letterSpacing: 0.6 }}>
            TOTAL SPENT · {period.toUpperCase()}
          </Text>
          <Text style={{ color: "#fff", fontSize: 36, fontWeight: "700", marginTop: 6 }}>
            ${totalSpent.toLocaleString()}
          </Text>
          <Text style={{ color: "#B2DFDB", fontSize: 13, marginTop: 4 }}>
            of ${totalBudget.toLocaleString()} budgeted · {pct}% used
          </Text>
          <View style={[styles.summaryBar, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <View
              style={[
                styles.summaryBarFill,
                { width: `${Math.min(pct, 100)}%` as `${number}%`, backgroundColor: colors.primary },
              ]}
            />
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>By category</Text>

        {categories.map((c) => {
          const catPct = Math.min((c.spent / c.budget) * 100, 100);
          const over = c.spent > c.budget;
          return (
            <View
              key={c.name}
              style={[styles.catCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.catHead}>
                <View style={[styles.catIcon, { backgroundColor: c.color + "22" }]}>
                  <Feather name={c.icon} size={16} color={c.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.catName, { color: colors.text }]}>{c.name}</Text>
                  <Text style={[styles.catSub, { color: colors.mutedForeground }]}>
                    ${c.spent} of ${c.budget}
                  </Text>
                </View>
                {c.trend !== 0 && (
                  <View
                    style={[
                      styles.trendPill,
                      { backgroundColor: c.trend > 0 ? "#FEE2E2" : "#DCFCE7" },
                    ]}
                  >
                    <Feather
                      name={c.trend > 0 ? "trending-up" : "trending-down"}
                      size={10}
                      color={c.trend > 0 ? "#B91C1C" : "#15803D"}
                    />
                    <Text style={{ fontSize: 11, fontWeight: "700", color: c.trend > 0 ? "#B91C1C" : "#15803D" }}>
                      {Math.abs(c.trend)}%
                    </Text>
                  </View>
                )}
              </View>
              <View style={[styles.catBar, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.catBarFill,
                    {
                      width: `${catPct}%` as `${number}%`,
                      backgroundColor: over ? colors.caution : c.color,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}

        <TouchableOpacity
          style={[styles.adjustBtn, { backgroundColor: colors.navy }]}
          onPress={() => {
            Haptics.selectionAsync();
            router.push("/budget-editor");
          }}
          activeOpacity={0.85}
        >
          <Feather name="sliders" size={16} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700" }}>Adjust budgets</Text>
        </TouchableOpacity>
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
  periodRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  periodChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1 },
  summaryCard: { borderRadius: 16, padding: 18, marginBottom: 22 },
  summaryBar: { height: 8, borderRadius: 4, marginTop: 14, overflow: "hidden" },
  summaryBarFill: { height: 8, borderRadius: 4 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  catCard: { borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 10 },
  catHead: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  catIcon: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  catName: { fontSize: 14, fontWeight: "700" },
  catSub: { fontSize: 12, marginTop: 2 },
  catBar: { height: 6, borderRadius: 3, overflow: "hidden" },
  catBarFill: { height: 6, borderRadius: 3 },
  trendPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  adjustBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 20,
  },
});
