import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type GoalStatus = "ahead" | "on-track" | "slightly-behind" | "at-risk";

export interface Goal {
  id: string;
  title: string;
  emoji: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: GoalStatus;
  monthlyContribution: number;
  category: string;
  pinned: boolean;
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  account: string;
  alignment: "aligned" | "neutral" | "out-of-sync";
  isDebit: boolean;
}

export interface Alert {
  id: string;
  type: "nudge" | "celebration" | "warning" | "info";
  title: string;
  body: string;
  date: string;
  read: boolean;
  goalId?: string;
  actionLabel?: string;
}

export interface Holding {
  id: string;
  name: string;
  ticker: string;
  value: number;
  allocation: number;
  change: number;
  changePercent: number;
  assetClass: "equity" | "fixed-income" | "cash" | "alternative";
}

export interface ConnectedAccount {
  id: string;
  institution: string;
  name: string;
  type: "checking" | "savings" | "investment" | "credit" | "mortgage";
  balance: number;
  lastSync: string;
}

interface AppState {
  goals: Goal[];
  transactions: Transaction[];
  alerts: Alert[];
  holdings: Holding[];
  accounts: ConnectedAccount[];
  alignmentScore: number;
  alignmentTrend: number;
  netWorth: number;
  totalLiquid: number;
  totalInvested: number;
  totalDebt: number;
  userName: string;
}

interface AppContextType extends AppState {
  markAlertRead: (id: string) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  addGoal: (goal: Omit<Goal, "id">) => void;
}

const MOCK_GOALS: Goal[] = [
  {
    id: "g1",
    title: "Home Down Payment",
    emoji: "🏡",
    targetAmount: 120000,
    currentAmount: 48200,
    targetDate: "2026-12-01",
    status: "slightly-behind",
    monthlyContribution: 1800,
    category: "home",
    pinned: true,
  },
  {
    id: "g2",
    title: "Early Retirement",
    emoji: "🌅",
    targetAmount: 1500000,
    currentAmount: 287400,
    targetDate: "2042-01-01",
    status: "on-track",
    monthlyContribution: 2200,
    category: "retirement",
    pinned: true,
  },
  {
    id: "g3",
    title: "Emergency Fund",
    emoji: "🛡️",
    targetAmount: 24000,
    currentAmount: 19800,
    targetDate: "2025-09-01",
    status: "ahead",
    monthlyContribution: 600,
    category: "emergency",
    pinned: true,
  },
  {
    id: "g4",
    title: "Kids' College Fund",
    emoji: "🎓",
    targetAmount: 80000,
    currentAmount: 12500,
    targetDate: "2035-08-01",
    status: "on-track",
    monthlyContribution: 400,
    category: "education",
    pinned: false,
  },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "t1", merchant: "Whole Foods Market", amount: 84.32, date: "2026-05-08", category: "Groceries", account: "Chase Checking", alignment: "aligned", isDebit: true },
  { id: "t2", merchant: "Spotify Premium", amount: 11.99, date: "2026-05-07", category: "Subscriptions", account: "Chase Checking", alignment: "neutral", isDebit: true },
  { id: "t3", merchant: "Direct Deposit", amount: 3940.00, date: "2026-05-06", category: "Income", account: "Chase Checking", alignment: "aligned", isDebit: false },
  { id: "t4", merchant: "Nobu Restaurant", amount: 187.50, date: "2026-05-05", category: "Dining", account: "Amex Gold", alignment: "out-of-sync", isDebit: true },
  { id: "t5", merchant: "Netflix", amount: 22.99, date: "2026-05-04", category: "Subscriptions", account: "Chase Checking", alignment: "neutral", isDebit: true },
  { id: "t6", merchant: "Target", amount: 56.40, date: "2026-05-04", category: "Shopping", account: "Amex Gold", alignment: "neutral", isDebit: true },
  { id: "t7", merchant: "Vanguard Transfer", amount: 2200.00, date: "2026-05-03", category: "Investing", account: "Chase Checking", alignment: "aligned", isDebit: true },
  { id: "t8", merchant: "Equinox Gym", amount: 189.00, date: "2026-05-02", category: "Health & Fitness", account: "Amex Gold", alignment: "aligned", isDebit: true },
  { id: "t9", merchant: "Amazon", amount: 43.18, date: "2026-05-01", category: "Shopping", account: "Chase Checking", alignment: "neutral", isDebit: true },
  { id: "t10", merchant: "Trader Joe's", amount: 67.91, date: "2026-04-30", category: "Groceries", account: "Chase Checking", alignment: "aligned", isDebit: true },
  { id: "t11", merchant: "Sweetgreen", amount: 16.50, date: "2026-04-30", category: "Dining", account: "Amex Gold", alignment: "neutral", isDebit: true },
  { id: "t12", merchant: "HISA Deposit", amount: 1800.00, date: "2026-04-29", category: "Savings", account: "Marcus HISA", alignment: "aligned", isDebit: true },
];

const MOCK_ALERTS: Alert[] = [
  {
    id: "a1",
    type: "warning",
    title: "Dining trending over pace",
    body: "Dining is up 31% this month vs. your goal-aligned pace. At this rate, your home purchase timeline shifts ~5 weeks later.",
    date: "2026-05-08",
    read: false,
    goalId: "g1",
    actionLabel: "See impact",
  },
  {
    id: "a2",
    type: "celebration",
    title: "Emergency fund nearly complete",
    body: "You're 82% of the way to your emergency fund goal — just $4,200 to go. You're on track to hit it 3 months early!",
    date: "2026-05-07",
    read: false,
    goalId: "g3",
    actionLabel: "View goal",
  },
  {
    id: "a3",
    type: "nudge",
    title: "Increase savings by $200/mo",
    body: "Boosting your monthly savings from $1,800 to $2,000 would get you to your home down payment 8 months sooner.",
    date: "2026-05-06",
    read: true,
    goalId: "g1",
    actionLabel: "Adjust goal",
  },
  {
    id: "a4",
    type: "info",
    title: "3 subscriptions detected",
    body: "We found Spotify, Netflix, and Hulu on your accounts — totaling $47/mo. One may be inactive.",
    date: "2026-05-05",
    read: true,
    actionLabel: "Review",
  },
];

const MOCK_HOLDINGS: Holding[] = [
  { id: "h1", name: "Vanguard Total Stock", ticker: "VTSAX", value: 148200, allocation: 52, change: 2140, changePercent: 1.47, assetClass: "equity" },
  { id: "h2", name: "iShares Core S&P 500", ticker: "IVV", value: 71800, allocation: 25, change: -320, changePercent: -0.44, assetClass: "equity" },
  { id: "h3", name: "Vanguard Total Bond", ticker: "VBTLX", value: 42600, allocation: 15, change: 180, changePercent: 0.42, assetClass: "fixed-income" },
  { id: "h4", name: "Money Market Fund", ticker: "VMFXX", value: 18400, allocation: 6, change: 42, changePercent: 0.23, assetClass: "cash" },
  { id: "h5", name: "REIT Index Fund", ticker: "VNQ", value: 6400, allocation: 2, change: -88, changePercent: -1.35, assetClass: "alternative" },
];

const MOCK_ACCOUNTS: ConnectedAccount[] = [
  { id: "ac1", institution: "Chase", name: "Sapphire Checking", type: "checking", balance: 14820, lastSync: "2 min ago" },
  { id: "ac2", institution: "American Express", name: "Gold Card", type: "credit", balance: -2340, lastSync: "5 min ago" },
  { id: "ac3", institution: "Marcus", name: "High-Yield Savings", type: "savings", balance: 48200, lastSync: "8 min ago" },
  { id: "ac4", institution: "Vanguard", name: "Brokerage Account", type: "investment", balance: 287400, lastSync: "12 min ago" },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);

  const markAlertRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
  };

  const addGoal = (goal: Omit<Goal, "id">) => {
    const newGoal: Goal = {
      ...goal,
      id: `g_${Date.now()}`,
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  return (
    <AppContext.Provider
      value={{
        goals,
        transactions: MOCK_TRANSACTIONS,
        alerts,
        holdings: MOCK_HOLDINGS,
        accounts: MOCK_ACCOUNTS,
        alignmentScore: 74,
        alignmentTrend: 3,
        netWorth: 348680,
        totalLiquid: 63020,
        totalInvested: 287400,
        totalDebt: 2340,
        userName: "Sarah",
        markAlertRead,
        updateGoal,
        addGoal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
