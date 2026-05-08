import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Modal,
  Pressable,
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
  const [confirmTarget, setConfirmTarget] = useState<Sub | null>(null);

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
    Haptics.selectionAsync();
    setConfirmTarget(sub);
  };

  const confirmCancel = () => {
    if (!confirmTarget) return;
    setSubs((prev) => prev.filter((s) => s.id !== confirmTarget.id));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setConfirmTarget(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 56 : 12), borderBottomColor: colors.border }]}>
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

      <Modal
        visible={confirmTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmTarget(null)}
      >
        <Pressable style={styles.backdrop} onPress={() => setConfirmTarget(null)}>
          <Pressable
            style={[styles.dialog, { backgroundColor: colors.card }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.dialogIcon, { backgroundColor: colors.cautionLight }]}>
              <Feather name="alert-triangle" size={22} color={colors.caution} />
            </View>
            <Text style={[styles.dialogTitle, { color: colors.navy }]}>
              Cancel {confirmTarget?.name}?
            </Text>
            <Text style={[styles.dialogBody, { color: colors.mutedForeground }]}>
              You'll save{" "}
              <Text style={{ fontWeight: "700", color: colors.text }}>
                ${((confirmTarget?.amount ?? 0) * 12).toFixed(0)}/yr
              </Text>
              . We'll guide you to {confirmTarget?.name}'s cancel page to finish the process.
            </Text>
            <View style={styles.dialogActions}>
              <TouchableOpacity
                style={[styles.dialogBtn, { backgroundColor: colors.muted }]}
                onPress={() => setConfirmTarget(null)}
                activeOpacity={0.85}
              >
                <Text style={{ color: colors.text, fontWeight: "700", fontSize: 14 }}>Not now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogBtn, { backgroundColor: colors.caution }]}
                onPress={confirmCancel}
                activeOpacity={0.85}
              >
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
                  Cancel subscription
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,42,74,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  dialog: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
  },
  dialogIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  dialogTitle: { fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  dialogBody: { fontSize: 13, lineHeight: 19, textAlign: "center", marginBottom: 20 },
  dialogActions: { flexDirection: "row", gap: 10, width: "100%" },
  dialogBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
  },
});
