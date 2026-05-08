import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppContext } from "@/context/AppContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

function formatCurrency(n: number) {
  if (n >= 0) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  return `-$${Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function AccountRow({
  institution,
  name,
  type,
  balance,
  lastSync,
}: {
  institution: string;
  name: string;
  type: string;
  balance: number;
  lastSync: string;
}) {
  const colors = useColors();
  const typeIcon: Record<string, string> = {
    checking: "credit-card",
    savings: "shield",
    investment: "bar-chart-2",
    credit: "credit-card",
    mortgage: "home",
  };
  const icon = (typeIcon[type] ?? "circle") as any;
  const isNeg = balance < 0;

  return (
    <View style={[styles.acctRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.acctIcon, { backgroundColor: colors.muted }]}>
        <Feather name={icon} size={16} color={colors.primary} />
      </View>
      <View style={styles.acctInfo}>
        <Text style={[styles.acctName, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.acctInst, { color: colors.mutedForeground }]}>{institution} · synced {lastSync}</Text>
      </View>
      <Text style={[styles.acctBalance, { color: isNeg ? colors.caution : colors.navy }]}>
        {formatCurrency(balance)}
      </Text>
    </View>
  );
}

function SettingRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: any;
  label: string;
  value?: string;
  onPress?: () => void;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[styles.settingRow, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIcon, { backgroundColor: colors.muted }]}>
        <Feather name={icon} size={16} color={colors.primary} />
      </View>
      <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
      {value && <Text style={[styles.settingValue, { color: colors.mutedForeground }]}>{value}</Text>}
      <Feather name="chevron-right" size={16} color={colors.border} />
    </TouchableOpacity>
  );
}

function ToggleRow({
  icon,
  label,
  value,
  onChange,
}: {
  icon: any;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const colors = useColors();
  return (
    <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.settingIcon, { backgroundColor: colors.muted }]}>
        <Feather name={icon} size={16} color={colors.primary} />
      </View>
      <Text style={[styles.settingLabel, { color: colors.text, flex: 1 }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#fff"
      />
    </View>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { accounts, userName } = useAppContext();
  const { resetOnboarding, riskProfile, name } = useOnboarding();

  const [quietAlerts, setQuietAlerts] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [mlConsent, setMlConsent] = useState(true);

  const displayName = name || userName;

  const riskLabel: Record<string, string> = {
    conservative: "Conservative",
    moderate: "Moderate",
    "moderate-aggressive": "Moderate Aggressive",
    aggressive: "Aggressive",
  };

  const handleResetOnboarding = () => {
    if (Platform.OS === "web") {
      resetOnboarding().then(() => router.replace("/(onboarding)/welcome"));
      return;
    }
    Alert.alert(
      "Restart onboarding?",
      "This will take you back through the setup flow. Your data won't be affected.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restart",
          onPress: () => resetOnboarding().then(() => router.replace("/(onboarding)/welcome")),
        },
      ]
    );
  };

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
        <Text style={[styles.headline, { color: colors.navy }]}>Profile</Text>
      </View>

      <View style={[styles.avatarCard, { backgroundColor: colors.navy }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.avatarName, { color: "#fff" }]}>{displayName} Chen</Text>
          <Text style={[styles.avatarEmail, { color: colors.primaryTint }]}>sarah.chen@email.com</Text>
        </View>
        <View style={[styles.premiumBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.premiumText}>Free</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.navy }]}>Connected Accounts</Text>
        <TouchableOpacity>
          <Text style={[styles.seeAll, { color: colors.primary }]}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { borderColor: colors.border }]}>
        {accounts.map((acct) => (
          <AccountRow key={acct.id} {...acct} />
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.navy }]}>Preferences</Text>
      </View>

      <View style={[styles.card, { borderColor: colors.border }]}>
        <ToggleRow icon="bell" label="Quiet alerts by default" value={quietAlerts} onChange={setQuietAlerts} />
        <ToggleRow icon="lock" label="Biometric login" value={biometric} onChange={setBiometric} />
        <SettingRow icon="target" label="Alert frequency" value="Weekly digest" />
        <SettingRow icon="sliders" label="Risk profile" value={riskLabel[riskProfile ?? "moderate"] ?? "Moderate"} />
        <SettingRow icon="globe" label="Currency & region" value="USD · US" />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.navy }]}>Privacy & Data</Text>
      </View>

      <View style={[styles.card, { borderColor: colors.border }]}>
        <ToggleRow icon="cpu" label="Allow anonymized ML training" value={mlConsent} onChange={setMlConsent} />
        <SettingRow icon="eye" label="What data we hold" />
        <SettingRow icon="download" label="Export my data" />
        <SettingRow icon="book-open" label="Privacy policy" />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.navy }]}>About</Text>
      </View>

      <View style={[styles.card, { borderColor: colors.border }]}>
        <SettingRow icon="book" label="Goal Alignment methodology" />
        <SettingRow icon="cpu" label="How AI guidance works" />
        <SettingRow icon="shield" label="Security practices" />
        <SettingRow icon="help-circle" label="Support" />
        <SettingRow icon="rotate-ccw" label="Restart onboarding" onPress={handleResetOnboarding} />
      </View>

      <TouchableOpacity style={[styles.deleteRow, { borderColor: colors.destructive }]}>
        <Feather name="trash-2" size={16} color={colors.destructive} />
        <Text style={[styles.deleteText, { color: colors.destructive }]}>Delete account</Text>
      </TouchableOpacity>

      <Text style={[styles.version, { color: colors.mutedForeground }]}>
        Align v1.0.0 · Educational reference, not personalized investment advice.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSection: { paddingHorizontal: 20, paddingBottom: 14 },
  headline: { fontSize: 28, fontWeight: "700" },
  avatarCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 22, fontWeight: "700", color: "#fff" },
  avatarName: { fontSize: 17, fontWeight: "700" },
  avatarEmail: { fontSize: 13, marginTop: 2 },
  premiumBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 4,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700" },
  seeAll: { fontSize: 14, fontWeight: "500" },
  card: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  acctRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
  },
  acctIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  acctInfo: { flex: 1 },
  acctName: { fontSize: 14, fontWeight: "600" },
  acctInst: { fontSize: 12, marginTop: 2 },
  acctBalance: { fontSize: 14, fontWeight: "700" },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
  },
  settingIcon: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  settingLabel: { flex: 1, fontSize: 14 },
  settingValue: { fontSize: 13 },
  deleteRow: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },
  deleteText: { fontSize: 14, fontWeight: "600" },
  version: { textAlign: "center", fontSize: 11, marginBottom: 8 },
});
