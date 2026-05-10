import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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

import { useAppContext, type Goal, type GoalStatus } from "@/context/AppContext";
import { useConfirm } from "@/context/ConfirmContext";
import { useColors } from "@/hooks/useColors";

const GOAL_TEMPLATES = [
  { id: "home", emoji: "🏡", label: "Home purchase", years: 2 },
  { id: "retirement", emoji: "🌅", label: "Early retirement", years: 16 },
  { id: "emergency", emoji: "🛡️", label: "Emergency fund", years: 1 },
  { id: "education", emoji: "🎓", label: "Education / college", years: 9 },
  { id: "travel", emoji: "✈️", label: "Sabbatical / travel", years: 2 },
  { id: "family", emoji: "👨‍👩‍👧", label: "Family & caregiving", years: 3 },
  { id: "business", emoji: "💼", label: "Start a business", years: 3 },
  { id: "custom", emoji: "⭐", label: "Something else", years: 5 },
];

const AMOUNT_PRESETS = [10000, 20000, 50000, 100000, 200000, 500000, 1000000, 1500000];
const YEAR_PRESETS = [1, 2, 3, 5, 10, 15, 20];

function formatMoney(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function deriveStatus(current: number, target: number): GoalStatus {
  if (!target) return "at-risk";
  const pct = current / target;
  if (pct >= 0.95) return "ahead";
  if (pct >= 0.6) return "on-track";
  if (pct >= 0.3) return "slightly-behind";
  return "at-risk";
}

export default function GoalEditorScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { goals, addGoal, updateGoal, deleteGoal, toggleGoalHidden } = useAppContext();
  const confirm = useConfirm();

  const editingGoal = useMemo(
    () => (params.id ? goals.find((g) => g.id === params.id) : undefined),
    [params.id, goals]
  );
  const isEditing = !!editingGoal;
  const isStaleEdit = !!params.id && !editingGoal;

  useEffect(() => {
    if (isStaleEdit && router.canGoBack()) {
      router.back();
    }
  }, [isStaleEdit]);

  const initialTemplate =
    GOAL_TEMPLATES.find((t) => t.id === editingGoal?.category) ?? GOAL_TEMPLATES[0];

  const [category, setCategory] = useState(editingGoal?.category ?? initialTemplate.id);
  const [emoji, setEmoji] = useState(editingGoal?.emoji ?? initialTemplate.emoji);
  const [title, setTitle] = useState(editingGoal?.title ?? initialTemplate.label);
  const [targetAmount, setTargetAmount] = useState(editingGoal?.targetAmount ?? 100000);
  const [currentAmount, setCurrentAmount] = useState(editingGoal?.currentAmount ?? 0);
  const [monthly, setMonthly] = useState(editingGoal?.monthlyContribution ?? 500);
  const [years, setYears] = useState(() => {
    if (editingGoal) {
      const diff =
        new Date(editingGoal.targetDate).getFullYear() - new Date().getFullYear();
      return Math.max(1, diff);
    }
    return initialTemplate.years;
  });

  const canSave = title.trim().length > 0 && targetAmount > 0;

  const handleSelectTemplate = (id: string) => {
    Haptics.selectionAsync();
    const t = GOAL_TEMPLATES.find((x) => x.id === id)!;
    setCategory(id);
    setEmoji(t.emoji);
    if (!isEditing || title === GOAL_TEMPLATES.find((x) => x.id === category)?.label) {
      setTitle(t.label);
    }
    setYears(t.years);
  };

  const handleSave = () => {
    if (!canSave) return;
    const targetDate = new Date();
    targetDate.setFullYear(targetDate.getFullYear() + years);
    const status = deriveStatus(currentAmount, targetAmount);

    if (isEditing && editingGoal) {
      updateGoal(editingGoal.id, {
        title: title.trim(),
        emoji,
        category,
        targetAmount,
        currentAmount,
        monthlyContribution: monthly,
        targetDate: targetDate.toISOString().split("T")[0],
        status,
      });
    } else {
      const newGoal: Omit<Goal, "id"> = {
        title: title.trim(),
        emoji,
        category,
        targetAmount,
        currentAmount,
        monthlyContribution: monthly,
        targetDate: targetDate.toISOString().split("T")[0],
        status,
        pinned: true,
        hidden: false,
      };
      addGoal(newGoal);
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const handleDelete = async () => {
    if (!editingGoal) return;
    const ok = await confirm({
      title: "Delete goal?",
      message: `"${editingGoal.title}" will be removed permanently. This can't be undone.`,
      confirmText: "Delete",
      tone: "destructive",
      icon: "trash-2",
    });
    if (!ok) return;
    deleteGoal(editingGoal.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    router.back();
  };

  const handleAmountInput = (val: string, set: (n: number) => void) => {
    const cleaned = val.replace(/[^0-9]/g, "");
    set(cleaned === "" ? 0 : parseInt(cleaned, 10));
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + (Platform.OS === "web" ? 56 : 12), backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Feather name="x" size={22} color={colors.navy} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.navy }]}>
            {isEditing ? "Edit goal" : "New goal"}
          </Text>
          <View style={styles.iconBtn} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 130 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Category</Text>
        <View style={styles.grid}>
          {GOAL_TEMPLATES.map((tmpl) => {
            const selected = category === tmpl.id;
            return (
              <Pressable
                key={tmpl.id}
                style={[
                  styles.templateCard,
                  {
                    borderColor: selected ? colors.primary : colors.border,
                    backgroundColor: selected ? "#EBF8F8" : colors.card,
                    borderWidth: selected ? 2 : 1,
                  },
                ]}
                onPress={() => handleSelectTemplate(tmpl.id)}
              >
                <Text style={styles.tmplEmoji}>{tmpl.emoji}</Text>
                <Text
                  style={[
                    styles.tmplLabel,
                    { color: selected ? colors.primary : colors.text },
                  ]}
                  numberOfLines={2}
                >
                  {tmpl.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Goal name</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: colors.border, backgroundColor: colors.card, color: colors.text },
          ]}
          placeholder="e.g. Buy a camper van"
          placeholderTextColor={colors.mutedForeground}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Target amount</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: colors.border, backgroundColor: colors.card, color: colors.text },
          ]}
          placeholder="100000"
          placeholderTextColor={colors.mutedForeground}
          keyboardType="numeric"
          value={targetAmount === 0 ? "" : String(targetAmount)}
          onChangeText={(v) => handleAmountInput(v, setTargetAmount)}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}
        >
          {AMOUNT_PRESETS.map((a) => (
            <TouchableOpacity
              key={a}
              style={[
                styles.chip,
                {
                  borderColor: targetAmount === a ? colors.primary : colors.border,
                  backgroundColor: targetAmount === a ? "#EBF8F8" : colors.card,
                  borderWidth: targetAmount === a ? 2 : 1,
                },
              ]}
              onPress={() => setTargetAmount(a)}
            >
              <Text style={[styles.chipText, { color: targetAmount === a ? colors.primary : colors.text }]}>
                {formatMoney(a)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          Already saved
        </Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: colors.border, backgroundColor: colors.card, color: colors.text },
          ]}
          placeholder="0"
          placeholderTextColor={colors.mutedForeground}
          keyboardType="numeric"
          value={currentAmount === 0 ? "" : String(currentAmount)}
          onChangeText={(v) => handleAmountInput(v, setCurrentAmount)}
        />

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          Monthly contribution
        </Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: colors.border, backgroundColor: colors.card, color: colors.text },
          ]}
          placeholder="500"
          placeholderTextColor={colors.mutedForeground}
          keyboardType="numeric"
          value={monthly === 0 ? "" : String(monthly)}
          onChangeText={(v) => handleAmountInput(v, setMonthly)}
        />

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Target horizon</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}
        >
          {YEAR_PRESETS.map((y) => (
            <TouchableOpacity
              key={y}
              style={[
                styles.chip,
                {
                  borderColor: years === y ? colors.primary : colors.border,
                  backgroundColor: years === y ? "#EBF8F8" : colors.card,
                  borderWidth: years === y ? 2 : 1,
                },
              ]}
              onPress={() => setYears(y)}
            >
              <Text style={[styles.chipText, { color: years === y ? colors.primary : colors.text }]}>
                {y} {y === 1 ? "yr" : "yrs"}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.summaryCard, { backgroundColor: colors.navy }]}>
          <Text style={styles.summaryEmoji}>{emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.summaryTitle, { color: "#fff" }]}>{title || "Untitled goal"}</Text>
            <Text style={[styles.summarySub, { color: "#B2DFDB" }]}>
              {formatMoney(targetAmount)} by {new Date().getFullYear() + years} · {formatMoney(monthly)}/mo
            </Text>
          </View>
        </View>

        {isEditing && editingGoal && (
          <>
            <TouchableOpacity
              style={[styles.secondaryBtn, { borderColor: colors.border }]}
              onPress={() => {
                toggleGoalHidden(editingGoal.id);
                Haptics.selectionAsync();
                router.back();
              }}
              activeOpacity={0.75}
            >
              <Feather
                name={editingGoal.hidden ? "eye" : "eye-off"}
                size={16}
                color={colors.text}
              />
              <Text style={[styles.deleteText, { color: colors.text }]}>
                {editingGoal.hidden ? "Show on dashboard" : "Hide from list"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deleteBtn, { borderColor: colors.caution }]}
              onPress={handleDelete}
              activeOpacity={0.75}
            >
              <Feather name="trash-2" size={16} color={colors.caution} />
              <Text style={[styles.deleteText, { color: colors.caution }]}>Delete goal</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.primaryBtn,
            { backgroundColor: canSave ? colors.navy : colors.border },
          ]}
          onPress={handleSave}
          disabled={!canSave}
          activeOpacity={0.85}
        >
          <Feather name="check" size={18} color={canSave ? "#fff" : colors.mutedForeground} />
          <Text style={[styles.primaryBtnText, { color: canSave ? "#fff" : colors.mutedForeground }]}>
            {isEditing ? "Save changes" : "Create goal"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { fontSize: 17, fontWeight: "700" },
  iconBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 18,
    marginBottom: 10,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  templateCard: { width: "47%", borderRadius: 14, padding: 14, gap: 6 },
  tmplEmoji: { fontSize: 24 },
  tmplLabel: { fontSize: 13, fontWeight: "600", lineHeight: 18 },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  chipScroll: { marginHorizontal: -20, marginTop: 10 },
  chipRow: { flexDirection: "row", gap: 8, paddingHorizontal: 20 },
  chip: { borderRadius: 20, paddingVertical: 9, paddingHorizontal: 14, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: "700" },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 14,
    padding: 18,
    marginTop: 24,
  },
  summaryEmoji: { fontSize: 32 },
  summaryTitle: { fontSize: 16, fontWeight: "700" },
  summarySub: { fontSize: 13, marginTop: 3 },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 13,
    marginTop: 16,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 13,
    marginTop: 10,
  },
  deleteText: { fontSize: 14, fontWeight: "700" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 17,
  },
  primaryBtnText: { fontSize: 16, fontWeight: "700" },
});
