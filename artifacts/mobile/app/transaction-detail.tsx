import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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

const ALIGNMENT_CONFIG = {
  aligned: { color: "#15803D", bg: "#DCFCE7", label: "Aligned with goals" },
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
};

function formatCurrency(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function TransactionDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { transactions, goals } = useAppContext();

  const tx = useMemo(
    () => (params.id ? transactions.find((t) => t.id === params.id) : undefined),
    [params.id, transactions]
  );

  useEffect(() => {
    if (params.id && !tx && router.canGoBack()) router.back();
  }, [params.id, tx]);

  const [category, setCategory] = useState(tx?.category ?? "");
  const [linkedGoalId, setLinkedGoalId] = useState<string | null>(null);

  if (!tx) return null;
  const cfg = ALIGNMENT_CONFIG[tx.alignment];
  const icon = (CATEGORY_ICONS[tx.category] ?? "circle") as any;

  const dateLabel = new Date(tx.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Feather name="x" size={22} color={colors.navy} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.navy }]}>Transaction</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={[styles.heroIcon, { backgroundColor: cfg.bg }]}>
            <Feather name={icon} size={26} color={cfg.color} />
          </View>
          <Text style={[styles.heroMerchant, { color: colors.navy }]}>{tx.merchant}</Text>
          <Text style={[styles.heroAmount, { color: tx.isDebit ? colors.text : colors.success }]}>
            {tx.isDebit ? "-" : "+"}
            {formatCurrency(tx.amount)}
          </Text>
          <View style={[styles.alignPill, { backgroundColor: cfg.bg }]}>
            <View style={[styles.alignDot, { backgroundColor: cfg.color }]} />
            <Text style={{ color: cfg.color, fontSize: 12, fontWeight: "700" }}>{cfg.label}</Text>
          </View>
        </View>

        <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <DetailRow label="Date" value={dateLabel} colors={colors} />
          <DetailRow label="Account" value={tx.account} colors={colors} />
          <DetailRow label="Category" value={category} colors={colors} />
          <DetailRow
            label="Type"
            value={tx.isDebit ? "Debit" : "Credit"}
            colors={colors}
            last
          />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Recategorize</Text>
        <View style={styles.chipWrap}>
          {Object.keys(CATEGORY_ICONS).map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.chip,
                {
                  backgroundColor: category === c ? "#EBF8F8" : colors.card,
                  borderColor: category === c ? colors.primary : colors.border,
                  borderWidth: category === c ? 2 : 1,
                },
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setCategory(c);
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "700", color: category === c ? colors.primary : colors.text }}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Link to a goal</Text>
        <View style={{ gap: 8 }}>
          {goals
            .filter((g) => !g.hidden)
            .map((g) => {
              const selected = linkedGoalId === g.id;
              return (
                <TouchableOpacity
                  key={g.id}
                  style={[
                    styles.goalLinkRow,
                    {
                      backgroundColor: selected ? "#EBF8F8" : colors.card,
                      borderColor: selected ? colors.primary : colors.border,
                      borderWidth: selected ? 2 : 1,
                    },
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setLinkedGoalId(selected ? null : g.id);
                  }}
                >
                  <Text style={{ fontSize: 22 }}>{g.emoji}</Text>
                  <Text style={[styles.goalLinkText, { color: colors.text }]}>{g.title}</Text>
                  {selected && <Feather name="check-circle" size={18} color={colors.primary} />}
                </TouchableOpacity>
              );
            })}
        </View>

        <TouchableOpacity
          style={[styles.flagBtn, { borderColor: colors.caution }]}
          onPress={() =>
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
          }
        >
          <Feather name="flag" size={16} color={colors.caution} />
          <Text style={{ color: colors.caution, fontSize: 14, fontWeight: "700" }}>
            Flag as unrecognized
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.navy }]}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.back();
          }}
          activeOpacity={0.85}
        >
          <Feather name="check" size={18} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>Save changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DetailRow({
  label,
  value,
  colors,
  last,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.detailRow,
        !last && { borderBottomWidth: 1, borderBottomColor: colors.border },
      ]}
    >
      <Text style={{ fontSize: 13, color: colors.mutedForeground }}>{label}</Text>
      <Text style={{ fontSize: 14, color: colors.text, fontWeight: "600" }}>{value}</Text>
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
  heroSection: { alignItems: "center", paddingVertical: 16, marginBottom: 18 },
  heroIcon: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", marginBottom: 14 },
  heroMerchant: { fontSize: 20, fontWeight: "700" },
  heroAmount: { fontSize: 32, fontWeight: "700", marginTop: 6 },
  alignPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: 10,
  },
  alignDot: { width: 8, height: 8, borderRadius: 4 },
  detailCard: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, marginBottom: 18 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 4,
  },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 18 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18 },
  goalLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    padding: 14,
  },
  goalLinkText: { flex: 1, fontSize: 14, fontWeight: "600" },
  flagBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 13,
    marginTop: 18,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 17,
  },
});
