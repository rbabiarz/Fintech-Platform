import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppContext } from "@/context/AppContext";
import { useConfirm } from "@/context/ConfirmContext";
import { useColors } from "@/hooks/useColors";

const TYPE_LABEL: Record<string, string> = {
  checking: "Checking",
  savings: "Savings",
  investment: "Investment",
  credit: "Credit card",
  mortgage: "Mortgage",
};

const TYPE_ICON: Record<string, React.ComponentProps<typeof Feather>["name"]> = {
  checking: "credit-card",
  savings: "shield",
  investment: "bar-chart-2",
  credit: "credit-card",
  mortgage: "home",
};

function formatCurrency(n: number) {
  if (n < 0) return `−$${Math.abs(n).toLocaleString()}`;
  return `$${n.toLocaleString()}`;
}

export default function AccountDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { accounts } = useAppContext();
  const confirm = useConfirm();
  const params = useLocalSearchParams<{ id?: string }>();

  const account = accounts.find((a) => a.id === params.id) ?? accounts[0];
  const isNeg = account.balance < 0;

  const [includeNetWorth, setIncludeNetWorth] = useState(true);
  const [includeAlerts, setIncludeAlerts] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    Haptics.selectionAsync();
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1200);
  };

  const handleDisconnect = async () => {
    const ok = await confirm({
      title: "Disconnect account?",
      message: `${account.institution} ${account.name} will stop syncing. You can re-link it any time.`,
      confirmText: "Disconnect",
      tone: "destructive",
      icon: "link-2",
    });
    if (ok) router.back();
  };

  const meta = [
    { label: "Institution", value: account.institution },
    { label: "Account type", value: TYPE_LABEL[account.type] ?? account.type },
    { label: "Last sync", value: account.lastSync },
    { label: "Connection", value: "Plaid · read-only" },
    { label: "Linked since", value: "Mar 12, 2024" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Feather name="x" size={22} color={colors.navy} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.navy }]} numberOfLines={1}>
          {account.name}
        </Text>
        <TouchableOpacity onPress={handleSync} style={styles.iconBtn}>
          <Feather name="refresh-cw" size={18} color={colors.navy} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.summary, { backgroundColor: colors.navy }]}>
          <View style={[styles.summaryIcon, { backgroundColor: "rgba(178,223,219,0.18)" }]}>
            <Feather name={TYPE_ICON[account.type] ?? "circle"} size={20} color="#B2DFDB" />
          </View>
          <Text style={styles.summaryInst}>{account.institution}</Text>
          <Text style={styles.summaryName}>{account.name}</Text>
          <Text style={styles.summaryBalance}>{formatCurrency(account.balance)}</Text>
          <Text style={styles.summarySub}>
            {syncing ? "Syncing now…" : `Last synced ${account.lastSync}`}
          </Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Account info</Text>
        <View style={[styles.metaCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {meta.map((m, i) => (
            <View
              key={m.label}
              style={[
                styles.metaRow,
                i < meta.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>{m.label}</Text>
              <Text style={[styles.metaValue, { color: isNeg && m.label === "Account type" ? colors.text : colors.text }]}>
                {m.value}
              </Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Settings</Text>
        <View style={[styles.metaCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.toggleRow, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>Include in net worth</Text>
              <Text style={[styles.toggleSub, { color: colors.mutedForeground }]}>
                Shown in your top-line balance and goal mapping
              </Text>
            </View>
            <Switch
              value={includeNetWorth}
              onValueChange={setIncludeNetWorth}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>Get alerts for this account</Text>
              <Text style={[styles.toggleSub, { color: colors.mutedForeground }]}>
                Low balance, big transactions, recurring charges
              </Text>
            </View>
            <Switch
              value={includeAlerts}
              onValueChange={setIncludeAlerts}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.disconnectBtn, { borderColor: colors.destructive }]}
          onPress={handleDisconnect}
          activeOpacity={0.85}
        >
          <Feather name="link-2" size={16} color={colors.destructive} />
          <Text style={[styles.disconnectText, { color: colors.destructive }]}>Disconnect account</Text>
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
  summary: { borderRadius: 16, padding: 20, marginBottom: 18 },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  summaryInst: { color: "#B2DFDB", fontSize: 12, fontWeight: "700", letterSpacing: 0.5 },
  summaryName: { color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 2 },
  summaryBalance: { color: "#fff", fontSize: 32, fontWeight: "700", marginTop: 14 },
  summarySub: { color: "#B2DFDB", fontSize: 12, marginTop: 4 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 4,
  },
  metaCard: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, marginBottom: 18 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  metaLabel: { fontSize: 13 },
  metaValue: { fontSize: 13, fontWeight: "700" },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  toggleLabel: { fontSize: 14, fontWeight: "600" },
  toggleSub: { fontSize: 12, marginTop: 2 },
  disconnectBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginTop: 4,
  },
  disconnectText: { fontSize: 14, fontWeight: "700" },
});
