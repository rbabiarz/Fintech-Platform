import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const POPULAR = [
  { id: "chase", name: "Chase", color: "#117ACA" },
  { id: "bofa", name: "Bank of America", color: "#E31837" },
  { id: "wells", name: "Wells Fargo", color: "#D71E28" },
  { id: "citi", name: "Citi", color: "#003B70" },
  { id: "amex", name: "American Express", color: "#006FCF" },
  { id: "capital-one", name: "Capital One", color: "#D03027" },
  { id: "vanguard", name: "Vanguard", color: "#96151D" },
  { id: "fidelity", name: "Fidelity", color: "#388638" },
  { id: "schwab", name: "Schwab", color: "#00A0DF" },
  { id: "marcus", name: "Marcus by Goldman", color: "#7B6CD9" },
  { id: "ally", name: "Ally Bank", color: "#6A1B9A" },
  { id: "sofi", name: "SoFi", color: "#00A6CA" },
];

const TYPES = [
  { id: "bank", icon: "credit-card" as const, label: "Bank account", sub: "Checking, savings, money market" },
  { id: "credit", icon: "credit-card" as const, label: "Credit card", sub: "Visa, Mastercard, Amex" },
  { id: "investment", icon: "bar-chart-2" as const, label: "Investment", sub: "Brokerage, IRA, 401(k)" },
  { id: "mortgage", icon: "home" as const, label: "Loan or mortgage", sub: "Mortgage, auto, student" },
  { id: "crypto", icon: "trending-up" as const, label: "Crypto wallet", sub: "Coinbase, Kraken, Gemini" },
];

export default function AddAccountScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const filtered = POPULAR.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Feather name="x" size={22} color={colors.navy} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.navy }]}>Connect an account</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.intro, { backgroundColor: colors.navy }]}>
          <View style={[styles.introIcon, { backgroundColor: "rgba(178,223,219,0.18)" }]}>
            <Feather name="link" size={18} color="#B2DFDB" />
          </View>
          <Text style={styles.introTitle}>Powered by Plaid</Text>
          <Text style={styles.introBody}>
            We use bank-grade encryption and never see your login. Your credentials go directly to your institution.
          </Text>
        </View>

        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            placeholder="Search 12,000+ institutions"
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            style={[styles.searchInput, { color: colors.text }]}
          />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Account type</Text>
        <View style={[styles.typeGrid]}>
          {TYPES.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.typeCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.85}
              onPress={() => Haptics.selectionAsync()}
            >
              <View style={[styles.typeIcon, { backgroundColor: "#EBF8F8" }]}>
                <Feather name={t.icon} size={16} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.typeLabel, { color: colors.text }]}>{t.label}</Text>
                <Text style={[styles.typeSub, { color: colors.mutedForeground }]}>{t.sub}</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          {query ? `${filtered.length} match${filtered.length === 1 ? "" : "es"}` : "Popular institutions"}
        </Text>
        {filtered.length === 0 ? (
          <View style={[styles.empty, { borderColor: colors.border }]}>
            <Feather name="search" size={20} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No matches. Try a different name, or contact support to request an institution.
            </Text>
          </View>
        ) : (
          filtered.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.instRow, { backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.85}
              onPress={() => {
                Haptics.selectionAsync();
                router.back();
              }}
            >
              <View style={[styles.instLogo, { backgroundColor: p.color }]}>
                <Text style={styles.instLogoText}>{p.name.charAt(0)}</Text>
              </View>
              <Text style={[styles.instName, { color: colors.text }]}>{p.name}</Text>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ))
        )}
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
  intro: { borderRadius: 16, padding: 16, marginBottom: 18 },
  introIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  introTitle: { color: "#fff", fontSize: 15, fontWeight: "700", marginBottom: 4 },
  introBody: { color: "#B2DFDB", fontSize: 13, lineHeight: 19 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 18,
  },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 2 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 4,
  },
  typeGrid: { gap: 8, marginBottom: 22 },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  typeIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  typeLabel: { fontSize: 14, fontWeight: "700" },
  typeSub: { fontSize: 12, marginTop: 2 },
  instRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  instLogo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  instLogoText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  instName: { flex: 1, fontSize: 14, fontWeight: "600" },
  empty: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  emptyText: { fontSize: 13, textAlign: "center", lineHeight: 19 },
});
