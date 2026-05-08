import { Feather } from "@expo/vector-icons";
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useColors } from "@/hooks/useColors";

type ConfirmTone = "default" | "destructive";

export type ConfirmOptions = {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: ConfirmTone;
  icon?: React.ComponentProps<typeof Feather>["name"];
};

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

type State = (ConfirmOptions & { open: boolean }) | { open: false };

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const colors = useColors();
  const [state, setState] = useState<State>({ open: false });
  const resolverRef = useRef<((v: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((opts) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setState({ ...opts, open: true });
    });
  }, []);

  const close = useCallback((value: boolean) => {
    setState({ open: false });
    const r = resolverRef.current;
    resolverRef.current = null;
    if (r) r(value);
  }, []);

  const tone: ConfirmTone = state.open && state.tone ? state.tone : "default";
  const confirmBg = tone === "destructive" ? colors.destructive : colors.primary;
  const iconBg = tone === "destructive" ? "rgba(220,53,69,0.12)" : "rgba(44,122,123,0.12)";
  const iconColor = tone === "destructive" ? colors.destructive : colors.primary;
  const defaultIcon: React.ComponentProps<typeof Feather>["name"] =
    tone === "destructive" ? "alert-triangle" : "help-circle";

  const value = useMemo(() => confirm, [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <Modal
        visible={state.open}
        transparent
        animationType="fade"
        onRequestClose={() => close(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => close(false)}>
          <Pressable
            style={[styles.card, { backgroundColor: colors.background }]}
            onPress={(e) => e.stopPropagation()}
          >
            {state.open && (
              <>
                <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
                  <Feather name={state.icon ?? defaultIcon} size={22} color={iconColor} />
                </View>
                <Text style={[styles.title, { color: colors.navy }]}>{state.title}</Text>
                {state.message ? (
                  <Text style={[styles.message, { color: colors.mutedForeground }]}>{state.message}</Text>
                ) : null}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.btn, styles.cancelBtn, { borderColor: colors.border }]}
                    onPress={() => close(false)}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.cancelText, { color: colors.text }]}>
                      {state.cancelText ?? "Cancel"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: confirmBg }]}
                    onPress={() => close(true)}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.confirmText}>{state.confirmText ?? "Confirm"}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,42,74,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: { fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 6 },
  message: { fontSize: 14, lineHeight: 20, textAlign: "center", marginBottom: 18 },
  actions: { flexDirection: "row", gap: 10, width: "100%", marginTop: 4 },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: { borderWidth: 1 },
  cancelText: { fontSize: 14, fontWeight: "600" },
  confirmText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});
