import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppContext, type ConnectedAccount } from "@/context/AppContext";
import { useConfirm } from "@/context/ConfirmContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

function formatCurrency(n: number) {
  if (n >= 0) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  return `-$${Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function AccountRow({ account }: { account: ConnectedAccount }) {
  const colors = useColors();
  const typeIcon: Record<string, React.ComponentProps<typeof Feather>["name"]> = {
    checking: "credit-card",
    savings: "shield",
    investment: "bar-chart-2",
    credit: "credit-card",
    mortgage: "home",
  };
  const icon = typeIcon[account.type] ?? "circle";
  const isNeg = account.balance < 0;

  return (
    <Pressable
      style={[styles.acctRow, { borderBottomColor: colors.border }]}
      onPress={() => {
        Haptics.selectionAsync();
        router.push({ pathname: "/account-detail", params: { id: account.id } });
      }}
    >
      <View style={[styles.acctIcon, { backgroundColor: colors.muted }]}>
        <Feather name={icon} size={16} color={colors.primary} />
      </View>
      <View style={styles.acctInfo}>
        <Text style={[styles.acctName, { color: colors.text }]}>{account.name}</Text>
        <Text style={[styles.acctInst, { color: colors.mutedForeground }]}>{account.institution} · synced {account.lastSync}</Text>
      </View>
      <Text style={[styles.acctBalance, { color: isNeg ? colors.caution : colors.navy }]}>
        {formatCurrency(account.balance)}
      </Text>
      <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
    </Pressable>
  );
}

function SettingRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
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
  icon: React.ComponentProps<typeof Feather>["name"];
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

const ALERT_OPTIONS = ["Real-time", "Daily digest", "Weekly digest", "Off"];
const RISK_OPTIONS = [
  { id: "conservative", label: "Conservative", sub: "Capital preservation, low volatility" },
  { id: "moderate", label: "Moderate", sub: "Balanced growth and stability" },
  { id: "moderate-aggressive", label: "Moderate Aggressive", sub: "Growth-leaning, some volatility" },
  { id: "aggressive", label: "Aggressive", sub: "Maximum growth, higher volatility" },
];
const REGION_OPTIONS = [
  { id: "us", label: "USD · United States", flag: "🇺🇸" },
  { id: "ca", label: "CAD · Canada", flag: "🇨🇦" },
  { id: "uk", label: "GBP · United Kingdom", flag: "🇬🇧" },
  { id: "eu", label: "EUR · European Union", flag: "🇪🇺" },
  { id: "au", label: "AUD · Australia", flag: "🇦🇺" },
];

type PickerKind = null | "alerts" | "risk" | "region";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { accounts, userName } = useAppContext();
  const { resetOnboarding, riskProfile, name } = useOnboarding();
  const confirm = useConfirm();

  const [quietAlerts, setQuietAlerts] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [mlConsent, setMlConsent] = useState(true);

  const [alertFreq, setAlertFreq] = useState("Weekly digest");
  const [risk, setRisk] = useState(riskProfile ?? "moderate");
  const [region, setRegion] = useState("us");
  const [picker, setPicker] = useState<PickerKind>(null);

  const displayName = name || userName;

  const riskCurrent = RISK_OPTIONS.find((r) => r.id === risk) ?? RISK_OPTIONS[1];
  const regionCurrent = REGION_OPTIONS.find((r) => r.id === region) ?? REGION_OPTIONS[0];

  const handleResetOnboarding = async () => {
    const ok = await confirm({
      title: "Restart onboarding?",
      message: "This will take you back through the setup flow. Your data won't be affected.",
      confirmText: "Restart",
      icon: "rotate-ccw",
    });
    if (!ok) return;
    await resetOnboarding();
    router.replace("/(onboarding)/welcome");
  };

  const handleDelete = async () => {
    const ok1 = await confirm({
      title: "Delete account?",
      message: "This permanently removes all goals, transactions, and preferences. This cannot be undone.",
      confirmText: "Continue",
      tone: "destructive",
      icon: "trash-2",
    });
    if (!ok1) return;
    const ok2 = await confirm({
      title: "Are you absolutely sure?",
      message: "Once deleted there's no recovery.",
      confirmText: "Delete forever",
      tone: "destructive",
      icon: "alert-triangle",
    });
    if (ok2) router.replace("/(onboarding)/welcome");
  };

  const handleExport = async () => {
    await confirm({
      title: "Export your data?",
      message: "We'll email a download link to sarah.chen@email.com within 24 hours.",
      confirmText: "Request export",
      icon: "download",
    });
  };

  const handleUpgrade = async () => {
    await confirm({
      title: "Upgrade to Align Plus",
      message: "Unlock unlimited goals, advanced scenarios, and priority support for $9/mo.",
      confirmText: "See plans",
      icon: "star",
    });
  };

  const closePicker = () => setPicker(null);

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{
          paddingTop: insets.top + (Platform.OS === "web" ? 67 : 20),
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
          <TouchableOpacity
            style={[styles.premiumBadge, { backgroundColor: colors.primary }]}
            onPress={handleUpgrade}
            activeOpacity={0.85}
          >
            <Text style={styles.premiumText}>Free</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.navy }]}>Connected Accounts</Text>
          <TouchableOpacity
            onPress={() => {
              Haptics.selectionAsync();
              router.push("/add-account");
            }}
          >
            <Text style={[styles.seeAll, { color: colors.primary }]}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { borderColor: colors.border }]}>
          {accounts.map((acct) => (
            <AccountRow key={acct.id} account={acct} />
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.navy }]}>Preferences</Text>
        </View>

        <View style={[styles.card, { borderColor: colors.border }]}>
          <ToggleRow icon="bell" label="Quiet alerts by default" value={quietAlerts} onChange={setQuietAlerts} />
          <ToggleRow icon="lock" label="Biometric login" value={biometric} onChange={setBiometric} />
          <SettingRow
            icon="target"
            label="Alert frequency"
            value={alertFreq}
            onPress={() => setPicker("alerts")}
          />
          <SettingRow
            icon="sliders"
            label="Risk profile"
            value={riskCurrent.label}
            onPress={() => setPicker("risk")}
          />
          <SettingRow
            icon="globe"
            label="Currency & region"
            value={regionCurrent.label.split(" · ")[0]}
            onPress={() => setPicker("region")}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.navy }]}>Privacy & Data</Text>
        </View>

        <View style={[styles.card, { borderColor: colors.border }]}>
          <ToggleRow icon="cpu" label="Allow anonymized ML training" value={mlConsent} onChange={setMlConsent} />
          <SettingRow
            icon="eye"
            label="What data we hold"
            onPress={() => router.push({ pathname: "/info-detail", params: { topic: "what-data" } })}
          />
          <SettingRow icon="download" label="Export my data" onPress={handleExport} />
          <SettingRow
            icon="book-open"
            label="Privacy policy"
            onPress={() => router.push({ pathname: "/info-detail", params: { topic: "privacy-policy" } })}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.navy }]}>About</Text>
        </View>

        <View style={[styles.card, { borderColor: colors.border }]}>
          <SettingRow
            icon="book"
            label="Goal Alignment methodology"
            onPress={() => router.push({ pathname: "/info-detail", params: { topic: "alignment-methodology" } })}
          />
          <SettingRow
            icon="cpu"
            label="How AI guidance works"
            onPress={() => router.push({ pathname: "/info-detail", params: { topic: "ai-guidance" } })}
          />
          <SettingRow
            icon="shield"
            label="Security practices"
            onPress={() => router.push({ pathname: "/info-detail", params: { topic: "security" } })}
          />
          <SettingRow
            icon="help-circle"
            label="Support"
            onPress={() => router.push({ pathname: "/info-detail", params: { topic: "support" } })}
          />
          <SettingRow icon="rotate-ccw" label="Restart onboarding" onPress={handleResetOnboarding} />
        </View>

        <TouchableOpacity
          style={[styles.deleteRow, { borderColor: colors.destructive }]}
          onPress={handleDelete}
          activeOpacity={0.85}
        >
          <Feather name="trash-2" size={16} color={colors.destructive} />
          <Text style={[styles.deleteText, { color: colors.destructive }]}>Delete account</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>
          Align v1.0.0 · Educational reference, not personalized investment advice.
        </Text>
      </ScrollView>

      <Modal visible={picker !== null} transparent animationType="slide" onRequestClose={closePicker}>
        <Pressable style={styles.sheetBackdrop} onPress={closePicker}>
          <Pressable
            style={[
              styles.sheet,
              { backgroundColor: colors.background, paddingBottom: insets.bottom + 24 },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.navy }]}>
                {picker === "alerts" ? "Alert frequency" : picker === "risk" ? "Risk profile" : "Currency & region"}
              </Text>
              <TouchableOpacity
                onPress={closePicker}
                hitSlop={10}
                style={[styles.sheetCloseBtn, { backgroundColor: colors.muted }]}
              >
                <Feather name="x" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>

            {picker === "alerts" &&
              ALERT_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.optRow, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setAlertFreq(opt);
                    closePicker();
                  }}
                >
                  <Text style={[styles.optLabel, { color: colors.text }]}>{opt}</Text>
                  {alertFreq === opt && <Feather name="check" size={18} color={colors.primary} />}
                </TouchableOpacity>
              ))}

            {picker === "risk" &&
              RISK_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.optRow, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setRisk(opt.id as typeof risk);
                    closePicker();
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optLabel, { color: colors.text }]}>{opt.label}</Text>
                    <Text style={[styles.optSub, { color: colors.mutedForeground }]}>{opt.sub}</Text>
                  </View>
                  {risk === opt.id && <Feather name="check" size={18} color={colors.primary} />}
                </TouchableOpacity>
              ))}

            {picker === "region" &&
              REGION_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.optRow, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setRegion(opt.id);
                    closePicker();
                  }}
                >
                  <Text style={{ fontSize: 22, marginRight: 12 }}>{opt.flag}</Text>
                  <Text style={[styles.optLabel, { color: colors.text, flex: 1 }]}>{opt.label}</Text>
                  {region === opt.id && <Feather name="check" size={18} color={colors.primary} />}
                </TouchableOpacity>
              ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
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
  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15,42,74,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxHeight: "86%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  sheetTitle: { fontSize: 18, fontWeight: "700" },
  sheetCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  optRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optLabel: { fontSize: 15, fontWeight: "600" },
  optSub: { fontSize: 12, marginTop: 2 },
});
