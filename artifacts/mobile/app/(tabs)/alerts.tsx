import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
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

import { useAppContext, type Alert } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

function routeForAlert(alert: Alert) {
  const label = alert.actionLabel?.toLowerCase() ?? "";
  if (label === "see impact") {
    router.push({ pathname: "/alert-impact", params: { id: alert.id } });
    return;
  }
  if (label === "view goal" || label === "adjust goal") {
    if (alert.goalId) {
      router.push({ pathname: "/goal-editor", params: { id: alert.goalId } });
      return;
    }
  }
  if (label === "review") {
    router.push("/subscriptions-detail");
    return;
  }
  if (alert.goalId) {
    router.push({ pathname: "/goal-editor", params: { id: alert.goalId } });
    return;
  }
  router.push({ pathname: "/alert-impact", params: { id: alert.id } });
}

const ALERT_CONFIG = {
  nudge: { icon: "zap" as const, color: "#2C7A7B", bg: "#EBF8F8" },
  celebration: { icon: "star" as const, color: "#15803D", bg: "#DCFCE7" },
  warning: { icon: "alert-circle" as const, color: "#B45309", bg: "#FEF3C7" },
  info: { icon: "info" as const, color: "#64748B", bg: "#F0EDEA" },
};

function AlertCard({ alert, onOpen }: { alert: Alert; onOpen: () => void }) {
  const colors = useColors();
  const cfg = ALERT_CONFIG[alert.type];
  const isNew = !alert.read;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.alertCard,
        {
          backgroundColor: pressed ? colors.muted : colors.card,
          borderColor: isNew ? cfg.color : colors.border,
          borderWidth: isNew ? 1.5 : 1,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
      onPress={() => {
        Haptics.selectionAsync();
        onOpen();
      }}
    >
      {isNew && (
        <View style={[styles.newDot, { backgroundColor: cfg.color }]} />
      )}
      <View style={[styles.alertIcon, { backgroundColor: cfg.bg }]}>
        <Feather name={cfg.icon} size={18} color={cfg.color} />
      </View>
      <View style={styles.alertContent}>
        <Text style={[styles.alertTitle, { color: colors.navy }]}>{alert.title}</Text>
        <Text style={[styles.alertBody, { color: colors.text }]} numberOfLines={3}>
          {alert.body}
        </Text>
        <View style={styles.alertFooter}>
          <Text style={[styles.alertDate, { color: colors.mutedForeground }]}>{formatDate(alert.date)}</Text>
          {alert.actionLabel && (
            <TouchableOpacity
              hitSlop={8}
              onPress={(e) => {
                e.stopPropagation();
                Haptics.selectionAsync();
                onOpen();
              }}
            >
              <Text style={[styles.alertAction, { color: cfg.color }]}>{alert.actionLabel} →</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Pressable>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AlertsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { alerts, markAlertRead } = useAppContext();

  const unread = alerts.filter((a) => !a.read);
  const read = alerts.filter((a) => a.read);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: insets.top + (Platform.OS === "web" ? 67 : 20),
        paddingBottom: insets.bottom + 100,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerSection}>
        <Text style={[styles.headline, { color: colors.navy }]}>Alerts</Text>
        {unread.length > 0 && (
          <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.unreadCount}>{unread.length}</Text>
          </View>
        )}
      </View>

      {unread.length === 0 && (
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="check-circle" size={32} color={colors.success} />
          <Text style={[styles.emptyTitle, { color: colors.navy }]}>All caught up</Text>
          <Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>
            No new alerts. We'll only notify you when something genuinely matters.
          </Text>
        </View>
      )}

      {unread.length > 0 && (
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>New</Text>
      )}
      {unread.map((a) => (
        <AlertCard
          key={a.id}
          alert={a}
          onOpen={() => {
            markAlertRead(a.id);
            routeForAlert(a);
          }}
        />
      ))}

      {read.length > 0 && (
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Earlier</Text>
      )}
      {read.map((a) => (
        <AlertCard key={a.id} alert={a} onOpen={() => routeForAlert(a)} />
      ))}

      <View style={[styles.settingsHint, { backgroundColor: colors.muted }]}>
        <Feather name="bell" size={14} color={colors.mutedForeground} />
        <Text style={[styles.settingsHintText, { color: colors.mutedForeground }]}>
          Alerts are quiet by default. We only surface what genuinely affects your goals.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headline: { fontSize: 28, fontWeight: "700" },
  unreadBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadCount: { color: "#fff", fontSize: 12, fontWeight: "700" },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 4,
  },
  alertCard: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    position: "relative",
  },
  newDot: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: 15, fontWeight: "700", marginBottom: 4 },
  alertBody: { fontSize: 13, lineHeight: 19, marginBottom: 8 },
  alertFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  alertDate: { fontSize: 12 },
  alertAction: { fontSize: 12, fontWeight: "600" },
  emptyCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 14,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: { fontSize: 17, fontWeight: "700" },
  emptyBody: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  settingsHint: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  settingsHintText: { fontSize: 12, lineHeight: 18, flex: 1 },
});
