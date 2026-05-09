import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppContext } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const STEP = 25;

interface Suggestion {
  id: string;
  category: string;
  delta: number;
  title: string;
  body: string;
  goalEmoji: string;
}

export default function BudgetEditorScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    budgetCategories,
    budgets,
    monthlyIncome,
    setBudget,
    resetBudgets,
  } = useAppContext();

  const [draft, setDraft] = useState<Record<string, number>>(() => ({ ...budgets }));
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const totalBudget = useMemo(
    () => Object.values(draft).reduce((sum, v) => sum + (Number(v) || 0), 0),
    [draft],
  );

  const totalRecommended = useMemo(
    () => budgetCategories.reduce((sum, c) => sum + c.recommendedBudget, 0),
    [budgetCategories],
  );

  const leftover = monthlyIncome - totalBudget;
  const overIncome = totalBudget > monthlyIncome;
  const dirty = useMemo(
    () => budgetCategories.some((c) => (draft[c.name] ?? 0) !== (budgets[c.name] ?? 0)),
    [budgetCategories, draft, budgets],
  );

  const suggestions: Suggestion[] = useMemo(() => {
    const list: Suggestion[] = [];
    const dining = budgetCategories.find((c) => c.name === "Dining");
    if (dining) {
      list.push({
        id: "trim-dining",
        category: dining.name,
        delta: -50,
        title: "Trim Dining by $50",
        body: "Free up $50/mo for your Home goal — about +3 weeks faster.",
        goalEmoji: "🏡",
      });
    }
    const subs = budgetCategories.find((c) => c.name === "Subscriptions");
    if (subs) {
      list.push({
        id: "cut-subs",
        category: subs.name,
        delta: -20,
        title: "Drop unused subscriptions",
        body: "Hulu may be inactive. Move $20/mo to Emergency Fund.",
        goalEmoji: "🛡️",
      });
    }
    return list;
  }, [budgetCategories]);

  function adjust(name: string, delta: number) {
    Haptics.selectionAsync();
    setDraft((prev) => ({
      ...prev,
      [name]: Math.max(0, (prev[name] ?? 0) + delta),
    }));
  }

  function setExact(name: string, raw: string) {
    const n = Number(raw.replace(/[^0-9]/g, ""));
    setDraft((prev) => ({ ...prev, [name]: Number.isFinite(n) ? n : 0 }));
  }

  function applySuggestion(s: Suggestion) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setDraft((prev) => ({
      ...prev,
      [s.category]: Math.max(0, (prev[s.category] ?? 0) + s.delta),
    }));
    setAppliedSuggestions((prev) => new Set(prev).add(s.id));
  }

  function handleReset() {
    Haptics.selectionAsync();
    const fresh: Record<string, number> = {};
    for (const c of budgetCategories) fresh[c.name] = c.recommendedBudget;
    setDraft(fresh);
    setAppliedSuggestions(new Set());
  }

  function handleSave() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    for (const c of budgetCategories) {
      setBudget(c.name, draft[c.name] ?? 0);
    }
    setSavedAt(Date.now());
    setTimeout(() => router.back(), 480);
  }

  // Saved toast animation
  const toastY = useRef(new Animated.Value(40)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (savedAt) {
      Animated.parallel([
        Animated.timing(toastY, { toValue: 0, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(toastOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [savedAt, toastY, toastOpacity]);

  const headerPadTop = insets.top + (Platform.OS === "web" ? 56 : 12);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: headerPadTop, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} hitSlop={10}>
          <Feather name="x" size={22} color={colors.navy} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.navy }]}>Adjust budgets</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={!dirty || overIncome}
          style={[
            styles.saveBtn,
            {
              backgroundColor: dirty && !overIncome ? colors.primary : "transparent",
              opacity: dirty && !overIncome ? 1 : 0.45,
            },
          ]}
          hitSlop={6}
        >
          <Text style={[styles.saveText, { color: dirty && !overIncome ? "#fff" : colors.mutedForeground }]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 110 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.summary, { backgroundColor: colors.navy }]}>
          <View style={styles.summaryRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryLabel}>MONTHLY INCOME</Text>
              <Text style={styles.summaryValue}>${monthlyIncome.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryLabel}>BUDGETED</Text>
              <Text style={[styles.summaryValue, overIncome && { color: "#FCA5A5" }]}>
                ${totalBudget.toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={[styles.summaryBar, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <View
              style={[
                styles.summaryBarFill,
                {
                  width: `${Math.min((totalBudget / monthlyIncome) * 100, 100)}%` as `${number}%`,
                  backgroundColor: overIncome ? "#F87171" : colors.primary,
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.summaryFoot,
              { color: overIncome ? "#FCA5A5" : "#B2DFDB" },
            ]}
          >
            {overIncome
              ? `Over income by $${(totalBudget - monthlyIncome).toLocaleString()}`
              : `$${leftover.toLocaleString()} left for savings & goals`}
          </Text>
        </View>

        {suggestions.length > 0 && (
          <View style={{ marginBottom: 18 }}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Smart suggestions</Text>
            {suggestions.map((s) => {
              const applied = appliedSuggestions.has(s.id);
              return (
                <View
                  key={s.id}
                  style={[
                    styles.suggestion,
                    {
                      backgroundColor: applied ? colors.successLight : colors.card,
                      borderColor: applied ? colors.success : colors.border,
                    },
                  ]}
                >
                  <View style={[styles.suggestionIcon, { backgroundColor: colors.primaryTint }]}>
                    <Text style={{ fontSize: 18 }}>{s.goalEmoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.suggestionTitle, { color: colors.navy }]}>{s.title}</Text>
                    <Text style={[styles.suggestionBody, { color: colors.mutedForeground }]}>{s.body}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => !applied && applySuggestion(s)}
                    disabled={applied}
                    activeOpacity={0.85}
                    style={[
                      styles.suggestionBtn,
                      {
                        backgroundColor: applied ? colors.success : colors.navy,
                      },
                    ]}
                  >
                    {applied ? (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <Feather name="check" size={12} color="#fff" />
                        <Text style={styles.suggestionBtnText}>Applied</Text>
                      </View>
                    ) : (
                      <Text style={styles.suggestionBtnText}>Apply</Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Categories</Text>

        {budgetCategories.map((c) => {
          const value = draft[c.name] ?? 0;
          const tooLow = value < c.spent;
          const changed = value !== (budgets[c.name] ?? c.recommendedBudget);
          return (
            <View
              key={c.name}
              style={[
                styles.row,
                {
                  backgroundColor: colors.card,
                  borderColor: changed ? colors.primary : colors.border,
                },
              ]}
            >
              <View style={styles.rowHead}>
                <View style={[styles.catIcon, { backgroundColor: c.color + "22" }]}>
                  <Feather name={c.icon} size={16} color={c.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.catName, { color: colors.text }]}>{c.name}</Text>
                  <Text style={[styles.catSub, { color: colors.mutedForeground }]}>
                    ${c.spent} spent · recommended ${c.recommendedBudget}
                  </Text>
                </View>
                {c.trend !== 0 && (
                  <View
                    style={[
                      styles.trendPill,
                      { backgroundColor: c.trend > 0 ? "#FEE2E2" : "#DCFCE7" },
                    ]}
                  >
                    <Feather
                      name={c.trend > 0 ? "trending-up" : "trending-down"}
                      size={10}
                      color={c.trend > 0 ? "#B91C1C" : "#15803D"}
                    />
                    <Text style={{ fontSize: 11, fontWeight: "700", color: c.trend > 0 ? "#B91C1C" : "#15803D" }}>
                      {Math.abs(c.trend)}%
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.stepperRow}>
                <TouchableOpacity
                  onPress={() => adjust(c.name, -STEP)}
                  style={[styles.stepBtn, { borderColor: colors.border }]}
                  activeOpacity={0.7}
                >
                  <Feather name="minus" size={16} color={colors.navy} />
                </TouchableOpacity>

                <View style={[styles.valueWrap, { borderColor: tooLow ? colors.caution : colors.border }]}>
                  <Text style={[styles.valuePrefix, { color: colors.mutedForeground }]}>$</Text>
                  <TextInput
                    value={String(value)}
                    onChangeText={(t) => setExact(c.name, t)}
                    keyboardType="number-pad"
                    style={[styles.valueInput, { color: colors.navy }]}
                    selectTextOnFocus
                  />
                  <Text style={[styles.valueSuffix, { color: colors.mutedForeground }]}>/mo</Text>
                </View>

                <TouchableOpacity
                  onPress={() => adjust(c.name, STEP)}
                  style={[styles.stepBtn, { borderColor: colors.border }]}
                  activeOpacity={0.7}
                >
                  <Feather name="plus" size={16} color={colors.navy} />
                </TouchableOpacity>
              </View>

              {tooLow && (
                <View style={styles.warnRow}>
                  <Feather name="alert-circle" size={12} color={colors.caution} />
                  <Text style={[styles.warnText, { color: colors.caution }]}>
                    Below current spend (${c.spent})
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        <TouchableOpacity onPress={handleReset} style={styles.resetBtn} activeOpacity={0.7}>
          <Feather name="rotate-ccw" size={14} color={colors.mutedForeground} />
          <Text style={[styles.resetText, { color: colors.mutedForeground }]}>
            Reset to recommended (${totalRecommended.toLocaleString()}/mo)
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {savedAt && (
        <Animated.View
          style={[
            styles.toast,
            {
              backgroundColor: colors.navy,
              bottom: insets.bottom + 24,
              opacity: toastOpacity,
              transform: [{ translateY: toastY }],
            },
          ]}
        >
          <Feather name="check-circle" size={16} color={colors.primaryTint} />
          <Text style={styles.toastText}>Budgets saved</Text>
        </Animated.View>
      )}
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
  saveBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    minWidth: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: { fontSize: 14, fontWeight: "700" },

  summary: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 22,
  },
  summaryRow: { flexDirection: "row", alignItems: "center" },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.18)",
    marginHorizontal: 14,
  },
  summaryLabel: {
    color: "#B2DFDB",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  summaryValue: { color: "#fff", fontSize: 22, fontWeight: "700", marginTop: 4 },
  summaryBar: { height: 8, borderRadius: 4, marginTop: 16, overflow: "hidden" },
  summaryBarFill: { height: 8, borderRadius: 4 },
  summaryFoot: { fontSize: 12, marginTop: 10, fontWeight: "600" },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
  },

  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  suggestionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionTitle: { fontSize: 13, fontWeight: "700" },
  suggestionBody: { fontSize: 12, marginTop: 2, lineHeight: 16 },
  suggestionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  suggestionBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  row: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  rowHead: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  catIcon: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  catName: { fontSize: 14, fontWeight: "700" },
  catSub: { fontSize: 12, marginTop: 2 },
  trendPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },

  stepperRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  valueWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 4,
  },
  valuePrefix: { fontSize: 16, fontWeight: "600" },
  valueInput: {
    fontSize: 20,
    fontWeight: "700",
    minWidth: 60,
    textAlign: "center",
    padding: 0,
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : null),
  },
  valueSuffix: { fontSize: 13, fontWeight: "600" },

  warnRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  warnText: { fontSize: 12, fontWeight: "600" },

  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
  },
  resetText: { fontSize: 13, fontWeight: "600" },

  toast: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  toastText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});
