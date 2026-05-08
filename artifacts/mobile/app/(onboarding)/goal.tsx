import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

const GOAL_TEMPLATES = [
  { id: "home", emoji: "🏡", label: "Home purchase", amount: 120000, years: 2 },
  { id: "retirement", emoji: "🌅", label: "Early retirement", amount: 1500000, years: 16 },
  { id: "emergency", emoji: "🛡️", label: "Emergency fund", amount: 20000, years: 1 },
  { id: "education", emoji: "🎓", label: "Education / college", amount: 80000, years: 9 },
  { id: "travel", emoji: "✈️", label: "Sabbatical / travel", amount: 30000, years: 2 },
  { id: "family", emoji: "👨‍👩‍👧", label: "Family & caregiving", amount: 50000, years: 3 },
  { id: "business", emoji: "💼", label: "Start a business", amount: 75000, years: 3 },
  { id: "custom", emoji: "⭐", label: "Something else", amount: 50000, years: 5 },
];

const AMOUNTS = [10000, 20000, 50000, 100000, 200000, 500000, 1000000, 1500000];

function formatCurrency(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

export default function GoalScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setField, goalTitle, goalEmoji, goalTarget, goalCategory } = useOnboarding();

  const [selected, setSelected] = useState(goalCategory || "home");
  const [amount, setAmount] = useState(goalTarget);
  const [customTitle, setCustomTitle] = useState(goalTitle);
  const [focused, setFocused] = useState(false);

  const template = GOAL_TEMPLATES.find((t) => t.id === selected);

  const handleContinue = () => {
    const t = GOAL_TEMPLATES.find((t) => t.id === selected)!;
    setField("goalCategory", selected);
    setField("goalEmoji", t.emoji);
    setField("goalTitle", customTitle || t.label);
    setField("goalTarget", amount);
    const targetDate = new Date();
    targetDate.setFullYear(targetDate.getFullYear() + (t.years || 5));
    setField("goalDate", targetDate.toISOString().split("T")[0]);
    router.push("/(onboarding)/link");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Feather name="arrow-left" size={22} color={colors.navy} />
        </TouchableOpacity>
        <StepBar step={2} total={5} />
        <Text style={[styles.stepLabel, { color: colors.mutedForeground }]}>Step 2 of 5</Text>
        <Text style={[styles.headline, { color: colors.navy }]}>What are you working toward?</Text>
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: 16, paddingBottom: insets.bottom + 130 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Pick your first life goal. You can add more anytime.
        </Text>

        <View style={styles.grid}>
          {GOAL_TEMPLATES.map((tmpl) => (
            <Pressable
              key={tmpl.id}
              style={[
                styles.templateCard,
                {
                  borderColor: selected === tmpl.id ? colors.primary : colors.border,
                  backgroundColor: selected === tmpl.id ? "#EBF8F8" : colors.card,
                  borderWidth: selected === tmpl.id ? 2 : 1,
                },
              ]}
              onPress={() => {
                setSelected(tmpl.id);
                setAmount(tmpl.amount);
                if (tmpl.id !== "custom") setCustomTitle(tmpl.label);
              }}
            >
              <Text style={styles.tmplEmoji}>{tmpl.emoji}</Text>
              <Text
                style={[
                  styles.tmplLabel,
                  { color: selected === tmpl.id ? colors.primary : colors.text },
                ]}
                numberOfLines={2}
              >
                {tmpl.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {selected === "custom" && (
          <>
            <Text style={[styles.label, { color: colors.text }]}>Name your goal</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: focused ? colors.primary : colors.border,
                  backgroundColor: colors.card,
                  color: colors.text,
                },
              ]}
              placeholder="e.g. Buy a camper van"
              placeholderTextColor={colors.mutedForeground}
              value={customTitle}
              onChangeText={setCustomTitle}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </>
        )}

        <Text style={[styles.label, { color: colors.text }]}>Target amount</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.amountScroll}
          contentContainerStyle={styles.amountRow}
        >
          {AMOUNTS.map((a) => (
            <TouchableOpacity
              key={a}
              style={[
                styles.amountChip,
                {
                  borderColor: amount === a ? colors.primary : colors.border,
                  backgroundColor: amount === a ? "#EBF8F8" : colors.card,
                  borderWidth: amount === a ? 2 : 1,
                },
              ]}
              onPress={() => setAmount(a)}
            >
              <Text style={[styles.amountText, { color: amount === a ? colors.primary : colors.text }]}>
                {formatCurrency(a)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.previewCard, { backgroundColor: colors.navy }]}>
          <Text style={styles.previewEmoji}>{template?.emoji ?? "⭐"}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.previewTitle, { color: "#fff" }]}>
              {customTitle || template?.label}
            </Text>
            <Text style={[styles.previewSub, { color: "#B2DFDB" }]}>
              {formatCurrency(amount)} · {new Date().getFullYear() + (template?.years ?? 5)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.navy }]}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Continue</Text>
          <Feather name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 24 },
  header: { paddingHorizontal: 24, paddingBottom: 14, borderBottomWidth: 1 },
  back: { marginBottom: 12, width: 36 },
  stepBarWrap: { flexDirection: "row", gap: 4 },
  stepSegment: { flex: 1, height: 4, borderRadius: 2 },
  stepLabel: { fontSize: 13, fontWeight: "500", marginBottom: 6 },
  headline: { fontSize: 28, fontWeight: "800", letterSpacing: -0.5, marginBottom: 8 },
  sub: { fontSize: 15, lineHeight: 22, marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  templateCard: {
    width: "47%",
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  tmplEmoji: { fontSize: 26 },
  tmplLabel: { fontSize: 13, fontWeight: "600", lineHeight: 18 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 14,
  },
  amountScroll: { marginHorizontal: -24, marginBottom: 20 },
  amountRow: { flexDirection: "row", gap: 8, paddingHorizontal: 24 },
  amountChip: { borderRadius: 20, paddingVertical: 10, paddingHorizontal: 16, borderWidth: 1 },
  amountText: { fontSize: 14, fontWeight: "700" },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
  },
  previewEmoji: { fontSize: 32 },
  previewTitle: { fontSize: 16, fontWeight: "700" },
  previewSub: { fontSize: 13, marginTop: 3 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 17,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 24,
    paddingTop: 14,
  },
});
