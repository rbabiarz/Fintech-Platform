import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useOnboarding } from "@/context/OnboardingContext";
import { useColors } from "@/hooks/useColors";

function StepBar({ step, total }: { step: number; total: number }) {
  const colors = useColors();
  return (
    <View style={styles.stepBarWrap}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.stepSegment, { backgroundColor: i < step ? colors.primary : colors.border }]} />
      ))}
    </View>
  );
}

const INSTITUTIONS = [
  { id: "chase", name: "Chase", icon: "credit-card", type: "Bank", accounts: ["Sapphire Checking", "Savings"] },
  { id: "amex", name: "American Express", icon: "credit-card", type: "Credit Card", accounts: ["Gold Card"] },
  { id: "vanguard", name: "Vanguard", icon: "bar-chart-2", type: "Investment", accounts: ["Brokerage", "Roth IRA"] },
  { id: "marcus", name: "Marcus by Goldman", icon: "shield", type: "Savings", accounts: ["High-Yield Savings"] },
  { id: "fidelity", name: "Fidelity", icon: "bar-chart-2", type: "Investment", accounts: ["401(k)", "HSA"] },
  { id: "bofa", name: "Bank of America", icon: "home", type: "Bank", accounts: ["Checking", "Savings"] },
];

type LinkState = "idle" | "connecting" | "connected";

export default function LinkScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setField, linkedAccounts } = useOnboarding();
  const [linkStates, setLinkStates] = useState<Record<string, LinkState>>({});

  const handleLink = (id: string) => {
    if (linkStates[id] === "connected") {
      setLinkStates((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setField("linkedAccounts", linkedAccounts.filter((a) => a !== id));
      return;
    }
    Haptics.selectionAsync();
    setLinkStates((prev) => ({ ...prev, [id]: "connecting" }));
    setTimeout(() => {
      setLinkStates((prev) => ({ ...prev, [id]: "connected" }));
      setField("linkedAccounts", [...linkedAccounts, id]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1400);
  };

  const connectedCount = Object.values(linkStates).filter((s) => s === "connected").length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Feather name="arrow-left" size={22} color={colors.navy} />
        </TouchableOpacity>
        <StepBar step={3} total={5} />
        <Text style={[styles.stepLabel, { color: colors.mutedForeground }]}>Step 3 of 5</Text>
        <Text style={[styles.headline, { color: colors.navy }]}>Connect your accounts</Text>
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: 16, paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Link at least one account so Align can build your personalized financial picture. The more you link, the clearer the view.
        </Text>

        <View style={[styles.securityNote, { backgroundColor: "#EBF8F8", borderColor: colors.primary }]}>
          <Feather name="lock" size={14} color={colors.primary} />
          <Text style={[styles.securityText, { color: colors.text }]}>
            Read-only access via bank-grade encryption. We never store your login credentials.
          </Text>
        </View>

        <View style={styles.institutionList}>
          {INSTITUTIONS.map((inst) => {
            const state = linkStates[inst.id] ?? "idle";
            const isConnected = state === "connected";
            const isConnecting = state === "connecting";

            return (
              <View
                key={inst.id}
                style={[
                  styles.institutionCard,
                  {
                    borderColor: isConnected ? colors.primary : colors.border,
                    backgroundColor: colors.card,
                    borderWidth: isConnected ? 1.5 : 1,
                  },
                ]}
              >
                <View style={[styles.instIcon, { backgroundColor: isConnected ? "#EBF8F8" : colors.muted }]}>
                  <Feather name={inst.icon as any} size={18} color={isConnected ? colors.primary : colors.mutedForeground} />
                </View>
                <View style={styles.instInfo}>
                  <Text style={[styles.instName, { color: colors.navy }]}>{inst.name}</Text>
                  <Text style={[styles.instType, { color: colors.mutedForeground }]}>
                    {isConnected ? inst.accounts.join(", ") : inst.type}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.linkBtn,
                    {
                      backgroundColor: isConnected ? colors.successLight : isConnecting ? colors.muted : "#EBF8F8",
                      borderColor: isConnected ? colors.success : isConnecting ? colors.border : colors.primary,
                    },
                  ]}
                  onPress={() => handleLink(inst.id)}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <>
                      <Feather
                        name={isConnected ? "check" : "plus"}
                        size={14}
                        color={isConnected ? colors.success : colors.primary}
                      />
                      <Text style={[styles.linkBtnText, { color: isConnected ? colors.success : colors.primary }]}>
                        {isConnected ? "Linked" : "Link"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + 16 },
        ]}
      >
        {connectedCount > 0 && (
          <Text style={[styles.connectedCount, { color: colors.primary }]}>
            {connectedCount} account{connectedCount !== 1 ? "s" : ""} linked
          </Text>
        )}
        <TouchableOpacity
          style={[
            styles.primaryBtn,
            { backgroundColor: connectedCount > 0 ? colors.navy : colors.border },
          ]}
          onPress={() => router.push("/(onboarding)/risk")}
          disabled={connectedCount === 0}
        >
          <Text style={[styles.primaryBtnText, { color: connectedCount > 0 ? "#fff" : colors.mutedForeground }]}>
            {connectedCount > 0 ? "Continue" : "Link at least one account"}
          </Text>
          {connectedCount > 0 && <Feather name="arrow-right" size={18} color="#fff" />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(onboarding)/risk")} style={styles.skipBtn}>
          <Text style={[styles.skipText, { color: colors.mutedForeground }]}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 24 },
  header: { paddingHorizontal: 24, paddingBottom: 14, borderBottomWidth: 1 },
  back: { marginBottom: 12, width: 36 },
  stepBarWrap: { flexDirection: "row", gap: 4, marginBottom: 14 },
  stepSegment: { flex: 1, height: 4, borderRadius: 2 },
  stepLabel: { fontSize: 13, fontWeight: "500", marginBottom: 6 },
  headline: { fontSize: 28, fontWeight: "800", letterSpacing: -0.5, marginBottom: 8 },
  sub: { fontSize: 15, lineHeight: 22, marginBottom: 16 },
  securityNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  securityText: { fontSize: 13, lineHeight: 18, flex: 1 },
  institutionList: { gap: 10 },
  institutionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    padding: 14,
  },
  instIcon: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  instInfo: { flex: 1 },
  instName: { fontSize: 14, fontWeight: "700" },
  instType: { fontSize: 12, marginTop: 2 },
  linkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 68,
    justifyContent: "center",
    minHeight: 34,
  },
  linkBtnText: { fontSize: 13, fontWeight: "700" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 24,
    paddingTop: 14,
    gap: 8,
  },
  connectedCount: { fontSize: 13, fontWeight: "600", textAlign: "center" },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 17,
  },
  primaryBtnText: { fontSize: 16, fontWeight: "700" },
  skipBtn: { alignItems: "center", paddingVertical: 6 },
  skipText: { fontSize: 14 },
});
