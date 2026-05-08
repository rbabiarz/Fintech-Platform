import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
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
        <View
          key={i}
          style={[
            styles.stepSegment,
            { backgroundColor: i < step ? colors.primary : colors.border },
          ]}
        />
      ))}
    </View>
  );
}

export default function SignupScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { name, email, setField } = useOnboarding();
  const [localName, setLocalName] = useState(name);
  const [localEmail, setLocalEmail] = useState(email);
  const [localPassword, setLocalPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const canContinue = localName.trim().length > 1 && localEmail.includes("@") && localPassword.length >= 8;

  const handleContinue = () => {
    setField("name", localName.trim());
    setField("email", localEmail.trim());
    router.push("/(onboarding)/goal");
  };

  const inputStyle = (field: string) => [
    styles.input,
    {
      borderColor: focused === field ? colors.primary : colors.border,
      backgroundColor: colors.card,
      color: colors.text,
    },
  ];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 56 : 12), backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Feather name="arrow-left" size={22} color={colors.navy} />
        </TouchableOpacity>
        <StepBar step={1} total={5} />
        <Text style={[styles.stepLabel, { color: colors.mutedForeground }]}>Step 1 of 5</Text>
        <Text style={[styles.headline, { color: colors.navy }]}>Create your account</Text>
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: 16, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Your data is encrypted and only used to power your personalized guidance.
        </Text>

        <View style={styles.ssoRow}>
          {[
            { icon: "github" as const, label: "Continue with Apple" },
            { icon: "mail" as const, label: "Continue with Google" },
          ].map((btn) => (
            <TouchableOpacity
              key={btn.label}
              style={[styles.ssoBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
              onPress={() => {
                setField("name", "Sarah");
                setField("email", "sarah@example.com");
                router.push("/(onboarding)/goal");
              }}
              activeOpacity={0.75}
            >
              <Feather name={btn.icon} size={18} color={colors.text} />
              <Text style={[styles.ssoBtnText, { color: colors.text }]}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>or email</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <Text style={[styles.label, { color: colors.text }]}>First name</Text>
        <TextInput
          style={inputStyle("name")}
          placeholder="Sarah"
          placeholderTextColor={colors.mutedForeground}
          value={localName}
          onChangeText={setLocalName}
          onFocus={() => setFocused("name")}
          onBlur={() => setFocused(null)}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <Text style={[styles.label, { color: colors.text }]}>Email</Text>
        <TextInput
          style={inputStyle("email")}
          placeholder="you@example.com"
          placeholderTextColor={colors.mutedForeground}
          value={localEmail}
          onChangeText={setLocalEmail}
          onFocus={() => setFocused("email")}
          onBlur={() => setFocused(null)}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
        />

        <Text style={[styles.label, { color: colors.text }]}>Password</Text>
        <View>
          <TextInput
            style={inputStyle("password")}
            placeholder="Min. 8 characters"
            placeholderTextColor={colors.mutedForeground}
            value={localPassword}
            onChangeText={setLocalPassword}
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused(null)}
            secureTextEntry={!showPw}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPw(!showPw)}
          >
            <Feather name={showPw ? "eye-off" : "eye"} size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.primaryBtn,
            { backgroundColor: canContinue ? colors.navy : colors.border },
          ]}
          onPress={handleContinue}
          disabled={!canContinue}
          activeOpacity={0.85}
        >
          <Text style={[styles.primaryBtnText, { color: canContinue ? "#fff" : colors.mutedForeground }]}>
            Continue
          </Text>
          <Feather name="arrow-right" size={18} color={canContinue ? "#fff" : colors.mutedForeground} />
        </TouchableOpacity>

        <Text style={[styles.terms, { color: colors.mutedForeground }]}>
          By continuing you agree to our{" "}
          <Text style={{ color: colors.primary }}>Terms of Service</Text> and{" "}
          <Text style={{ color: colors.primary }}>Privacy Policy</Text>.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
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
  sub: { fontSize: 15, lineHeight: 22, marginBottom: 24 },
  ssoRow: { gap: 10, marginBottom: 20 },
  ssoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  ssoBtnText: { fontSize: 15, fontWeight: "600" },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 14,
  },
  eyeBtn: { position: "absolute", right: 14, top: 14 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 17,
    marginTop: 8,
    marginBottom: 16,
  },
  primaryBtnText: { fontSize: 16, fontWeight: "700" },
  terms: { fontSize: 12, textAlign: "center", lineHeight: 18 },
});
