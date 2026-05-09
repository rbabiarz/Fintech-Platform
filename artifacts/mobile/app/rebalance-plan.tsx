import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

type Method = "sell" | "contribute" | "hybrid";

const METHODS: {
  id: Method;
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  body: string;
  pill: { label: string; tone: "success" | "caution" | "muted" };
  taxImpact: string;
  cadence: string;
}[] = [
  {
    id: "contribute",
    icon: "trending-up",
    title: "Direct new contributions",
    body: "Route your next monthly deposits toward Fixed Income & Cash until you're back on target.",
    pill: { label: "No taxable event", tone: "success" },
    taxImpact: "$0 estimated tax",
    cadence: "~3 months to align",
  },
  {
    id: "hybrid",
    icon: "shuffle",
    title: "Hybrid",
    body: "Sell a small slice of overweight equities and route new contributions to underweight classes.",
    pill: { label: "Low tax impact", tone: "caution" },
    taxImpact: "~$320 estimated tax",
    cadence: "~6 weeks to align",
  },
  {
    id: "sell",
    icon: "minus-circle",
    title: "Sell to rebalance",
    body: "Sell overweight equities now and immediately buy underweight classes to hit the target today.",
    pill: { label: "Taxable event", tone: "caution" },
    taxImpact: "~$840 estimated tax",
    cadence: "Aligned today",
  },
];

interface Trade {
  action: "Sell" | "Buy" | "Route";
  symbol: string;
  name: string;
  amount: number;
}

function tradesFor(method: Method): Trade[] {
  if (method === "sell") {
    return [
      { action: "Sell", symbol: "VTSAX", name: "Vanguard Total Stock", amount: 8500 },
      { action: "Buy", symbol: "VBTLX", name: "Vanguard Total Bond", amount: 6300 },
      { action: "Buy", symbol: "VMFXX", name: "Money Market Fund", amount: 2200 },
    ];
  }
  if (method === "hybrid") {
    return [
      { action: "Sell", symbol: "VTSAX", name: "Vanguard Total Stock", amount: 3200 },
      { action: "Buy", symbol: "VBTLX", name: "Vanguard Total Bond", amount: 2200 },
      { action: "Buy", symbol: "VMFXX", name: "Money Market Fund", amount: 1000 },
      { action: "Route", symbol: "VBTLX", name: "Next 2 monthly contributions", amount: 1800 },
    ];
  }
  return [
    { action: "Route", symbol: "VBTLX", name: "$1,260/mo to Fixed Income", amount: 1260 },
    { action: "Route", symbol: "VMFXX", name: "$540/mo to Cash", amount: 540 },
  ];
}

export default function RebalancePlanScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [method, setMethod] = useState<Method | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const trades = useMemo(() => (method ? tradesFor(method) : []), [method]);
  const selectedMeta = useMemo(() => METHODS.find((m) => m.id === method), [method]);

  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, {
      toValue: step,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [step, progress]);

  function next() {
    Haptics.selectionAsync();
    if (step === 0 && method) setStep(1);
    else if (step === 1) setStep(2);
    else if (step === 2 && acknowledged) {
      setSubmitted(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }

  function back() {
    Haptics.selectionAsync();
    if (step === 0) {
      router.back();
    } else {
      setStep((s) => (s - 1) as 0 | 1 | 2);
    }
  }

  const ctaLabel =
    step === 0 ? "Continue" : step === 1 ? "Looks good — continue" : "Submit plan";
  const ctaDisabled =
    (step === 0 && !method) || (step === 2 && !acknowledged);

  if (submitted) {
    return <SubmittedView meta={selectedMeta} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 56 : 12), borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={back} style={styles.iconBtn} hitSlop={10}>
          <Feather name={step === 0 ? "x" : "arrow-left"} size={22} color={colors.navy} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.navy }]}>Plan a Rebalance</Text>
        <View style={styles.iconBtn} />
      </View>

      <View style={styles.progressTrack}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.progressSeg,
              { backgroundColor: i <= step ? colors.primary : colors.border },
            ]}
          />
        ))}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 110 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.stepKicker, { color: colors.primary }]}>STEP {step + 1} OF 3</Text>
        <Text style={[styles.stepTitle, { color: colors.navy }]}>
          {step === 0
            ? "Choose your method"
            : step === 1
              ? "Review your plan"
              : "Confirm & schedule"}
        </Text>
        <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>
          {step === 0
            ? "Pick how you want to bring your allocation back in line. Each option has different tradeoffs."
            : step === 1
              ? "Here's exactly what we'll do. You can still go back and choose another method."
              : "Set when this should run and confirm the plan."}
        </Text>

        {step === 0 &&
          METHODS.map((m) => {
            const selected = method === m.id;
            const pillBg =
              m.pill.tone === "success"
                ? colors.successLight
                : m.pill.tone === "caution"
                  ? colors.cautionLight
                  : colors.muted;
            const pillFg =
              m.pill.tone === "success"
                ? colors.success
                : m.pill.tone === "caution"
                  ? colors.caution
                  : colors.mutedForeground;
            return (
              <Pressable
                key={m.id}
                onPress={() => {
                  Haptics.selectionAsync();
                  setMethod(m.id);
                }}
                style={({ pressed }) => [
                  styles.methodCard,
                  {
                    backgroundColor: selected ? "#EBF8F8" : pressed ? colors.muted : colors.card,
                    borderColor: selected ? colors.primary : colors.border,
                    borderWidth: selected ? 2 : 1,
                  },
                ]}
              >
                <View style={styles.methodHead}>
                  <View style={[styles.methodIcon, { backgroundColor: selected ? colors.primary : "#EBF8F8" }]}>
                    <Feather name={m.icon} size={16} color={selected ? "#fff" : colors.primary} />
                  </View>
                  <Text style={[styles.methodTitle, { color: colors.navy }]}>{m.title}</Text>
                  <View style={[styles.radio, { borderColor: selected ? colors.primary : colors.border }]}>
                    {selected && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
                  </View>
                </View>
                <Text style={[styles.methodBody, { color: colors.text }]}>{m.body}</Text>
                <View style={styles.methodMetaRow}>
                  <View style={[styles.pill, { backgroundColor: pillBg }]}>
                    <Text style={{ color: pillFg, fontSize: 11, fontWeight: "700" }}>{m.pill.label}</Text>
                  </View>
                  <Text style={[styles.methodMeta, { color: colors.mutedForeground }]}>{m.taxImpact}</Text>
                  <Text style={[styles.methodDot, { color: colors.border }]}>·</Text>
                  <Text style={[styles.methodMeta, { color: colors.mutedForeground }]}>{m.cadence}</Text>
                </View>
              </Pressable>
            );
          })}

        {step === 1 && selectedMeta && (
          <>
            <View style={[styles.summary, { backgroundColor: colors.navy }]}>
              <View style={styles.summaryRow}>
                <View style={[styles.summaryIcon, { backgroundColor: "rgba(178,223,219,0.2)" }]}>
                  <Feather name={selectedMeta.icon} size={16} color={colors.primaryTint} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryKicker}>SELECTED METHOD</Text>
                  <Text style={styles.summaryTitle}>{selectedMeta.title}</Text>
                </View>
              </View>
              <View style={styles.summaryStatsRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryStatLabel}>EST. TAX IMPACT</Text>
                  <Text style={styles.summaryStat}>{selectedMeta.taxImpact}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryStatLabel}>TIMELINE</Text>
                  <Text style={styles.summaryStat}>{selectedMeta.cadence}</Text>
                </View>
              </View>
            </View>

            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Proposed actions</Text>
            <View style={[styles.tradeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {trades.map((t, i) => {
                const isSell = t.action === "Sell";
                const isBuy = t.action === "Buy";
                const accent = isSell ? colors.caution : isBuy ? colors.success : colors.primary;
                const bg = isSell ? colors.cautionLight : isBuy ? colors.successLight : "#EBF8F8";
                return (
                  <View
                    key={`${t.action}-${t.symbol}-${i}`}
                    style={[
                      styles.tradeRow,
                      i < trades.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <View style={[styles.actionPill, { backgroundColor: bg }]}>
                      <Text style={{ color: accent, fontSize: 11, fontWeight: "700" }}>
                        {t.action.toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.tradeName, { color: colors.text }]}>{t.name}</Text>
                      <Text style={[styles.tradeSym, { color: colors.mutedForeground }]}>{t.symbol}</Text>
                    </View>
                    <Text style={[styles.tradeAmt, { color: colors.navy }]}>
                      ${t.amount.toLocaleString()}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={[styles.disc, { backgroundColor: colors.muted }]}>
              <Feather name="info" size={12} color={colors.mutedForeground} />
              <Text style={[styles.discText, { color: colors.mutedForeground }]}>
                Estimates only. Final share counts will be calculated at execution using current market prices.
              </Text>
            </View>
          </>
        )}

        {step === 2 && selectedMeta && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Schedule</Text>
            <View style={[styles.scheduleCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.scheduleRow}>
                <Feather name="calendar" size={16} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.scheduleTitle, { color: colors.navy }]}>
                    {method === "contribute" ? "Next paycheck" : "Tomorrow at market open"}
                  </Text>
                  <Text style={[styles.scheduleSub, { color: colors.mutedForeground }]}>
                    {method === "contribute"
                      ? "Routing applies starting on your next direct deposit."
                      : "Trades will execute on May 12, 2026 at 9:30 AM ET."}
                  </Text>
                </View>
                <Feather name="check-circle" size={18} color={colors.primary} />
              </View>
            </View>

            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Summary</Text>
            <View style={[styles.summaryStatic, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <SummaryRow colors={colors} label="Method" value={selectedMeta.title} />
              <SummaryRow colors={colors} label="Est. tax impact" value={selectedMeta.taxImpact} />
              <SummaryRow colors={colors} label="Time to align" value={selectedMeta.cadence} last />
            </View>

            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                setAcknowledged((v) => !v);
              }}
              style={({ pressed }) => [
                styles.ackRow,
                {
                  backgroundColor: acknowledged ? "#EBF8F8" : pressed ? colors.muted : colors.card,
                  borderColor: acknowledged ? colors.primary : colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: acknowledged ? colors.primary : "transparent",
                    borderColor: acknowledged ? colors.primary : colors.border,
                  },
                ]}
              >
                {acknowledged && <Feather name="check" size={14} color="#fff" />}
              </View>
              <Text style={[styles.ackText, { color: colors.text }]}>
                I understand this is a guided action — Align will execute on my behalf and notify me when complete. Estimates may differ from final values.
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + 16,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={next}
          disabled={ctaDisabled}
          activeOpacity={0.85}
          style={[
            styles.cta,
            { backgroundColor: ctaDisabled ? colors.border : colors.navy },
          ]}
        >
          <Text style={[styles.ctaText, { color: ctaDisabled ? colors.mutedForeground : "#fff" }]}>
            {ctaLabel}
          </Text>
          {!ctaDisabled && <Feather name="arrow-right" size={16} color="#fff" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SummaryRow({
  colors,
  label,
  value,
  last,
}: {
  colors: ReturnType<typeof useColors>;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.summaryStaticRow,
        !last && { borderBottomWidth: 1, borderBottomColor: colors.border },
      ]}
    >
      <Text style={[styles.summaryStaticLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.summaryStaticValue, { color: colors.navy }]}>{value}</Text>
    </View>
  );
}

function SubmittedView({
  meta,
}: {
  meta?: (typeof METHODS)[number];
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const scale = useRef(new Animated.Value(0.4)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 240, useNativeDriver: true }),
    ]).start();
  }, [scale, opacity]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 60 }]}>
      <View style={styles.successWrap}>
        <Animated.View
          style={[
            styles.successIcon,
            {
              backgroundColor: colors.primary,
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <Feather name="check" size={42} color="#fff" />
        </Animated.View>

        <Animated.View style={{ opacity, alignItems: "center" }}>
          <Text style={[styles.successTitle, { color: colors.navy }]}>Plan submitted</Text>
          <Text style={[styles.successBody, { color: colors.mutedForeground }]}>
            {meta?.id === "contribute"
              ? "We'll route your next contributions toward Fixed Income & Cash and notify you each time."
              : "We'll execute on May 12 at market open and send you a confirmation when complete."}
          </Text>

          <View style={[styles.successCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.successRow}>
              <Feather name="bell" size={14} color={colors.primary} />
              <Text style={[styles.successCardText, { color: colors.text }]}>
                You'll get an alert in your activity feed.
              </Text>
            </View>
            <View style={styles.successRow}>
              <Feather name="clock" size={14} color={colors.primary} />
              <Text style={[styles.successCardText, { color: colors.text }]}>
                {meta?.cadence ?? "Aligned soon"}
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => {
            Haptics.selectionAsync();
            router.dismissAll?.();
            router.replace("/(tabs)/invest");
          }}
          activeOpacity={0.85}
          style={[styles.cta, { backgroundColor: colors.navy }]}
        >
          <Text style={[styles.ctaText, { color: "#fff" }]}>Done</Text>
        </TouchableOpacity>
      </View>
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

  progressTrack: { flexDirection: "row", gap: 6, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4 },
  progressSeg: { flex: 1, height: 4, borderRadius: 2 },

  stepKicker: { fontSize: 11, fontWeight: "700", letterSpacing: 0.6, marginTop: 8 },
  stepTitle: { fontSize: 22, fontWeight: "700", marginTop: 6 },
  stepSub: { fontSize: 14, lineHeight: 20, marginTop: 6, marginBottom: 22 },

  methodCard: { borderRadius: 14, padding: 16, marginBottom: 12 },
  methodHead: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
  methodIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  methodTitle: { flex: 1, fontSize: 15, fontWeight: "700" },
  methodBody: { fontSize: 13, lineHeight: 19, marginBottom: 12 },
  methodMetaRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  methodMeta: { fontSize: 12, fontWeight: "600" },
  methodDot: { fontSize: 12 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioDot: { width: 10, height: 10, borderRadius: 5 },

  summary: { borderRadius: 16, padding: 18, marginBottom: 22 },
  summaryRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  summaryIcon: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  summaryKicker: { color: "#B2DFDB", fontSize: 11, fontWeight: "700", letterSpacing: 0.6 },
  summaryTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginTop: 2 },
  summaryStatsRow: { flexDirection: "row", alignItems: "center" },
  summaryDivider: { width: 1, height: 30, backgroundColor: "rgba(255,255,255,0.15)", marginHorizontal: 14 },
  summaryStatLabel: { color: "#B2DFDB", fontSize: 10, fontWeight: "700", letterSpacing: 0.6 },
  summaryStat: { color: "#fff", fontSize: 15, fontWeight: "700", marginTop: 4 },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 4,
  },

  tradeCard: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, marginBottom: 18 },
  tradeRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  actionPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, minWidth: 56, alignItems: "center" },
  tradeName: { fontSize: 13, fontWeight: "600" },
  tradeSym: { fontSize: 11, marginTop: 2 },
  tradeAmt: { fontSize: 14, fontWeight: "700" },

  disc: { flexDirection: "row", gap: 6, padding: 10, borderRadius: 8, alignItems: "flex-start" },
  discText: { fontSize: 11, lineHeight: 15, flex: 1 },

  scheduleCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 22 },
  scheduleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  scheduleTitle: { fontSize: 14, fontWeight: "700" },
  scheduleSub: { fontSize: 12, marginTop: 4, lineHeight: 17 },

  summaryStatic: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, marginBottom: 22 },
  summaryStaticRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  summaryStaticLabel: { fontSize: 12, fontWeight: "600" },
  summaryStaticValue: { fontSize: 13, fontWeight: "700" },

  ackRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  ackText: { flex: 1, fontSize: 13, lineHeight: 18 },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 16,
  },
  ctaText: { fontSize: 15, fontWeight: "700" },

  successWrap: { flex: 1, alignItems: "center", paddingHorizontal: 32 },
  successIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successTitle: { fontSize: 24, fontWeight: "700", marginTop: 4 },
  successBody: { fontSize: 14, lineHeight: 20, textAlign: "center", marginTop: 8, marginBottom: 22 },
  successCard: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  successRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  successCardText: { fontSize: 13, fontWeight: "600", flex: 1 },
});
