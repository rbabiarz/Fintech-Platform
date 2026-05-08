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

import { useOnboarding, type RiskProfile } from "@/context/OnboardingContext";
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

const QUESTIONS = [
  {
    id: "q1",
    text: "If your investments dropped 20% in a year, you would…",
    options: [
      { value: 0, label: "Sell everything — I can't stand losses" },
      { value: 1, label: "Sell some to reduce my exposure" },
      { value: 2, label: "Hold and wait for recovery" },
      { value: 3, label: "Buy more — it's a buying opportunity" },
    ],
  },
  {
    id: "q2",
    text: "Your primary goal for your investments is…",
    options: [
      { value: 0, label: "Protect my money above all else" },
      { value: 1, label: "Some growth, but mostly stable" },
      { value: 2, label: "Strong growth, I can tolerate swings" },
      { value: 3, label: "Maximum growth — I'm in it for the long run" },
    ],
  },
  {
    id: "q3",
    text: "How long until you'll need the money you're investing?",
    options: [
      { value: 0, label: "Less than 3 years" },
      { value: 1, label: "3–7 years" },
      { value: 2, label: "7–15 years" },
      { value: 3, label: "More than 15 years" },
    ],
  },
  {
    id: "q4",
    text: "How often do you check your investment accounts?",
    options: [
      { value: 0, label: "Daily — I track every move" },
      { value: 1, label: "Monthly" },
      { value: 2, label: "Quarterly" },
      { value: 3, label: "Rarely — set it and forget it" },
    ],
  },
  {
    id: "q5",
    text: "Which best describes your investment experience?",
    options: [
      { value: 0, label: "I'm new to investing" },
      { value: 1, label: "I understand the basics" },
      { value: 2, label: "I'm comfortable with stocks and bonds" },
      { value: 3, label: "I have broad investment experience" },
    ],
  },
];

const PROFILE_RESULTS: Record<string, { profile: RiskProfile; label: string; description: string; alloc: string }> = {
  conservative: {
    profile: "conservative",
    label: "Conservative",
    description: "Capital preservation is your priority. A portfolio weighted toward fixed income and cash with modest equity exposure.",
    alloc: "20% Equities · 60% Fixed Income · 20% Cash",
  },
  moderate: {
    profile: "moderate",
    label: "Moderate",
    description: "Balanced growth and stability. You can handle some volatility in pursuit of long-term returns.",
    alloc: "50% Equities · 40% Fixed Income · 10% Cash",
  },
  "moderate-aggressive": {
    profile: "moderate-aggressive",
    label: "Moderate Aggressive",
    description: "Growth-focused with a tolerance for meaningful swings. You're building for the long term.",
    alloc: "70% Equities · 25% Fixed Income · 5% Cash",
  },
  aggressive: {
    profile: "aggressive",
    label: "Aggressive",
    description: "Maximum long-term growth. You're comfortable with significant short-term volatility.",
    alloc: "90% Equities · 8% Fixed Income · 2% Cash",
  },
};

function getRiskProfile(totalScore: number): string {
  if (totalScore <= 4) return "conservative";
  if (totalScore <= 8) return "moderate";
  if (totalScore <= 11) return "moderate-aggressive";
  return "aggressive";
}

export default function RiskScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setField } = useOnboarding();

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === QUESTIONS.length;
  const totalScore = Object.values(answers).reduce((s, v) => s + v, 0);
  const profileKey = getRiskProfile(totalScore);
  const result = PROFILE_RESULTS[profileKey];

  const handleAnswer = (qid: string, value: number) => {
    Haptics.selectionAsync();
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleContinue = () => {
    if (!showResult) {
      setShowResult(true);
      setField("riskProfile", result.profile);
    } else {
      router.push("/(onboarding)/ready");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 56 : 12), backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => {
          if (showResult) setShowResult(false);
          else router.back();
        }} style={styles.back}>
          <Feather name="arrow-left" size={22} color={colors.navy} />
        </TouchableOpacity>
        <StepBar step={4} total={5} />
        <Text style={[styles.stepLabel, { color: colors.mutedForeground }]}>Step 4 of 5</Text>
        <Text style={[styles.headline, { color: colors.navy }]}>
          {showResult ? "Your risk profile" : "Let's understand your risk comfort"}
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: 16, paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {!showResult ? (
          <>
            <Text style={[styles.sub, { color: colors.mutedForeground }]}>
              5 quick questions · About 60 seconds. This shapes how we frame investment guidance for you.
            </Text>

            <View style={[styles.progressRow, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(answeredCount / QUESTIONS.length) * 100}%` as `${number}%`, backgroundColor: colors.primary },
                ]}
              />
            </View>
            <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>
              {answeredCount} of {QUESTIONS.length} answered
            </Text>

            {QUESTIONS.map((q, qi) => (
              <View key={q.id} style={styles.questionBlock}>
                <View style={styles.qHeader}>
                  <View style={[styles.qNum, { backgroundColor: answers[q.id] !== undefined ? colors.primary : colors.muted }]}>
                    <Text style={[styles.qNumText, { color: answers[q.id] !== undefined ? "#fff" : colors.mutedForeground }]}>
                      {qi + 1}
                    </Text>
                  </View>
                  <Text style={[styles.qText, { color: colors.navy }]}>{q.text}</Text>
                </View>
                {q.options.map((opt) => (
                  <Pressable
                    key={opt.value}
                    style={[
                      styles.option,
                      {
                        borderColor: answers[q.id] === opt.value ? colors.primary : colors.border,
                        backgroundColor: answers[q.id] === opt.value ? "#EBF8F8" : colors.card,
                        borderWidth: answers[q.id] === opt.value ? 1.5 : 1,
                      },
                    ]}
                    onPress={() => handleAnswer(q.id, opt.value)}
                  >
                    <View
                      style={[
                        styles.radio,
                        {
                          borderColor: answers[q.id] === opt.value ? colors.primary : colors.border,
                          backgroundColor: answers[q.id] === opt.value ? colors.primary : "transparent",
                        },
                      ]}
                    >
                      {answers[q.id] === opt.value && <Feather name="check" size={10} color="#fff" />}
                    </View>
                    <Text style={[styles.optionText, { color: answers[q.id] === opt.value ? colors.primary : colors.text }]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ))}
          </>
        ) : (
          <>
            <Text style={[styles.sub, { color: colors.mutedForeground }]}>
              Based on your answers, here's how we'll frame investment guidance for you.
            </Text>

            <View style={[styles.resultCard, { backgroundColor: colors.navy }]}>
              <View style={[styles.profileBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.profileBadgeText}>{result.label}</Text>
              </View>
              <Text style={[styles.resultDesc, { color: "#fff" }]}>{result.description}</Text>
              <View style={[styles.allocBox, { backgroundColor: "rgba(255,255,255,0.1)" }]}>
                <Text style={[styles.allocLabel, { color: "#B2DFDB" }]}>Educational reference allocation</Text>
                <Text style={[styles.allocText, { color: "#fff" }]}>{result.alloc}</Text>
              </View>
            </View>

            <View style={[styles.disclaimer, { backgroundColor: colors.muted }]}>
              <Feather name="info" size={13} color={colors.mutedForeground} />
              <Text style={[styles.disclaimerText, { color: colors.mutedForeground }]}>
                This is an educational reference based on your stated preferences, not personalized investment advice. You can change it anytime in Profile.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.primaryBtn,
            { backgroundColor: (allAnswered || showResult) ? colors.navy : colors.border },
          ]}
          onPress={handleContinue}
          disabled={!allAnswered && !showResult}
        >
          <Text style={[styles.primaryBtnText, { color: (allAnswered || showResult) ? "#fff" : colors.mutedForeground }]}>
            {!allAnswered && !showResult
              ? `Answer all ${QUESTIONS.length} questions`
              : showResult
              ? "Continue to Align"
              : "See my profile"}
          </Text>
          {(allAnswered || showResult) && <Feather name="arrow-right" size={18} color="#fff" />}
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
  progressRow: { height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 8 },
  progressFill: { height: 6, borderRadius: 3 },
  progressLabel: { fontSize: 12, marginBottom: 20, fontWeight: "500" },
  questionBlock: { marginBottom: 24 },
  qHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 10 },
  qNum: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 },
  qNumText: { fontSize: 12, fontWeight: "700" },
  qText: { flex: 1, fontSize: 15, fontWeight: "700", lineHeight: 21 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  optionText: { fontSize: 14, flex: 1, lineHeight: 19 },
  resultCard: { borderRadius: 16, padding: 22, marginBottom: 16, gap: 14 },
  profileBadge: { alignSelf: "flex-start", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  profileBadgeText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  resultDesc: { fontSize: 15, lineHeight: 22 },
  allocBox: { borderRadius: 10, padding: 14 },
  allocLabel: { fontSize: 11, fontWeight: "600", marginBottom: 4 },
  allocText: { fontSize: 14, fontWeight: "600" },
  disclaimer: { borderRadius: 12, padding: 14, flexDirection: "row", alignItems: "flex-start", gap: 8 },
  disclaimerText: { fontSize: 12, lineHeight: 18, flex: 1 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 24,
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
