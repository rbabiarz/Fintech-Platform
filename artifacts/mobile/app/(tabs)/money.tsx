import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppContext, type Transaction } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

function formatCurrency(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

const ALIGNMENT_CONFIG = {
  aligned: { color: "#15803D", bg: "#DCFCE7", label: "Aligned" },
  neutral: { color: "#64748B", bg: "#F0EDEA", label: "Neutral" },
  "out-of-sync": { color: "#B45309", bg: "#FEF3C7", label: "Out of sync" },
};

const CATEGORY_ICONS: Record<string, string> = {
  Groceries: "shopping-bag",
  Dining: "coffee",
  Subscriptions: "repeat",
  Income: "trending-up",
  Shopping: "package",
  Investing: "bar-chart-2",
  "Health & Fitness": "activity",
  Savings: "shield",
  Transport: "map-pin",
  Utilities: "zap",
};

function TransactionRow({ tx }: { tx: Transaction }) {
  const colors = useColors();
  const alignCfg = ALIGNMENT_CONFIG[tx.alignment];
  const icon = (CATEGORY_ICONS[tx.category] ?? "circle") as any;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.txRow,
        { backgroundColor: pressed ? colors.muted : colors.card, borderColor: colors.border },
      ]}
      onPress={() => Haptics.selectionAsync()}
    >
      <View style={[styles.txIcon, { backgroundColor: alignCfg.bg }]}>
        <Feather name={icon} size={16} color={alignCfg.color} />
      </View>
      <View style={styles.txMiddle}>
        <Text style={[styles.txMerchant, { color: colors.text }]} numberOfLines={1}>{tx.merchant}</Text>
        <View style={styles.txMeta}>
          <Text style={[styles.txCategory, { color: colors.mutedForeground }]}>{tx.category}</Text>
          <Text style={[styles.txDot, { color: colors.border }]}>·</Text>
          <Text style={[styles.txAccount, { color: colors.mutedForeground }]}>{tx.account}</Text>
        </View>
      </View>
      <View style={styles.txRight}>
        <Text style={[styles.txAmount, { color: tx.isDebit ? colors.text : colors.success }]}>
          {tx.isDebit ? "-" : "+"}{formatCurrency(tx.amount)}
        </Text>
        <View style={[styles.alignDot, { backgroundColor: alignCfg.color }]} />
      </View>
    </Pressable>
  );
}

function SpendCategoryBar() {
  const colors = useColors();
  const cats = [
    { name: "Groceries", amount: 152, total: 600, color: "#2C7A7B" },
    { name: "Dining", amount: 204, total: 250, color: "#B45309" },
    { name: "Investing", amount: 2200, total: 2200, color: "#15803D" },
    { name: "Shopping", amount: 99, total: 300, color: "#64748B" },
    { name: "Subscriptions", amount: 35, total: 60, color: "#8B5CF6" },
  ];

  return (
    <View style={[styles.spendCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.spendHeader}>
        <Text style={[styles.spendTitle, { color: colors.navy }]}>May Spending Pulse</Text>
        <Text style={[styles.spendSub, { color: colors.mutedForeground }]}>$2,774 so far</Text>
      </View>
      {cats.map((c) => {
        const pct = Math.min((c.amount / c.total) * 100, 100);
        const over = c.amount > c.total;
        return (
          <View key={c.name} style={styles.catRow}>
            <Text style={[styles.catName, { color: colors.text }]}>{c.name}</Text>
            <View style={[styles.catBarBg, { backgroundColor: colors.border }]}>
              <View style={[styles.catBarFill, { width: `${pct}%` as `${number}%`, backgroundColor: c.color }]} />
            </View>
            <Text style={[styles.catAmt, { color: over ? colors.caution : colors.mutedForeground }]}>
              ${c.amount}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function SubscriptionCard() {
  const colors = useColors();
  const subs = [
    { name: "Spotify", amount: 11.99, active: true },
    { name: "Netflix", amount: 22.99, active: true },
    { name: "Hulu", amount: 17.99, active: false },
  ];

  return (
    <View style={[styles.subCard, { backgroundColor: colors.cautionLight, borderColor: colors.caution, borderWidth: 1 }]}>
      <View style={styles.subHeader}>
        <Feather name="repeat" size={16} color={colors.caution} />
        <Text style={[styles.subTitle, { color: colors.caution }]}>3 subscriptions detected</Text>
      </View>
      {subs.map((s) => (
        <View key={s.name} style={styles.subRow}>
          <View style={[styles.subDot, { backgroundColor: s.active ? colors.success : colors.caution }]} />
          <Text style={[styles.subName, { color: colors.text }]}>{s.name}</Text>
          {!s.active && (
            <View style={[styles.inactivePill, { backgroundColor: colors.cautionLight }]}>
              <Text style={[styles.inactiveText, { color: colors.caution }]}>May be inactive</Text>
            </View>
          )}
          <Text style={[styles.subAmt, { color: colors.mutedForeground }]}>${s.amount}/mo</Text>
        </View>
      ))}
      <Text style={[styles.subTotal, { color: colors.caution }]}>Total: $52.97/mo</Text>
    </View>
  );
}

type Filter = "all" | "aligned" | "out-of-sync";

export default function MoneyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { transactions } = useAppContext();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = transactions.filter((tx) => {
    if (filter === "all") return true;
    if (filter === "aligned") return tx.alignment === "aligned";
    if (filter === "out-of-sync") return tx.alignment === "out-of-sync";
    return true;
  });

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "aligned", label: "Aligned" },
    { key: "out-of-sync", label: "Out of sync" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + (Platform.OS === "web" ? 67 : 12),
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={[styles.headline, { color: colors.navy }]}>Money</Text>
          <TouchableOpacity style={[styles.searchBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="search" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        <SpendCategoryBar />
        <SubscriptionCard />

        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterBtn,
                {
                  backgroundColor: filter === f.key ? colors.primary : colors.card,
                  borderColor: filter === f.key ? colors.primary : colors.border,
                },
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setFilter(f.key);
              }}
            >
              <Text style={[styles.filterLabel, { color: filter === f.key ? "#fff" : colors.mutedForeground }]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>May 2026</Text>

        {filtered.map((tx) => (
          <TransactionRow key={tx.id} tx={tx} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headline: { fontSize: 28, fontWeight: "700" },
  searchBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  spendCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  spendHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
  spendTitle: { fontSize: 15, fontWeight: "700" },
  spendSub: { fontSize: 13 },
  catRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  catName: { fontSize: 12, width: 90 },
  catBarBg: { flex: 1, height: 6, borderRadius: 3, overflow: "hidden" },
  catBarFill: { height: 6, borderRadius: 3 },
  catAmt: { fontSize: 12, width: 36, textAlign: "right" },
  subCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 14,
    padding: 16,
  },
  subHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  subTitle: { fontSize: 14, fontWeight: "700" },
  subRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  subDot: { width: 8, height: 8, borderRadius: 4 },
  subName: { flex: 1, fontSize: 13 },
  subAmt: { fontSize: 13, fontWeight: "600" },
  inactivePill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  inactiveText: { fontSize: 10, fontWeight: "600" },
  subTotal: { fontSize: 12, fontWeight: "700", marginTop: 4 },
  filterRow: { flexDirection: "row", gap: 8, paddingHorizontal: 20, marginBottom: 14 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterLabel: { fontSize: 13, fontWeight: "600" },
  sectionLabel: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", paddingHorizontal: 20, marginBottom: 8, letterSpacing: 0.5 },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  txIcon: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  txMiddle: { flex: 1 },
  txMerchant: { fontSize: 14, fontWeight: "600" },
  txMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 },
  txCategory: { fontSize: 12 },
  txDot: { fontSize: 12 },
  txAccount: { fontSize: 12 },
  txRight: { alignItems: "flex-end", gap: 6 },
  txAmount: { fontSize: 14, fontWeight: "700" },
  alignDot: { width: 7, height: 7, borderRadius: 4 },
});
