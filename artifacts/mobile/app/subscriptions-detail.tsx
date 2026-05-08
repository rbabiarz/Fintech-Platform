import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

interface Sub {
  id: string;
  name: string;
  category: string;
  amount: number;
  cycle: "Monthly" | "Yearly";
  lastUsed: string;
  active: boolean;
  flagged: boolean;
}

const INITIAL: Sub[] = [
  { id: "s1", name: "Spotify Premium", category: "Music", amount: 11.99, cycle: "Monthly", lastUsed: "Today", active: true, flagged: false },
  { id: "s2", name: "Netflix", category: "Streaming", amount: 22.99, cycle: "Monthly", lastUsed: "Yesterday", active: true, flagged: false },
  { id: "s3", name: "Hulu", category: "Streaming", amount: 17.99, cycle: "Monthly", lastUsed: "47 days ago", active: true, flagged: true },
  { id: "s4", name: "Adobe Creative Cloud", category: "Software", amount: 54.99, cycle: "Monthly", lastUsed: "12 days ago", active: true, flagged: false },
  { id: "s5", name: "iCloud+ 200GB", category: "Storage", amount: 2.99, cycle: "Monthly", lastUsed: "Today", active: true, flagged: false },
  { id: "s6", name: "NYTimes", category: "News", amount: 4.25, cycle: "Monthly", lastUsed: "8 days ago", active: true, flagged: false },
];

export default function SubscriptionsDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [subs, setSubs] = useState<Sub[]>(INITIAL);

  const totalActive = useMemo(
    () => subs.filter((s) => s.active).reduce((sum, s) => sum + s.amount, 0),
    [subs]
  );
  const flaggedCount = subs.filter((s) => s.flagged && s.active).length;

  const toggleActive = (id: string) => {
    Haptics.selectionAsync();
    setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  const cancelSub = (sub: Sub) => {
    Alert.alert(
      `Cancel ${sub.name}?`,
      `Save ${(sub.amount * 12).toFixed(0)}/yr — we'll guide you to ${sub.name}'s cancel page.`,
      [
        { text: "Not now", style: "cancel" },
        {
          text: "Cancel subscription",
          style: "destructive",
          onPress: () => {
            setSubs((prev) => prev.filter((s) => s.id !== sub.id));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Feather name="x" size={22} color={colors.navy} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.navy }]}>Subscriptions</Text>
        <View style={styles.iconBtn} />
      </View>

      <View style={[styles.stickySummaryWrap, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={[styles.summaryCard, { backgroundColor: colors.navy, marginBottom: 0 }]}>
          <Text style={{ color: "#B2DFDB", fontSize: 12, fontWeight: "700", letterSpacing: 0.6 }}>
            ACTIVE SUBSCRIPTIONS
          </Text>
          <Text style={{ color: "#fff", fontSize: 36, fontWeight: "700", marginTop: 6 }}>
            ${totalActive.toFixed(2)}/mo
          </Text>
          <Text style={{ color: "#B2DFDB", fontSize: 13, marginTop: 4 }}>
            ${(totalActive * 12).toFixed(0)} per year across {subs.filter((s) => s.active).length} services
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: insets.bottom + 60 }}
        showsVerticalScrollIndicator={false}
      >
        {flaggedCount > 0 && (
          <View style={[styles.flagBanner, { backgroundColor: colors.cautionLight, borderColor: colors.caution }]}>
            <Feather name="alert-circle" size={16} color={colors.caution} />
            <Text style={{ color: colors.caution, fontSize: 13, fontWeight: "600", flex: 1 }}>
              {flaggedCount} subscription{flaggedCount > 1 ? "s" : ""} look unused — consider cancelling
            </Text>
          </View>
        )}

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>All subscriptions</Text>

        {subs.map((s) => (
          <View
            key={s.id}
            style={[
              styles.subCard,
              {
                backgroundColor: colors.card,
                borderColor: s.flagged ? colors.caution : colors.border,
                opacity: s.active ? 1 : 0.55,
              },
            ]}
          >
            <View style={styles.subRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.subName, { color: colors.text }]}>{s.name}</Text>
                <Text style={[styles.subMeta, { color: colors.mutedForeground }]}>
                  {s.category} · Last used {s.lastUsed}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.subAmt, { color: colors.text }]}>${s.amount.toFixed(2)}</Text>
                <Text style={[styles.subCycle, { color: colors.mutedForeground }]}>{s.cycle}</Text>
              </View>
            </View>
            {s.flagged && s.active && (
              <View style={styles.flagRow}>
                <Feather name="alert-triangle" size={12} color={colors.caution} />
                <Text style={{ color: colors.caution, fontSize: 12, fontWeight: "600" }}>
                  No activity in over 6 weeks
                </Text>
              </View>
            )}
            <View style={[styles.subFooter, { borderTopColor: colors.border }]}>
              <View style={styles.toggleRow}>
                <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>Active</Text>
                <Switch
                  value={s.active}
                  onValueChange={() => toggleActive(s.id)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>
              <TouchableOpacity onPress={() => cancelSub(s)}>
                <Text style={{ color: colors.caution, fontSize: 13, fontWeight: "700" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  stickySummaryWrap: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1 },
  summaryCard: { borderRadius: 16, padding: 18, marginBottom: 16 },
  flagBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  subCard: { borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 10 },
  subRow: { flexDirection: "row", alignItems: "flex-start" },
  subName: { fontSize: 14, fontWeight: "700" },
  subMeta: { fontSize: 12, marginTop: 3 },
  subAmt: { fontSize: 14, fontWeight: "700" },
  subCycle: { fontSize: 11, marginTop: 2 },
  flagRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  subFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 10,
  },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
});
