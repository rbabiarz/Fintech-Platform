import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
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

import { useAppContext, type Goal, type GoalStatus } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

function formatCurrency(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function formatLarge(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

const STATUS_CONFIG: Record<GoalStatus, { label: string; color: string; bg: string }> = {
  ahead: { label: "Ahead", color: "#15803D", bg: "#DCFCE7" },
  "on-track": { label: "On Track", color: "#2C7A7B", bg: "#B2DFDB" },
  "slightly-behind": { label: "Slightly Behind", color: "#B45309", bg: "#FEF3C7" },
  "at-risk": { label: "At Risk", color: "#B91C1C", bg: "#FEE2E2" },
};

function GoalCard({ goal }: { goal: Goal }) {
  const colors = useColors();
  const progress = Math.min(goal.currentAmount / goal.targetAmount, 1);
  const statusCfg = STATUS_CONFIG[goal.status];
  const pct = Math.round(progress * 100);

  const targetYear = new Date(goal.targetDate).getFullYear();

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/goal-editor", params: { id: goal.id } })}
      style={[styles.goalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={styles.goalCardHeader}>
        <Text style={styles.goalEmoji}>{goal.emoji}</Text>
        <View style={styles.goalTitleArea}>
          <Text style={[styles.goalTitle, { color: colors.navy }]} numberOfLines={1}>{goal.title}</Text>
          <Text style={[styles.goalTarget, { color: colors.mutedForeground }]}>Target: {formatLarge(goal.targetAmount)} · {targetYear}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: statusCfg.bg }]}>
          <Text style={[styles.statusLabel, { color: statusCfg.color }]}>{statusCfg.label}</Text>
        </View>
      </View>

      <View style={styles.progressRow}>
        <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${pct}%` as `${number}%`, backgroundColor: colors.primary },
            ]}
          />
        </View>
        <Text style={[styles.progressPct, { color: colors.primary }]}>{pct}%</Text>
      </View>

      <View style={styles.goalFooter}>
        <Text style={[styles.goalSaved, { color: colors.text }]}>
          {formatLarge(goal.currentAmount)} saved
        </Text>
        <Text style={[styles.goalContrib, { color: colors.mutedForeground }]}>
          +{formatCurrency(goal.monthlyContribution)}/mo
        </Text>
      </View>
    </Pressable>
  );
}


function AlignmentScoreRing({ score, trend }: { score: number; trend: number }) {
  const colors = useColors();
  const size = 96;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ - (score / 100) * circ;

  return (
    <View style={[styles.scoreCard, { backgroundColor: colors.navy }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.scoreLabel, { color: colors.primaryTint }]}>Goal Alignment Score</Text>
        <View style={styles.scoreRow}>
          <Text style={[styles.scoreNumber, { color: "#fff" }]}>{score}</Text>
          <View style={[styles.trendBadge, { backgroundColor: trend >= 0 ? "#15803D" : "#B91C1C" }]}>
            <Feather name={trend >= 0 ? "trending-up" : "trending-down"} size={11} color="#fff" />
            <Text style={styles.trendText}>{Math.abs(trend)} pts</Text>
          </View>
        </View>
        <Text style={[styles.scoreSubtext, { color: "#B2DFDB" }]}>vs. last month</Text>
        <View style={styles.scoreComponents}>
          {[
            { label: "Savings", val: 22, max: 30 },
            { label: "Spending", val: 20, max: 30 },
            { label: "Investing", val: 18, max: 20 },
            { label: "Debt", val: 14, max: 20 },
          ].map((c) => (
            <View key={c.label} style={styles.componentRow}>
              <Text style={[styles.componentLabel, { color: "#B2DFDB" }]}>{c.label}</Text>
              <View style={[styles.componentBarBg, { backgroundColor: "rgba(255,255,255,0.1)" }]}>
                <View
                  style={[
                    styles.componentBarFill,
                    {
                      width: `${(c.val / c.max) * 100}%` as `${number}%`,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.componentVal, { color: "#fff" }]}>{c.val}/{c.max}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function NetWorthStrip() {
  const colors = useColors();
  const { netWorth, totalLiquid, totalInvested, totalDebt } = useAppContext();

  const items = [
    { label: "Net Worth", value: netWorth, positive: true },
    { label: "Liquid", value: totalLiquid, positive: true },
    { label: "Invested", value: totalInvested, positive: true },
    { label: "Debt", value: totalDebt, positive: false },
  ];

  return (
    <View style={[styles.stripCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {items.map((item, i) => (
        <View key={item.label} style={[styles.stripItem, i < items.length - 1 && styles.stripDivider, { borderRightColor: colors.border }]}>
          <Text style={[styles.stripLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
          <Text style={[styles.stripValue, { color: item.positive ? colors.navy : colors.caution }]}>
            {item.positive ? "" : "-"}{formatLarge(Math.abs(item.value))}
          </Text>
        </View>
      ))}
    </View>
  );
}

function NextActionCard({ onDismiss }: { onDismiss: () => void }) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.actionCard, { backgroundColor: "#EBF8F8", borderColor: colors.primary, borderWidth: 1 }]}>
      <View style={styles.actionHeader}>
        <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
          <Feather name="zap" size={14} color="#fff" />
        </View>
        <Text style={[styles.actionTitle, { color: colors.navy }]}>Suggested next step</Text>
        <TouchableOpacity onPress={onDismiss}>
          <Feather name="x" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.actionBody, { color: colors.text }]}>
        Increase your monthly savings from $1,800 to $2,000 to reach your home down payment goal 8 months sooner.
      </Text>
      {expanded && (
        <View style={[styles.whyBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.whyTitle, { color: colors.primary }]}>Why this suggestion?</Text>
          <Text style={[styles.whyBody, { color: colors.mutedForeground }]}>
            At your current pace of $1,800/mo, you reach $120,000 by Feb 2027. An additional $200/mo compounds to 8 months of earlier completion, moving your target to Jun 2026 — before projected mortgage rate adjustments.
          </Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.whyBtn}
        onPress={() => {
          Haptics.selectionAsync();
          setExpanded(!expanded);
        }}
      >
        <Feather name={expanded ? "chevron-up" : "help-circle"} size={14} color={colors.primary} />
        <Text style={[styles.whyBtnText, { color: colors.primary }]}>{expanded ? "Show less" : "Why this?"}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function GoalsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { goals, alignmentScore, alignmentTrend, userName } = useAppContext();

  const visibleGoals = goals.filter((g) => !g.hidden);
  const hiddenGoals = goals.filter((g) => g.hidden);
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const [showHidden, setShowHidden] = useState(false);
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 100,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerSection}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>{today}</Text>
          <Text style={[styles.headline, { color: colors.navy }]}>Good morning, {userName}</Text>
        </View>
      </View>

      <AlignmentScoreRing score={alignmentScore} trend={alignmentTrend} />

      <NetWorthStrip />

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.navy }]}>Your Goals</Text>
        <TouchableOpacity
          style={styles.addGoalLink}
          onPress={() => router.push("/goal-editor")}
        >
          <Feather name="plus" size={14} color={colors.primary} />
          <Text style={[styles.seeAll, { color: colors.primary }]}>Add Goal</Text>
        </TouchableOpacity>
      </View>

      {visibleGoals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}

      {hiddenGoals.length > 0 && (
        <>
          <TouchableOpacity
            style={styles.hiddenToggle}
            onPress={() => setShowHidden((s) => !s)}
          >
            <Feather
              name={showHidden ? "chevron-up" : "chevron-down"}
              size={14}
              color={colors.mutedForeground}
            />
            <Text style={[styles.hiddenToggleText, { color: colors.mutedForeground }]}>
              {showHidden ? "Hide" : "Show"} hidden ({hiddenGoals.length})
            </Text>
          </TouchableOpacity>
          {showHidden &&
            hiddenGoals.map((goal) => (
              <View key={goal.id} style={{ opacity: 0.6 }}>
                <GoalCard goal={goal} />
              </View>
            ))}
        </>
      )}

      {!suggestionDismissed && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.navy }]}>Suggested next step</Text>
          </View>
          <NextActionCard onDismiss={() => setSuggestionDismissed(true)} />
        </>
      )}

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.navy }]}>What's changed</Text>
      </View>

      {[
        { icon: "trending-up" as const, text: "Your retirement savings hit $287K — up $4,200 this month", time: "Today" },
        { icon: "alert-circle" as const, text: "Dining spend is 31% over your aligned pace this month", time: "Yesterday" },
        { icon: "check-circle" as const, text: "Monthly savings goal contribution posted successfully", time: "May 6" },
      ].map((item, i) => (
        <View key={i} style={[styles.changeRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.changeIcon, { backgroundColor: colors.muted }]}>
            <Feather name={item.icon} size={16} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.changeText, { color: colors.text }]}>{item.text}</Text>
            <Text style={[styles.changeTime, { color: colors.mutedForeground }]}>{item.time}</Text>
          </View>
        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: { fontSize: 13, fontWeight: "500" },
  headline: { fontSize: 24, fontWeight: "700", marginTop: 2 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  scoreLeft: { flex: 1 },
  scoreLabel: { fontSize: 12, fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 },
  scoreRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  scoreNumber: { fontSize: 48, fontWeight: "700", lineHeight: 56 },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  trendText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  scoreSubtext: { fontSize: 12, marginTop: 2 },
  scoreChart: { alignItems: "center", justifyContent: "center" },
  circleContainer: { alignItems: "center", justifyContent: "center", width: 80, height: 80 },
  circleOuter: { width: 80, height: 80, borderRadius: 40, borderWidth: 7, alignItems: "center", justifyContent: "center" },
  circleInner: { position: "absolute", width: 80, height: 80, borderRadius: 40, borderWidth: 7 },
  circleScore: { fontSize: 22, fontWeight: "700" },
  scoreComponents: { marginTop: 14, gap: 8 },
  componentRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  componentLabel: { fontSize: 11, width: 58 },
  componentBarBg: { flex: 1, height: 4, borderRadius: 2, overflow: "hidden" },
  componentBarFill: { height: 4, borderRadius: 2 },
  componentVal: { fontSize: 11, fontWeight: "600", minWidth: 38, textAlign: "right" },
  stripCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    overflow: "hidden",
  },
  stripItem: { flex: 1, paddingVertical: 12, paddingHorizontal: 6, alignItems: "center" },
  stripDivider: { borderRightWidth: 1 },
  stripLabel: { fontSize: 10, fontWeight: "500", textTransform: "uppercase", marginBottom: 3 },
  stripValue: { fontSize: 14, fontWeight: "700" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700" },
  seeAll: { fontSize: 14, fontWeight: "500" },
  goalCard: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  goalCardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 10 },
  goalEmoji: { fontSize: 24 },
  goalTitleArea: { flex: 1 },
  goalTitle: { fontSize: 15, fontWeight: "700" },
  goalTarget: { fontSize: 12, marginTop: 2 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  statusLabel: { fontSize: 11, fontWeight: "600" },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  progressBg: { flex: 1, height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: 6, borderRadius: 3 },
  progressPct: { fontSize: 12, fontWeight: "700", width: 32, textAlign: "right" },
  goalFooter: { flexDirection: "row", justifyContent: "space-between" },
  goalSaved: { fontSize: 13, fontWeight: "600" },
  goalContrib: { fontSize: 12 },
  addGoalLink: { flexDirection: "row", alignItems: "center", gap: 4 },
  hiddenToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 10,
    marginTop: 4,
    marginBottom: 6,
  },
  hiddenToggleText: { fontSize: 13, fontWeight: "600" },
  actionCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 14,
    padding: 16,
  },
  actionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  actionIcon: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  actionTitle: { flex: 1, fontSize: 13, fontWeight: "700" },
  actionBody: { fontSize: 14, lineHeight: 20 },
  whyBox: { borderRadius: 10, padding: 12, marginTop: 10 },
  whyTitle: { fontSize: 12, fontWeight: "700", marginBottom: 4 },
  whyBody: { fontSize: 12, lineHeight: 18 },
  whyBtn: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 10 },
  whyBtnText: { fontSize: 13, fontWeight: "600" },
  changeRow: {
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  changeIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  changeText: { fontSize: 13, lineHeight: 18 },
  changeTime: { fontSize: 11, marginTop: 3 },
});
